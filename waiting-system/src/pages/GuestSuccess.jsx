export function GuestSuccess({ navigate, successData }) {
  if (!successData) {
    navigate('home');
    return null;
  }

  const { guest, position } = successData;
  const estimatedMinutes = Math.max(10, (position - 1) * 15);

  return (
    <div className="page" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div className="card success-landscape animate-in">
        {/* 상단 타이틀 */}
        <p style={{ textAlign: 'center', fontSize: 17, color: '#8888BB', letterSpacing: '0.12em', marginBottom: 28 }}>
          ✦ 웨이팅 등록 완료 ✦
        </p>

        <div className="success-columns">
          {/* 왼쪽: 대기 순번 */}
          <div className="success-col-left">
            <p style={{ fontSize: 16, color: '#8888BB', marginBottom: 8 }}>현재 대기 순번</p>
            <div className="success-number glow-pulse" style={{ lineHeight: 1, marginBottom: 10 }}>
              {position}
            </div>
            <p style={{ fontSize: 22, color: '#8888BB' }}>번째</p>
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="success-col-right">
            {/* 예상 대기 시간 */}
            <div
              style={{
                background: 'rgba(0,212,255,0.07)',
                border: '1px solid rgba(0,212,255,0.22)',
                borderRadius: 16,
                padding: '18px 24px',
              }}
            >
              <p style={{ fontSize: 14, color: '#8888BB', marginBottom: 6 }}>예상 대기 시간</p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#00D4FF',
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                약 {estimatedMinutes}분
              </p>
            </div>

            {/* 등록 정보 */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(108,99,255,0.2)',
                borderRadius: 16,
                padding: '18px 24px',
              }}
            >
              <p style={{ fontSize: 14, color: '#8888BB', marginBottom: 14, textAlign: 'center' }}>
                등록 정보
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Row label="이름" value={guest.name} />
                <Row label="전화번호" value={guest.phone} />
                <Row label="인원 수" value={`${guest.partySize}명`} />
              </div>
            </div>

            <p style={{ fontSize: 15, color: '#8888BB', textAlign: 'center', lineHeight: 1.8 }}>
              순서가 되면 등록하신 번호로<br />
              연락드릴 예정입니다 🌟
            </p>

            <button
              className="btn btn-outline"
              style={{ fontSize: 18, padding: '18px' }}
              onClick={() => navigate('home')}
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 15, color: '#8888BB' }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: '#E8E8FF' }}>{value}</span>
    </div>
  );
}
