import React, { useState } from 'react';
import { HelpCircle, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { API_URL } from '../../app/config';

export default function DoubtSolver({ currentLang, t }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState("Mathematics");
  const [ocrText, setOcrText] = useState("");
  const [solution, setSolution] = useState(null);
  const [practiceQuiz, setPracticeQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSolve = async () => {
    if (!selectedFile) {
      alert("Please choose a doubt sheet image or PDF to solve.");
      return;
    }
    setLoading(true);
    setError(null);
    setOcrText("");
    setSolution(null);
    setPracticeQuiz(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("subject", subject);
    formData.append("preferred_lang", currentLang);

    try {
      const token = localStorage.getItem("fuelup_token");
      const response = await fetch(`${API_URL}/api/ai/doubts/solve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Unable to obtain answer from OCR Doubt solving center.");
      }

      const data = await response.json();
      setOcrText(data.ocr_extracted_text);
      setSolution(data.solution);
      setPracticeQuiz(data.suggested_practice_quiz);
    } catch (err) {
      setError(err.message || "Failed to resolve connection to AI pipeline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }} className="modules-inner-grid">
        
        {/* Upload Form panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle className="w-4 h-4 text-orange-500" />
            AI Doubt Center
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Upload handwritten notes, textbook sheets, or homework problems to obtain step-by-step verified explanations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>SELECT FILE</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.01)',
              position: 'relative'
            }}>
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <Upload className="w-8 h-8 text-purple-500" style={{ margin: '0 auto 8px auto' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {selectedFile ? selectedFile.name : "Drag notes here or browse"}
              </span>
            </div>
            {/* Quick Helper Text */}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Tip: Name your file "math.jpg" or "ph.jpg" to test specific solver heuristics.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>ACADEMIC SUBJECT</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#FFF',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Astronomy">Astronomy</option>
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleSolve}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? "Analyzing OCR & Solving..." : "Solve Doubt"}
          </button>
        </div>

        {/* Results Solver output panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '300px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-cyan)' }}>AI Output Results</h4>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.05)',
                borderTopColor: 'var(--accent-orange)',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Processing vision OCR text layers...</span>
              <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle className="w-5 h-5 text-red-500" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#FCA5A5' }}>{error}</span>
            </div>
          )}

          {!loading && !error && !solution && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, opacity: 0.4 }}>
              <FileText className="w-12 h-12 text-slate-500" style={{ marginBottom: '12px' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Awaiting sheet upload...</span>
            </div>
          )}

          {solution && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>EXTRACTED QUESTION TEXT</span>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px', fontFamily: 'monospace', color: '#FFF' }}>
                  "{ocrText}"
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>STEP-BY-STEP EXPLANATION</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  {solution.steps.map((st) => (
                    <div key={st.step} style={{ display: 'flex', gap: '12px' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--accent-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#FFF',
                        flexShrink: 0
                      }}>{st.step}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-orange)' }}>{st.heading}</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{st.body}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.15)',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>FINAL VERIFIED VALUE</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFF', fontFamily: 'monospace' }}>{solution.final_answer}</span>
                </div>
              </div>

              {practiceQuiz && practiceQuiz.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>RECOMMENDED PRACTICE QUESTION</span>
                  <div className="card" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFF' }}>{practiceQuiz[0].question}</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      {practiceQuiz[0].options.map((opt, oIdx) => (
                        <div key={oIdx} style={{
                          padding: '8px 12px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)'
                        }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
