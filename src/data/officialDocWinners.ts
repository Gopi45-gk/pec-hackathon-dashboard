// Official Hackathon Winners Dataset
// Extracted exclusively from /home/gopikrishna/Documents/hackathons update/hackathon 2026.docx
// Prathyusha Engineering College (PEC) Institutional Records

import { TeamAwardRecord, StudentWinnerRecord } from '../types';

export interface OfficialDocMember {
  name: string;
  deptAndYear: string;
  department: string;
  academicYear: string;
}

export interface OfficialDocTeamAward {
  id: string; // Stable unique award identifier
  sNo: string;
  hackathonName: string;
  chartLabel: string; // Explicit label for charts and visualizations
  eventDate: string;
  awardPosition: 'First Prize' | 'Second Prize';
  prizeMoney: number;
  prizeMoneyFormatted: string;
  members: OfficialDocMember[];
}

export const OFFICIAL_DOC_WINNERS: OfficialDocTeamAward[] = [
  {
    id: 'award-1-sih-track-decode-2026',
    sNo: '1',
    hackathonName: 'BHARAT SHAKTHI TRACK DECODE SIH 2026',
    chartLabel: 'Bharat Shakthi Track – Decode SIH 2026',
    eventDate: '01 AUG 2026',
    awardPosition: 'First Prize',
    prizeMoney: 30000,
    prizeMoneyFormatted: '₹30,000/-',
    members: [
      { name: 'NAVEEN V', deptAndYear: 'AIML/II', department: 'AIML', academicYear: 'II' },
      { name: 'NAVEEN BASKER', deptAndYear: 'AIML/II', department: 'AIML', academicYear: 'II' },
      { name: 'SHIVANI MOHAN', deptAndYear: 'AIDS/II', department: 'AIDS', academicYear: 'II' },
      { name: 'SWEETY JOSE J', deptAndYear: 'AIDS/II', department: 'AIDS', academicYear: 'II' },
      { name: 'JEEVA ANAND', deptAndYear: 'AIML/II', department: 'AIML', academicYear: 'II' },
    ]
  },
  {
    id: 'award-2-technova-2026',
    sNo: '2',
    hackathonName: 'TECHNOVA 2026',
    chartLabel: 'Technova 2026',
    eventDate: '13 SEP 2026',
    awardPosition: 'First Prize',
    prizeMoney: 25000,
    prizeMoneyFormatted: '₹25,000/-',
    members: [
      { name: 'GOPI KRISHNA', deptAndYear: 'AIML/IV', department: 'AIML', academicYear: 'IV' },
      { name: 'VISHAL', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'TANUSREE', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'PAVITHRA', deptAndYear: 'AIDS/IV', department: 'AIDS', academicYear: 'IV' },
      { name: 'DHANASREE', deptAndYear: '', department: '', academicYear: '' },
    ]
  },
  {
    id: 'award-3-sustainverse-2026',
    sNo: '3',
    hackathonName: 'SUSTAINVERSE 2026',
    chartLabel: 'Sustainverse 2026',
    eventDate: '15-16 SEP 2026',
    awardPosition: 'Second Prize',
    prizeMoney: 5000,
    prizeMoneyFormatted: '₹5,000/-',
    members: [
      { name: 'SHAM KUMAR', deptAndYear: 'BIOTECH/IV', department: 'BIOTECH', academicYear: 'IV' },
      { name: 'DHANA SHREE', deptAndYear: 'BIOTECH/IV', department: 'BIOTECH', academicYear: 'IV' },
      { name: 'BHOOMIKA', deptAndYear: 'BIOTECH/IV', department: 'BIOTECH', academicYear: 'IV' },
      { name: 'NARESH', deptAndYear: 'ECE/II', department: 'ECE', academicYear: 'II' },
    ]
  },
  {
    id: 'award-4-vynorae-2026',
    sNo: '4',
    hackathonName: 'VYNORAE 2026',
    chartLabel: 'Vynorae 2026',
    eventDate: '21-22 AUG 2026',
    awardPosition: 'First Prize',
    prizeMoney: 20000,
    prizeMoneyFormatted: '₹20,000/-',
    members: [
      { name: 'THEJASVANI S', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'VAISHNAVI DEVI G', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'YOGITHA SG', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  },
  {
    id: 'award-5-tech-thiruvizha-2026',
    sNo: '5',
    hackathonName: 'TECH THIRUVIZHA 2026',
    chartLabel: 'Tech Thiruvizha 2026',
    eventDate: '25 AUG 2026',
    awardPosition: 'Second Prize',
    prizeMoney: 5000,
    prizeMoneyFormatted: '₹5,000/-',
    members: [
      { name: 'TANUSREE', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'VISHAL', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'JEFFRY JOYSON', deptAndYear: 'CSBS/II', department: 'CSBS', academicYear: 'II' },
    ]
  },
  {
    id: 'award-6-hack-day-genesis-first-2026',
    sNo: '6',
    hackathonName: 'HACK DAY GENESIS 2026',
    chartLabel: 'Hack Day Genesis 2026 — First Prize',
    eventDate: '30 SEP 2026',
    awardPosition: 'First Prize',
    prizeMoney: 2000,
    prizeMoneyFormatted: '₹2,000/-',
    members: [
      { name: 'THEJASVANI S', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'VAISHNAVI DEVI G', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'YOGITHA SG', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  },
  {
    id: 'award-7-hack-day-genesis-second-2026',
    sNo: '7',
    hackathonName: 'HACK DAY GENESIS 2026',
    chartLabel: 'Hack Day Genesis 2026 — Second Prize',
    eventDate: '30 SEP 2026',
    awardPosition: 'Second Prize',
    prizeMoney: 1000,
    prizeMoneyFormatted: '₹1,000/-',
    members: [
      { name: 'KAVIYA', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'SHANTHOSH', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'Sakthi Priya', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'Yazhini', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  },
  {
    id: 'award-8-future-forge-2026',
    sNo: '8',
    hackathonName: 'FUTURE FORGE 2K26',
    chartLabel: 'Future Forge 2K26',
    eventDate: '05-06 OCT 2026',
    awardPosition: 'Second Prize',
    prizeMoney: 8000,
    prizeMoneyFormatted: '₹8,000/-',
    members: [
      { name: 'KAVIYA', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'SHANTHOSH', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'Sakthi Priya', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'Yazhini', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  }
];

// Authoritative aggregate metrics derived from hackathon 2026.docx
export const TOTAL_OFFICIAL_DOC_PRIZE = OFFICIAL_DOC_WINNERS.reduce((sum, t) => sum + t.prizeMoney, 0); // ₹96,000
export const TOTAL_OFFICIAL_DOC_AWARDS = OFFICIAL_DOC_WINNERS.length; // 8 Award Records
export const TOTAL_OFFICIAL_DOC_TEAMS = OFFICIAL_DOC_WINNERS.length; // 8
export const TOTAL_OFFICIAL_FIRST_PRIZES = OFFICIAL_DOC_WINNERS.filter(w => w.awardPosition === 'First Prize').length; // 4
export const TOTAL_OFFICIAL_SECOND_PRIZES = OFFICIAL_DOC_WINNERS.filter(w => w.awardPosition === 'Second Prize').length; // 4
export const TOTAL_OFFICIAL_UNIQUE_STUDENTS = new Set(
  OFFICIAL_DOC_WINNERS.flatMap(w => w.members.map(m => m.name.toLowerCase().trim()))
).size; // 20

// Mapped TeamAwardRecord dataset for cross-component consumption
export const OFFICIAL_TEAM_AWARD_RECORDS: TeamAwardRecord[] = OFFICIAL_DOC_WINNERS.map(w => ({
  teamId: w.id,
  sNo: w.sNo,
  hackathonName: w.hackathonName,
  eventDate: w.eventDate,
  awardPosition: w.awardPosition === 'First Prize' ? 'First' : 'Second',
  rawAward: w.awardPosition,
  prizeMoney: w.prizeMoney,
  members: w.members
}));

// Mapped StudentWinnerRecord dataset (20 total student entries across awards)
export const OFFICIAL_STUDENT_WINNER_RECORDS: StudentWinnerRecord[] = OFFICIAL_DOC_WINNERS.flatMap(w => 
  w.members.map((m, idx) => ({
    id: `${w.id}-student-${idx}`,
    sNo: w.sNo,
    studentName: m.name,
    deptAndYear: m.deptAndYear,
    department: m.department,
    academicYear: m.academicYear,
    hackathonName: w.hackathonName,
    eventDate: w.eventDate,
    awardPosition: w.awardPosition === 'First Prize' ? 'First' : 'Second',
    rawAward: w.awardPosition,
    prizeMoney: w.prizeMoney,
    teamId: w.id,
    isTotalRow: false
  }))
);
