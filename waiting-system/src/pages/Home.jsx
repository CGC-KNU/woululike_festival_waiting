import { useNavigate } from 'react-router-dom';

export function Home({ navigate }) {
  const routerNavigate = useNavigate();

  return (
    <div className="page" style={{ gap: 0, justifyContent: 'center' }}>
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: 64 }}>
        <img
          src="/logo.png"
          alt="logo"
          className="glow-pulse"
          style={{
            width: 140, height: 140, borderRadius: 30,
            objectFit: 'cover', marginBottom: 30,
            boxShadow: '0 0 36px rgba(108,99,255,0.55)',
          }}
        />
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 34, fontWeight: 700,
            color: '#E8E8FF', marginBottom: 12,
            letterSpacing: '0.04em',
          }}
        >
          WOULDULIKE FESTIVAL
        </h1>
        <p style={{ fontSize: 17, color: '#8888BB', letterSpacing: '0.2em' }}>
          ✦ WAITING SYSTEM ✦
        </p>
      </div>

      <div className="animate-in" style={{ animationDelay: '0.1s', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-primary"
          style={{
            width: '90%', maxWidth: 520,
            fontSize: 28, padding: '34px 32px',
            borderRadius: 24,
            boxShadow: '0 0 44px rgba(108,99,255,0.55)',
            gap: 16,
          }}
          onClick={() => navigate('register')}
        >
          <span style={{ fontSize: 34 }}>🌟</span>
          <span>웨이팅 등록하기</span>
        </button>
      </div>

      <button
        className="admin-link-btn"
        onClick={() => routerNavigate('/admin')}
      >
        관리자
      </button>
    </div>
  );
}
