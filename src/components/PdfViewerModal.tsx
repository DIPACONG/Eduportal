'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Download, ExternalLink, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl?: string;
  pdfName?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  pdfName = 'Dokumen_Modul.pdf',
}) => {
  const [zoom, setZoom] = useState(100);

  const fallbackPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  const activeUrl = pdfUrl || fallbackPdf;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 180));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoom(100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={`Pratinjau Berkas Dokumen: ${pdfName}`}
      maxWidth="6xl"
    >
      <div className="flex flex-col h-[75vh]">
        {/* PDF Controls toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-3 bg-slate-100 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{pdfName}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 gap-1.5 text-xs text-slate-600">
              <button
                onClick={handleZoomOut}
                title="Perkecil"
                className="hover:text-brand-600 transition"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-slate-800">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                title="Perbesar"
                className="hover:text-brand-600 transition"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Ukuran"
                className="hover:text-brand-600 transition ml-1 pl-1 border-l border-slate-200"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Tab Baru</span>
            </a>

            <a
              href={activeUrl}
              download={pdfName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="relative flex-1 w-full bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center">
          <iframe
            src={`${activeUrl}#view=FitH&toolbar=1`}
            title={`Preview ${pdfName}`}
            className="w-full h-full border-0 transition-transform origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              height: `${100 / (zoom / 100)}%`,
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
