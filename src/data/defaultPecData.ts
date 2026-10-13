import { ParticipationRecord, StudentWinnerRecord, TeamAwardRecord } from '../types';

export const DEFAULT_PARTICIPATION_RAW = [
  {
    "S.No": "1",
    "Title of the Hackathon": "Bharat Shakthi Track – Decode SIH 2026",
    "Expected Teams": "8",
    "Expected No. of Students": "48",
    "Teams Registered/Participated": "8",
    "No. of Students Participated": "48",
    "Status/Won": "Won 1st Prize (₹30,000)",
    "Follow-Up/Completed": "Completed - Research Day Felicitation"
  },
  {
    "S.No": "2",
    "Title of the Hackathon": "Vynorae 2026",
    "Expected Teams": "4",
    "Expected No. of Students": "16",
    "Teams Registered/Participated": "4",
    "No. of Students Participated": "12",
    "Status/Won": "Won 1st Prize (₹20,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "3",
    "Title of the Hackathon": "Tech Thiruvizha 2026",
    "Expected Teams": "5",
    "Expected No. of Students": "20",
    "Teams Registered/Participated": "4",
    "No. of Students Participated": "15",
    "Status/Won": "Won 2nd Prize (₹5,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "4",
    "Title of the Hackathon": "Technova 2026",
    "Expected Teams": "6",
    "Expected No. of Students": "30",
    "Teams Registered/Participated": "5",
    "No. of Students Participated": "25",
    "Status/Won": "Won 1st Prize (₹25,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "5",
    "Title of the Hackathon": "Sustainverse 2026",
    "Expected Teams": "5",
    "Expected No. of Students": "20",
    "Teams Registered/Participated": "4",
    "No. of Students Participated": "16",
    "Status/Won": "Won 2nd Prize (₹5,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "6",
    "Title of the Hackathon": "Hack Day Genesis 2026",
    "Expected Teams": "10",
    "Expected No. of Students": "40",
    "Teams Registered/Participated": "9",
    "No. of Students Participated": "36",
    "Status/Won": "Won 1st & 2nd Prizes (₹3,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "7",
    "Title of the Hackathon": "Future Forge 2K26",
    "Expected Teams": "6",
    "Expected No. of Students": "24",
    "Teams Registered/Participated": "5",
    "No. of Students Participated": "20",
    "Status/Won": "Won 2nd Prize (₹8,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "8",
    "Title of the Hackathon": "Smart India Hackathon (SIH) 2026 – Internal Hackathon",
    "Expected Teams": "25",
    "Expected No. of Students": "150",
    "Teams Registered/Participated": "25",
    "No. of Students Participated": "150",
    "Status/Won": "12 Teams Shortlisted for National Stage",
    "Follow-Up/Completed": "Shortlisted"
  },
  {
    "S.No": "9",
    "Title of the Hackathon": "DDC 2026 – Drone Development Challenge",
    "Expected Teams": "3",
    "Expected No. of Students": "15",
    "Teams Registered/Participated": "2",
    "No. of Students Participated": "10",
    "Status/Won": "Won 2nd Prize (Design Category)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "10",
    "Title of the Hackathon": "BAJA SAEINDIA 2026 (mBAJA)",
    "Expected Teams": "2",
    "Expected No. of Students": "25",
    "Teams Registered/Participated": "1",
    "No. of Students Participated": "20",
    "Status/Won": "Won 3rd Prize – Best Model (₹3,000)",
    "Follow-Up/Completed": "Completed"
  },
  {
    "S.No": "11",
    "Title of the Hackathon": "PALS innoWAH 2026 Innovation Challenge",
    "Expected Teams": "8",
    "Expected No. of Students": "32",
    "Teams Registered/Participated": "8",
    "No. of Students Participated": "32",
    "Status/Won": "In Progress / Mentorship",
    "Follow-Up/Completed": "Yet to Participate"
  },
  {
    "S.No": "12",
    "Title of the Hackathon": "Healthcare & MedTech Hackathon 2026",
    "Expected Teams": "6",
    "Expected No. of Students": "24",
    "Teams Registered/Participated": "6",
    "No. of Students Participated": "24",
    "Status/Won": "Selected for Prototype Round",
    "Follow-Up/Completed": "Shortlisted"
  },
  {
    "S.No": "13",
    "Title of the Hackathon": "National Cyber Security Hackathon 2026",
    "Expected Teams": "5",
    "Expected No. of Students": "20",
    "Teams Registered/Participated": "4",
    "No. of Students Participated": "0",
    "Status/Won": "Registrations Completed",
    "Follow-Up/Completed": "Registered / Yet to Participate"
  },
  // Example of a Total row in sheets (which our parser detects, validates against sum, and ignores from records)
  {
    "S.No": "TOTAL",
    "Title of the Hackathon": "Total Summary",
    "Expected Teams": "92",
    "Expected No. of Students": "464",
    "Teams Registered/Participated": "81",
    "No. of Students Participated": "408",
    "Status/Won": "",
    "Follow-Up/Completed": ""
  }
];

