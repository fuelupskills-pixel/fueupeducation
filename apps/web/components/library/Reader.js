import React, { useState, useEffect } from 'react';
import { 
  X, Moon, Sun, Volume2, Highlighter, Bookmark, FileText, 
  HelpCircle, ChevronLeft, ChevronRight, Check, Languages, Loader
} from 'lucide-react';
import { API_URL } from '../../app/config';

export default function Reader({ activeBook, onClose }) {
  const [theme, setTheme] = useState('dark'); // dark, light, sepia
  const [bookmarks, setBookmarks] = useState(new Set());
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  // Selection Doubt state
  const [selectedText, setSelectedText] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Audiobook mode
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth, setSynth] = useState(null);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const handleSelection = () => {
    const text = window.getSelection().toString().trim();
    if (text.length > 5) {
      setSelectedText(text);
    }
  };

  const handleAddHighlight = () => {
    if (selectedText && !highlights.includes(selectedText)) {
      setHighlights([...highlights, selectedText]);
      alert("Text highlighted and saved!");
    }
  };

  const toggleBookmark = () => {
    const updated = new Set(bookmarks);
    if (updated.has(currentPage)) {
      updated.delete(currentPage);
    } else {
      updated.add(currentPage);
    }
    setBookmarks(updated);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, { page: currentPage, text: newNote }]);
    setNewNote('');
  };

  const handleAskAI = async () => {
    if (!selectedText) {
      alert("Please highlight some text in the reader first.");
      return;
    }
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch(`${API_URL}/api/library/doubts/contextual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selected_text: selectedText,
          question: customQuestion || "Explain this in detail.",
          topic_id: activeBook.topic_id || 1
        })
      });

      if (!response.ok) {
        throw new Error("Doubt solving center is offline");
      }

      const data = await response.json();
      setAiResponse(data.reply);
    } catch (err) {
      setAiResponse(`Failed to connect to library AI. Here is a simulated explanation of: "${selectedText.substring(0, 40)}..."\n\nBased on core learning objectives, this principle dictates that values are mapped to fundamental mathematical limits. Make sure to apply division parameters sequentially.`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSpeech = () => {
    if (!synth) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      const textToRead = document.getElementById('reader-content-body')?.innerText || "No text available.";
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setSpeechUtterance(utterance);
      setIsPlaying(true);
      synth.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  // Page mock content
  const pageContents = [
    "",
    "The fundamental basis of Real Numbers builds upon mathematical proofs and rational classifications. The Euclidean Division Lemma states that for any two positive integers a and b, there exist unique integers q and r satisfying a = b*q + r where 0 <= r < b. We use this to compute highest common factors and verify divisor relationships.",
    "Prime factorization remains a key utility. The Fundamental Theorem of Arithmetic states that every composite number can be uniquely expressed as a product of prime numbers, regardless of the ordering of prime factors. Let us prove the irrationality of the square root of 2 using contraction parameters.",
    "Let p be a prime number. If p divides a², then p divides a, where a is a positive integer. Using this theorem, we assume square root of 2 is rational: a / b where a and b are coprime. Thus 2 = a² / b² which means 2*b² = a². This contradicts coprimality parameters.",
    "Decimals offer further classifications. Rational numbers have either terminating decimal expansions (e.g. 3/8 = 0.375) or non-terminating repeating expansions (e.g. 1/7 = 0.142857...). Irrational numbers are non-terminating and non-repeating.",
    "Summary and Practice: HCF(a, b) * LCM(a, b) = a * b. This relation lets us cross check our arithmetic factors instantly. Solve exercise 1.1 parameters as check-in worksheets."
  ];

  const getThemeStyles = () => {
    if (theme === 'light') {
      return { bg: '#F8FAFC', text: '#0F172A', border: '#E2E8F0', cardBg: '#FFFFFF' };
    }
    if (theme === 'sepia') {
      return { bg: '#F4ECD8', text: '#5B4636', border: '#E4D6B6', cardBg: '#FCF8ED' };
    }
    return { bg: '#121026', text: '#F8FAFC', border: 'rgba(139,92,246,0.15)', cardBg: 'rgba(18,16,38,0.75)' };
  };

  const style = getThemeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10,9,21,0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        height: '90vh',
        backgroundColor: style.bg,
        color: style.text,
        borderRadius: '16px',
        border: `1px solid ${style.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        
        {/* Reader Header */}
        <header style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${style.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText className="w-5 h-5 text-purple-500" />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{activeBook.title}</h3>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Author: {activeBook.author || "Open Resource"}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme selector */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
              {['dark', 'light', 'sepia'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: theme === t ? 'var(--accent-purple)' : 'transparent',
                    color: '#FFF',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Bookmark button */}
            <button 
              onClick={toggleBookmark}
              style={{
                background: 'none',
                border: 'none',
                color: bookmarks.has(currentPage) ? 'var(--accent-orange)' : style.text,
                cursor: 'pointer'
              }}
            >
              <Bookmark className="w-5 h-5" fill={bookmarks.has(currentPage) ? "var(--accent-orange)" : "none"} />
            </button>

            {/* Text to Speech Readout */}
            <button 
              onClick={handleSpeech}
              style={{
                background: 'none',
                border: 'none',
                color: isPlaying ? 'var(--accent-green)' : style.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Volume2 className="w-5 h-5" />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>{isPlaying ? "Reading..." : "Listen"}</span>
            </button>

            {/* Exit Reader */}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: style.text, cursor: 'pointer' }}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Reader Core Interface */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Main Book Reader canvas */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderRight: `1px solid ${style.border}`,
            padding: '32px',
            overflowY: 'auto'
          }} className="custom-scrollbar">
            
            <div 
              id="reader-content-body"
              onMouseUp={handleSelection}
              onKeyUp={handleSelection}
              style={{
                fontSize: '18px',
                lineHeight: 1.8,
                flex: 1,
                maxWidth: '650px',
                margin: '0 auto',
                fontFamily: 'Georgia, serif',
                textAlign: 'justify'
              }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', fontFamily: 'var(--font-sans)' }}>
                Page {currentPage}: Analysis & Theorems
              </h2>
              {pageContents[currentPage] || "Loading page text contents..."}
            </div>

            {/* Text highlight popover when selection is active */}
            {selectedText && (
              <div style={{
                margin: '20px auto 0 auto',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--accent-purple)',
                maxWidth: '650px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                  Selection: "{selectedText}"
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleAddHighlight} className="btn" style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: '#FFF' }}>
                    <Highlighter className="w-3.5 h-3.5 text-yellow-400" /> Highlight
                  </button>
                  <button onClick={() => setCustomQuestion(`Explain the concept of: ${selectedText}`)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Ask AI
                  </button>
                </div>
              </div>
            )}

            {/* Footer Paging navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '40px',
              borderTop: `1px solid ${style.border}`,
              paddingTop: '16px'
            }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Doubt Sidebar & Notes panels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.02)',
            padding: '24px',
            overflowY: 'auto',
            gap: '24px'
          }} className="custom-scrollbar">
            
            {/* AI Highlight Solver module */}
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <HelpCircle className="w-4 h-4 text-orange-500" />
                Ask Library AI
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Highlight text on the left, write your custom question, and tap Ask AI.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  placeholder="Ask a specific doubt (e.g. Give me a real-life analogy for this...)"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#FFF',
                    fontSize: '13px',
                    resize: 'none',
                    height: '80px',
                    outline: 'none'
                  }}
                />
                
                <button 
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {aiLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Ask AI"}
                </button>
              </div>

              {aiResponse && (
                <div style={{
                  marginTop: '16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-line'
                }}>
                  {aiResponse}
                </div>
              )}
            </div>

            {/* Note taking panel */}
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>My Chapter Notes</h4>
              
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Add note for this page..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#FFF',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>Add</button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notes.filter(n => n.page === currentPage).map((n, i) => (
                  <div key={i} style={{
                    padding: '8px 10px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    {n.text}
                  </div>
                ))}
                {notes.filter(n => n.page === currentPage).length === 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>No notes on page {currentPage}.</span>
                )}
              </div>
            </div>

            {/* Highlights library preview */}
            <div className="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Highlights</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {highlights.map((hl, i) => (
                  <div key={i} style={{
                    fontSize: '11px',
                    padding: '6px 8px',
                    backgroundColor: 'rgba(234,179,8,0.1)',
                    borderLeft: '3px solid var(--accent-orange)',
                    color: 'var(--text-secondary)',
                    borderRadius: '0 4px 4px 0'
                  }}>
                    "{hl.substring(0, 80)}..."
                  </div>
                ))}
                {highlights.length === 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>No text highlighted.</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
