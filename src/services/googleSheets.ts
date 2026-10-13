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
import { DEFAULT_PARTICIPATION_RAW, DEFAULT_WINNERS_RAW } from '../data/defaultPecData';

// Helper to clean currency strings like "₹30,000/-" or "5000" into pure numbers
export function parseCurrency(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace(/[^\d.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Helper to clean integer strings
export function parseInteger(val: any): number {
  if (typeof val === 'number') return Math.round(val);
  if (!val) return 0;
  const str = String(val).replace(/[^\d.-]/g, '');
  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : num;
}

// Helper to check if a row is a summary/total row
export function isSummaryRow(row: Record<string, any>): boolean {
  const values = Object.values(row).map(v => String(v || '').trim().toUpperCase());
  return values.some(v => v === 'TOTAL' || v === 'TOTAL SUMMARY' || v.startsWith('TOTAL ') || v === 'GRAND TOTAL' || v === 'SUM');
}

// Derive clean normalized status from participation columns
export function deriveParticipationStatus(statusWon: string, followUp: string): DerivedStatus {
  const combined = `${statusWon || ''} ${followUp || ''}`.toLowerCase();
  
  if (combined.includes('won') || combined.includes('prize') || combined.includes('1st') || combined.includes('2nd') || combined.includes('3rd') || combined.includes('winner')) {
    return 'Won Prize';
  }
  if (combined.includes('shortlisted') || combined.includes('selected') || combined.includes('next round')) {
    return 'Shortlisted';
  }
  if (combined.includes('completed') || combined.includes('participated') || combined.includes('felicitation')) {
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
  if (str.includes('first') || str.includes('1st') || str.includes('1') || str.includes('gold')) return 'First';
  if (str.includes('second') || str.includes('2nd') || str.includes('2') || str.includes('silver')) return 'Second';
  if (str.includes('third') || str.includes('3rd') || str.includes('3') || str.includes('bronze')) return 'Third';
  if (str.includes('consolation')) return 'Consolation';
  if (str.includes('special') || str.includes('model') || str.includes('best')) return 'Special Award';
  return 'Other';
}

// Normalize Department and Academic Year
export function parseDeptAndYear(raw: string): { dept: string; year: string } {
  if (!raw) return { dept: 'General', year: 'N/A' };
  const clean = raw.trim();
  
  // Format like "AIML/II", "CSE / III", "Biotech/IV"
  if (clean.includes('/')) {
    const parts = clean.split('/');
    return {
      dept: parts[0].trim().toUpperCase(),
      year: parts[1].trim().toUpperCase()
    };
  }
  
  // Format with space or dash
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

// Parse Participation Rows (from CSV or GViz object rows)
export function parseParticipationRecords(rawRows: Record<string, any>[]): {
  records: ParticipationRecord[];
  audit: Partial<DataAuditReport>;
} {
  const records: ParticipationRecord[] = [];
  let rawTotalExpectedTeams: number | undefined;
  let rawTotalExpectedStudents: number | undefined;
  let rawTotalRegisteredTeams: number | undefined;
  let rawTotalActualStudents: number | undefined;
  let hasParticipationTotalRow = false;

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx];
    
    // Find matching keys case-insensitively
    const findVal = (...aliases: string[]) => {
      for (const alias of aliases) {
        for (const key of Object.keys(row)) {
          if (key.trim().toLowerCase() === alias.trim().toLowerCase()) {
            return row[key];
          }
        }
      }
      return '';
    };

    const sNo = findVal('S.No', 'SNo', 'Sl No', 'Serial No', 'ID');
    const title = findVal('Title of the Hackathon', 'Hackathon Title', 'Hackathon Name', 'Title', 'Event Name');
    const expTeams = findVal('Expected Teams', 'Expected No. of Teams', 'Expected No of Teams', 'Exp Teams');
    const expStudents = findVal('Expected No. of Students', 'Expected Students', 'Expected No of Students', 'Exp Students');
    const regTeams = findVal('Teams Registered/Participated', 'Teams Registered', 'Registered Teams', 'Teams Participated');
    const partStudents = findVal('No. of Students Participated', 'Students Participated', 'Participating Students', 'Actual Students');
    const statusWon = findVal('Status/Won', 'Status', 'Won', 'Award Status');
    const followUp = findVal('Follow-Up/Completed', 'Follow Up', 'Completed', 'Follow-Up');

    // Skip completely empty rows
    if (!title && !sNo && !expTeams && !regTeams) {
      continue;
    }

    // Check if total summary row
    if (isSummaryRow(row) || String(sNo).trim().toUpperCase() === 'TOTAL' || String(title).trim().toUpperCase().includes('TOTAL')) {
      hasParticipationTotalRow = true;
      rawTotalExpectedTeams = parseInteger(expTeams) || rawTotalExpectedTeams;
      rawTotalExpectedStudents = parseInteger(expStudents) || rawTotalExpectedStudents;
      rawTotalRegisteredTeams = parseInteger(regTeams) || rawTotalRegisteredTeams;
      rawTotalActualStudents = parseInteger(partStudents) || rawTotalActualStudents;
      continue; // Exclude summary row from individual records to prevent double counting
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

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx];

    const findVal = (...aliases: string[]) => {
      for (const alias of aliases) {
        for (const key of Object.keys(row)) {
          if (key.trim().toLowerCase() === alias.trim().toLowerCase()) {
            return row[key];
          }
        }
      }
      return '';
    };

    const sNo = findVal('S.No', 'SNo', 'Sl No', 'Serial No');
    const studentName = findVal('Student Name', 'Name', 'Student', 'Candidate Name');
    const deptAndYear = findVal('Department and Year', 'Dept and Year', 'Dept/Yr', 'Dept / Year', 'Department / Year', 'Dept');
    const hackathonName = findVal('Hackathon Name', 'Name of the Hackathon', 'Title of the Hackathon', 'Event Name', 'Hackathon');
    const eventDate = findVal('Event Date', 'Date', 'Event Date / Month', 'Date of Event');
    const awardPos = findVal('Award / Prize Position', 'Award Position', 'Award', 'Prize Position', 'Position');
    const prizeMoney = findVal('Prize Money', 'Price Money', 'Prize', 'Cash Prize', 'Amount');

    // Skip empty lines
    if (!studentName && !hackathonName && !prizeMoney && !sNo) {
      continue;
    }

    // Check if total summary row
    if (isSummaryRow(row) || String(sNo).trim().toUpperCase() === 'TOTAL' || String(studentName).trim().toUpperCase() === 'TOTAL') {
      hasWinnersTotalRow = true;
      rawWinnersPrizeMoney = parseCurrency(prizeMoney) || rawWinnersPrizeMoney;
      continue;
    }

    // Merged cell / Continuation Row Logic:
    // If S.No or Hackathon or Award is provided, start a new team context
    const hasNewTeamContext = (sNo && String(sNo).trim() !== '') || (hackathonName && String(hackathonName).trim() !== '');

    if (hasNewTeamContext) {
      currentSNo = sNo || (teamMap.size + 1);
      currentHackathon = String(hackathonName || currentHackathon).trim();
      currentDate = String(eventDate || currentDate).trim();
      currentRawAward = String(awardPos || currentRawAward).trim();
      currentAward = normalizeAwardPosition(currentRawAward);
      currentPrizeMoney = parseCurrency(prizeMoney);
      currentTeamId = `team-${currentSNo}-${currentHackathon.slice(0, 10).replace(/\s+/g, '_')}-${idx}`;

      // Register or get team
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

      // If for some reason a student is listed before a team context, create a fallback team
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

      // Add to team members
      const team = teamMap.get(currentTeamId)!;
      team.members.push({
        name: cleanStudentName,
        deptAndYear: String(deptAndYear || '').trim(),
        department: dept,
        academicYear: year
      });

      // Individual student winner record
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
        prizeMoney: currentPrizeMoney, // Team's award amount (not multiplied)
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
    uniqueWinningTeams: teamAwards.length
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

// Fetch via Google Visualization API (GViz)
export async function fetchGoogleSheetViaGviz(spreadsheetId: string, sheetName: string): Promise<Record<string, any>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Visualization API HTTP error: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  
  // Extract JSON payload from Google's response: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!match || !match[1]) {
    // If not matching, it might be an HTML error page (permissions or invalid sheet)
    if (text.includes('accounts.google.com') || text.includes('Sign in')) {
      throw new Error(`Spreadsheet requires authorization. Please make the Google Sheet public ('Anyone with the link can view') or use Google Apps Script.`);
    }
    throw new Error('Unable to parse Google Visualization API response.');
  }

  const data = JSON.parse(match[1]);
  if (data.status === 'error') {
    const errorMsg = data.errors?.map((e: any) => e.detailed_message || e.message).join('; ') || 'GViz Error';
    throw new Error(`Google Sheet Error: ${errorMsg}`);
  }

  const table = data.table;
  if (!table || !table.cols || !table.rows) {
    return [];
  }

  const headers: string[] = table.cols.map((col: any, colIdx: number) => {
    return col.label || `Column_${colIdx + 1}`;
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
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets CSV export HTTP error: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<html>')) {
    throw new Error('Google Sheet returned HTML instead of CSV. Ensure the sheet permission is set to "Anyone with the link can view".');
  }

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        resolve(results.data as Record<string, any>[]);
      },
      error: (error: any) => {
        reject(new Error(`CSV parse error: ${error.message}`));
      }
    });
  });
}

