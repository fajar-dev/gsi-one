/* global AbortSignal */
const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');
const { performance } = require('node:perf_hooks');
const { createClient } = require('@supabase/supabase-js');

function calculatePercentiles(latencies) {
  if (!latencies.length) return { p50: 0, p95: 0, p99: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const percentile = p => sorted[Math.ceil(sorted.length * p) - 1];
  return { p50: percentile(0.5), p95: percentile(0.95), p99: percentile(0.99) };
}

/** Measures real, read-only requests; never substitutes generated latency. */
async function runBenchmark() {
  const envFile = path.resolve(__dirname, '../.env');
  const env = {
    ...(fs.existsSync(envFile)
      ? parseEnv(fs.readFileSync(envFile, 'utf8'))
      : {}),
    ...process.env,
  };
  if (!env.BENCHMARK_EMAIL || !env.BENCHMARK_PASSWORD) {
    throw new Error(
      'Set BENCHMARK_EMAIL and BENCHMARK_PASSWORD for an existing test account.',
    );
  }
  const samples = Number(env.BENCHMARK_SAMPLES || 10);
  const target = Number(env.BENCHMARK_P95_MS || 1000);
  if (
    !Number.isInteger(samples) ||
    samples < 1 ||
    samples > 100 ||
    !Number.isFinite(target) ||
    target <= 0
  ) {
    throw new Error('Use 1–100 samples and a positive BENCHMARK_P95_MS.');
  }
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options) =>
        fetch(url, {
          ...options,
          signal: options?.signal || AbortSignal.timeout(15000),
        }),
    },
  });
  try {
    const auth = await client.auth.signInWithPassword({
      email: env.BENCHMARK_EMAIL,
      password: env.BENCHMARK_PASSWORD,
    });
    if (auth.error) throw auth.error;
    const measurements = {};
    for (const table of ['projects_with_budget', 'notifications']) {
      const latencies = [];
      // Warm the connection; do not count it toward the sample percentiles.
      const warmup = await client.from(table).select('id').limit(20);
      if (warmup.error) throw warmup.error;
      for (let index = 0; index < samples; index++) {
        const start = performance.now();
        const response = await client.from(table).select('id').limit(20);
        if (response.error) throw response.error;
        latencies.push(performance.now() - start);
      }
      measurements[table] = calculatePercentiles(latencies);
    }
    const passed = Object.values(measurements).every(
      result => result.p95 <= target,
    );
    const result = { samples, targetP95Ms: target, measurements, passed };
    console.log(JSON.stringify(result, null, 2));
    if (!passed) process.exitCode = 1;
    return result;
  } finally {
    await client.auth.signOut({ scope: 'local' });
  }
}

if (require.main === module) {
  runBenchmark().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
module.exports = { calculatePercentiles, runBenchmark };
