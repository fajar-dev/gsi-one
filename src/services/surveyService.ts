import { SupabaseSurveyRepository } from './repositories/SupabaseSurveyRepository';
import { ISurveyRepository, CreateBookingData, ClaimBookingData } from './repositories/ISurveyRepository';
import { SurveyRequestData } from '../domain/entities/SurveyRequestEntity';

class SurveyService {
    private repository: ISurveyRepository;

    constructor(repository: ISurveyRepository) {
        this.repository = repository;
    }

    async getBookings(): Promise<SurveyRequestData[]> {
        return this.repository.getBookings();
    }

    async createBooking(data: CreateBookingData): Promise<void> {
        return this.repository.createBooking(data);
    }

    async claimBooking(bookingId: number, claimData: ClaimBookingData): Promise<void> {
        return this.repository.claimBooking(bookingId, claimData);
    }

    async deleteBooking(bookingId: number): Promise<void> {
        return this.repository.deleteBooking(bookingId);
    }
}

export const surveyService = new SurveyService(new SupabaseSurveyRepository());

export type { CreateBookingData, ClaimBookingData, ISurveyRepository };
