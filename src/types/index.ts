export type DerivedStatus = 
  | 'Completed' 
  | 'Registered' 
  | 'Shortlisted' 
  | 'Won Prize' 
  | 'Needs Review';

export type AwardPosition = 
  | 'First' 
  | 'Second' 
  | 'Third' 
  | 'Consolation' 
  | 'Special Award' 
  | 'Other';

export interface ParticipationRecord {
  id: string;
  sNo: number | string;
  title: string;
  expectedTeams: number;
  expectedStudents: number;
  teamsRegistered: number;
  studentsParticipated: number;
  statusWon: string;
  followUpCompleted: string;
  derivedStatus: DerivedStatus;
  isTotalRow: boolean;
  notes?: string;
  sourceRowIndex?: number;
  // Raw fields from sheet
  rawRow?: Record<string, string>;
}

export interface StudentWinnerRecord {
  id: string;
  sNo: number | string;
  studentName: string;
  deptAndYear: string;
  department: string;
  academicYear: string;
  hackathonName: string;
  eventDate: string;
  eventDateParsed?: string; // YYYY-MM-DD for timeline
  awardPosition: AwardPosition;
  rawAward: string;
  prizeMoney: number;
  teamId: string;
  isTotalRow: boolean;
  sourceRowIndex?: number;
  rawRow?: Record<string, string>;
}

export interface TeamAwardRecord {
  teamId: string;
  sNo: number | string;
  hackathonName: string;
  eventDate: string;
  awardPosition: AwardPosition;
  rawAward: string;
  prizeMoney: number;
  members: Array<{
    name: string;
    deptAndYear: string;
    department: string;
    academicYear: string;
  }>;
}

export interface DataAuditReport {
  hasParticipationTotalRow: boolean;
  rawParticipationExpectedTeams?: number;
  calculatedParticipationExpectedTeams: number;
  rawParticipationRegisteredTeams?: number;
  calculatedParticipationRegisteredTeams: number;
  rawParticipationExpectedStudents?: number;
  calculatedParticipationExpectedStudents: number;
  rawParticipationActualStudents?: number;
  calculatedParticipationActualStudents: number;
  
  hasWinnersTotalRow: boolean;
  rawWinnersPrizeMoney?: number;
  calculatedPrizeMoney: number;
  
  participationDiscrepancies: string[];
  winnerDiscrepancies: string[];
  dataQualityWarnings: string[];
}

export interface SheetConnectionConfig {
  spreadsheetId: string;
  participationTabName: string;
  winnersTabName: string;
  connectionMode: 'gviz' | 'csv' | 'gas';
  gasWebAppUrl?: string;
  autoRefreshInterval: number; // in seconds
  isCustomConfigured: boolean;
}

export interface DashboardMetrics {
  // Participation Metrics
  totalHackathons: number;
  totalExpectedTeams: number;
  totalRegisteredTeams: number;
  totalExpectedStudents: number;
  totalParticipatingStudents: number;
  studentParticipationPercentage: number;
  registeredPendingHackathons: number;
  completedHackathons: number;
  shortlistedHackathons: number;
  hackathonsWithAwards: number;

  // Winner Metrics
  totalAwardRecords: number;
  totalFirstPrizes: number;
  totalSecondPrizes: number;
  totalThirdPrizes: number;
  totalPrizeMoney: number;
  uniqueWinningStudents: number;
  hackathonsWithWinningTeams: number;
  uniqueWinningTeams: number;

  // Essential Dashboard Fields
  departmentsCount: number;
  departmentList: string[];
  yetToParticipateHackathons: number;
}

export interface GlobalFilterState {
  searchQuery: string;
  hackathon: string;
  status: string;
  department: string;
  academicYear: string;
  awardPosition: string;
  dateRange: string;
}
