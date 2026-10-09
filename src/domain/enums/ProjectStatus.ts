export enum ProjectStatusEnum {
    PENDING = 'pending',
    ON_PROGRESS = 'on_progress',
    DONE = 'done',
    ON_HOLD = 'on_hold',
}

export enum ProjectStageStatusEnum {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu',
    on_progress: 'Sedang Berjalan',
    done: 'Selesai',
    on_hold: 'Ditunda',
};

export const STAGE_STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu',
    in_progress: 'Sedang Berjalan',
    done: 'Selesai',
};
