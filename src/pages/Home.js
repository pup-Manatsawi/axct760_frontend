import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    localStorage.setItem('role', role);

    // ✅ ใช้ navigate แทน reload
    if (role === 'SALE') {
      navigate('/Axmr009');
    } else {
      navigate('/Aglq760');
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to right, #e3f2fd, #ffffff)'
    }}>
      
      <h1 style={{ fontSize: 32, color: '#003366' }}>
        🏢 TSIC ERP T100 REPORT
      </h1>

      <p style={{ marginBottom: 40 }}>
       {/* เลือกแผนก / 選部門*/}
      </p>
      

      <div style={{ display: 'flex', gap: 30 }}>

        {/* SALE */}
        <div
          onClick={() => selectRole('SALE')}
          style={cardStyle('#0066cc')}
        >
          💼 MARLETING
          
        </div>

        {/* ACC */}
        <div
          onClick={() => selectRole('ACC')}
          style={cardStyle('#009933')}
        >
          💰 ACC / FIN
        
        </div>

      </div>

    </div>
  );
}

const cardStyle = (color) => ({
  background: color,
  color: '#fff',
  padding: '30px 50px',
  borderRadius: 12,
  cursor: 'pointer',
  textAlign: 'center',
  fontSize: 20,
  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  transition: '0.3s'
});

export default Home;