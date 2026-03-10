export interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  blank_answer: string;
  source: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CourseData {
  toeic_course: Word[];
  business_course: Word[];
}
