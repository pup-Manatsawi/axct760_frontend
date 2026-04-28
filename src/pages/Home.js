import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const savedSite = localStorage.getItem('site');

  const isBangkok = path === '/bkkt100';

  // ✅ จำ site
  useEffect(() => {
    if (path === '/bkkt100' || path === '/rayong') {
      localStorage.setItem('site', path);
    }
  }, [path]);

  // ✅ redirect ถ้าเข้า "/"
  useEffect(() => {
    if (path === '/' && savedSite) {
      navigate(savedSite);
    }
  }, [path, savedSite, navigate]);

  // ✅ reset role ทุกครั้งที่เข้า Home
  useEffect(() => {
    localStorage.removeItem('role');
  }, []);

  // ✅ เลือก role
  const selectRole = (role) => {
    localStorage.setItem('role', role);

    if (role === 'MARKETING') {
      navigate('/Axmr009');
    } else if (role === 'ACC') {
      navigate('/Aglq760');
    } else if (role === 'FAC') {
      navigate('/Aint302');
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        <img src="/tsiclogo.png" alt="logo" style={logoStyle} />
        TSIC ERP T100 REPORT
      </h1>

      <div style={{ display: 'flex', gap: 40 }}>

        {/* Bangkok → 3 เมนู */}
        {isBangkok && (
          <>
            <div onClick={() => selectRole('MARKETING')} style={menuStyle('#0066cc')}>
              <img src="/sales.png" alt="sales" style={imgStyle(-15)} />
              <span style={textStyle}>MARKETING</span>
            </div>

            <div onClick={() => selectRole('ACC')} style={menuStyle('#009933')}>
              <img src="/investment.png" alt="investment" style={imgStyle(-20)} />
              <span style={textStyle}>ACC / FIN</span>
            </div>

            <div onClick={() => selectRole('FAC')} style={menuStyle('#8A5CD6')}>
              <img src="/factory4.png" alt="factory" style={imgStyle(-15)} />
              <span style={textStyle}>FACTORY</span>
            </div>
          </>
        )}

        {/* Rayong หรือ path อื่น → FAC อย่างเดียว */}
        {!isBangkok && (
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
  background: 'linear-gradient(to right, #e3f2fd, #ffffff)'
};

const titleStyle = {
  fontSize: 32,
  color: '#003366',
  display: 'flex',
  alignItems: 'center',
  margin: 80
};

const logoStyle = {
  width: 80,
  height: 80,
  marginRight: 10
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
  transition: '0.3s'
});

const menuStyle = (color) => ({
  ...cardStyle(color),
  position: 'relative',
  width: 120,
  height: 15,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const imgStyle = (left) => ({
  position: 'absolute',
  left,
  width: 75,
  height: 75
});

const textStyle = {
  fontWeight: 500,
  position: 'absolute',
  left: 70
};

export default Home;