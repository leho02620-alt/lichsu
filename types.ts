
export enum Textbook {
  KNTT = "Kết nối tri thức và cuộc sống",
  CANH_DIEU = "Cánh Diều",
  CTST = "Chân trời sáng tạo"
}

export enum ExamType {
  MIN_15 = "Kiểm tra 15 phút",
  MIN_45 = "Kiểm tra 1 tiết (45 phút)",
  MID_TERM = "Thi giữa kỳ",
  FINAL = "Thi cuối kỳ"
}

export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash';

export const AVAILABLE_MODELS: { id: AIModel; name: string; description: string }[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Nhanh nhất, phù hợp cho đề thi cơ bản.' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Thông minh nhất, lý luận sâu cho đề thi khó.' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Ổn định, cân bằng giữa tốc độ và chất lượng.' }
];

export interface ExamConfig {
  name: string;
  textbook: Textbook;
  type: ExamType;
  topic: string;
  mcqCount: number;
  essayCount: number;
  difficultyRatio: {
    knowledge: number;
    comprehension: number;
    application: number;
    highApplication: number;
  };
  totalScore: number;
  selectedModel: AIModel;
}

export interface QuestionMCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  level: string;
}

export interface QuestionEssay {
  id: number;
  question: string;
  points: number;
  guide: string;
  level: string;
}

export interface MatrixItem {
  topic: string;
  levels: {
    knowledge: string;
    comprehension: string;
    application: string;
    highApplication: string;
    total: string;
  };
}

export interface GeneratedExamData {
  title: string;
  subtitle: string;
  timeLimit: string;
  matrix: MatrixItem[];
  mcqPart: QuestionMCQ[];
  essayPart: QuestionEssay[];
  generalGuide: string;
}

export const DEFAULT_CONFIG: ExamConfig = {
  name: "Đề kiểm tra Lịch Sử 9",
  textbook: Textbook.KNTT,
  type: ExamType.MIN_45,
  topic: "Thế giới từ năm 1945 đến năm 1991",
  mcqCount: 12,
  essayCount: 2,
  difficultyRatio: {
    knowledge: 40,
    comprehension: 30,
    application: 20,
    highApplication: 10
  },
  totalScore: 10,
  selectedModel: 'gemini-3-flash-preview'
};
