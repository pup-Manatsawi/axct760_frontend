import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // 1. Redirect เมื่อเข้าหน้า "/"
  useEffect(() => {
    const savedSite = localStorage.getItem('site');
    if (path === '/') {
      if (savedSite) {
        navigate(savedSite, { replace: true });
      }
    } else if (['/bkkt100acc&fin', '/bkkpur', '/bkksale', '/rayong'].includes(path)) {
      // จำ site เฉพาะ path ที่ถูกต้อง
      localStorage.setItem('site', path);
    }
  }, [path, navigate]);

  // 2. Clear role ทุกครั้งที่เข้าหน้านี้
  useEffect(() => {
    localStorage.removeItem('role');
  }, []);

  // เลือก role และ redirect
  const selectRole = (role) => {
    localStorage.setItem('role', role);

    const roleRoutes = {
      MARKETING: '/Axmr009',
      ACC: '/Aglq760',
      FAC: '/Aint302',
      PUR: '/Apmt400',
    };

    if (roleRoutes[role]) {
      navigate(roleRoutes[role]);
    }
  };

  const isAccFin = path === '/bkkt100acc&fin';
  const isSale = path === '/bkksale';
  const isPur = path === '/bkkpur';
  const isRayong = path === '/rayong'|| path === '/';

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        <img src="/tsiclogo.png" alt="logo" style={logoStyle} />
        TSIC ERP T100 REPORT
      </h1>

      <div style={{ display: 'flex', gap: 40 }}>
        {/* Bangkok -> แสดง 4 เมนู (Marketing, ACC, PUR, FAC) */}
        {isAccFin && (
          <>
            <div onClick={() => selectRole('MARKETING')} style={menuStyle('#0066cc')}>
              <img src="/sales.png" alt="sales" style={imgStyle(-15)} />
              <span style={textStyle}>MARKETING</span>
            </div>

            <div onClick={() => selectRole('ACC')} style={menuStyle('#C5A059')}>
              <img src="/investment.png" alt="investment" style={imgStyle(-20)} />
              <span style={textStyle}>ACC / FIN</span>
            </div>

            <div onClick={() => selectRole('PUR')} style={menuStyle('#009933')}>
            <img src="/pur2.png" alt="purchase" style={imgStyle(-20)} />
            <span style={textStyle}>PURCHASE</span>
          </div>

          <div onClick={() => selectRole('FAC')} style={menuStyle('#8A5CD6')}>
            <img src="/factory4.png" alt="factory" style={imgStyle(-15)} />
            <span style={textStyle}>FACTORY</span>
          </div>
          </>
        )}

        {/* Purchase (หรือ Bangkok) */}
        {isPur && (
          <div onClick={() => selectRole('PUR')} style={menuStyle('#009933')}>
            <img src="/pur2.png" alt="purchase" style={imgStyle(-20)} />
            <span style={textStyle}>PURCHASE</span>
          </div>
        )}

        {/* Sale (หรือ Bangkok) */}
        {isSale && (
          <div onClick={() => selectRole('MARKETING')} style={menuStyle('#0066cc')}>
              <img src="/sales.png" alt="sales" style={imgStyle(-15)} />
              <span style={textStyle}>MARKETING</span>
            </div>
        )}

        {/* Factory (แสดงถ้าเป็น Bangkok, Rayong หรือ path อื่นๆ) */}
        {isRayong && (
          <div onClick={() => selectRole('FAC')} style={menuStyle('#8A5CD6')}>
            <img src="/factory4.png" alt="factory" style={imgStyle(-15)} />
            <span style={textStyle}>FACTORY</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================== STYLE ================== */
const containerStyle = {
  fontFamily: 'Arial',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
};

const titleStyle = {
  fontSize: 32,
  color: '#003366',
  display: 'flex',
  alignItems: 'center',
  margin: 80,
};

const logoStyle = {
  width: 80,
  height: 80,
  marginRight: 10,
};

const cardStyle = (color) => ({
  background: color,
  color: '#fff',
  padding: '30px 50px',
  borderRadius: 12,
  cursor: 'pointer',
  textAlign: 'center',
  fontSize: 20,
  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  transition: '0.3s',
});

const menuStyle = (color) => ({
  ...cardStyle(color),
  position: 'relative',
  width: 120,
  height: 15,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const imgStyle = (left) => ({
  position: 'absolute',
  left,
  width: 75,
  height: 75,
});

const textStyle = {
  fontWeight: 500,
  position: 'absolute',
  left: 70,
};

export default Home;