// Fetch via Google Apps Script Web App
export async function fetchGoogleSheetViaGas(webAppUrl: string, action = 'getData'): Promise<{
  participationRows: Record<string, any>[];
  winnersRows: Record<string, any>[];
}> {
  const url = `${webAppUrl}${webAppUrl.includes('?') ? '&' : '?'}action=${action}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Apps Script HTTP error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  if (json.status === 'error') {
    throw new Error(json.message || 'Google Apps Script error');
  }
  return {
    participationRows: json.participation || [],
    winnersRows: json.winners || []
  };
}

// Master Synchronizer that manages connection options and fallbacks
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

  const isCustomId = config.spreadsheetId && config.spreadsheetId.trim() !== '' && config.spreadsheetId !== 'SAMPLE_PEC_SHEET_ID';

  if (isCustomId) {
    if (config.connectionMode === 'gas' && config.gasWebAppUrl) {
      const gasData = await fetchGoogleSheetViaGas(config.gasWebAppUrl);
      partRows = gasData.participationRows;
      winRows = gasData.winnersRows;
    } else if (config.connectionMode === 'csv') {
      partRows = await fetchGoogleSheetViaCsv(config.spreadsheetId, config.participationTabName);
      try {
        winRows = await fetchGoogleSheetViaCsv(config.spreadsheetId, config.winnersTabName);
      } catch (e) {
        console.warn('Winners sheet not found or failed, using participation data only', e);
      }
    } else {
      // Default: GViz API
      partRows = await fetchGoogleSheetViaGviz(config.spreadsheetId, config.participationTabName);
      try {
        winRows = await fetchGoogleSheetViaGviz(config.spreadsheetId, config.winnersTabName);
      } catch (e) {
        console.warn('Winners sheet not found or failed, using participation data only', e);
      }
    }
  } else {
    // Verified PEC official records
    partRows = DEFAULT_PARTICIPATION_RAW;
    winRows = DEFAULT_WINNERS_RAW;
  }

  const { records: participation, audit: pAudit } = parseParticipationRecords(partRows);
  const { studentRecords: studentWinners, teamRecords: teamAwards, audit: wAudit } = parseWinnersRecords(winRows);
  const metrics = calculateDashboardMetrics(participation, studentWinners, teamAwards);
  const audit = evaluateDataAudit(pAudit, wAudit, metrics);

  return {
    participation,
    studentWinners,
    teamAwards,
    metrics,
    audit,
    source: isCustomId ? 'live-sheets' : 'fallback-data',
    timestamp: new Date()
  };
}
