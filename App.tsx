
import React, { useState } from 'react';
import { DEFAULT_CONFIG, ExamConfig, GeneratedExamData, AIModel } from './types.ts';
import ExamForm from './components/ExamForm.tsx';
import ExamPreview from './components/ExamPreview.tsx';
import { generateExamContent } from './services/geminiService.ts';
import { GraduationCap, History, Settings, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_CONFIG);
  const [examData, setExamData] = useState<GeneratedExamData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<AIModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setExamData(null);
    
    try {
      const data = await generateExamContent(config, (model) => {
        setActiveModel(model);
      });
      setExamData(data);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.message || JSON.stringify(err);
      setError(`Đã dừng do lỗi: ${errorMsg}`);
    } finally {
      setIsLoading(false);
      setActiveModel(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
                 <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">VietHistory AI</h1>
                 <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1">Lớp 9 - Chuẩn BGD</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-lg shadow-sm animate-in slide-in-from-top duration-300">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm uppercase">Phát hiện lỗi xử lý</h3>
                    <p className="text-sm opacity-90 font-mono mt-1 break-all">{error}</p>
                  </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className={`lg:col-span-4 lg:sticky lg:top-24 transition-all duration-500 ${examData ? '' : 'lg:col-span-6 lg:col-start-4'}`}>
                <ExamForm 
                    config={config} 
                    setConfig={setConfig} 
                    isLoading={isLoading} 
                    activeModel={activeModel}
                    onSubmit={handleGenerate} 
                    isError={!!error}
                />
            </div>

            <div className="lg:col-span-8 h-full">
              {examData ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <ExamPreview data={examData} />
                  </div>
              ) : isLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-[600px] flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">AI đang biên soạn nội dung...</h3>
                      <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                        Chúng tôi đang sử dụng <b>{activeModel}</b> để tạo ma trận và câu hỏi chuẩn bộ giáo dục. 
                        Vui lòng đợi trong giây lát.
                      </p>
                    </div>
                    <div className="w-full max-w-sm bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                      <div className="bg-indigo-600 h-full animate-progress-indeterminate"></div>
                    </div>
                </div>
              ) : (
                 <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center h-[600px] flex flex-col items-center justify-center opacity-80">
                    <History className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-400">Xem trước đề thi</h3>
                    <p className="text-sm text-gray-400 mt-2">Điền thông tin và nhấn "Tạo đề thi" để bắt đầu.</p>
                 </div>
              )}
            </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">© {new Date().getFullYear()} VietHistory AI - Digital Education Tools</p>
        </div>
      </footer>

      <style>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite linear;
          width: 50%;
        }
      `}</style>
    </div>
  );
};

export default App;
