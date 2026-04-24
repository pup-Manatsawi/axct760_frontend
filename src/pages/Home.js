import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    localStorage.setItem('role', role);

    // ✅ ใช้ navigate แทน reload
    if (role === 'MARKETING') {
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
      
      <h1 style={{ fontSize: 32, color: '#003366', margin: 0 , display: 'flex', alignItems: 'center' }} >
        <img src="/tsiclogo.png" alt="TSIC Logo" style={{ width: 80, height: 80, marginRight: 10 }} /> TSIC ERP T100 REPORT
        
        
      </h1>

      

      <p style={{ marginBottom: 40 }}>
       {/* เลือกแผนก / 選部門*/}
      </p>
      

      <div style={{ display: 'flex', gap: 40 }}>

        {/* SALE */}
        {/*<img src="/sales.png" alt="factory" style={{ width: 80, height: 80}} />
        <div
          onClick={() => selectRole('MARKETING')}
          style={cardStyle('#0066cc')}
        >
           MARLETING
         
          
          
        </div>*/}
        
        <div onClick={() => selectRole('MARKETING')}
              style={{
                      ...cardStyle('#0066cc'),
                      position: 'relative',
                      width: 120,
                      height: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
              }}
>
          <img src="/sales.png" alt="sales"
                style={{
                        position: 'absolute',
                        left: -15,   // ให้มันล้ำออกมา
                        width: 75,
                        height: 75
                      }} />

          <span style={{ fontWeight: 50 ,position: 'absolute', left: 70}}>
            MARKETING
          </span>
        </div>
        
        
    

        {/* ACC */}
        {/*<div
          onClick={() => selectRole('ACC')}
          style={cardStyle('#009933')}
        >
          💰 ACC / FIN
        
        </div>*/}
        <div onClick={() => selectRole('ACC')}
              style={{
                      ...cardStyle('#009933'),
                      position: 'relative',
                      width: 120,
                      height: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
              }}
>
          <img src="/investment.png" alt="investment"
                style={{
                        position: 'absolute',
                        left: -20,   // ให้มันล้ำออกมา
                        width: 75,
                        height: 75
                      }} />

          <span style={{ fontWeight: 50 ,position: 'absolute', left: 70}}>
            ACC / FIN
          </span>
        </div>

<div onClick={() => selectRole('FAC')}
              style={{
                      ...cardStyle('#8A5CD6'),
                      position: 'relative',
                      width: 120,
                      height: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
              }}
>
          <img src="/factory4.png" alt="factory"
                style={{
                        position: 'absolute',
                        left: -15,   // ให้มันล้ำออกมา
                        width: 75,
                        height: 75
                      }} />

          <span style={{ fontWeight: 50 ,position: 'absolute', left: 70}}>
            FACTORY
          </span>
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