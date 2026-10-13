// Official Hackathon Winners Reference Dataset
// Extracted and validated directly from:
// /home/gopikrishna/Documents/hackathons update/hackathon 2026.docx

export interface OfficialDocMember {
  name: string;
  deptAndYear: string;
  department: string;
  academicYear: string;
}

export interface OfficialDocTeamAward {
  sNo: string;
  hackathonName: string;
  eventDate: string;
  awardPosition: 'First' | 'Second' | 'Third' | 'Other';
  prizeMoney: number;
  prizeMoneyFormatted: string;
  members: OfficialDocMember[];
}

export const OFFICIAL_DOC_WINNERS: OfficialDocTeamAward[] = [
  {
    sNo: '1',
    hackathonName: 'BHARAT SHAKTHI TRACK DECODE SIH 2026',
    eventDate: '01 AUG 2026',
    awardPosition: 'First',
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
    sNo: '2',
    hackathonName: 'TECHNOVA 2026',
    eventDate: '13 SEP 2026',
    awardPosition: 'First',
    prizeMoney: 25000,
    prizeMoneyFormatted: '₹25,000/-',
    members: [
      { name: 'GOPI KRISHNA', deptAndYear: 'AIML/IV', department: 'AIML', academicYear: 'IV' },
      { name: 'VISHAL', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'TANUSREE', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'PAVITHRA', deptAndYear: 'AIDS/IV', department: 'AIDS', academicYear: 'IV' },
      { name: 'DHANASREE', deptAndYear: 'BIOTECH/IV', department: 'BIOTECH', academicYear: 'IV' },
    ]
  },
  {
    sNo: '3',
    hackathonName: 'SUSTAINVERSE 2026',
    eventDate: '15-16 SEP 2026',
    awardPosition: 'Second',
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
    sNo: '4',
    hackathonName: 'VYNORAE 2026',
    eventDate: '21-22 AUG 2026',
    awardPosition: 'First',
    prizeMoney: 20000,
    prizeMoneyFormatted: '₹20,000/-',
    members: [
      { name: 'THEJASVANI S', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'VAISHNAVI DEVI G', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'YOGITHA SG', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  },
  {
    sNo: '5',
    hackathonName: 'TECH THIRUVIZHA 2026',
    eventDate: '25 AUG 2026',
    awardPosition: 'Second',
    prizeMoney: 5000,
    prizeMoneyFormatted: '₹5,000/-',
    members: [
      { name: 'TANUSREE', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'VISHAL', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'JEFFRY JOYSON', deptAndYear: 'CSBS/II', department: 'CSBS', academicYear: 'II' },
    ]
  },
  {
    sNo: '6',
    hackathonName: 'HACK DAY GENESIS 2026 (Track A)',
    eventDate: '30 SEP 2026',
    awardPosition: 'First',
    prizeMoney: 2000,
    prizeMoneyFormatted: '₹2,000/-',
    members: [
      { name: 'THEJASVANI S', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'VAISHNAVI DEVI G', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'YOGITHA SG', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  },
  {
    sNo: '7',
    hackathonName: 'HACK DAY GENESIS 2026 (Track B)',
    eventDate: '30 SEP 2026',
    awardPosition: 'Second',
    prizeMoney: 1000,
    prizeMoneyFormatted: '₹1,000/-',
    members: [
      { name: 'KAVIYA', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'SHANTHOSH', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'SAKTHI PRIYA', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'YAZHINI', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  },
  {
    sNo: '8',
    hackathonName: 'FUTURE FORGE 2K26',
    eventDate: '05-06 OCT 2026',
    awardPosition: 'Second',
    prizeMoney: 8000,
    prizeMoneyFormatted: '₹8,000/-',
    members: [
      { name: 'KAVIYA', deptAndYear: 'CSBS/III', department: 'CSBS', academicYear: 'III' },
      { name: 'SHANTHOSH', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'SAKTHI PRIYA', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
      { name: 'YAZHINI', deptAndYear: 'CSE/III', department: 'CSE', academicYear: 'III' },
    ]
  }
];

export const TOTAL_OFFICIAL_DOC_PRIZE = OFFICIAL_DOC_WINNERS.reduce((sum, t) => sum + t.prizeMoney, 0); // 96,000
export const TOTAL_OFFICIAL_DOC_TEAMS = OFFICIAL_DOC_WINNERS.length; // 8
