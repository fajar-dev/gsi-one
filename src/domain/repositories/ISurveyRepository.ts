import { SurveyRequestData } from '../entities/SurveyRequestEntity';

export interface CreateBookingData {
  full_name: string;
  company_name?: string | null;
  email: string;
  phone: string;
  service_type: string;
  location: string;
  preferred_date: string;
  message: string | null;
  status: string;
}

export interface ClaimBookingData {
  status: string;
  claimed_by: string;
  claimed_at: string;
}

export interface ISurveyRepository {
  getBookings(): Promise<SurveyRequestData[]>;

  createBooking(data: CreateBookingData): Promise<void>;

  claimBooking(bookingId: number, claimData: ClaimBookingData): Promise<void>;

  deleteBooking(bookingId: number): Promise<void>;
}
