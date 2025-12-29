
import React, { useState } from 'react';
import { Key, ExternalLink, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<Props> = ({ isOpen, onSave }) => {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full mb-4">
            <Key className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Cấu hình API Key</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Ứng dụng cần Gemini API Key để hoạt động. Key của bạn sẽ được lưu an toàn trong trình duyệt.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Google API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Dán API key của bạn vào đây..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl space-y-3">
            <div className="flex gap-2 text-blue-800 text-sm font-medium">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Hướng dẫn lấy key miễn phí:</span>
            </div>
            <ul className="text-xs text-blue-700 space-y-2 list-disc pl-4">
              <li>
                Truy cập <a href="https://aistudio.google.com/api-keys" target="_blank" className="underline font-bold text-blue-900 flex items-center gap-1 inline-flex">Google AI Studio <ExternalLink className="w-3 h-3"/></a>
              </li>
              <li>Tạo API key và dán vào ô phía trên.</li>
              <li>
                <a href="https://tinyurl.com/hdsdpmTHT" target="_blank" className="underline italic text-indigo-700 font-semibold">Xem video hướng dẫn chi tiết tại đây</a>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSave(key)}
            disabled={!key.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              !key.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
            }`}
          >
            LƯU VÀ BẮT ĐẦU
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
