
import React, { useState } from 'react';
import { GeneratedExamData } from '../types.ts';
import { downloadDocx } from '../services/docxService.ts';
import { Printer, Download, Eye, Table as TableIcon, CheckCircle } from 'lucide-react';

interface Props {
  data: GeneratedExamData;
}

const ExamPreview: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'exam' | 'answers'>('exam');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button onClick={() => setActiveTab('matrix')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <TableIcon className="w-4 h-4" /> Ma trận
          </button>
          <button onClick={() => setActiveTab('exam')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'exam' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Eye className="w-4 h-4" /> Đề thi
          </button>
          <button onClick={() => setActiveTab('answers')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'answers' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <CheckCircle className="w-4 h-4" /> Đáp án
          </button>
        </div>

        <div className="flex gap-2">
            <button onClick={handlePrint} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2 font-medium">
                <Printer className="w-4 h-4" /> In / PDF
            </button>
            <button onClick={() => downloadDocx(data)} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2 font-medium">
                <Download className="w-4 h-4" /> Tải Word
            </button>
        </div>
      </div>

      <div id="print-area" className="flex-1 p-8 md:p-12 overflow-y-auto bg-white min-h-[500px]">
        <div className={`text-center mb-8 border-b pb-6 ${activeTab !== 'exam' ? 'hidden print:block' : ''}`}>
           <h1 className="text-2xl font-bold uppercase text-gray-900">{data.title}</h1>
           <p className="text-gray-600 mt-2 font-serif italic">{data.subtitle}</p>
        </div>

        <div className={`${activeTab === 'matrix' ? 'block' : 'hidden'} print:hidden`}>
            <h3 className="text-xl font-bold mb-4 text-indigo-800">Ma trận đề thi</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Chủ đề</th>
                            <th className="border p-3 text-center">Nhận biết</th>
                            <th className="border p-3 text-center">Thông hiểu</th>
                            <th className="border p-3 text-center">Vận dụng</th>
                            <th className="border p-3 text-center">VD Cao</th>
                            <th className="border p-3 text-center">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.matrix.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="border p-3 font-medium">{row.topic}</td>
                                <td className="border p-3 text-center">{row.levels.knowledge}</td>
                                <td className="border p-3 text-center">{row.levels.comprehension}</td>
                                <td className="border p-3 text-center">{row.levels.application}</td>
                                <td className="border p-3 text-center">{row.levels.highApplication}</td>
                                <td className="border p-3 text-center font-bold">{row.levels.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className={`${activeTab === 'exam' ? 'block' : 'hidden'} print:block exam-content`}>
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase mb-4 text-gray-900">I. Phần Trắc Nghiệm</h3>
                <div className="space-y-6">
                    {data.mcqPart.map((q, idx) => (
                        <div key={q.id} className="break-inside-avoid">
                            <p className="font-semibold text-gray-800 mb-2">
                                <span className="underline">Câu {idx + 1}:</span> {q.question}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                                {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="font-medium text-gray-700">{['A.', 'B.', 'C.', 'D.'][i]}</span>
                                        <span className="text-gray-600">{opt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold uppercase mb-4 text-gray-900">II. Phần Tự Luận</h3>
                <div className="space-y-6">
                    {data.essayPart.map((q, idx) => (
                        <div key={q.id} className="break-inside-avoid">
                            <p className="font-semibold text-gray-800 mb-2">
                                <span className="underline">Câu {idx + 1} ({q.points} điểm):</span> {q.question}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className={`${activeTab === 'answers' ? 'block' : 'hidden'} print:hidden mt-8 pt-8 border-t`}>
            <h3 className="text-xl font-bold mb-6 text-indigo-800 text-center">ĐÁP ÁN</h3>
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                {data.mcqPart.map((q, idx) => (
                    <div key={q.id} className="text-sm py-1">
                        <span className="font-bold min-w-[60px] inline-block">Câu {idx + 1}:</span>
                        <span className="font-bold text-red-600 mr-2">{q.correctAnswer}</span>
                        <span className="text-gray-600 italic">- {q.explanation}</span>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                {data.essayPart.map((q, idx) => (
                    <div key={q.id} className="bg-white border p-4 rounded-lg">
                        <p className="font-bold text-gray-800 mb-1">Câu {idx + 1} (Tự luận):</p>
                        <p className="text-gray-600 whitespace-pre-line text-sm">{q.guide}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPreview;
