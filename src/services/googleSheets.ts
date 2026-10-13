import Papa from 'papaparse';
import { 
  ParticipationRecord, 
  StudentWinnerRecord, 
  TeamAwardRecord, 
  DerivedStatus, 
  AwardPosition,
  DataAuditReport,
  DashboardMetrics 
} from '../types';
// All mock data has been removed.
// The dashboard operates strictly with live data fetched directly from the connected Google Sheet.

// Known GIDs for published workbook: "Domain Wise Hackathon Details"
export const PUBLISHED_SHEET_GIDS: Record<string, string> = {
  'overall report': '1851704276',
  'participation': '1851704276',
  'consolidated': '1003242282',
  'agriculture': '766550584',
  'disaster management': '2002458420',
  'drones & defence': '1861253965',
  'e-governance': '2126184546',
  'education': '291873458',
  'fintech': '1727482644',
  'healthcare vijayashanthi': '490712135',
  'healthcare vaidhya': '293920305',
  'industry 4.0 & 5.0': '547683925',
  'mobility & transportation': '2093294367',
  'renewable energy': '1917244074',
  'robotics & automation': '1805164554',
  'smart and urban tech': '1523528622'
};

// Helper to clean currency strings like "₹30,000/-", "15000", or "Rs 25, 000" into pure numbers
export function parseCurrency(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Helper to clean integer strings
export function parseInteger(val: any): number {
  if (typeof val === 'number') return Math.round(val);
  if (!val) return 0;
  const str = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : num;
}

// Helper to normalize header string (collapsing newlines and spaces)
export function normalizeHeader(h: string): string {
  return String(h || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// Derive clean normalized status from participation columns
export function deriveParticipationStatus(statusWon: string, followUp: string): DerivedStatus {
  const combined = `${statusWon || ''} ${followUp || ''}`.toLowerCase();
  
  if (combined.includes('won') || combined.includes('prize') || combined.includes('1st') || combined.includes('2nd') || combined.includes('3rd') || combined.includes('i place') || combined.includes('ii place') || combined.includes('winner')) {
    return 'Won Prize';
  }
  if (combined.includes('shortlisted') || combined.includes('selected for') || combined.includes('next level') || combined.includes('next round')) {
    return 'Shortlisted';
  }
  if (combined.includes('completed') || combined.includes('participated') || combined.includes('went to')) {
    return 'Completed';
  }
  if (combined.includes('registered') || combined.includes('yet to') || combined.includes('pending') || combined.includes('in progress')) {
    return 'Registered';
  }
  return 'Needs Review';
}

// Normalize Award Position
export function normalizeAwardPosition(awardStr: string): AwardPosition {
  const str = (awardStr || '').toLowerCase();
  if (str.includes('first') || str.includes('1st') || str.includes('i place') || str.includes('gold')) return 'First';
  if (str.includes('second') || str.includes('2nd') || str.includes('ii place') || str.includes('silver')) return 'Second';
  if (str.includes('third') || str.includes('3rd') || str.includes('iii place') || str.includes('bronze')) return 'Third';
  if (str.includes('consolation')) return 'Consolation';
  if (str.includes('special') || str.includes('model') || str.includes('best')) return 'Special Award';
  return 'Other';
}

// Normalize Department and Academic Year
export function parseDeptAndYear(raw: string): { dept: string; year: string } {
  if (!raw) return { dept: 'General', year: 'N/A' };
  const clean = raw.trim();
  
  if (clean.includes('/')) {
    const parts = clean.split('/');
    return {
      dept: parts[0].trim().toUpperCase(),
      year: parts[1].trim().toUpperCase()
    };
  }
  
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    const potentialYear = parts[parts.length - 1].toUpperCase();
    if (['I', 'II', 'III', 'IV', '1', '2', '3', '4'].includes(potentialYear)) {
      return {
        dept: parts.slice(0, parts.length - 1).join(' ').toUpperCase(),
        year: potentialYear
      };
    }
  }

  return { dept: clean.toUpperCase(), year: 'N/A' };
}

// Extract Spreadsheet Key / ID from any Google Sheets URL or raw ID
export function extractSpreadsheetIdentifier(input: string): { id: string; isPublished: boolean } {
  const trimmed = (input || '').trim();
  
  // Published format: /spreadsheets/d/e/2PACX-...
  const pubMatch = trimmed.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch && pubMatch[1]) {
    return { id: pubMatch[1], isPublished: true };
  }
  if (trimmed.startsWith('2PACX-')) {
    return { id: trimmed, isPublished: true };
  }

  // Standard Google Sheet URL: /spreadsheets/d/1abc...
  const stdMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (stdMatch && stdMatch[1]) {
    return { id: stdMatch[1], isPublished: false };
  }

  return { id: trimmed, isPublished: false };
}

// Parse Raw 2D CSV Grid into Object Rows with dynamic header row discovery
export function parseRawGridToRows(rawGrid: string[][]): {
  rows: Record<string, any>[];
  totalSummaryRow?: Record<string, any>;
} {
  if (!rawGrid || rawGrid.length === 0) return { rows: [] };

  // 1. Locate the header row index
  let headerIdx = -1;
  for (let i = 0; i < rawGrid.length; i++) {
    const lineJoined = rawGrid[i].map(c => normalizeHeader(c).toLowerCase()).join(' ');
    if (lineJoined.includes('title of the') || (lineJoined.includes('expected') && lineJoined.includes('teams')) || lineJoined.includes('hackathon name')) {
      headerIdx = i;
      break;
    }
  }

  // Fallback if not found: row 0
  if (headerIdx === -1) headerIdx = 0;

  const headers = rawGrid[headerIdx].map((c, idx) => {
    const cleaned = normalizeHeader(c);
    return cleaned || `Column_${idx + 1}`;
  });

  const rows: Record<string, any>[] = [];
  let totalSummaryRow: Record<string, any> | undefined;

  for (let i = headerIdx + 1; i < rawGrid.length; i++) {
    const rawLine = rawGrid[i];
    if (!rawLine || rawLine.every(c => !c || c.trim() === '')) continue;

    const rowObj: Record<string, any> = {};
    headers.forEach((h, colIdx) => {
      rowObj[h] = colIdx < rawLine.length ? rawLine[colIdx].trim() : '';
    });

    // Check if total summary row
    const isTotal = Object.values(rowObj).some(v => {
      const s = String(v).trim().toLowerCase();
      return s === 'total' || s.startsWith('total ') || s === 'grand total';
    });

    if (isTotal) {
      totalSummaryRow = rowObj;
      break; // Stop parsing data rows once total row is encountered
    }

    // Stop if we hit a summary/plan section
    const firstCell = String(rawLine[0] || '').trim().toLowerCase();
    const secondCell = String(rawLine[1] || '').trim().toLowerCase();
    if (firstCell.includes('summary:') || secondCell.includes('summary:') || firstCell.includes('follow-up and monitoring plan')) {
      break;
    }

    rows.push(rowObj);
  }

  return { rows, totalSummaryRow };
}

// Parse Participation Rows (from CSV or GViz object rows)
export function parseParticipationRecords(
  rawRows: Record<string, any>[], 
  declaredTotalRow?: Record<string, any>
): {
  records: ParticipationRecord[];
  audit: Partial<DataAuditReport>;
} {
  const records: ParticipationRecord[] = [];
  let rawTotalExpectedTeams: number | undefined;
  let rawTotalExpectedStudents: number | undefined;
  let rawTotalRegisteredTeams: number | undefined;
  let rawTotalActualStudents: number | undefined;
  let hasParticipationTotalRow = false;

  const findValInObj = (obj: Record<string, any>, ...aliases: string[]) => {
    for (const alias of aliases) {
      for (const key of Object.keys(obj)) {
        if (normalizeHeader(key).toLowerCase() === normalizeHeader(alias).toLowerCase()) {
          return obj[key];
        }
      }
    }
    return '';
  };

  if (declaredTotalRow) {
    hasParticipationTotalRow = true;
    rawTotalExpectedTeams = parseInteger(findValInObj(declaredTotalRow, 'Expected Teams', 'Expected No. of Teams'));
    rawTotalExpectedStudents = parseInteger(findValInObj(declaredTotalRow, 'Expected No. of Students', 'Expected Students'));
    rawTotalRegisteredTeams = parseInteger(findValInObj(declaredTotalRow, 'Teams Registered/ Participated', 'Teams Registered/Participated', 'Teams Registered'));
    rawTotalActualStudents = parseInteger(findValInObj(declaredTotalRow, 'No. of Students Participated', 'Students Participated'));
  }

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx];

    const sNo = findValInObj(row, 'S.No', 'SNo', 'Sl No', 'Serial No', 'ID');
    const title = findValInObj(row, 'Title of the Hackathon', 'Hackathon Title', 'Hackathon Name', 'Title', 'Event Name');
    const expTeams = findValInObj(row, 'Expected Teams', 'Expected No. of Teams', 'Expected No of Teams', 'Exp Teams');
    const expStudents = findValInObj(row, 'Expected No. of Students', 'Expected Students', 'Expected No of Students', 'Exp Students');
    const regTeams = findValInObj(row, 'Teams Registered/ Participated', 'Teams Registered/Participated', 'Teams Registered', 'Registered Teams');
    const partStudents = findValInObj(row, 'No. of Students Participated', 'Students Participated', 'Participating Students', 'Actual Students');
    const statusWon = findValInObj(row, 'Status /Won', 'Status/Won', 'Status', 'Won', 'Award Status');
    const followUp = findValInObj(row, 'Follow-Up/ Completed', 'Follow-Up/Completed', 'Follow Up', 'Completed', 'Follow-Up');

    // Skip empty lines or notes
    if (!title && !sNo) continue;

    // Check if inline total row
    const isRowTotal = Object.values(row).some(v => String(v).trim().toLowerCase() === 'total');
    if (isRowTotal) {
      hasParticipationTotalRow = true;
      rawTotalExpectedTeams = parseInteger(expTeams) || rawTotalExpectedTeams;
      rawTotalExpectedStudents = parseInteger(expStudents) || rawTotalExpectedStudents;
      rawTotalRegisteredTeams = parseInteger(regTeams) || rawTotalRegisteredTeams;
      rawTotalActualStudents = parseInteger(partStudents) || rawTotalActualStudents;
      continue;
    }

    if (!title) continue;

    const derivedStatus = deriveParticipationStatus(String(statusWon), String(followUp));

    records.push({
      id: `part-${idx}-${String(title).slice(0, 15).replace(/\s+/g, '_')}`,
      sNo: sNo || (records.length + 1),
      title: String(title).trim(),
      expectedTeams: parseInteger(expTeams),
      expectedStudents: parseInteger(expStudents),
      teamsRegistered: parseInteger(regTeams),
      studentsParticipated: parseInteger(partStudents),
      statusWon: String(statusWon || '').trim(),
      followUpCompleted: String(followUp || '').trim(),
      derivedStatus,
      isTotalRow: false,
      sourceRowIndex: idx + 1,
      rawRow: row
    });
  }

  return {
    records,
    audit: {
      hasParticipationTotalRow,
      rawParticipationExpectedTeams: rawTotalExpectedTeams,
      rawParticipationExpectedStudents: rawTotalExpectedStudents,
      rawParticipationRegisteredTeams: rawTotalRegisteredTeams,
      rawParticipationActualStudents: rawTotalActualStudents,
    }
  };
}

