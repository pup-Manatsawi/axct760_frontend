import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: 10, background: "#ddd" }}>
      <Link to="/" style={{ marginRight: 10 }}>หน้าแรก</Link>
      <Link to="/axct201" style={{ marginRight: 10 }}>AXCT201</Link>
      <Link to="/aglq760" style={{ marginRight: 10 }}>AGLQ760</Link>
      <Link to="/axct707_12XX" style={{ marginRight: 10 }}>AXCT707(12XX)</Link>
      <Link to="/axct707_6XXX" style={{ marginRight: 10 }}>AXCT707(6XXX)</Link>
    </nav>
  );
}

export default Navbar;