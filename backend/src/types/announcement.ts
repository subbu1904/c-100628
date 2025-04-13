
export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  priority: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementBanner {
  text: string;
  isEnabled: boolean;
  lastUpdated: string;
}