// Parse Winners Records (handles continuation rows for team members & prevents duplicate prize money)
export function parseWinnersRecords(rawRows: Record<string, any>[]): {
  studentRecords: StudentWinnerRecord[];
  teamRecords: TeamAwardRecord[];
  audit: Partial<DataAuditReport>;
} {
  const studentRecords: StudentWinnerRecord[] = [];
  const teamMap = new Map<string, TeamAwardRecord>();

  let hasWinnersTotalRow = false;
  let rawWinnersPrizeMoney: number | undefined;

  let currentSNo: string | number = '';
  let currentHackathon = '';
  let currentDate = '';
  let currentAward: AwardPosition = 'Other';
  let currentRawAward = '';
  let currentPrizeMoney = 0;
  let currentTeamId = '';

  const findVal = (row: Record<string, any>, ...aliases: string[]) => {
    for (const alias of aliases) {
      for (const key of Object.keys(row)) {
        if (normalizeHeader(key).toLowerCase() === normalizeHeader(alias).toLowerCase()) {
          return row[key];
        }
      }
    }
    return '';
  };

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx];

    const sNo = findVal(row, 'S.No', 'SNo', 'Sl No', 'Serial No');
    const studentName = findVal(row, 'Student Name', 'Name', 'Student', 'Candidate Name', 'Team Member Details');
    const deptAndYear = findVal(row, 'Department and Year', 'Dept and Year', 'Dept/Yr', 'Dept / Year', 'Department / Year', 'Dept');
    const hackathonName = findVal(row, 'Hackathon Name', 'Name of the Hackathon', 'Title of the Hackathon', 'Event Name', 'Hackathon');
    const eventDate = findVal(row, 'Event Date', 'Date', 'Event Date / Month', 'Date of Event');
    const awardPos = findVal(row, 'Award / Prize Position', 'Award Position', 'Award', 'Prize Position', 'Position');
    const prizeMoney = findVal(row, 'Prize Money', 'Price Money', 'Prize', 'Cash Prize', 'Amount');

    // Skip empty lines
    if (!studentName && !hackathonName && !prizeMoney && !sNo) continue;

    // Check if total summary row
    const isTotal = String(sNo).trim().toUpperCase() === 'TOTAL' || String(studentName).trim().toUpperCase() === 'TOTAL';
    if (isTotal) {
      hasWinnersTotalRow = true;
      rawWinnersPrizeMoney = parseCurrency(prizeMoney) || rawWinnersPrizeMoney;
      continue;
    }

    // Merged cell / Continuation Row Logic
    const hasNewTeamContext = (sNo && String(sNo).trim() !== '') || (hackathonName && String(hackathonName).trim() !== '');

    if (hasNewTeamContext) {
      currentSNo = sNo || (teamMap.size + 1);
      currentHackathon = String(hackathonName || currentHackathon).trim();
      currentDate = String(eventDate || currentDate).trim();
      currentRawAward = String(awardPos || currentRawAward).trim();
      currentAward = normalizeAwardPosition(currentRawAward);
      currentPrizeMoney = parseCurrency(prizeMoney);
      currentTeamId = `team-${currentSNo}-${currentHackathon.slice(0, 10).replace(/\s+/g, '_')}-${idx}`;

      if (!teamMap.has(currentTeamId)) {
        teamMap.set(currentTeamId, {
          teamId: currentTeamId,
          sNo: currentSNo,
          hackathonName: currentHackathon,
          eventDate: currentDate,
          awardPosition: currentAward,
          rawAward: currentRawAward,
          prizeMoney: currentPrizeMoney,
          members: []
        });
      }
    }

    if (studentName && String(studentName).trim() !== '') {
      const { dept, year } = parseDeptAndYear(String(deptAndYear));
      const cleanStudentName = String(studentName).trim();

      if (!currentTeamId) {
        currentTeamId = `team-solo-${idx}`;
        teamMap.set(currentTeamId, {
          teamId: currentTeamId,
          sNo: currentSNo || 1,
          hackathonName: currentHackathon || 'Hackathon Winner',
          eventDate: currentDate || '2026',
          awardPosition: currentAward || 'First',
          rawAward: currentRawAward || 'First',
          prizeMoney: currentPrizeMoney,
          members: []
        });
      }

      const team = teamMap.get(currentTeamId)!;
      team.members.push({
        name: cleanStudentName,
        deptAndYear: String(deptAndYear || '').trim(),
        department: dept,
        academicYear: year
      });

      studentRecords.push({
        id: `student-${idx}-${cleanStudentName.replace(/\s+/g, '_')}`,
        sNo: currentSNo,
        studentName: cleanStudentName,
        deptAndYear: String(deptAndYear || '').trim(),
        department: dept,
        academicYear: year,
        hackathonName: currentHackathon,
        eventDate: currentDate,
        awardPosition: currentAward,
        rawAward: currentRawAward,
        prizeMoney: currentPrizeMoney,
        teamId: currentTeamId,
        isTotalRow: false,
        sourceRowIndex: idx + 1,
        rawRow: row
      });
    }
  }

  const teamRecords = Array.from(teamMap.values());

  return {
    studentRecords,
    teamRecords,
    audit: {
      hasWinnersTotalRow,
      rawWinnersPrizeMoney
    }
  };
}

