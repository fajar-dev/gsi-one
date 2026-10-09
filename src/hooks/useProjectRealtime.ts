import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type RealtimePayload = RealtimePostgresChangesPayload<Record<string, unknown>>;
type OnStageUpdateCallback = (payload: RealtimePayload) => void;
type OnProjectUpdateCallback = (payload: RealtimePayload) => void;

interface UseProjectRealtimeOptions {
    projectId: string;
    onStageUpdate?: OnStageUpdateCallback;
    onProjectUpdate?: OnProjectUpdateCallback;
    enabled?: boolean;
}

function useProjectRealtime({
    projectId,
    onStageUpdate,
    onProjectUpdate,
    enabled = true,
}: UseProjectRealtimeOptions): void {
    const channelRef = useRef<RealtimeChannel | null>(null);

    const onStageUpdateRef = useRef(onStageUpdate);
    const onProjectUpdateRef = useRef(onProjectUpdate);

    useEffect(() => {
        onStageUpdateRef.current = onStageUpdate;
    }, [onStageUpdate]);

    useEffect(() => {
        onProjectUpdateRef.current = onProjectUpdate;
    }, [onProjectUpdate]);

    useEffect(() => {
        if (!enabled || !projectId) return;

        const channelName = `project-realtime-${projectId}`;

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*', 
                    schema: 'public',
                    table: 'project_stages',
                    filter: `project_id=eq.${projectId}`,
                },
                (payload: RealtimePayload) => {
                    onStageUpdateRef.current?.(payload);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'stage_updates',
                    filter: `project_id=eq.${projectId}`,
                },
                (payload: RealtimePayload) => {
                    onStageUpdateRef.current?.(payload);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'projects',
                    filter: `id=eq.${projectId}`,
                },
                (payload: RealtimePayload) => {
                    onProjectUpdateRef.current?.(payload);
                }
            )
            .subscribe((status) => {
                if (status === 'CHANNEL_ERROR') {
                    if (__DEV__) { console.warn(`[Realtime] Channel error for project ${projectId}`); }
                }
            });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [projectId, enabled]); 
}

export default useProjectRealtime;
