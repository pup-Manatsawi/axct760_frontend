import { Link, useLocation } from "react-router-dom";

function Navbar({ role }) {
  const location = useLocation();

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

  const menu = role === "MARKETING" ? menuSale : role === "ACC" ? menuAcc : menuFac;

  return (
    <div style={styles.navbar}>
      
      {/* Logo + Home */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        
        <Link to="/" style={styles.logo}>
         {/* <img src="/tsictop.png" alt="TSIC Logo" style={{ width: 80, height: 30, marginRight: 10 }} />*/}
         <h1 
          style={{
                  fontSize: 24,
                  color: '#1E40AF',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  fontStyle: 'italic',
                  fontWeight: 700
                }} >
        <img src="/tsiclogo.png" alt="TSIC Logo" style={{ width: 40, height: 40, marginRight: 0 }} /> TSIC
      </h1>
        </Link>

        {/*<Link
          to="/"
          style={{
            ...styles.homeBtn,
            ...(location.pathname === "/" ? styles.activeHome : {})
          }}
        >
          🏠 Home
        </Link>*/}

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
        {role}
      </div>

    </div>
  );
}

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
    fontWeight: "bold",
    fontSize: 18,
    color: "#1e3a8a",
    textDecoration: "none"
  },

  homeBtn: {
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 14,
    background: "#f1f5f9",
    color: "#334155",
    transition: "0.2s"
  },

  activeHome: {
    background: "#e0f2fe",
    color: "#0284c7"
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