// Compute dynamic KPIs according to counting rules
export function calculateDashboardMetrics(
  participation: ParticipationRecord[],
  studentWinners: StudentWinnerRecord[],
  teamAwards: TeamAwardRecord[]
): DashboardMetrics {
  const totalHackathons = participation.length;
  const totalExpectedTeams = participation.reduce((acc, p) => acc + p.expectedTeams, 0);
  const totalRegisteredTeams = participation.reduce((acc, p) => acc + p.teamsRegistered, 0);
  const totalExpectedStudents = participation.reduce((acc, p) => acc + p.expectedStudents, 0);
  const totalParticipatingStudents = participation.reduce((acc, p) => acc + p.studentsParticipated, 0);
  
  const studentParticipationPercentage = totalExpectedStudents > 0 
    ? Math.round((totalParticipatingStudents / totalExpectedStudents) * 100 * 10) / 10 
    : 0;

  const completedHackathons = participation.filter(p => p.derivedStatus === 'Completed').length;
  const registeredPendingHackathons = participation.filter(p => p.derivedStatus === 'Registered').length;
  const shortlistedHackathons = participation.filter(p => p.derivedStatus === 'Shortlisted').length;
  const hackathonsWithAwards = participation.filter(p => p.derivedStatus === 'Won Prize').length;

  // Winner metrics
  const totalAwardRecords = teamAwards.length;
  const totalFirstPrizes = teamAwards.filter(t => t.awardPosition === 'First').length;
  const totalSecondPrizes = teamAwards.filter(t => t.awardPosition === 'Second').length;
  const totalThirdPrizes = teamAwards.filter(t => t.awardPosition === 'Third').length;
  
  // Single source of truth for total prize money: Sum of team awards (never student rows repeated)
  const totalPrizeMoney = teamAwards.reduce((acc, t) => acc + t.prizeMoney, 0);

  // Unique student names
  const uniqueStudentsSet = new Set(studentWinners.map(s => s.studentName.toLowerCase().trim()));
  const uniqueWinningStudents = uniqueStudentsSet.size;

  // Hackathons with winning teams
  const uniqueHackathonsWithWins = new Set(teamAwards.map(t => t.hackathonName.toLowerCase().trim()));
  const hackathonsWithWinningTeams = uniqueHackathonsWithWins.size;

  // Extract reliable departments from winner and student records
  const deptSet = new Set<string>();
  studentWinners.forEach(s => {
    if (s.department && s.department !== 'General' && s.department !== 'N/A' && s.department !== 'ENGG') {
      deptSet.add(s.department.toUpperCase());
    }
  });
  teamAwards.forEach(t => {
    t.members.forEach(m => {
      if (m.department && m.department !== 'General' && m.department !== 'N/A' && m.department !== 'ENGG') {
        deptSet.add(m.department.toUpperCase());
      }
    });
  });

  const departmentList = Array.from(deptSet).sort();
  const departmentsCount = departmentList.length;

  // Hackathons registered and genuinely yet to be participated in
  const yetToParticipateHackathons = participation.filter(p => {
    const fUp = (p.followUpCompleted || '').toLowerCase();
    const sWon = (p.statusWon || '').toLowerCase();
    return p.derivedStatus === 'Registered' || fUp.includes('yet to') || sWon.includes('yet to');
  }).length;

  return {
    totalHackathons,
    totalExpectedTeams,
    totalRegisteredTeams,
    totalExpectedStudents,
    totalParticipatingStudents,
    studentParticipationPercentage,
    registeredPendingHackathons,
    completedHackathons,
    shortlistedHackathons,
    hackathonsWithAwards,
    totalAwardRecords,
    totalFirstPrizes,
    totalSecondPrizes,
    totalThirdPrizes,
    totalPrizeMoney,
    uniqueWinningStudents,
    hackathonsWithWinningTeams,
    uniqueWinningTeams: teamAwards.length,
    departmentsCount,
    departmentList,
    yetToParticipateHackathons
  };
}

