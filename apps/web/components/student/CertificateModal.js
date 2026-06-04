import React from 'react';
import { CheckCircle2, Printer } from 'lucide-react';

export default function CertificateModal({ certUnlocked, user, certId, t, onPrint }) {
  if (!certUnlocked) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '20px' }}>
      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        {t.attendanceSuccess || "Certificate Unlocked & Ready"}
      </h4>
      
      {/* Interactive Certificate Viewport */}
      <div style={{ width: '100%', maxWidth: '650px', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <svg id="certificate-svg" viewBox="0 0 800 600" width="100%" style={{ backgroundColor: '#0b0a1d', display: 'block', border: '4px solid #d4af37' }}>
          <rect x="20" y="20" width="760" height="560" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.6"/>
          <rect x="25" y="25" width="750" height="550" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="10 5" opacity="0.4"/>
          
          <path d="M 20 50 L 50 20 M 20 70 L 70 20" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M 780 50 L 750 20 M 780 70 L 730 20" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M 20 550 L 50 580 M 20 530 L 70 580" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M 780 550 L 750 580 M 780 530 L 730 580" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
          
          <circle cx="400" cy="300" r="220" fill="url(#gold-glow)" opacity="0.15"/>
          
          <defs>
            <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#0b0a1d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BF953F" />
              <stop offset="25%" stopColor="#FCF6BA" />
              <stop offset="50%" stopColor="#B38728" />
              <stop offset="75%" stopColor="#FBF5B7" />
              <stop offset="100%" stopColor="#AA771C" />
            </linearGradient>
          </defs>

          <text x="400" y="90" textAnchor="middle" fill="url(#gold-gradient)" fontSize="26" fontWeight="800" letterSpacing="4">FUELUP EDUCATION</text>
          <text x="400" y="115" textAnchor="middle" fill="#94A3B8" fontSize="11" letterSpacing="6">WORLD-CLASS EDUCATION HUB</text>
          <line x1="280" y1="130" x2="520" y2="130" stroke="url(#gold-gradient)" strokeWidth="1.5" opacity="0.5"/>
          
          <text x="400" y="195" textAnchor="middle" fill="#F8FAFC" fontSize="34" fontWeight="700">{(t.passingCert || "Certificate of Achievement").toUpperCase()}</text>
          <text x="400" y="230" textAnchor="middle" fill="#94A3B8" fontSize="15" fontStyle="italic">This certificate is awarded to</text>
          
          <text x="400" y="295" textAnchor="middle" fill="url(#gold-gradient)" fontSize="40" fontWeight="800">{user ? user.name : 'Alex Carter'}</text>
          <line x1="220" y1="310" x2="580" y2="310" stroke="#94A3B8" strokeWidth="1" opacity="0.3"/>
          
          <text x="400" y="350" textAnchor="middle" fill="#F8FAFC" fontSize="15">{t.certificateDesc || "Successfully completed curriculum requirements."}</text>
          <text x="400" y="385" textAnchor="middle" fill="url(#gold-gradient)" fontSize="20" fontWeight="700">{t.certificateTitle || "Planetary Physics Certification"}</text>
          <text x="400" y="415" textAnchor="middle" fill="#94A3B8" fontSize="13">Astrophysics Module I & II • Completed with Distinction</text>
          
          <text x="180" y="485" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="600">DATE</text>
          <text x="180" y="510" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="700">May 30, 2026</text>
          <line x1="110" y1="495" x2="250" y2="495" stroke="#94A3B8" strokeWidth="0.5" opacity="0.3"/>
          
          <text x="620" y="485" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="600">{t.certificateVerification || "VERIFICATION ID"}</text>
          <text x="620" y="510" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontFamily="monospace" fontWeight="700">{certId || "FE-ASTRO-9029X"}</text>
          <line x1="550" y1="495" x2="690" y2="495" stroke="#94A3B8" strokeWidth="0.5" opacity="0.3"/>
          
          <g transform="translate(365, 460)">
            <path d="M 40 0 L 47 18 L 65 9 L 58 27 L 76 27 L 58 37 L 69 52 L 50 49 L 45 67 L 35 52 L 21 61 L 22 43 L 4 38 L 20 30 L 11 14 L 28 17 Z" fill="#D4AF37" transform="scale(0.8) translate(5, 5)" opacity="0.95"/>
            <circle cx="40" cy="40" r="26" fill="#CF9E2E" stroke="#FCF6BA" strokeWidth="1.5"/>
            <text x="40" y="44" textAnchor="middle" fill="#0b0a1d" fontSize="9" fontWeight="800">GOLD</text>
          </g>
        </svg>
      </div>

      <button onClick={onPrint} className="btn btn-primary" style={{ marginTop: '10px' }}>
        <Printer className="w-4 h-4" />
        {t.viewCert || "Print & Save PDF"}
      </button>
    </div>
  );
}
