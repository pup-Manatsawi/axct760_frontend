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
  const isRayong = path === '/rayong' || path === '/';

  return (
    <div style={containerStyle}>
      {/* Background Decorative Glows */}
      <div style={bgGlow1Style}></div>
      <div style={bgGlow2Style}></div>

      <div style={contentWrapperStyle}>
        {/* Header Title Section */}
        <div style={headerSectionStyle}>
          <div style={logoWrapperStyle}>
            <img src="/tsiclogo.png" alt="TSIC Logo" style={logoStyle} />
          </div>
          <h1 style={titleStyle}>TSIC ERP T100 REPORT</h1>
          <p style={subtitleStyle}>กรุณาเลือกแผนกหรือระบบงานที่ต้องการเข้าใช้งาน</p>
        </div>

        {/* Menu Cards Container */}
        <div style={gridContainerStyle}>
          {/* Bangkok -> แสดง 4 เมนู (Marketing, ACC, PUR, FAC) */}
          {isAccFin && (
            <>
              <div 
                onClick={() => selectRole('MARKETING')} 
                style={menuCardStyle('linear-gradient(185deg, #2563eb 0%, #1d4ed8 100%)', 'rgba(37, 99, 235, 0.35)')}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <img src="/sales.png" alt="sales" style={imgStyle} />
                <div style={textContainerStyle}>
                  <span style={cardTitleStyle}>MARKETING</span>
                  <span style={cardDescStyle}>ระบบงานขายและจัดส่ง</span>
                </div>
              </div>

              <div 
                onClick={() => selectRole('ACC')} 
                style={menuCardStyle('linear-gradient(185deg, #d97706 0%, #b45309 100%)', 'rgba(217, 119, 6, 0.35)')}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <img src="/investment.png" alt="investment" style={imgStyle} />
                <div style={textContainerStyle}>
                  <span style={cardTitleStyle}>ACC / FIN</span>
                  <span style={cardDescStyle}>ระบบบัญชีและการเงิน</span>
                </div>
              </div>

              <div 
                onClick={() => selectRole('PUR')} 
                style={menuCardStyle('linear-gradient(185deg, #059669 0%, #047857 100%)', 'rgba(5, 150, 105, 0.35)')}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <img src="/pur2.png" alt="purchase" style={imgStyle} />
                <div style={textContainerStyle}>
                  <span style={cardTitleStyle}>PURCHASE</span>
                  <span style={cardDescStyle}>ระบบจัดซื้อและเจ้าหนี้</span>
                </div>
              </div>

              <div 
                onClick={() => selectRole('FAC')} 
                style={menuCardStyle('linear-gradient(185deg, #7c3aed 0%, #6d28d9 100%)', 'rgba(124, 58, 237, 0.35)')}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <img src="/factory4.png" alt="factory" style={imgStyle} />
                <div style={textContainerStyle}>
                  <span style={cardTitleStyle}>FACTORY</span>
                  <span style={cardDescStyle}>ระบบการผลิตและโรงงาน</span>
                </div>
              </div>
            </>
          )}

          {/* Purchase */}
          {isPur && (
            <div 
              onClick={() => selectRole('PUR')} 
              style={menuCardStyle('linear-gradient(185deg, #059669 0%, #047857 100%)', 'rgba(5, 150, 105, 0.35)')}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <img src="/pur2.png" alt="purchase" style={imgStyle} />
              <div style={textContainerStyle}>
                <span style={cardTitleStyle}>PURCHASE</span>
                <span style={cardDescStyle}>ระบบจัดซื้อและเจ้าหนี้</span>
              </div>
            </div>
          )}

          {/* Sale */}
          {isSale && (
            <div 
              onClick={() => selectRole('MARKETING')} 
              style={menuCardStyle('linear-gradient(185deg, #2563eb 0%, #1d4ed8 100%)', 'rgba(37, 99, 235, 0.35)')}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <img src="/sales.png" alt="sales" style={imgStyle} />
              <div style={textContainerStyle}>
                <span style={cardTitleStyle}>MARKETING</span>
                <span style={cardDescStyle}>ระบบงานขายและจัดส่ง</span>
              </div>
            </div>
          )}

          {/* Factory */}
          {isRayong && (
            <div 
              onClick={() => selectRole('FAC')} 
              style={menuCardStyle('linear-gradient(185deg, #7c3aed 0%, #6d28d9 100%)', 'rgba(124, 58, 237, 0.35)')}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <img src="/factory4.png" alt="factory" style={imgStyle} />
              <div style={textContainerStyle}>
                <span style={cardTitleStyle}>FACTORY</span>
                <span style={cardDescStyle}>ระบบการผลิตและโรงงาน</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== HOVER HANDLERS ================== */
const handleMouseOver = (e) => {
  e.currentTarget.style.transform = 'translateY(-6px)';
  e.currentTarget.style.boxShadow = '0 18px 35px rgba(0, 0, 0, 0.15)';
};

const handleMouseOut = (e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.08)';
};

/* ================== STYLES ================== */
const containerStyle = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f1f5f9 100%)',
  position: 'relative',
  overflow: 'hidden',
  padding: '24px',
  boxSizing: 'border-box'
};

const bgGlow1Style = {
  position: 'absolute',
  top: '-10%',
  left: '-10%',
  width: '500px',
  height: '500px',
  background: 'radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
  borderRadius: '50%',
  zIndex: 0
};

const bgGlow2Style = {
  position: 'absolute',
  bottom: '-10%',
  right: '-10%',
  width: '500px',
  height: '500px',
  background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
  borderRadius: '50%',
  zIndex: 0
};

const contentWrapperStyle = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1050px'
};

const headerSectionStyle = {
  textAlign: 'center',
  marginBottom: '48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const logoWrapperStyle = {
  background: '#ffffff',
  padding: '16px',
  borderRadius: '24px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
  marginBottom: '20px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const logoStyle = {
  width: '64px',
  height: '64px',
  objectFit: 'contain'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#0f172a',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  fontSize: '15px',
  color: '#64748b',
  margin: 0,
  fontWeight: '400'
};

const gridContainerStyle = {
  display: 'flex',
  gap: '24px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '100%'
};

const menuCardStyle = (gradient, shadowColor) => ({
  background: gradient,
  color: '#ffffff',
  padding: '32px 24px',
  borderRadius: '20px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',   // จัดเรียงเป็นแนวตั้ง (ไอคอนอยู่บน ข้อความอยู่ล่าง)
  alignItems: 'center',      // จัดกึ่งกลางแนวนอน
  textAlign: 'center',
  width: '210px',            // ปรับความกว้างการ์ดให้พอดีกับแนวตั้ง
  boxShadow: `0 10px 20px ${shadowColor}`,
  transition: 'all 0.25s ease-in-out',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxSizing: 'border-box'
});

const imgStyle = {
  width: '80px',             // ขยายขนาดไอคอนให้ใหญ่สะใจ (ปรับเพิ่มลดได้ตามต้องการ)
  height: '80px',
  objectFit: 'contain',
  marginBottom: '16px',      // เว้นระยะห่างระหว่างไอคอนกับข้อความ
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
};

const textContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  alignItems: 'center'
};

const cardTitleStyle = {
  fontSize: '16px',
  fontWeight: '700',
  letterSpacing: '0.5px',
  color: '#ffffff'
};

const cardDescStyle = {
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.8)',
  fontWeight: '400'
};

export default Home;