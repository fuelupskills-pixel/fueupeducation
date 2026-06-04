import React from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function FlashcardContainer({ 
  localizedFlashcards, 
  activeCard, 
  setActiveCard, 
  flipped, 
  setFlipped, 
  masteredCards, 
  onMarkMastered, 
  t 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw className="w-4 h-4 text-purple-500" />
          {t.flashcards || "Interactive Flashcards"}
        </h4>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {t.masteredCount || "Mastered Flashcards"}: {masteredCards.size} / {localizedFlashcards.length}
        </span>
      </div>

      {/* Interactive 3D Card */}
      <div 
        className={`flip-card ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner">
          {/* Front Side */}
          <div className="flip-card-front">
            <span className="badge badge-purple" style={{ fontSize: '10px', marginBottom: '12px' }}>TERM</span>
            <h5 style={{ fontSize: '20px', fontWeight: 700 }}>{localizedFlashcards[activeCard]?.front}</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>{t.cardFlipped || "Click card to flip"}</p>
          </div>
          {/* Back Side */}
          <div className="flip-card-back">
            <span className="badge badge-orange" style={{ fontSize: '10px', marginBottom: '12px' }}>DEFINITION</span>
            <p style={{ fontSize: '14px', lineHeight: 1.5, fontWeight: 500 }}>{localizedFlashcards[activeCard]?.back}</p>
          </div>
        </div>
      </div>

      {/* Card controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '8px 12px' }}
            disabled={activeCard === 0}
            onClick={() => { setFlipped(false); setActiveCard(prev => Math.max(0, prev - 1)); }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.previous || "Previous"}</span>
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '8px 12px' }}
            disabled={activeCard === localizedFlashcards.length - 1}
            onClick={() => { setFlipped(false); setActiveCard(prev => Math.min(localizedFlashcards.length - 1, prev + 1)); }}
          >
            <span>{t.next || "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button 
          className={`btn ${masteredCards.has(activeCard) ? 'btn-secondary' : 'btn-primary'}`}
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={(e) => {
            e.stopPropagation();
            onMarkMastered(activeCard);
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{masteredCards.has(activeCard) ? (t.mastered || "Mastered") : (t.markMastered || "Mark as Mastered")}</span>
        </button>
      </div>
    </div>
  );
}
