import { useState } from 'react';

const ADMIN_PIN = '0629'; // 관리자 비밀번호 (변경 가능)

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  return `${Math.floor(diff / 3600)}시간 전`;
}

export function AdminDashboard({ waitingList, waitingOnly, calledOnly, callGuest, seatGuest, cancelGuest, clearAll }) {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PinGate onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <Dashboard
      waitingList={waitingList}
      waitingOnly={waitingOnly}
      calledOnly={calledOnly}
      callGuest={callGuest}
      seatGuest={seatGuest}
      cancelGuest={cancelGuest}
      clearAll={clearAll}
      onLogout={() => setAuthenticated(false)}
    />
  );
}

/* ── PIN 입력 게이트 ── */
function PinGate({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKey = (digit) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);

    if (next.length === 4) {
      if (next === ADMIN_PIN) {
        setTimeout(onSuccess, 200);
      } else {
        setTimeout(() => {
          setError(true);
          setPin('');
          setTimeout(() => setError(false), 700);
        }, 200);
      }
    }
  };

  const handleDelete = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="page">
      <div
        className="card animate-in"
        style={{ textAlign: 'center', maxWidth: 380, padding: '36px 32px' }}
      >
        <img
          src="/logo.png"
          alt="logo"
          style={{ width: 54, height: 54, borderRadius: 12, marginBottom: 16, objectFit: 'cover' }}
        />
        <h2
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 16, color: '#E8E8FF', marginBottom: 6,
          }}
        >
          관리자 인증
        </h2>
        <p style={{ fontSize: 13, color: '#8888BB', marginBottom: 4 }}>
          PIN을 입력해주세요
        </p>
        {error && (
          <p style={{ fontSize: 13, color: '#FF4D6D', marginTop: 4 }}>
            비밀번호가 틀렸습니다
          </p>
        )}

        {/* PIN 점 */}
        <div className={`pin-dots ${error ? 'shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${pin.length > i ? 'filled' : ''} ${error ? 'error' : ''}`}
            />
          ))}
        </div>

        {/* 키패드 */}
        <div className="keypad-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              className="keypad-btn"
              style={{ height: 70, fontSize: 26 }}
              onClick={() => handleKey(d)}
            >
              {d}
            </button>
          ))}
          <button
            className="keypad-btn ghost"
            style={{ height: 70, cursor: 'default' }}
            disabled
          />
          <button
            className="keypad-btn"
            style={{ height: 70, fontSize: 26 }}
            onClick={() => handleKey('0')}
          >
            0
          </button>
          <button
            className="keypad-btn delete"
            style={{ height: 70 }}
            onClick={handleDelete}
          >
            ←
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 실제 관리자 대시보드 ── */
function Dashboard({ waitingList, waitingOnly, calledOnly, callGuest, seatGuest, cancelGuest, clearAll, onLogout }) {
  const [tab, setTab] = useState('active');
  const [confirmClear, setConfirmClear] = useState(false);

  const seatedList = waitingList.filter((g) => g.status === 'seated');
  const cancelledList = waitingList.filter((g) => g.status === 'cancelled');
  const totalPeople =
    waitingOnly.reduce((s, g) => s + g.partySize, 0) +
    calledOnly.reduce((s, g) => s + g.partySize, 0);

  const handleClear = () => {
    if (confirmClear) {
      clearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="page" style={{ justifyContent: 'flex-start', paddingTop: 20, paddingBottom: 20 }}>
      <div className="card card-wide animate-in" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={onLogout}
            style={{ background: 'none', border: 'none', color: '#8888BB', fontSize: 22, cursor: 'pointer', padding: 4 }}
          >
            ←
          </button>
          <img src="/logo.png" alt="logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h2 className="title-orbitron" style={{ fontSize: 15, color: '#E8E8FF', marginBottom: 1 }}>
              운영진 관리 모드
            </h2>
            <p style={{ fontSize: 11, color: '#8888BB' }}>WOULDULIKE FESTIVAL</p>
          </div>
          <button
            onClick={handleClear}
            style={{
              background: confirmClear ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${confirmClear ? 'rgba(255,77,109,0.6)' : 'rgba(108,99,255,0.2)'}`,
              color: confirmClear ? '#FF4D6D' : '#8888BB',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'Noto Sans KR, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {confirmClear ? '확인 (초기화)' : '초기화'}
          </button>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#6C63FF' }}>{waitingOnly.length}</div>
            <div className="stat-label">대기 중</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#FFD700' }}>{calledOnly.length}</div>
            <div className="stat-label">호출됨</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#00E5A0' }}>{seatedList.length}</div>
            <div className="stat-label">착석 완료</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ color: '#00D4FF' }}>{totalPeople}</div>
            <div className="stat-label">대기 인원</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
            대기 중 ({waitingOnly.length + calledOnly.length})
          </button>
          <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
            완료 ({seatedList.length + cancelledList.length})
          </button>
        </div>

        {/* List */}
        <div className="list-scroll">
          {tab === 'active' && (
            <>
              {calledOnly.length > 0 && (
                <>
                  <p style={{ fontSize: 11, color: '#FFD700', marginBottom: 8, letterSpacing: '0.08em' }}>
                    ✦ 호출됨 — 입장 대기 중
                  </p>
                  {calledOnly.map((g) => (
                    <GuestRow
                      key={g.id}
                      guest={g}
                      position={null}
                      status="called"
                      onSeat={() => seatGuest(g.id)}
                      onCancel={() => cancelGuest(g.id)}
                    />
                  ))}
                  <div className="divider" />
                  <p style={{ fontSize: 11, color: '#8888BB', marginBottom: 8, letterSpacing: '0.08em' }}>
                    ✦ 대기 중
                  </p>
                </>
              )}

              {waitingOnly.length === 0 && calledOnly.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🌌</div>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>대기 중인 손님이 없습니다</p>
                  <p style={{ fontSize: 13 }}>웨이팅 등록을 기다리세요</p>
                </div>
              )}

              {waitingOnly.map((g, idx) => (
                <GuestRow
                  key={g.id}
                  guest={g}
                  position={idx + 1}
                  status="waiting"
                  onCall={() => callGuest(g.id)}
                  onCancel={() => cancelGuest(g.id)}
                  isFirst={idx === 0}
                />
              ))}
            </>
          )}

          {tab === 'history' && (
            <>
              {seatedList.length === 0 && cancelledList.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🌌</div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>완료된 내역이 없습니다</p>
                </div>
              ) : (
                [...seatedList, ...cancelledList]
                  .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
                  .map((g) => <HistoryRow key={g.id} guest={g} />)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GuestRow({ guest, position, status, onCall, onSeat, onCancel, isFirst }) {
  return (
    <div className={`guest-row ${status === 'called' ? 'called' : ''}`}>
      <div className={`guest-number ${status === 'called' ? 'called' : ''}`}>
        {status === 'called' ? '📞' : `#${position}`}
      </div>
      <div className="guest-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="guest-name">{guest.name}</span>
          {isFirst && status === 'waiting' && (
            <span
              style={{
                background: 'rgba(108,99,255,0.25)', color: '#6C63FF',
                fontSize: 10, padding: '2px 7px', borderRadius: 100,
                border: '1px solid rgba(108,99,255,0.4)', fontWeight: 600,
              }}
            >
              다음
            </span>
          )}
        </div>
        <div className="guest-phone">{guest.phone}</div>
        <div className="guest-meta">{guest.partySize}명 · {timeAgo(guest.registeredAt)}</div>
      </div>
      <div className="guest-actions">
        {status === 'waiting' && onCall && (
          <button className="btn btn-call" onClick={onCall}>호출</button>
        )}
        {status === 'called' && onSeat && (
          <button className="btn btn-success" onClick={onSeat}>착석</button>
        )}
        <button className="btn btn-danger" onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

function HistoryRow({ guest }) {
  const isSeated = guest.status === 'seated';
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${isSeated ? 'rgba(0,229,160,0.15)' : 'rgba(255,77,109,0.1)'}`,
        borderRadius: 10, marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 18 }}>{isSeated ? '✅' : '❌'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#E8E8FF' }}>{guest.name}</span>
        <div style={{ fontSize: 12, color: '#8888BB', marginTop: 2 }}>
          {guest.phone} · {guest.partySize}명 · {timeAgo(guest.registeredAt)}
        </div>
      </div>
      <span
        style={{
          fontSize: 11, fontWeight: 600,
          color: isSeated ? '#00E5A0' : '#FF4D6D',
          background: isSeated ? 'rgba(0,229,160,0.1)' : 'rgba(255,77,109,0.1)',
          padding: '3px 9px', borderRadius: 100,
          border: `1px solid ${isSeated ? 'rgba(0,229,160,0.3)' : 'rgba(255,77,109,0.3)'}`,
        }}
      >
        {isSeated ? '착석' : '취소'}
      </span>
    </div>
  );
}
