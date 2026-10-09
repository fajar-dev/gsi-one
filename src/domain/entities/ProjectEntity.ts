import { ProjectDetail, ProjectStage } from '../../services/projectService';
import { ProjectStageStatusEnum } from '../enums/ProjectStatus';
import { canEditProjectRole, isInternalRole } from '../enums/UserRole';

export class ProjectEntity {
    private readonly data: ProjectDetail;

    constructor(data: ProjectDetail) {
        this.data = data;
    }

    public get id(): string {
        return this.data.id;
    }

    public get code(): string {
        return this.data.project_code || '-';
    }

    public get name(): string {
        return this.data.project_name;
    }

    public get clientName(): string {
        return this.data.client_name;
    }

    public get budget(): number | undefined {
        return this.data.budget;
    }

    public get status(): string {
        return this.data.status;
    }

    public get stages(): ProjectStage[] {
        return this.data.stages || [];
    }

    public getProgressPercentage(): number {
        if (!this.stages || this.stages.length === 0) return 0;
        const doneStages = this.stages.filter(s => s.status === ProjectStageStatusEnum.DONE).length;
        return Math.round((doneStages / this.stages.length) * 100);
    }

    public isOverdue(): boolean {
        if (!this.data.estimated_finish) return false;
        const estDate = new Date(this.data.estimated_finish);
        return estDate < new Date() && this.data.status !== 'done';
    }

    public canUserEdit(role?: string): boolean {
        return canEditProjectRole(role);
    }

    public isUserInternal(role?: string): boolean {
        return isInternalRole(role);
    }

    public getFormattedStartDate(): string {
        if (!this.data.start_date) return '-';
        return new Date(this.data.start_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    public getFormattedEndDate(): string {
        if (!this.data.estimated_finish) return '-';
        return new Date(this.data.estimated_finish).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    public getFormattedBudget(): string {
        if (this.data.budget == null) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(this.data.budget);
    }

    public toDTO(): ProjectDetail {
        return this.data;
    }
}
