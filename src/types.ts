export type EventType = 
  | 'wedding'
  | 'milestone-birthday'
  | 'community-event'
  | 'corporate-gala'
  | 'anniversary-party'
  | 'other';

export interface EventInput {
  eventType: EventType;
  title: string;
  guestCount: number;
  location: string;
  vibe: string;
  totalBudget: number;
  eventDate?: string;
  specialNotes?: string;
}

export interface BudgetCategory {
  category: string;
  percentage: number;
  amount: number;
  items: string[];
  tips: string;
}

export interface BudgetMatrix {
  totalBudget: number;
  perGuestCost: number;
  contingencyBufferAmount: number;
  contingencyBufferPercent: number;
  categories: BudgetCategory[];
  themeSpecificSavingsTips: string[];
}

export interface TimelineTask {
  id: string;
  task: string;
  isUrgent?: boolean;
  deadlineNote?: string;
  completed?: boolean;
}

export interface TimelineMilestone {
  period: string; // e.g. "9–12 Months Out", "6 Months Out", "1 Month Out", "Week-of"
  timingBadge: string;
  focusTitle: string;
  description: string;
  bookingWindow: string;
  tasks: TimelineTask[];
}

export interface DayOfScheduleItem {
  id: string;
  time: string;
  activity: string;
  leadPerson: string;
  notes: string;
}

export interface ReverseTimeline {
  milestones: TimelineMilestone[];
  dayOfSchedule: DayOfScheduleItem[];
}

export interface VendorQuote {
  id: string;
  vendorName: string;
  contactPerson?: string;
  emailOrPhone?: string;
  quoteAmount: number;
  inclusions: string[];
  exclusionsOrExtraFees: string[];
  depositRequired: number;
  cancellationPolicy: string;
  pros: string[];
  cons: string[];
  rating?: number;
  status: 'Pending' | 'Shortlisted' | 'Selected' | 'Declined';
  notes?: string;
  quoteDate?: string;
}

export interface VendorChecklistItem {
  role: string;
  category: string;
  priority: 'High' | 'Medium' | 'Essential';
  budgetEstimate: string;
  allocatedBudgetNumber?: number;
  criticalQuestions: string[];
  redFlags: string[];
  status?: 'To Contact' | 'Interviewing' | 'Booked' | 'Deposit Paid';
  notes?: string;
  quotes?: VendorQuote[];
}

export interface LogisticsItem {
  category: 'Permits & Licensing' | 'Event Insurance & Safety' | 'Power & AV Specs' | 'Guest Flow & Accessibility' | 'Sanitation & Facilities';
  requirement: string;
  criticalDetails: string;
  actionItem: string;
}

export interface VendorAndLogistics {
  vendors: VendorChecklistItem[];
  logistics: LogisticsItem[];
}

export interface PaletteColor {
  name: string;
  hex: string;
  role: string; // e.g. "Primary Accent", "Base Neutral", "Subtle Highlight"
}

export interface CreativeConcept {
  id: string;
  themeName: string;
  tagline: string;
  narrativeVibe: string;
  palette: PaletteColor[];
  signatureExperience: string;
  diyElements: string[];
  professionalElements: string[];
  tablescapeAndDecor: string;
  audioVisualAtmosphere: string;
}

export interface CollaborationPrompt {
  id: string;
  question: string;
  contextWhyItMatters: string;
  sampleOptions: string[];
  answered?: boolean;
  userResponse?: string;
}

export interface MasterEventPlan {
  id: string;
  createdAt: string;
  eventInput: EventInput;
  budgetMatrix: BudgetMatrix;
  timeline: ReverseTimeline;
  vendorAndLogistics: VendorAndLogistics;
  creativeConcepts: CreativeConcept[];
  collaborationPrompts: CollaborationPrompt[];
  executiveSummary: string;
  fullMarkdown: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
