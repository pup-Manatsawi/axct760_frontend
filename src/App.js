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
import Aist310 from "./pages/Aist310";
import Aapq360 from "./pages/Aapq360";
import Apmt400 from "./pages/Apmt400";

// ================== APP CONTENT ==================
function AppContent() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // ✅ ซ่อน Navbar หน้าเลือก site / home
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/bkkt100acc&fin" ||
    location.pathname === "/bkkpur" ||
    location.pathname === "/bkksale" ||
    location.pathname === "/rayong";

  // ✅ helper redirect ตาม role
  const getDefaultPath = () => {
    if (role === "MARKETING") return "/Axmr009";
    if (role === "ACC") return "/Aglq760";
    if (role === "FAC") return "/Aint302";
    if (role === "PUR") return "/Apmt400";  
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
              <Navigate to={localStorage.getItem("site") || "/rayong"} replace />
            }
          />

          {/* ================= HOME (SITE) ================= */}
          <Route
            path="/bkkt100acc&fin"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home />}
          />

          {/* ✅ เพิ่ม Route /bkkpur ตรงนี้ให้ครบแล้ว */}
          <Route
            path="/bkkpur"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home />}
          />

          <Route
            path="/bkksale"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home />}
          />

          <Route
            path="/rayong"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home />}
          />

          {/* ================= ROLE BASE ================= */}

          {/* MARKETING */}
          {role === "MARKETING" && (
            <>
              <Route path="/Axmr009" element={<Axmr009 />} />
              <Route path="*" element={<Navigate to="/Axmr009" replace />} />
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
              <Route path="/Aist310" element={<Aist310 />} />
              <Route path="/Aapq360" element={<Aapq360 />} />
              <Route path="/Axmr009" element={<Navigate to="/Aglq760" replace />} />
              <Route path="*" element={<Navigate to="/Aglq760" replace />} />
            </>
          )}

          {/* FAC */}
          {role === "FAC" && (
            <>
              <Route path="/Aint302" element={<Aint302 />} />
              <Route path="*" element={<Navigate to="/Aint302" replace />} />
            </>
          )}

          {/* PUR */}
          {role === "PUR" && (
            <>
              <Route path="/Apmt400" element={<Apmt400 />} />
              <Route path="*" element={<Navigate to="/Apmt400" replace />} />
            </>
          )}

          {/* ยังไม่เลือก role */}
          {!role && (
            <Route path="*" element={<Navigate to="/" replace />} />
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