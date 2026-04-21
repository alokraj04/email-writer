import React, { useState } from 'react';
import { Copy, Loader2, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateEmail } from '../services/api';

const TONES = ['Professional', 'Casual', 'Friendly', 'Formal'];

export default function EmailGenerator() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!emailContent.trim()) {
      toast.error('Please enter some content to generate an email.');
      return;
    }

    setIsLoading(true);
    setGeneratedEmail('');
    try {
      const response = await generateEmail(emailContent, tone);
      setGeneratedEmail(response);
      toast.success('Email generated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to generate email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Section */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <label htmlFor="emailContent" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          What do you want to say?
        </label>
        <textarea
          id="emailContent"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="E.g., Remind the team about tomorrow's meeting at 10 AM..."
          className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{emailContent.length} characters</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="tone" className="sr-only">Select Tone</label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em`, paddingRight: `2.5rem` }}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!emailContent.trim() || isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate Reply'}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {(generatedEmail || isLoading) && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generated Email</h2>
            {generatedEmail && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            )}
          </div>
          
          <div className="relative">
            {isLoading ? (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm animate-pulse">Drafting your email...</p>
              </div>
            ) : (
              <div className="w-full min-h-[10rem] p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {generatedEmail}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
