import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export default function KennisKoenWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  const gptLink = 'https://chatgpt.com/g/g-69944fcba0c88191b0b40e0f36de1767-kennis-koen'; // Vervang met jouw GPT link

  const handleOpenGPT = () => {
    window.open(gptLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="!fixed !bottom-4 !right-4 sm:!bottom-6 sm:!right-6 z-[9999] w-12 h-12 sm:w-14 sm:h-14 bg-[#280bc4] hover:bg-[#1a0880] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
          aria-label="Open Kennis Koen widget"
          style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#7ef769] group-hover:scale-110 transition-transform" />
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#7ef769] absolute -top-1 -right-1 animate-bounce" />
        </button>
      )}

      {/* Widget Panel */}
      {isOpen && (
        <div className="!fixed !bottom-4 !right-4 sm:!bottom-6 sm:!right-6 z-[9999] w-[calc(100vw-2rem)] max-w-[280px] h-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#280bc4] to-[#1a0880] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#7ef769] rounded-full flex items-center justify-center font-bold text-black text-sm shadow-lg">
                K
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm leading-tight">Kennis Koen</h3>
                <p className="text-[10px] text-white/90 leading-tight">AI Assistent</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors ml-2"
              aria-label="Sluit widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-2.5 flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="text-center mb-2">
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                💬 Vraag het aan Koen!
              </h4>
              <p className="text-gray-600 text-[9px]">
                Business Developer <span className="font-semibold">Koen Hendrickx</span>
              </p>
            </div>

            <div className="bg-white rounded-lg p-2 mb-2 border border-gray-200 shadow-sm">
              <p className="text-[11px] text-gray-700 mb-1 font-semibold">
                💡 Koen helpt met:
              </p>
              <ul className="text-[10px] text-gray-600 space-y-0.5">
                <li>✓ Business development</li>
                <li>✓ Klantrelaties</li>
                <li>✓ Growth hacking</li>
                <li>✓ Sales tips</li>
              </ul>
            </div>

            <Button
              onClick={handleOpenGPT}
              className="bg-[#7ef769] hover:bg-[#6ee659] text-black font-semibold px-3 py-2.5 text-xs shadow-lg hover:shadow-xl transition-all duration-300 group w-full"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Start gesprek met Koen
              <ExternalLink className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}













