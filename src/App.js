
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Aglq760 from "./pages/Aglq760";
import Axct201 from "./pages/Axct201";
import Axct707_12XX from "./pages/Axct707_12XX";
import Axct707_6XXX from "./pages/Axct707_6XXX";
import Aint302 from "./pages/Aint302";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Aglq760" element={<Aglq760 />} />
          <Route path="/Axct201" element={<Axct201 />} />
          <Route path="/Axct707_12XX" element={<Axct707_12XX />} />
          <Route path="/Axct707_6XXX" element={<Axct707_6XXX />} />
          <Route path="/Aint302" element={<Aint302 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
