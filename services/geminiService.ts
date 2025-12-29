
import { GoogleGenAI, Type } from "@google/genai";
import { ExamConfig, GeneratedExamData, AIModel } from "../types.ts";

const FALLBACK_MODELS: AIModel[] = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    timeLimit: { type: Type.STRING },
    matrix: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          levels: {
            type: Type.OBJECT,
            properties: {
              knowledge: { type: Type.STRING },
              comprehension: { type: Type.STRING },
              application: { type: Type.STRING },
              highApplication: { type: Type.STRING },
              total: { type: Type.STRING }
            }
          }
        }
      }
    },
    mcqPart: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          level: { type: Type.STRING }
        }
      }
    },
    essayPart: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          points: { type: Type.NUMBER },
          guide: { type: Type.STRING },
          level: { type: Type.STRING }
        }
      }
    },
    generalGuide: { type: Type.STRING }
  }
};

export const generateExamContent = async (
  config: ExamConfig, 
  onModelTry?: (model: AIModel) => void
): Promise<GeneratedExamData> => {
  const prompt = `Bạn là giáo viên Lịch sử lớp 9. Tạo đề thi theo chương trình mới (GDPT 2018).
  Sách: ${config.textbook}, Loại: ${config.type}, Chủ đề: ${config.topic}.
  Cấu trúc: ${config.mcqCount} câu TN, ${config.essayCount} câu TL.
  Ma trận %: Nhận biết ${config.difficultyRatio.knowledge}, Thông hiểu ${config.difficultyRatio.comprehension}, Vận dụng ${config.difficultyRatio.application}, Vận dụng cao ${config.difficultyRatio.highApplication}.`;

  const modelsToTry = [config.selectedModel, ...FALLBACK_MODELS.filter(m => m !== config.selectedModel)];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      if (onModelTry) onModelTry(model);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7,
        }
      });
      if (response.text) return JSON.parse(response.text) as GeneratedExamData;
    } catch (error) {
      console.error(`Model ${model} failed:`, error);
      lastError = error;
    }
  }
  throw lastError || new Error("Failed to generate exam.");
};
