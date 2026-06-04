import React from 'react';
import { Volume2 } from 'lucide-react';

export default function FormulaSheetDrawer({ localizedFormulas, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Volume2 className="w-4 h-4 text-cyan-500" />
        {t.formulas || "Core Formulas & Equations"}
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }} className="custom-scrollbar">
        {localizedFormulas.map((f, i) => (
          <div key={i} className="card" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)' }}>{f.name}</span>
            <code style={{ fontSize: '14px', fontFamily: 'monospace', color: '#FFF', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>{f.eq}</code>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
