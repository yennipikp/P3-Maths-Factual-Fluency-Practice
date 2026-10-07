import { Question, TableSelection } from '../types/quiz';

const MULTIPLICATION_TIPS: Record<string, string> = {
  // Table of 6
  '6x6': '6 × 6 = 36: "Six times six is thirty-six, wizard wands and magic tricks!"',
  '6x7': '6 × 7 = 42: Think (6 × 6) + 6 = 36 + 6 = 42!',
  '7x6': '7 × 6 = 42: Commutative rule: 7 × 6 is the exact same as 6 × 7 = 42.',
  '6x8': '6 × 8 = 48: "Six and eight went to skate, came back home at 48!"',
  '8x6': '8 × 6 = 48: "Six and eight went to skate, came back home at 48!"',
  '6x9': '6 × 9 = 54: Digits sum to 9 (5 + 4 = 9), and 5 is one less than 6!',
  '9x6': '9 × 6 = 54: Digits sum to 9 (5 + 4 = 9), and 5 is one less than 6!',
  '6x10': '6 × 10 = 60: Multiplying by 10 is easy! Just place a 0 after 6!',
  '10x6': '10 × 6 = 60: Multiplying by 10 is easy! Just place a 0 after 6!',
  // Table of 7
  '7x7': '7 × 7 = 49: "Seven times seven is forty-nine, football players on the line!"',
  '7x8': '7 × 8 = 56: Sequence rule: count 5, 6, 7, 8 → 56 = 7 × 8!',
  '8x7': '8 × 7 = 56: Sequence rule: count 5, 6, 7, 8 → 56 = 8 × 7!',
  '7x9': '7 × 9 = 63: 7 × 10 is 70, minus 7 is 63! (6 + 3 = 9)',
  '9x7': '9 × 7 = 63: Digits sum to 9 (6 + 3 = 9), and 6 is one less than 7!',
  '7x10': '7 × 10 = 70: Just add a 0 to 7 to get 70!',
  '10x7': '10 × 7 = 70: Just add a 0 to 7 to get 70!',
  // Table of 8
  '8x8': '8 × 8 = 64: "I ate and ate \'til I got sick on the floor, eight times eight is sixty-four!"',
  '8x9': '8 × 9 = 72: 8 × 10 is 80, minus 8 is 72! (7 + 2 = 9)',
  '9x8': '9 × 8 = 72: Digits sum to 9 (7 + 2 = 9), and 7 is one less than 8!',
  '8x10': '8 × 10 = 80: Just add a 0 to 8 to get 80!',
  '10x8': '10 × 8 = 80: Just add a 0 to 8 to get 80!',
  // Table of 9
  '9x9': '9 × 9 = 81: 9 × 10 is 90, minus 9 is 81! (8 + 1 = 9)',
  '9x10': '9 × 10 = 90: Just add a 0 to 9 to get 90!',
  '10x9': '10 × 9 = 90: Just add a 0 to 9 to get 90!',
};

export function getQuestionTip(a: number, b: number): string {
  const key1 = `${a}x${b}`;
  const key2 = `${b}x${a}`;
  if (MULTIPLICATION_TIPS[key1]) return MULTIPLICATION_TIPS[key1];
  if (MULTIPLICATION_TIPS[key2]) return MULTIPLICATION_TIPS[key2];

  // Rule of 10 fallback
  if (a === 10 || b === 10) {
    const other = a === 10 ? b : a;
    return `Rule of 10: ${other} × 10 = ${other * 10}. Simply append a 0 to ${other}!`;
  }
  // Rule of 9 fallback
  if (a === 9 || b === 9) {
    const other = a === 9 ? b : a;
    return `Rule of 9: ${other} × 9 = ${a * b}. The tens digit is ${other - 1} and digits add to 9!`;
  }
  // Rule of 6 fallback
  if (a === 6 || b === 6) {
    const other = a === 6 ? b : a;
    return `Rule of 6: Think (5 × ${other}) + ${other} = ${5 * other} + ${other} = ${a * b}!`;
  }
  // Rule of 8 fallback
  if (a === 8 || b === 8) {
    const other = a === 8 ? b : a;
    return `Rule of 8: Double three times! (${other} → ${other * 2} → ${other * 4} → ${other * 8})!`;
  }
  // Rule of 7 fallback
  if (a === 7 || b === 7) {
    const other = a === 7 ? b : a;
    return `Rule of 7: Think (5 × ${other}) + (2 × ${other}) = ${5 * other} + ${2 * other} = ${a * b}!`;
  }

  return `${a} × ${b} = ${a * b}`;
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generate60Questions(selection: TableSelection): Question[] {
  const TOTAL_QUESTIONS = 60;
  const rawPairs: Array<{ table: number; a: number; b: number }> = [];

  // Exclude 11 and 12: only numbers from 1 to 10
  const FACTORS_1_TO_10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (selection !== 'mix') {
    const tableNum = parseInt(selection, 10);
    // Factors 1 through 10 repeated 6 times = exactly 60 questions!
    for (let repeat = 0; repeat < 6; repeat++) {
      for (const factor of FACTORS_1_TO_10) {
        // Randomize order: factor * tableNum vs tableNum * factor
        const isSwapped = Math.random() > 0.5;
        rawPairs.push({
          table: tableNum,
          a: isSwapped ? factor : tableNum,
          b: isSwapped ? tableNum : factor,
        });
      }
    }
  } else {
    // Mix: tables 6, 7, 8, 9 (factors strictly 1 to 10)
    // 60 questions / 4 tables = 15 questions per table
    const tables = [6, 7, 8, 9];
    tables.forEach((t) => {
      // 10 base factors (1..10) plus 5 extra random factors from 1..10 = 15 questions per table
      const extraFactors = shuffle([...FACTORS_1_TO_10]).slice(0, 5);
      const factorsForTable = [...FACTORS_1_TO_10, ...extraFactors];

      factorsForTable.forEach((f) => {
        const isSwapped = Math.random() > 0.5;
        rawPairs.push({
          table: t,
          a: isSwapped ? f : t,
          b: isSwapped ? t : f,
        });
      });
    });
  }

  // Shuffle thoroughly
  let shuffled = shuffle(rawPairs);

  // Prevent exact consecutive duplicates where possible
  for (let i = 1; i < shuffled.length; i++) {
    if (
      shuffled[i].a === shuffled[i - 1].a &&
      shuffled[i].b === shuffled[i - 1].b
    ) {
      const swapTarget = (i + 3) % shuffled.length;
      [shuffled[i], shuffled[swapTarget]] = [shuffled[swapTarget], shuffled[i]];
    }
  }

  // Ensure exactly 60 questions
  shuffled = shuffled.slice(0, TOTAL_QUESTIONS);

  return shuffled.map((item, index) => {
    const correctAnswer = item.a * item.b;
    return {
      id: index + 1,
      table: item.table,
      factorA: item.a,
      factorB: item.b,
      correctAnswer,
      userAnswer: null,
      tip: getQuestionTip(item.a, item.b),
    };
  });
}

// Local Storage helpers for personal records
export function getSavedBestScores(): Record<TableSelection, number> {
  try {
    const data = localStorage.getItem('multiplication_bests');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // fallback
  }
  return {
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    'mix': 0,
  };
}

export function saveBestScore(selection: TableSelection, score: number): boolean {
  try {
    const current = getSavedBestScores();
    if (score > (current[selection] || 0)) {
      current[selection] = score;
      localStorage.setItem('multiplication_bests', JSON.stringify(current));
      return true; // New record!
    }
  } catch {
    // ignore
  }
  return false;
}
