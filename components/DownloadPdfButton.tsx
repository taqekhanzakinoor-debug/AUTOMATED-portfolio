'use client';

export default function DownloadPdfButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-4 py-2 rounded-lg transition-colors"
    >
      Download as PDF
    </button>
  );
}