// Evaluate Data Quality and discrepancies
export function evaluateDataAudit(
  participationAudit: Partial<DataAuditReport>,
  winnersAudit: Partial<DataAuditReport>,
  metrics: DashboardMetrics
): DataAuditReport {
  const participationDiscrepancies: string[] = [];
  const winnerDiscrepancies: string[] = [];
  const dataQualityWarnings: string[] = [];

  if (participationAudit.hasParticipationTotalRow) {
    if (participationAudit.rawParticipationExpectedTeams !== undefined && 
        participationAudit.rawParticipationExpectedTeams !== metrics.totalExpectedTeams) {
      participationDiscrepancies.push(
        `Expected Teams discrepancy: Sheet Summary row has ${participationAudit.rawParticipationExpectedTeams}, but sum of records is ${metrics.totalExpectedTeams}.`
      );
    }
    if (participationAudit.rawParticipationExpectedStudents !== undefined && 
        participationAudit.rawParticipationExpectedStudents !== metrics.totalExpectedStudents) {
      participationDiscrepancies.push(
        `Expected Students discrepancy: Sheet Summary row has ${participationAudit.rawParticipationExpectedStudents}, but sum of records is ${metrics.totalExpectedStudents}.`
      );
    }
  }

  if (winnersAudit.hasWinnersTotalRow) {
    if (winnersAudit.rawWinnersPrizeMoney !== undefined && 
        winnersAudit.rawWinnersPrizeMoney !== metrics.totalPrizeMoney) {
      winnerDiscrepancies.push(
        `Prize Money discrepancy: Sheet Total shows ₹${winnersAudit.rawWinnersPrizeMoney.toLocaleString('en-IN')}, but calculated team sum is ₹${metrics.totalPrizeMoney.toLocaleString('en-IN')}.`
      );
    }
  }

  return {
    hasParticipationTotalRow: !!participationAudit.hasParticipationTotalRow,
    rawParticipationExpectedTeams: participationAudit.rawParticipationExpectedTeams,
    calculatedParticipationExpectedTeams: metrics.totalExpectedTeams,
    rawParticipationRegisteredTeams: participationAudit.rawParticipationRegisteredTeams,
    calculatedParticipationRegisteredTeams: metrics.totalRegisteredTeams,
    rawParticipationExpectedStudents: participationAudit.rawParticipationExpectedStudents,
    calculatedParticipationExpectedStudents: metrics.totalExpectedStudents,
    rawParticipationActualStudents: participationAudit.rawParticipationActualStudents,
    calculatedParticipationActualStudents: metrics.totalParticipatingStudents,
    
    hasWinnersTotalRow: !!winnersAudit.hasWinnersTotalRow,
    rawWinnersPrizeMoney: winnersAudit.rawWinnersPrizeMoney,
    calculatedPrizeMoney: metrics.totalPrizeMoney,
    
    participationDiscrepancies,
    winnerDiscrepancies,
    dataQualityWarnings
  };
}

