
import { GoogleGenAI, Type } from "@google/genai";
import { ExamConfig, GeneratedExamData, AIModel } from "../types";

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

/**
 * Generates exam content using Gemini API.
 * Uses process.env.API_KEY exclusively as per guidelines.
 */
export const generateExamContent = async (
  config: ExamConfig, 
  onModelTry?: (model: AIModel) => void
): Promise<GeneratedExamData> => {
  
  const prompt = `
    Bạn là một giáo viên Lịch Sử lớp 9 giỏi tại Việt Nam. 
    Tạo đề thi dựa trên:
    - Sách: ${config.textbook}
    - Loại: ${config.type}
    - Nội dung: ${config.topic}
    - Cấu trúc: ${config.mcqCount} câu trắc nghiệm (4 lựa chọn A,B,C,D), ${config.essayCount} câu tự luận.
    - Tổng điểm: ${config.totalScore}
    - Ma trận nhận thức (%): Nhận biết ${config.difficultyRatio.knowledge}, Thông hiểu ${config.difficultyRatio.comprehension}, Vận dụng ${config.difficultyRatio.application}, Vận dụng cao ${config.difficultyRatio.highApplication}.
    
    Yêu cầu: Trả về JSON chuẩn theo schema. Nội dung chính xác kiến thức Lịch sử 9 chương trình mới.
  `;

  // Filter models starting with the selected one
  const modelsToTry = [
    config.selectedModel,
    ...FALLBACK_MODELS.filter(m => m !== config.selectedModel)
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      if (onModelTry) onModelTry(model);
      
      // Initializing GoogleGenAI with API Key from environment variable
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

      const text = response.text;
      if (!text) throw new Error("Empty response from " + model);
      
      return JSON.parse(text) as GeneratedExamData;
    } catch (error: any) {
      console.error(`Error with model ${model}:`, error);
      lastError = error;
      // Continue to next model in loop
    }
  }

  throw lastError || new Error("Tất cả các model đều thất bại.");
};
