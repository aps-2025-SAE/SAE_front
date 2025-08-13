export interface Event {
  id: string;
  title: string;
  description: string;
  dateInit: string | Date;
  dateEnd: string | Date;
  budget: number;
  diaryOffers: number;
}

export interface EventRequest {
  id: string;
  clientName: string;
  clientEmail?: string;
  description: string;
  eventDate: string | Date;
  eventTime: string;
  eventType: string;
  budget: number;
  location?: string;
  guestCount?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string | Date;
  eventId?: string;
}