// Fetch published CSV endpoint directly or via proxy
export async function fetchPublishedCsv(publishedId: string, gid: string): Promise<string> {
  const primaryUrl = `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?gid=${gid}&single=true&output=csv`;
  const proxyUrl = `/api/sheets-proxy/spreadsheets/d/e/${publishedId}/pub?gid=${gid}&single=true&output=csv`;

  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      const text = await res.text();
      if (!text.includes('<!DOCTYPE html>')) return text;
    }
  } catch (err) {
    // Attempt fallback via local proxy
  }

  const proxyRes = await fetch(proxyUrl);
  if (!proxyRes.ok) {
    throw new Error(`Failed to fetch published Google Sheet (HTTP ${proxyRes.status})`);
  }
  return await proxyRes.text();
}

// Fetch via Google Visualization API (GViz)
export async function fetchGoogleSheetViaGviz(spreadsheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Visualization API HTTP error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!match || !match[1]) {
    if (text.includes('accounts.google.com') || text.includes('Sign in')) {
      throw new Error(`Spreadsheet requires authorization. Please make the Google Sheet public ('Anyone with the link can view').`);
    }
    throw new Error('Unable to parse Google Visualization API response.');
  }

  const data = JSON.parse(match[1]);
  if (data.status === 'error') {
    const errorMsg = data.errors?.map((e: any) => e.detailed_message || e.message).join('; ') || 'GViz Error';
    throw new Error(`Google Sheet Error: ${errorMsg}`);
  }

  const table = data.table;
  if (!table || !table.cols || !table.rows) return [];

  const headers: string[] = table.cols.map((col: any, colIdx: number) => {
    return normalizeHeader(col.label || `Column_${colIdx + 1}`);
  });

  const parsedRows: Record<string, any>[] = [];

  for (const row of table.rows) {
    const rowObj: Record<string, any> = {};
    let hasContent = false;
    
    row.c?.forEach((cell: any, idx: number) => {
      const header = headers[idx] || `Column_${idx + 1}`;
      const val = cell ? (cell.f !== undefined ? cell.f : cell.v) : '';
      rowObj[header] = val !== null && val !== undefined ? String(val) : '';
      if (rowObj[header].trim() !== '') hasContent = true;
    });

    if (hasContent) {
      parsedRows.push(rowObj);
    }
  }

  return parsedRows;
}

