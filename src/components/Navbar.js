import { Link, useLocation, useNavigate } from "react-router-dom";

// 🌟 [แก้ไข] รับ props theme และ toggleTheme เข้ามาใช้งานจาก App.js
function Navbar({ role, theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();

  const site = localStorage.getItem("site") || "/";

  const menuSale = [
    { path: "/Axmr009", label: "AXMR009" },
    { path: "/Axmq140", label: "AXMQ140" }
  ];

  const menuAcc = [
    { path: "/Aglq760", label: "AGLQ760" },
    { path: "/Axct201", label: "AXCT201" },
    { path: "/Axct707_12XX", label: "AXCT707-12XX" },
    { path: "/Axct707_6XXX", label: "AXCT707-6XXX" },
    { path: "/Aint302", label: "AINT302" },
    { path: "/Aist310", label: "AIST310" },
    { path: "/Axcq513", label: "AXCQ513" },
    { path: "/Aapq360", label: "AAPQ360" },
    { path: "/QRCodeBox", label: "QR Code Box" }
  ];

  const menuPur = [
    { path: "/Apmt400", label: "APMT400" }
  ];

  const menuFac = [
    { path: "/Aint302", label: "AINT302" }
  ];

  // ✅ กัน role null
  let menu = [];
  if (role === "MARKETING") menu = menuSale;
  else if (role === "ACC") menu = menuAcc;
  else if (role === "FAC") menu = menuFac;
  else if (role === "PUR") menu = menuPur;

  // ✅ กำหนดชุดสีตาม Role (Dynamic Theme Colors)
  const getThemeConfig = (currentRole) => {
    switch (currentRole) {
      case "MARKETING":
        return {
          gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          shadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
          dotColor: "#2563eb"
        };
      case "ACC":
        return {
          gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
          shadow: "0 4px 10px rgba(217, 119, 6, 0.3)",
          dotColor: "#d97706"
        };
      case "PUR":
        return {
          gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          shadow: "0 4px 10px rgba(5, 150, 105, 0.3)",
          dotColor: "#059669"
        };
      case "FAC":
        return {
          gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          shadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
          dotColor: "#7c3aed"
        };
      default:
        return {
          gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          shadow: "0 4px 10px rgba(5, 150, 105, 0.3)",
          dotColor: "#059669"
        };
    }
  };

  const themeConfig = getThemeConfig(role);

  // ✅ logout (กลับ Home + ล้าง role)
  const handleHome = () => {
    localStorage.removeItem("role");
    navigate(site); // กลับ site เดิม เช่น /bkkt100
  };

  const isDark = theme === "dark";

  return (
    <div style={{
      ...styles.navbar,
      background: "var(--card-bg)",               // 🌟 พื้นหลังของแถบเมนูเปลี่ยนตามธีมสว่าง/มืด
      borderBottom: "1px solid var(--border-color)", // 🌟 เส้นขอบด้านล่างเปลี่ยนสีตามธีม
    }}>
      
      {/* Logo + Home */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div onClick={handleHome} style={styles.logo}>
          {/* 🌟 [แก้ไขใหม่] ส่งค่าสี var(--brand-color) เข้าไปที่แท็กครอบใหญ่ h1 โดยตรงเพื่อสั่งเคลียร์สีดำของเบราว์เซอร์ */}
          <h1 style={{ ...styles.title, color: "var(--brand-color)" }}>
            <img src="/tsiclogo.png" alt="logo" style={styles.logoImg} />
            <span style={styles.logoText}>TSIC</span> 
          </h1>
        </div>
      </div>

      {/* Menu */}
      <div style={styles.menu}>
        {menu.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                color: "var(--text-color)", // 🌟 ตัวอักษรเมนูที่ไม่ได้ Active จะใช้สีตามธีมหลัก
                ...(active ? { background: themeConfig.gradient, color: "#ffffff", boxShadow: themeConfig.shadow, fontWeight: "600" } : {})
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Control Area (Theme Slide Switch + Role Badge) */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        
        {/* 🌟 ปุ่มสลับธีมแบบ Slide Switch ดีไซน์เก๋ไก๋ทันสมัย */}
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
            {/* ไอคอนจิ๋วเปลี่ยนรูปตามโหมดบนหมุดสไลด์ */}
            <span style={{ fontSize: "12px", lineHeight: 1 }}>
              {isDark ? "🌙" : "☀️"}
            </span>
          </div>
          
          {/* แบคกราวด์ไอคอนจางๆ ข้างหลังช่วยให้ดูสมบูรณ์ขึ้น */}
          <span style={{ ...styles.bgIcon, left: "7px", opacity: isDark ? 0.3 : 0 }}>☀️</span>
          <span style={{ ...styles.bgIcon, right: "7px", opacity: isDark ? 0 : 0.3 }}>🌙</span>
        </div>

        {/* Role */}
        <div style={{
          ...styles.role,
          background: "var(--bg-color)",           // 🌟 กล่อง Role เปลี่ยนสีตามธีมสว่าง/มืด
          color: "var(--text-color)",              // 🌟 ตัวอักษร Role เปลี่ยนสีตามธีม
          borderColor: "var(--border-color)"       // 🌟 ขอบกล่อง Role เปลี่ยนสีตามธีม
        }}>
          <span style={{ ...styles.roleDot, backgroundColor: themeConfig.dotColor }}></span>
          {role || "-"}
        </div>
      </div>

    </div>
  );
}

/* ================= STYLE ================= */

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxSizing: "border-box",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Prompt", "Thonburi", sans-serif'
  },

  logo: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },

  title: {
    fontSize: "24px",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    transition: "color 0.3s ease" /* ใส่เอฟเฟกต์ทรานซิชันเปลี่ยนสีกราฟิกที่ h1 */
  },

  logoText: {
    color: "inherit", /* 🌟 [แก้ไขใหม่] ให้สืบทอดสีหลักมาจากแท็กครอบนอก (h1) โดยตรงเพื่อป้องกันสีดำทับ */
    fontWeight: "700",
    letterSpacing: "-0.5px"
  },

  logoImg: {
    width: "34px",
    height: "34px",
    objectFit: "contain"
  },

  menu: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  link: {
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "13px",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "transparent",
    letterSpacing: "0.2px"
  },

  /* สไตล์ของแคปซูลสวิตช์ครอบนอก */
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

  /* สไตล์ของหมุดทรงกลมที่จะเลื่อนสไลด์ไปมา */
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

  /* ไอคอนจางๆ ด้านในแคปซูล */
  bgIcon: {
    position: "absolute",
    fontSize: "10px",
    pointerEvents: "none",
    transition: "opacity 0.2s ease",
    userSelect: "none"
  },

  role: {
    fontSize: "12px",
    fontWeight: "500",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "0.2px"
  },

  roleDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%"
  }
};

export default Navbar;
