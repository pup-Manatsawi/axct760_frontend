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
import Axct707_12XX from "./pages/Axct707_12XX";
import Axct707_6XXX from "./pages/Axct707_6XXX";
import Aint302 from "./pages/Aint302";
import Axmr009 from "./pages/Axmr009";

// ✅ แยก component เพื่อใช้ useLocation
function AppContent() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // ✅ ซ่อน Navbar หน้า Home
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {/* ✅ Navbar */}
      {!hideNavbar && <Navbar role={role} />}

      {/* ✅ Content */}
      <div style={{ padding: 20 }}>
        <Routes>

          {/* หน้า Home */}
          <Route path="/" element={<Home />} />

          {/* ================== SALE ================== */}
          {role === "MARKETING" && (
            <>
              <Route path="/Axmr009" element={<Axmr009 />} />

              {/* กันหลงหน้า */}
              <Route path="*" element={<Navigate to="/Axmr009" />} />
            </>
          )}

          {/* ================== ACC ================== */}
          {role === "ACC" && (
            <>
              <Route path="/Aglq760" element={<Aglq760 />} />
              <Route path="/Axct201" element={<Axct201 />} />
              <Route path="/Axct707_12XX" element={<Axct707_12XX />} />
              <Route path="/Axct707_6XXX" element={<Axct707_6XXX />} />
              <Route path="/Aint302" element={<Aint302 />} />

              {/* ❌ block AXMR009 */}
              <Route path="/Axmr009" element={<Navigate to="/Aglq760" />} />

              {/* กันหลงหน้า */}
              <Route path="*" element={<Navigate to="/Aglq760" />} />
            </>
          )}

          {/* ================== ยังไม่เลือก role ================== */}
          {!role && (
            <Route path="*" element={<Navigate to="/" />} />
          )}

        </Routes>
      </div>
    </>
  );
}

// ✅ ตัวหลัก
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
