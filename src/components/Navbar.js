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
    { path: "/Aint302", label: "AINT302" }
  ];

  const menuFac = [
    { path: "/Aint302", label: "AINT302" }
  ];

  // ✅ กัน role null
  let menu = [];
  if (role === "MARKETING") menu = menuSale;
  else if (role === "ACC") menu = menuAcc;
  else if (role === "FAC") menu = menuFac;

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
            TSIC
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
                ...(active ? styles.active : {})
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Role */}
      <div style={styles.role}>
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
    padding: "12px 30px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
  },

  logo: {
    cursor: "pointer"
  },

  title: {
    fontSize: 24,
    color: "#1E40AF",
    margin: 0,
    display: "flex",
    alignItems: "center",
    fontStyle: "italic",
    fontWeight: 700
  },

  logoImg: {
    width: 40,
    height: 40,
    marginRight: 5
  },

  menu: {
    display: "flex",
    gap: 20
  },

  link: {
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: 8,
    color: "#374151",
    fontWeight: 500,
    transition: "0.25s"
  },

  active: {
    background: "#e0f2fe",
    color: "#0284c7"
  },

  role: {
    fontSize: 14,
    padding: "6px 12px",
    borderRadius: 20,
    background: "#f1f5f9",
    color: "#475569"
  }
};

export default Navbar;