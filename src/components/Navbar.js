import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const site = localStorage.getItem("site") || "/";

  const menuSale = [
    { path: "/Axmr009", label: "AXMR009" }
  ];

  const menuAcc = [
    { path: "/Aglq760", label: "AGLQ760" },
    { path: "/Axct201", label: "AXCT201" },
    { path: "/Axct707_12XX", label: "AXCT707-12XX" },
    { path: "/Axct707_6XXX", label: "AXCT707-6XXX" },
    { path: "/Aint302", label: "AINT302" },
    { path: "/Aist310", label: "AIST310" },
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

  const theme = getThemeConfig(role);

  // ✅ logout (กลับ Home + ล้าง role)
  const handleHome = () => {
    localStorage.removeItem("role");
    navigate(site); // กลับ site เดิม เช่น /bkkt100
  };

  return (
    <div style={styles.navbar}>
      
      {/* Logo + Home */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div onClick={handleHome} style={styles.logo}>
          <h1 style={styles.title}>
            <img src="/tsiclogo.png" alt="logo" style={styles.logoImg} />
            <span>TSIC</span>
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
                ...(active ? { background: theme.gradient, color: "#ffffff", boxShadow: theme.shadow } : {})
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Role */}
      <div style={styles.role}>
        <span style={{ ...styles.roleDot, backgroundColor: theme.dotColor }}></span>
        {role || "-"}
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
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxSizing: "border-box"
  },

  logo: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },

  title: {
    fontSize: "25px",
    color: "#2563eb",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "3px",
    fontWeight: "700",
    letterSpacing: "-0.3px"
  },

  logoImg: {
    width: "36px",
    height: "36px",
    objectFit: "contain"
  },

  menu: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  link: {
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "transparent"
  },

  role: {
    fontSize: "13px",
    fontWeight: "600",
    padding: "6px 14px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#334155",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  roleDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%"
  }
};

export default Navbar;