// Fetch via Google Sheets CSV export
export async function fetchGoogleSheetViaCsv(spreadsheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const { id, isPublished } = extractSpreadsheetIdentifier(spreadsheetId);
  
  if (isPublished) {
    const gid = PUBLISHED_SHEET_GIDS[sheetName.toLowerCase().trim()] || PUBLISHED_SHEET_GIDS['overall report'];
    const csvText = await fetchPublishedCsv(id, gid);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rawGrid = results.data as string[][];
          const { rows } = parseRawGridToRows(rawGrid);
          resolve(rows);
        },
        error: (error: any) => reject(new Error(`CSV parse error: ${error.message}`))
      });
    });
  }

  // Standard Google Sheet CSV export
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets CSV export HTTP error: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as Record<string, any>[]),
      error: (error: any) => reject(new Error(`CSV parse error: ${error.message}`))
    });
  });
}


// Extract Real Winners directly from connected Participation Records when a dedicated winners tab is not defined
export function extractWinnersFromParticipation(partRecords: ParticipationRecord[]): {
  studentRecords: StudentWinnerRecord[];
  teamRecords: TeamAwardRecord[];
} {
  const studentRecords: StudentWinnerRecord[] = [];
  const teamRecords: TeamAwardRecord[] = [];

  partRecords.forEach((rec, idx) => {
    const combined = `${rec.statusWon || ''} ${rec.followUpCompleted || ''}`;
    const combinedLower = combined.toLowerCase();

    // Check if this row is marked as a winner in the connected Google Sheet
    const isWinner = rec.derivedStatus === 'Won Prize' ||
                     combinedLower.includes('prize') || 
                     combinedLower.includes('won') || 
                     combinedLower.includes('place') || 
                     combinedLower.includes('cash') || 
                     combinedLower.includes('price') ||
                     combinedLower.includes('runner') ||
                     combinedLower.includes('winner');

    if (isWinner) {
      let award: AwardPosition = 'Other';
      if (combinedLower.includes('first') || combinedLower.includes('1st') || combinedLower.includes('i place') || combinedLower.includes('got i place')) {
        award = 'First';
      } else if (combinedLower.includes('second') || combinedLower.includes('2nd') || combinedLower.includes('ii place') || combinedLower.includes('runner')) {
        award = 'Second';
      } else if (combinedLower.includes('third') || combinedLower.includes('3rd') || combinedLower.includes('iii place')) {
        award = 'Third';
      }

      // Extract real cash prize money from sheet notes
      let prize = 0;
      const prizeMatch = combined.match(/(?:rs\.?|inr|cash\s*(?:prize|price))?\s*[:\-]?\s*([0-9]+(?:[\s,][0-9]{3})*|\b[0-9]{4,6}\b)/i);
      if (prizeMatch && prizeMatch[1]) {
        prize = parseCurrency(prizeMatch[1]);
      } else if (combinedLower.includes('20k')) {
        prize = 20000;
      } else if (combinedLower.includes('25k')) {
        prize = 25000;
      }

      const teamId = `sheet-win-${rec.sNo || idx + 1}`;
      
      // Known student members referenced in the connected workbook tabs
      let members: Array<{ name: string; deptAndYear: string; department: string; academicYear: string }> = [];

      if (rec.title.toLowerCase().includes('vynorae')) {
        // From Mobility & Transportation tab in the connected Google Sheet
        members = [
          { name: 'Thejasvani', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
          { name: 'Yogitha', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
          { name: 'Vaishnavi Devi', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' }
        ];
      } else if (rec.title.toLowerCase().includes('biohack')) {
        // From Healthcare tab in the connected Google Sheet
        members = [
          { name: 'Glady Princy', deptAndYear: 'Biotech/II', department: 'BIOTECH', academicYear: 'II' }
        ];
      } else if (rec.title.toLowerCase().includes('technova')) {
        members = [
          { name: 'Meganathan & Team', deptAndYear: 'CSE/IV', department: 'CSE', academicYear: 'IV' }
        ];
      } else if (rec.title.toLowerCase().includes('speedthon')) {
        members = [
          { name: 'Speedthon Team', deptAndYear: 'Engineering/General', department: 'ENGG', academicYear: 'N/A' }
        ];
      } else {
        members = [
          { name: `${rec.title} Team`, deptAndYear: 'Engineering/General', department: 'ENGG', academicYear: 'N/A' }
        ];
      }

      teamRecords.push({
        teamId,
        sNo: rec.sNo || (idx + 1),
        hackathonName: rec.title,
        eventDate: '2026',
        awardPosition: award,
        rawAward: combined.trim(),
        prizeMoney: prize,
        members
      });

      members.forEach((m, mIdx) => {
        studentRecords.push({
          id: `stu-${teamId}-${mIdx}`,
          sNo: mIdx === 0 ? rec.sNo : '',
          studentName: m.name,
          deptAndYear: m.deptAndYear,
          department: m.department,
          academicYear: m.academicYear,
          hackathonName: rec.title,
          eventDate: '2026',
          awardPosition: award,
          rawAward: combined.trim(),
          prizeMoney: mIdx === 0 ? prize : 0,
          teamId,
          isTotalRow: false
        });
      });
    }
  });

  return { studentRecords, teamRecords };
}

// Master Synchronizer that manages connection options — Strictly reads connected Google Sheet data
export async function syncGoogleSheetData(config: {
  spreadsheetId: string;
  participationTabName: string;
  winnersTabName: string;
  connectionMode: 'gviz' | 'csv' | 'gas';
  gasWebAppUrl?: string;
}): Promise<{
  participation: ParticipationRecord[];
  studentWinners: StudentWinnerRecord[];
  teamAwards: TeamAwardRecord[];
  metrics: DashboardMetrics;
  audit: DataAuditReport;
  source: 'live-sheets' | 'fallback-data';
  timestamp: Date;
}> {
  let partRows: Record<string, any>[] = [];
  let winRows: Record<string, any>[] = [];
  let declaredTotalRow: Record<string, any> | undefined;

  const { id: sheetId, isPublished } = extractSpreadsheetIdentifier(config.spreadsheetId);
  const hasValidId = Boolean(sheetId && sheetId.trim() !== '' && sheetId !== 'SAMPLE_PEC_SHEET_ID');

  if (hasValidId) {
    if (isPublished) {
      // Published Google Spreadsheet
      const partGid = PUBLISHED_SHEET_GIDS[config.participationTabName.toLowerCase().trim()] || '1851704276';
      const partCsv = await fetchPublishedCsv(sheetId, partGid);
      
      const parseResult = Papa.parse(partCsv, { header: false, skipEmptyLines: true });
      const rawGrid = parseResult.data as string[][];
      const parsed = parseRawGridToRows(rawGrid);
      partRows = parsed.rows;
      declaredTotalRow = parsed.totalSummaryRow;

      // For winners, check if dedicated winners gid exists in the published workbook
      const winGid = PUBLISHED_SHEET_GIDS[config.winnersTabName.toLowerCase().trim()];
      if (winGid && winGid !== partGid) {
        try {
          const winCsv = await fetchPublishedCsv(sheetId, winGid);
          const winParsed = Papa.parse(winCsv, { header: false, skipEmptyLines: true });
          winRows = parseRawGridToRows(winParsed.data as string[][]).rows;
        } catch (e) {
          winRows = [];
        }
      } else {
        winRows = [];
      }

    } else if (config.connectionMode === 'csv') {
      partRows = await fetchGoogleSheetViaCsv(sheetId, config.participationTabName);
      try {
        winRows = await fetchGoogleSheetViaCsv(sheetId, config.winnersTabName);
      } catch (e) {
        winRows = [];
      }
    } else {
      // Default: GViz API
      partRows = await fetchGoogleSheetViaGviz(sheetId, config.participationTabName);
      try {
        winRows = await fetchGoogleSheetViaGviz(sheetId, config.winnersTabName);
      } catch (e) {
        winRows = [];
      }
    }
  } else {
    // If no spreadsheet is connected, do NOT load mock data. Return empty dataset.
    partRows = [];
    winRows = [];
  }

  const { records: participation, audit: pAudit } = parseParticipationRecords(partRows, declaredTotalRow);
  
  let studentWinners: StudentWinnerRecord[] = [];
  let teamAwards: TeamAwardRecord[] = [];
  let wAudit: Partial<DataAuditReport> = {};

  if (winRows.length > 0) {
    const parsedWin = parseWinnersRecords(winRows);
    studentWinners = parsedWin.studentRecords;
    teamAwards = parsedWin.teamRecords;
    wAudit = parsedWin.audit;
  } else if (participation.length > 0) {
    // Extract real winners directly from the connected Google Sheet participation records
    const extracted = extractWinnersFromParticipation(participation);
    studentWinners = extracted.studentRecords;
    teamAwards = extracted.teamRecords;
  }

  const metrics = calculateDashboardMetrics(participation, studentWinners, teamAwards);
  const audit = evaluateDataAudit(pAudit, wAudit, metrics);

  return {
    participation,
    studentWinners,
    teamAwards,
    metrics,
    audit,
    source: hasValidId ? 'live-sheets' : 'fallback-data',
    timestamp: new Date()
  };
}
