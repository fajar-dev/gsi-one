const http = require('http');
const PORT = 3000;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🏁 Starting Automated API Tests...');
  let testProjectId = null;
  let testStageId = null;

  try {
    console.log('\n1. Testing User Registration...');
    const regEmail = `tester_${Math.round(Math.random() * 100000)}@test.com`;
    const regRes = await request('POST', '/api/register', {
      email: regEmail,
      password: 'password123',
      full_name: 'John Tester'
    });
    console.log(`Status: ${regRes.status}`, regRes.body);
    if (regRes.status !== 201) throw new Error('Registration failed');
    console.log('✅ PASS: Registration success.');

    console.log('\n2. Testing User Login...');
    const loginRes = await request('POST', '/api/login', {
      email: regEmail,
      password: 'password123'
    });
    console.log(`Status: ${loginRes.status}`, loginRes.body);
    if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Login failed');
    console.log('✅ PASS: Login success, token generated.');

    console.log('\n3. Testing Login Failure (Invalid Credentials)...');
    const badLoginRes = await request('POST', '/api/login', {
      email: regEmail,
      password: 'wrong_password'
    });
    console.log(`Status: ${badLoginRes.status}`, badLoginRes.body);
    if (badLoginRes.status !== 401) throw new Error('Login failure did not return 401');
    console.log('✅ PASS: Login rejected with wrong credentials.');

    console.log('\n4. Testing Book Survey...');
    const bookingRes = await request('POST', '/api/booking', {
      full_name: 'Budi Test',
      company_name: 'PT Test Corp',
      email: 'budi@test.com',
      phone: '081234567890',
      service_type: 'NDT Structural',
      location: 'Menara Jaya, Jakarta',
      preferred_date: '2026-08-01',
      message: 'Uji kekuatan balok beton'
    });
    console.log(`Status: ${bookingRes.status}`, bookingRes.body);
    if (bookingRes.status !== 201) throw new Error('Booking survey failed');
    console.log('✅ PASS: Booking survey submitted.');

    console.log('\n--- Switching authorization token to GSI Admin account ---');
    const adminLogin = await request('POST', '/api/login', {
      email: 'admin@grahasurvei.com',
      password: 'password123'
    });
    if (adminLogin.status !== 200) throw new Error('Admin login failed');
    const adminToken = adminLogin.body.token;

    console.log('\n5. Testing Fetch Projects List...');
    const projRes = await request('GET', '/api/projects', null, adminToken);
    console.log(`Status: ${projRes.status}`, `Found projects: ${projRes.body.projects ? projRes.body.projects.length : 0}`);
    if (projRes.status !== 200 || !projRes.body.projects || projRes.body.projects.length === 0) {
      throw new Error('Fetch projects failed or empty');
    }
    testProjectId = projRes.body.projects[0].id;
    console.log('✅ PASS: Projects list successfully loaded.');

    console.log(`\n6. Testing Fetch Project Detail for ID: ${testProjectId}...`);
    const detailRes = await request('GET', `/api/projects/${testProjectId}`, null, adminToken);
    console.log(`Status: ${detailRes.status}`, `Project Name: ${detailRes.body.project ? detailRes.body.project.project_name : 'None'}`);
    if (detailRes.status !== 200 || !detailRes.body.project || !detailRes.body.project.stages || detailRes.body.project.stages.length === 0) {
      throw new Error('Fetch project detail failed');
    }
    testStageId = detailRes.body.project.stages[3].id; 
    console.log('✅ PASS: Project details and timeline stages loaded.');

    console.log('\n--- Switching authorization token to Heri Engineer account ---');
    const engLogin = await request('POST', '/api/login', {
      email: 'engineer@grahasurvei.com',
      password: 'password123'
    });
    if (engLogin.status !== 200) throw new Error('Engineer login failed');
    const engineerToken = engLogin.body.token;

    console.log(`\n7. Testing Update Stage Status for ID: ${testStageId} to 'done'...`);
    const updateStageRes = await request('PUT', `/api/stages/${testStageId}`, {
      status: 'done'
    }, engineerToken);
    console.log(`Status: ${updateStageRes.status}`, updateStageRes.body);
    if (updateStageRes.status !== 200) throw new Error('Update stage status failed');
    console.log('✅ PASS: Stage status updated to done.');

    console.log(`\n8. Testing Add Stage Progress Note for Stage ID: ${testStageId}...`);
    const updateProgressRes = await request('POST', `/api/stages/${testStageId}/updates`, {
      description: 'Sensor regangan selesai dipasang di pilar utama nomor 4',
      progress: 95
    }, engineerToken);
    console.log(`Status: ${updateProgressRes.status}`, updateProgressRes.body);
    if (updateProgressRes.status !== 201) throw new Error('Add progress update note failed');
    console.log('✅ PASS: Progress update note successfully recorded.');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! GSI ONE BACKEND IS FULLY FUNCTIONAL.');
  } catch (err) {
    console.error('\n❌ TEST FAILED WITH EXCEPTION:', err);
    process.exit(1);
  }
}

runTests();
