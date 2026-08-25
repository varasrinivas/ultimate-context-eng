// Generated from bench/seed/dataset.json (standing_questions). Keep in sync.
export interface StandingQuestion {
  id: string;
  cls: 'structural' | 'canonical' | 'logic' | 'abstention' | 'aggregation';
  text: string;
}

export const STANDING_QUESTIONS: StandingQuestion[] = [
  { id: 'Q1', cls: 'structural', text: 'Which criteria apply to procedure 72148 and what is the weight of each?' },
  { id: 'Q2', cls: 'structural', text: 'Which requests are currently in MANUAL_REVIEW, and which criterion is each missing?' },
  { id: 'Q3', cls: 'canonical', text: 'What score thresholds route a request to approval, manual review, and denial?' },
  { id: 'Q4', cls: 'canonical', text: 'What is the eligibility rule, and which plan tier covers surgical procedures?' },
  { id: 'Q5', cls: 'logic', text: 'Why was PA-1003 denied? Name every missing criterion. (It was not an eligibility denial - explain the scoring.)' },
  { id: 'Q6', cls: 'logic', text: 'Why did PA-1004 go to manual review instead of being auto-approved?' },
  { id: 'Q7', cls: 'abstention', text: "What is member M-2003's date of birth?" },
  { id: 'Q8', cls: 'abstention', text: "What did Dr. Rivera's note say about PA-1010?" },
  { id: 'Q9', cls: 'aggregation', text: "Summarize member M-2001's authorization history: how many requests and what were the outcomes?" },
  { id: 'Q10', cls: 'aggregation', text: 'Which member has had a request denied for eligibility reasons, and why?' },
];
