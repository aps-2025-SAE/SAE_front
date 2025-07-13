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
  eventId?: string;
  description: string;
  budget: number;
}
