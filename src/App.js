import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Aglq760 from "./pages/Aglq760";
import Axct201 from "./pages/Axct201";
import Axct70712XX from "./pages/Axct707_12XX";
import Axct7076XXX from "./pages/Axct707_6XXX";
import Aint302 from "./pages/Aint302";
import Axmr009 from "./pages/Axmr009";

// ================== APP CONTENT ==================
function AppContent() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // ✅ ซ่อน Navbar หน้าเลือก site / home
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/bkkt100" ||
    location.pathname === "/rayong";

  // ✅ helper redirect ตาม role
  const getDefaultPath = () => {
    if (role === "MARKETING") return "/Axmr009";
    if (role === "ACC") return "/Aglq760";
    if (role === "FAC") return "/Aint302";
    return "/";
  };

  return (
    <>
      {/* ✅ Navbar */}
      {!hideNavbar && <Navbar role={role} />}

      {/* ✅ Content */}
      <div style={{ padding: 20 }}>
        <Routes>

          {/* ================= ROOT ================= */}
          <Route
            path="/"
            element={
              <Navigate to={localStorage.getItem("site") || "/rayong"} />
            }
          />

          {/* ================= HOME (SITE) ================= */}
          <Route
            path="/bkkt100"
            element={
              role
                ? <Navigate to={getDefaultPath()} />
                : <Home />
            }
          />

          <Route
            path="/rayong"
            element={
              role
                ? <Navigate to="/Aint302" />
                : <Home />
            }
          />

          {/* ================= ROLE BASE ================= */}

          {/* MARKETING */}
          {role === "MARKETING" && (
            <>
              <Route path="/Axmr009" element={<Axmr009 />} />
              <Route path="*" element={<Navigate to="/Axmr009" />} />
            </>
          )}

          {/* ACC */}
          {role === "ACC" && (
            <>
              <Route path="/Aglq760" element={<Aglq760 />} />
              <Route path="/Axct201" element={<Axct201 />} />
              <Route path="/Axct707_12XX" element={<Axct70712XX />} />
              <Route path="/Axct707_6XXX" element={<Axct7076XXX />} />
              <Route path="/Aint302" element={<Aint302 />} />
              <Route path="/Axmr009" element={<Navigate to="/Aglq760" />} />
              <Route path="*" element={<Navigate to="/Aglq760" />} />
            </>
          )}

          {/* FAC */}
          {role === "FAC" && (
            <>
              <Route path="/Aint302" element={<Aint302 />} />
              <Route path="*" element={<Navigate to="/Aint302" />} />
            </>
          )}

          {/* ยังไม่เลือก role */}
          {!role && (
            <Route path="*" element={<Navigate to="/" />} />
          )}

        </Routes>
      </div>
    </>
  );
}

// ================== MAIN APP ==================
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;