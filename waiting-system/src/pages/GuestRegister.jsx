import { useState } from 'react';

function formatPhoneDisplay(digits) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function GuestRegister({ navigate, addGuest, waitingOnly }) {
  const [name, setName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  const isPhoneComplete = phoneDigits.length >= 10;
  const canSubmit = name.trim().length > 0 && isPhoneComplete;

  const handlePhoneKey = (digit) => {
    if (phoneDigits.length >= 11) return;
    setPhoneDigits((prev) => prev + digit);
  };

  const handleDelete = () => setPhoneDigits((d) => d.slice(0, -1));

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const phone = formatPhoneDisplay(phoneDigits);
    const guest = addGuest({ name: name.trim(), phone, partySize });
    setTimeout(() => {
      navigate('success', { guest, position: waitingOnly.length + 1 });
    }, 300);
  };

  const phoneDisplay = phoneDigits.length > 0 ? formatPhoneDisplay(phoneDigits) : null;

  return (
    <div className="page" style={{ paddingTop: 16, paddingBottom: 16 }}>
      <div className="card card-register-landscape animate-in">
        {/* 헤더 */}
        <div className="register-header">
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'none', border: 'none', color: '#8888BB',
              fontSize: 26, cursor: 'pointer', padding: '4px 8px 4px 0',
              lineHeight: 1, flexShrink: 0,
            }}
          >
            ←
          </button>
          <span className="register-header-title">WOULDULIKE · WAITING</span>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
          />
        </div>

        {/* 2컬럼 그리드 */}
        <div className="register-columns">
          {/* 전화번호 + 키패드 (왼쪽) */}
          <div className="register-area-phone">
            <div className="register-section-label">전화번호 (PHONE)</div>
            <div
              className="phone-display"
              style={{ color: phoneDisplay ? '#E8E8FF' : '#333366' }}
            >
              {phoneDisplay || '010 - ???? - ????'}
            </div>
            <div className="keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <button key={d} className="keypad-btn" onClick={() => handlePhoneKey(d)}>
                  {d}
                </button>
              ))}
              <button className="keypad-btn ghost" disabled style={{ cursor: 'default' }} />
              <button className="keypad-btn" onClick={() => handlePhoneKey('0')}>0</button>
              <button className="keypad-btn delete" onClick={handleDelete}>←</button>
            </div>
          </div>

          {/* 이름 (오른쪽) */}
          <div className="register-area-name">
            <div className="register-section-label">이름 (NAME)</div>
            <input
              className="input-field"
              style={{ fontSize: 24, padding: '18px 20px', textAlign: 'center' }}
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && canSubmit) handleSubmit(); }}
            />
          </div>

          {/* 인원수 (오른쪽) */}
          <div className="register-area-party">
            <div className="register-section-label">인원수 (PARTY SIZE)</div>
            <div className="party-counter-large" style={{ marginBottom: 0 }}>
              <button
                className="counter-btn-large"
                onClick={() => setPartySize((p) => Math.max(1, p - 1))}
              >
                −
              </button>
              <div>
                <div className="counter-value-large">{partySize}</div>
              </div>
              <span style={{ fontSize: 22, color: '#8888BB', fontWeight: 500 }}>명</span>
              <button
                className="counter-btn-large"
                onClick={() => setPartySize((p) => Math.min(15, p + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="register-area-submit">
            <button
              className="btn btn-primary"
              style={{ fontSize: 20, padding: '22px' }}
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
            >
              {submitting ? '등록 중...' : '✨ 웨이팅 등록 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
