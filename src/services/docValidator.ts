import { TeamAwardRecord } from '../types';
import { OFFICIAL_DOC_WINNERS, OfficialDocTeamAward } from '../data/officialDocWinners';

export interface AwardValidationResult {
  liveCount: number;
  docCount: number;
  livePrizeTotal: number;
  docPrizeTotal: number;
  matchedCount: number;
  differences: string[];
  docAwards: OfficialDocTeamAward[];
}

export function validateWinnersAgainstDoc(liveAwards: TeamAwardRecord[]): AwardValidationResult {
  const liveCount = liveAwards.length;
  const docCount = OFFICIAL_DOC_WINNERS.length;
  const livePrizeTotal = liveAwards.reduce((sum, a) => sum + (a.prizeMoney || 0), 0);
  const docPrizeTotal = OFFICIAL_DOC_WINNERS.reduce((sum, a) => sum + (a.prizeMoney || 0), 0);
  
  const differences: string[] = [];
  let matchedCount = 0;

  // Normalized matching helper
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  OFFICIAL_DOC_WINNERS.forEach(docAward => {
    const docNorm = normalize(docAward.hackathonName);
    const liveMatch = liveAwards.find(live => {
      const liveNorm = normalize(live.hackathonName);
      return liveNorm.includes(docNorm) || docNorm.includes(liveNorm) ||
             (docNorm.includes('technova') && liveNorm.includes('technova')) ||
             (docNorm.includes('vynorae') && liveNorm.includes('vynorae'));
    });

    if (liveMatch) {
      matchedCount++;
      if (liveMatch.prizeMoney !== docAward.prizeMoney) {
        differences.push(
          `Prize discrepancy for "${docAward.hackathonName}": Word Doc has ₹${docAward.prizeMoney.toLocaleString('en-IN')}, but Google Sheets has ₹${liveMatch.prizeMoney.toLocaleString('en-IN')}.`
        );
      }
    } else {
      differences.push(
        `Document award "${docAward.hackathonName}" (₹${docAward.prizeMoney.toLocaleString('en-IN')}) is in the official Word register but pending in the live Google Sheets winners tab.`
      );
    }
  });

  // Check for live awards not in document
  liveAwards.forEach(live => {
    const liveNorm = normalize(live.hackathonName);
    const docMatch = OFFICIAL_DOC_WINNERS.find(doc => {
      const docNorm = normalize(doc.hackathonName);
      return liveNorm.includes(docNorm) || docNorm.includes(liveNorm);
    });

    if (!docMatch && live.prizeMoney > 0) {
      differences.push(
        `Live sheet award "${live.hackathonName}" (₹${live.prizeMoney.toLocaleString('en-IN')}) is recorded in Google Sheets but not listed in hackathon 2026.docx.`
      );
    }
  });

  return {
    liveCount,
    docCount,
    livePrizeTotal,
    docPrizeTotal,
    matchedCount,
    differences,
    docAwards: OFFICIAL_DOC_WINNERS
  };
}
