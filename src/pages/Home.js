import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// 🌟 [แก้ไข] รับ props theme และ toggleTheme เข้ามาใช้งานในหน้า Home
function Home({ theme, toggleTheme }) {
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

  const isDark = theme === "dark";

  return (
    <div style={{
      ...containerStyle,
      /* 🌟 [ปรับปรุงใหม่] ไล่เฉดสีพื้นหลังแบบ Dynamic ตามโหมดสว่างและมืด */
      background: isDark 
        ? 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e293b 100%)' 
        : 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f1f5f9 100%)',
    }}>
      
      {/* 🌟 [เพิ่มใหม่] ปุ่มสวิตช์สไลด์สลับธีมสุดเก๋ที่มุมขวาบนของหน้า Home */}
      <div style={styles.themeToggleWrapper}>
        <div 
          onClick={toggleTheme} 
          style={{
            ...styles.switchContainer,
            backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
            borderColor: isDark ? "#475569" : "#cbd5e1",
          }}
        >
          {/* ตัวเลื่อนวงกลมด้านใน (หมุดสไลด์) */}
          <div style={{
            ...styles.switchHandle,
            transform: isDark ? "translateX(28px)" : "translateX(0px)",
            backgroundColor: isDark ? "#38bdf8" : "#f59e0b",
            boxShadow: isDark ? "0 0 10px rgba(56, 189, 248, 0.6)" : "0 0 10px rgba(245, 158, 11, 0.4)",
          }}>
            <span style={{ fontSize: "12px", lineHeight: 1 }}>
              {isDark ? "🌙" : "☀️"}
            </span>
          </div>
          <span style={{ ...styles.bgIcon, left: "7px", opacity: isDark ? 0.3 : 0 }}>☀️</span>
          <span style={{ ...styles.bgIcon, right: "7px", opacity: isDark ? 0 : 0.3 }}>🌙</span>
        </div>
      </div>

      {/* Background Decorative Glows */}
      <div style={bgGlow1Style(isDark)}></div>
      <div style={bgGlow2Style(isDark)}></div>

      <div style={contentWrapperStyle}>
        {/* Header Title Section */}
        <div style={headerSectionStyle}>
          <div style={{
            ...logoWrapperStyle,
            backgroundColor: 'var(--card-bg)', /* 🌟 [แก้ไข] จากสีขาวตายตัว ดึงสีตามโหมดสว่าง/มืด */
            borderColor: 'var(--border-color)',   /* 🌟 [แก้ไข] เส้นขอบเปลี่ยนตามธีม */
          }}>
            <img src="/tsiclogo.png" alt="TSIC Logo" style={logoStyle} />
          </div>
          
          {/* 🌟 [แก้ไข] ให้แสดงสีน้ำเงินในโหมดกลางวัน และสีขาวถนอมสายตาในโหมดกลางคืน */}
          <h1 style={{
            ...titleStyle,
            color: 'var(--brand-color)',
            transition: 'color 0.3s ease'
          }}>
            TSIC ERP T100 REPORT
          </h1>
          
          <p style={{
            ...subtitleStyle,
            color: 'var(--text-color)', /* 🌟 [แก้ไข] ปรับตามตัวแปรสีหลัก */
            opacity: 0.7
          }}>
            กรุณาเลือกแผนกหรือระบบงานที่ต้องการเข้าใช้งาน
          </p>
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
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Prompt", "Thonburi", sans-serif',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: '24px',
  boxSizing: 'border-box',
  transition: 'background 0.3s ease'
};

/* 🌟 [แก้ไข] ปรับจุดเรืองแสงพื้นหลังให้จางสวยขึ้นเมื่อโหมดมืดทำงาน */
const bgGlow1Style = (isDark) => ({
  position: 'absolute',
  top: '-10%',
  left: '-10%',
  width: '500px',
  height: '500px',
  background: isDark 
    ? 'radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
    : 'radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
  borderRadius: '50%',
  zIndex: 0,
  transition: 'background 0.3s ease'
});

const bgGlow2Style = (isDark) => ({
  position: 'absolute',
  bottom: '-10%',
  right: '-10%',
  width: '500px',
  height: '500px',
  background: isDark 
    ? 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
    : 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
  borderRadius: '50%',
  zIndex: 0,
  transition: 'background 0.3s ease'
});

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
  padding: '16px',
  borderRadius: '24px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
  marginBottom: '20px',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease'
};

const logoStyle = {
  width: '64px',
  height: '64px',
  objectFit: 'contain'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  fontSize: '15px',
  margin: 0,
  fontWeight: '400',
  transition: 'color 0.3s ease'
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
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  width: '210px',
  boxShadow: `0 10px 20px ${shadowColor}`,
  transition: 'all 0.25s ease-in-out',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxSizing: 'border-box'
});

const imgStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'contain',
  marginBottom: '16px',
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

/* 🌟 [เพิ่มใหม่] สไตล์ของปุ่มสวิตช์เลื่อนในหน้าแรก */
const styles = {
  themeToggleWrapper: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    zIndex: 10
  },
  switchContainer: {
    width: "56px",
    height: "28px",
    borderRadius: "15px",
    border: "1px solid",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "0 2px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    userSelect: "none"
  },
  switchHandle: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  bgIcon: {
    position: "absolute",
    fontSize: "10px",
    pointerEvents: "none",
    transition: "opacity 0.2s ease",
    userSelect: "none"
  }
};

export default Home;
