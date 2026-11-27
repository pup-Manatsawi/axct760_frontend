import React, { useState, useEffect } from "react"; // ✅ นำเข้า useState และ useEffect มาคุมระบบธีมหลัก

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
import Axcq513 from "./pages/Axcq513";
import Apmt400 from "./pages/Apmt400";
import Axmq140 from "./pages/Axmq140";
import QRCodeBox from "./pages/QRCodeBox"; 
import Manual from "./pages/manual";

// ================== APP CONTENT ==================
function AppContent() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // 🌟 จัดการ State สำหรับธีม โดยเริ่มจาก 'light' หรือดึงค่าจาก localStorage ที่เคยเซฟไว้
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "light";
  });

  // 🌟 อัปเดต attribute data-theme ที่แท็ก html ของหน้าเว็บ และบันทึกลงเครื่องเมื่อเปลี่ยนธีม
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  // 🌟 ฟังก์ชันสำหรับให้ปุ่มกดสลับธีมไปมา
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

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
      {/* 🌟 ส่งตัวแปร theme และฟังก์ชัน toggleTheme ไปให้ Navbar */}
      {!hideNavbar && (
        <Navbar role={role} theme={theme} toggleTheme={toggleTheme} />
      )}

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
          {/* 🌟 ส่ง props theme และ toggleTheme เข้าไปที่ Home เพื่อรองรับการสลับธีมตั้งแต่หน้าแรก */}
          <Route
            path="/bkkt100acc&fin"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home theme={theme} toggleTheme={toggleTheme} />}
          />

          <Route
            path="/bkkpur"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home theme={theme} toggleTheme={toggleTheme} />}
          />

          <Route
            path="/bkksale"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home theme={theme} toggleTheme={toggleTheme} />}
          />

          <Route
            path="/rayong"
            element={role ? <Navigate to={getDefaultPath()} replace /> : <Home theme={theme} toggleTheme={toggleTheme} />}
          />

          {/* ================= ROLE BASE ================= */}
          {/* MARKETING */}
          {role === "MARKETING" && (
            <>
              {/* 🌟 Axmr009 ใช้สีผ่าน CSS Variables เพียวๆ จึงเอา props theme ออก เพื่อให้เปลี่ยนสีทันทีไม่ดีเลย์ */}
              <Route path="/Axmr009" element={<Axmr009 />} />
              {/* 🌟 Axmq140 จำเป็นต้องส่ง props theme ไปคำนวณเฉดสีแดงสลัว Over Credit ของแถวสินค้า */}
              <Route path="/Axmq140" element={<Axmq140 theme={theme} />} />
              <Route path="*" element={<Navigate to="/Axmr009" replace />} />
            </>
          )}

          {/* ACC */}
          {role === "ACC" && (
            <>
              {/* 🌟 [แก้ไขปรับปรุง] ปลดล๊อก props theme ออกจากหน้าที่ไม่จำเป็น เพื่อแก้ปัญหาตารางตอบสนองหน่วงช้า */}
              <Route path="/Aglq760" element={<Aglq760 />} />
              <Route path="/Axct201" element={<Axct201 />} />
              <Route path="/Axct707_12XX" element={<Axct70712XX />} />
              <Route path="/Axct707_6XXX" element={<Axct7076XXX />} />
              <Route path="/Aint302" element={<Aint302 />} />
              <Route path="/Aist310" element={<Aist310 />} />
              <Route path="/Axcq513" element={<Axcq513 />} />
              <Route path="/Aapq360" element={<Aapq360 />} />
              <Route path="/QRCodeBox" element={<QRCodeBox />} />
              
              {/* 🌟 หน้า Manual จำเป็นต้องใช้ theme คำนวณสีปุ่มแท็บสไลด์และวงกลมตัวเลขเพื่อป้องกันสีกลืนกัน */}
              <Route path="/manual" element={<Manual theme={theme} />} />
              <Route path="/Manual" element={<Manual theme={theme} />} />

              <Route path="/Axmr009" element={<Navigate to="/Aglq760" replace />} />
              <Route path="*" element={<Navigate to="/Aglq760" replace />} />
            </>
          )}

          {/* FAC */}
          {role === "FAC" && (
            <>
              {/* 🌟 เอา props theme ออกจาก Aint302 */}
              <Route path="/Aint302" element={<Aint302 />} />
              <Route path="*" element={<Navigate to="/Aint302" replace />} />
            </>
          )}

          {/* PUR */}
          {role === "PUR" && (
            <>
              {/* 🌟 หน้า Apmt400 จำเป็นต้องส่ง props theme ไปคำนวณเฉดสีเตือนภัยแดง/ส้มให้สมูทตาในโหมดมืด */}
              <Route path="/Apmt400" element={<Apmt400 theme={theme} />} />
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
