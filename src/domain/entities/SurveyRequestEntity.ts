export interface SurveyRequestData {
    id: string;
    rawDbId?: number;
    clientName: string;
    companyName: string;
    phone: string;
    email: string;
    structureType: string;
    location: string;
    submittedDate: string;
    notes: string;
    status: 'pending' | 'claimed';
    claimedBy?: string;
    claimedAt?: string;
}

export class SurveyRequestEntity {
    private readonly data: SurveyRequestData;

    constructor(data: SurveyRequestData) {
        this.data = data;
    }

    public get id(): string {
        return this.data.id;
    }

    public get rawDbId(): number | undefined {
        return this.data.rawDbId;
    }

    public get clientName(): string {
        return this.data.clientName;
    }

    public get companyName(): string {
        return this.data.companyName;
    }

    public get phone(): string {
        return this.data.phone;
    }

    public get email(): string {
        return this.data.email;
    }

    public get structureType(): string {
        return this.data.structureType;
    }

    public get location(): string {
        return this.data.location;
    }

    public get submittedDate(): string {
        return this.data.submittedDate;
    }

    public get notes(): string {
        return this.data.notes;
    }

    public get status(): 'pending' | 'claimed' {
        return this.data.status;
    }

    public get claimedBy(): string | undefined {
        return this.data.claimedBy;
    }

    public get claimedAt(): string | undefined {
        return this.data.claimedAt;
    }

    public isPending(): boolean {
        return this.data.status === 'pending';
    }

    public isClaimed(): boolean {
        return this.data.status === 'claimed';
    }

    public getWhatsAppUrl(): string {
        const cleanPhone = this.data.phone.replace(/^0/, '62');
        const text = encodeURIComponent(
            `Halo ${this.data.clientName}, saya dari Tim Marketing Graha Survei Indonesia (GSI). Terkait pengajuan survey Anda...`
        );
        return `https://wa.me/${cleanPhone}?text=${text}`;
    }

    public getPhoneUrl(): string {
        return `tel:${this.data.phone}`;
    }

    public claimBy(userName: string, roleTitle: string): SurveyRequestEntity {
        return new SurveyRequestEntity({
            ...this.data,
            status: 'claimed',
            claimedBy: `${userName} (${roleTitle})`,
            claimedAt: 'Baru Saja',
        });
    }

    public toDTO(): SurveyRequestData {
        return this.data;
    }
}