export const DEFAULT_WINNERS_RAW = [
  // 1. Bharat Shakthi Track (Team award: 30000)
  { "S.No": "1", "Student Name": "Naveen V", "Department and Year": "AIML/II", "Hackathon Name": "Bharat Shakthi Track – Decode SIH 2026", "Event Date": "01 AUG 2026", "Award / Prize Position": "First", "Prize Money": "30,000/-" },
  { "S.No": "", "Student Name": "Naveen Basker", "Department and Year": "AIML/II", "Hackathon Name": "Bharat Shakthi Track – Decode SIH 2026", "Event Date": "01 AUG 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Shivani Mohan", "Department and Year": "AIDS/II", "Hackathon Name": "Bharat Shakthi Track – Decode SIH 2026", "Event Date": "01 AUG 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Sweety Jose J", "Department and Year": "AIDS/II", "Hackathon Name": "Bharat Shakthi Track – Decode SIH 2026", "Event Date": "01 AUG 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Jeeva Anand", "Department and Year": "AIML/II", "Hackathon Name": "Bharat Shakthi Track – Decode SIH 2026", "Event Date": "01 AUG 2026", "Award / Prize Position": "First", "Prize Money": "" },

  // 2. Technova 2026 (Team award: 25000)
  { "S.No": "2", "Student Name": "Gopi Krishna", "Department and Year": "AIML/IV", "Hackathon Name": "Technova 2026", "Event Date": "13 SEP 2026", "Award / Prize Position": "First", "Prize Money": "25,000/-" },
  { "S.No": "", "Student Name": "Vishal", "Department and Year": "CSBS/III", "Hackathon Name": "Technova 2026", "Event Date": "13 SEP 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Tanusree", "Department and Year": "CSBS/III", "Hackathon Name": "Technova 2026", "Event Date": "13 SEP 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Pavithra", "Department and Year": "AIDS/IV", "Hackathon Name": "Technova 2026", "Event Date": "13 SEP 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Dhanasree", "Department and Year": "Biotech/IV", "Hackathon Name": "Technova 2026", "Event Date": "13 SEP 2026", "Award / Prize Position": "First", "Prize Money": "" },

  // 3. Sustainverse 2026 (Team award: 5000)
  { "S.No": "3", "Student Name": "Sham Kumar", "Department and Year": "Biotech/IV", "Hackathon Name": "Sustainverse 2026", "Event Date": "15-16 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "5,000/-" },
  { "S.No": "", "Student Name": "Dhana Shree", "Department and Year": "Biotech/IV", "Hackathon Name": "Sustainverse 2026", "Event Date": "15-16 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Bhoomika", "Department and Year": "Biotech/IV", "Hackathon Name": "Sustainverse 2026", "Event Date": "15-16 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Naresh", "Department and Year": "ECE/II", "Hackathon Name": "Sustainverse 2026", "Event Date": "15-16 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "" },

  // 4. Vynorae 2026 (Team award: 20000)
  { "S.No": "4", "Student Name": "Thejasvani S", "Department and Year": "CSE/III", "Hackathon Name": "Vynorae 2026", "Event Date": "21-22 AUG 2026", "Award / Prize Position": "First", "Prize Money": "20,000/-" },
  { "S.No": "", "Student Name": "Vaishnavi Devi G", "Department and Year": "CSE/III", "Hackathon Name": "Vynorae 2026", "Event Date": "21-22 AUG 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Yogitha SG", "Department and Year": "CSE/III", "Hackathon Name": "Vynorae 2026", "Event Date": "21-22 AUG 2026", "Award / Prize Position": "First", "Prize Money": "" },

  // 5. Tech Thiruvizha 2026 (Team award: 5000)
  { "S.No": "5", "Student Name": "Tanusree", "Department and Year": "CSBS/III", "Hackathon Name": "Tech Thiruvizha 2026", "Event Date": "25 AUG 2026", "Award / Prize Position": "Second", "Prize Money": "5000/-" },
  { "S.No": "", "Student Name": "Vishal", "Department and Year": "CSBS/III", "Hackathon Name": "Tech Thiruvizha 2026", "Event Date": "25 AUG 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Jeffry Joyson", "Department and Year": "CSBS/II", "Hackathon Name": "Tech Thiruvizha 2026", "Event Date": "25 AUG 2026", "Award / Prize Position": "Second", "Prize Money": "" },

  // 6. Hack Day Genesis 2026 - First Prize (Team award: 2000)
  { "S.No": "6", "Student Name": "Thejasvani S", "Department and Year": "CSE/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "First", "Prize Money": "2000/-" },
  { "S.No": "", "Student Name": "Vaishnavi Devi G", "Department and Year": "CSE/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "First", "Prize Money": "" },
  { "S.No": "", "Student Name": "Yogitha SG", "Department and Year": "CSE/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "First", "Prize Money": "" },

  // 7. Hack Day Genesis 2026 - Second Prize (Team award: 1000)
  { "S.No": "7", "Student Name": "Kaviya", "Department and Year": "CSBS/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "1000/-" },
  { "S.No": "", "Student Name": "Shanthosh", "Department and Year": "CSE/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Sakthi Priya", "Department and Year": "CSE/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Yazhini", "Department and Year": "CSE/III", "Hackathon Name": "Hack Day Genesis 2026", "Event Date": "30 SEP 2026", "Award / Prize Position": "Second", "Prize Money": "" },

  // 8. Future Forge 2K26 - Second Prize (Team award: 8000)
  { "S.No": "8", "Student Name": "Kaviya", "Department and Year": "CSBS/III", "Hackathon Name": "Future Forge 2K26", "Event Date": "5TH & 6TH OCT 2026", "Award / Prize Position": "Second", "Prize Money": "8000/-" },
  { "S.No": "", "Student Name": "Shanthosh", "Department and Year": "CSE/III", "Hackathon Name": "Future Forge 2K26", "Event Date": "5TH & 6TH OCT 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Sakthi Priya", "Department and Year": "CSE/III", "Hackathon Name": "Future Forge 2K26", "Event Date": "5TH & 6TH OCT 2026", "Award / Prize Position": "Second", "Prize Money": "" },
  { "S.No": "", "Student Name": "Yazhini", "Department and Year": "CSE/III", "Hackathon Name": "Future Forge 2K26", "Event Date": "5TH & 6TH OCT 2026", "Award / Prize Position": "Second", "Prize Money": "" },

  // Sheet Total row in official docx
  { "S.No": "TOTAL", "Student Name": "", "Department and Year": "", "Hackathon Name": "", "Event Date": "", "Award / Prize Position": "", "Prize Money": "96,000/-" }
];
