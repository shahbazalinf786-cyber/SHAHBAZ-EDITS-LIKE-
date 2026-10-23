import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReportReason } from '../../types';

export const ReportModal: React.FC = () => {
  const { reportModalTarget, closeReportModal, submitReport } = useApp();

  const [reason, setReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!reportModalTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(
      reportModalTarget.type,
      reportModalTarget.id,
      reportModalTarget.title,
      reason,
      details.trim() || 'No additional details provided.'
    );
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      closeReportModal();
    }, 1800);
  };

  const reasonsList: { value: ReportReason; label: string; desc: string }[] = [
    { value: 'spam', label: 'Spam or misleading content', desc: 'Commercial scam, fake clicks, repetitive advertising' },
    { value: 'hate_speech', label: 'Hate speech or harassment', desc: 'Attacks against individuals or protected groups' },
    { value: 'copyright', label: 'Copyright infringement', desc: 'Unauthorized use of copyrighted audio or video' },
    { value: 'misinformation', label: 'Harmful misinformation', desc: 'Dangerous health, civic, or scientific falsehoods' },
    { value: 'harassment', label: 'Harassment or cyberbullying', desc: 'Targeted hostility or threat' },
    { value: 'other', label: 'Other platform guideline violations', desc: 'Other concerns not listed above' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#16161c] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Report Content</span>
          </div>
          <button
            onClick={closeReportModal}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Report Submitted for Review
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Our safety and moderation team will inspect this item. Thank you for protecting the VidPulse community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reporting: <span className="font-normal text-slate-500">{reportModalTarget.title}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Choose the primary reason that describes this violation:
              </div>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {reasonsList.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    reason === item.value 
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={item.value}
                    checked={reason === item.value}
                    onChange={() => setReason(item.value)}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Additional Context (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Include timestamps or specific details..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
