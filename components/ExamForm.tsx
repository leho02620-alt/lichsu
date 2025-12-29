
import React from 'react';
import { ExamConfig, ExamType, Textbook, AVAILABLE_MODELS, AIModel } from '../types.ts';
import { Settings, Sparkles } from 'lucide-react';

interface Props {
  config: ExamConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExamConfig>>;
  isLoading: boolean;
  activeModel: AIModel | null;
  onSubmit: () => void;
  isError: boolean;
}

const ExamForm: React.FC<Props> = ({ config, setConfig, isLoading, activeModel, onSubmit, isError }) => {
  
  const handleChange = (field: keyof ExamConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleRatioChange = (key: keyof typeof config.difficultyRatio, value: string) => {
    const num = parseInt(value) || 0;
    setConfig(prev => ({
      ...prev,
      difficultyRatio: {
        ...prev.difficultyRatio,
        [key]: num
      }
    }));
  };

  const totalRatio = config.difficultyRatio.knowledge + config.difficultyRatio.comprehension + config.difficultyRatio.application + config.difficultyRatio.highApplication;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 space-y-6 border border-gray-100">
      <div className="flex items-center gap-3 border-b pb-4 mb-2">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Cấu hình Đề Thi</h2>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Chọn Model AI
        </label>
        <div className="grid grid-cols-1 gap-3">
          {AVAILABLE_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => handleChange('selectedModel', model.id)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                config.selectedModel === model.id 
                ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                : "border-gray-100 hover:border-indigo-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-bold text-sm ${config.selectedModel === model.id ? "text-indigo-700" : "text-gray-700"}`}>
                  {model.name} {model.id === 'gemini-3-flash-preview' && <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded ml-1">DEFAULT</span>}
                </span>
                {config.selectedModel === model.id && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
              </div>
              <p className="text-[11px] text-gray-500 leading-tight mt-1">{model.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bộ Sách</label>
          <select 
            value={config.textbook} 
            onChange={(e) => handleChange('textbook', e.target.value)}
            className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          >
            {Object.values(Textbook).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại Đề</label>
          <select 
            value={config.type} 
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          >
            {Object.values(ExamType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chủ đề / Nội dung ôn tập</label>
        <textarea
          value={config.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          rows={2}
          className="w-full rounded-lg border-gray-300 border p-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          placeholder="Ví dụ: Lịch sử Việt Nam từ 1919 đến 1930..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Số câu TN</label>
          <input
            type="number"
            value={config.mcqCount}
            onChange={(e) => handleChange('mcqCount', parseInt(e.target.value))}
            className="w-full rounded-lg border-gray-200 border p-2 text-center text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Số câu TL</label>
          <input
            type="number"
            value={config.essayCount}
            onChange={(e) => handleChange('essayCount', parseInt(e.target.value))}
            className="w-full rounded-lg border-gray-200 border p-2 text-center text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tổng điểm</label>
          <input
            type="number"
            value={config.totalScore}
            onChange={(e) => handleChange('totalScore', parseInt(e.target.value))}
            className="w-full rounded-lg border-gray-200 border p-2 text-center text-sm"
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
         <label className="block text-xs font-bold text-indigo-900 mb-3 flex items-center justify-between">
          <span>Mức độ nhận thức (%)</span>
          <span className={totalRatio !== 100 ? "text-red-500" : "text-green-600"}>{totalRatio}%</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['Nhận biết', 'Thông hiểu', 'Vận dụng', 'VD Cao'].map((label, idx) => {
            const keys = ['knowledge', 'comprehension', 'application', 'highApplication'] as const;
            return (
              <div key={label}>
                <span className="text-[10px] text-gray-500 block text-center truncate">{label}</span>
                <input 
                  type="number" 
                  value={config.difficultyRatio[keys[idx]]} 
                  onChange={(e) => handleRatioChange(keys[idx], e.target.value)}
                  className="mt-1 w-full p-1.5 border border-indigo-200 rounded text-center text-xs"
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || totalRatio !== 100}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition active:scale-95 ${
          isLoading 
            ? "bg-indigo-400 cursor-not-allowed text-white"
            : totalRatio !== 100
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : isError
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-indigo-500/30"
        }`}
      >
        {isLoading ? "AI ĐANG XỬ LÝ..." : isError ? "THỬ LẠI NGAY" : "TẠO ĐỀ THI NGAY"}
      </button>
    </div>
  );
};

export default ExamForm;
