import { useEffect, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axmq140() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creditFilter, setCreditFilter] = useState('ALL'); // ALL, OVER, NORMAL
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🔹 State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);
  // 🔹 ฟังก์ชันสำหรับแปลงวันที่ปัจจุบันให้อยู่ในฟอร์แมต "19 Nov 26"
  const getTodayHeaderLabel = () => {
    const today = new Date();
    const day = today.getDate();
    // ดึงชื่อเดือนแบบย่อ 3 ตัวอักษรภาษาอังกฤษ (เช่น Nov)
    const month = today.toLocaleString('en-US', { month: 'short' });
    // ดึงปี ค.ศ. แบบย่อ 2 หลักสุดท้าย (เช่น 26)
    const year = today.getFullYear().toString().slice(-2);

    return `Today Available Credit (${day} ${month} ${year})`;
  };

  // รีเซ็ตกลับไปหน้า 1 เมื่อเปลี่ยนตัวกรอง
  useEffect(() => {
    setCurrentPage(1);
  }, [creditFilter]);

  const headers = [
    'Customer Code',
    'Customer Name',
    'Currency',
    'Credit Limit',
    'Available Credit',
    'Est. Available Credit',
    getTodayHeaderLabel()
  ];

  // 🔹 ฟังก์ชันฟอร์แมตตัวเลขให้อ่านง่าย มีคอมม่าทศนิยม 2 ตำแหน่ง
  const formatNumber = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const mapRow = (row) => [
    row.PMAB001,
    row.PMAAL004,
    row.PMAB005,
    row.PMAB006,
    row.CALCULATED_COST,
    row.CALSHIPPING_COST,
    row.TODAYSHIPPING_COST
  ];

  // 🔹 ตรวจสอบว่าติดลบ (OverCredit) หรือไม่: เช็คทั้ง 3 ช่อง ถ้ามีช่องใดช่องหนึ่ง < 0 ให้ถือว่า Over Credit
  const isOverCredit = (row) => {
    const valAvailable = parseFloat(row.CALCULATED_COST);
    const valEst = parseFloat(row.CALSHIPPING_COST);
    const valToday = parseFloat(row.TODAYSHIPPING_COST);

    return (
      (!isNaN(valAvailable) && valAvailable < 0) ||
      (!isNaN(valEst) && valEst < 0) ||
      (!isNaN(valToday) && valToday < 0)
    );
  };

  // 🔹 ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = useCallback((isBackground = false) => {
    if (!isBackground) setLoading(true);

    fetch(`http://192.168.111.19:3001/api/axmq140`)
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData)) {
          setData(resData);
          setLastUpdated(new Date());
        } else {
          console.error('❌ API ไม่ได้ส่ง array:', resData);
          setData([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setData([]);
      })
      .finally(() => {
        if (!isBackground) setLoading(false);
      });
  }, []);

  // 🔹 โหลดข้อมูลครั้งแรก + ตั้งเวลา Auto-refresh ทุก 3 นาที (180,000 ms)
  useEffect(() => {
    fetchData(); // โหลดครั้งแรก

    const interval = setInterval(() => {
      fetchData(true); // อัปเดตพื้นหลัง
    }, 180000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // 🔹 กรองข้อมูลตามสถานะ OverCredit
  const filteredData = data.filter((row) => {
    if (creditFilter === 'OVER') return isOverCredit(row);
    if (creditFilter === 'NORMAL') return !isOverCredit(row);
    return true;
  });

  // 🔹 คำนวณแบ่งหน้า Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // นับจำนวนรายการที่ OverCredit
  const overCreditCount = data.filter(isOverCredit).length;

    const exportToExcel = () => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      return alert('No data available to download');
    }

    const worksheetData = [
      headers,
      ...filteredData.map(mapRow),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 🔹 สร้างวันที่ฟอร์แมต เช่น 19_Nov_26 อ้างอิงตามเวลาปัจจุบันระบบของผู้ใช้
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'short' }); // ได้เป็น 'Nov'
    const year = now.getFullYear().toString().slice(-2); // ได้เป็น '26'
    const dateStr = `${day}_${month}_${year}`; // ผลลัพธ์: '19_Nov_26'

    // 🔹 บันทึกไฟล์โดยต่อท้ายด้วยวันที่ที่ดาวน์โหลดแบบอัตโนมัติ
    saveAs(
      new Blob([wbout]),
      `AXMQ140_Credit_Limit_Report_${dateStr}.xlsx`
    );
  };


  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '32px 24px',
      maxWidth: '1940px',
      margin: '0 auto',
      backgroundColor: '#f1f5f9', // พื้นหลังหลักสี Slate สว่าง
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        borderRadius: '20px',
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', // 🔹 เปลี่ยนเป็นเฉดสี Royal Indigo พรีเมียม
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.28)' // 🔹 เงาสีครามนุ่มลึก
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* กรอบตัวบัตรขอบมน */}
              <rect x="2" y="5" width="20" height="14" rx="3" />
              {/* แถบแม่เหล็ก/แถบเส้นบน */}
              <line x1="2" y1="10" x2="22" y2="10" opacity="0.4" strokeWidth="2.5" />
              {/* สมาร์ทชิปการ์ด (EMV Chip) */}
              <rect x="5" y="13" width="4" height="3" rx="0.8" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
              {/* เส้นแถบลายบัตรด้านขวา */}
              <line x1="12" y1="14.5" x2="18" y2="14.5" opacity="0.6" strokeDasharray="1.5 2" />
            </svg>
          </div>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px'
            }}>
              Customer Credit Limit Monitor
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '500' }}>
              ระบบตรวจสอบวงเงินสินเชื่อลูกค้า (AXMQ140) 
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {lastUpdated && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                Last Updated: <strong style={{ color: '#0f172a' }}>{lastUpdated.toLocaleTimeString('th-TH')}</strong>
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Auto-refresh 3 min</span>
            </div>
          )}
          <button
            onClick={() => fetchData(false)}
            style={{
              background: '#ffffff',
              color: '#312e81', // สี Indigo เข้มดูแพงและอ่านง่าย
              border: '1px solid #e2e8f0',
              padding: '9px 18px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.2px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              userSelect: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(99, 102, 241, 0.1), 0 4px 6px -4px rgba(99, 102, 241, 0.1)';

              const icon = e.currentTarget.querySelector('.sync-svg-clean');
              if (icon) icon.style.transform = 'rotate(180deg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)';

              const icon = e.currentTarget.querySelector('.sync-svg-clean');
              if (icon) icon.style.transform = 'rotate(0deg)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1px) scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
            }}
          >
            {/* 🔹 จุดไฟสถานะเปลี่ยนเป็นสีฟ้าสว่างเรืองแสง (ไม่ใช้สีเขียว) */}
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #6366f1',
              display: 'inline-block'
            }} />

            {/* ไอคอน SVG เส้นบางลื่นไหล */}
            <svg
              className="sync-svg-clean"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>

            <span>Sync Data</span>
          </button>

          <div style={{
            fontSize: '13px',
            color: '#334155',
            backgroundColor: '#f8fafc',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: '600',
            border: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px'
          }}>
            <span>Customer Total: <strong style={{ color: '#4f46e5' }}>{data.length}</strong> </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span>Over Credit: <strong style={{ color: '#ef4444' }}>{overCreditCount}</strong> </span>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px 28px',
        borderRadius: '20px',
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '16px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Credit Status
          </label>
          <select 
            value={creditFilter}
            onChange={(e) => setCreditFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '600',
              width: '260px',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'} // 🔹 เปลี่ยนสีขอบตอน Focus เป็น Indigo
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="ALL">All ({data.length})</option>
            <option value="OVER">🔴 Over Credit ({overCreditCount})</option>
            <option value="NORMAL">⚪ Normal Credit ({data.length - overCreditCount})</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={exportToExcel}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)', // 🔹 ปุ่ม Export สี Royal Indigo
              color: 'white',
              border: 'none',
              padding: '11px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)', // 🔹 เงาสีคราม
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(79, 70, 229, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.3)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export to Excel
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '100px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #4f46e5', // 🔹 เปลี่ยนสี Spinner เป็น Indigo
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Searching partner credit info...</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '400' }}>Fetching live ERP data, please wait...</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: '100px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              border: '1px solid #e2e8f0'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>No data found in the system.</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No Customers match this status.</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              maxHeight: '64vh',
              overflowX: 'auto',
              overflowY: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000, textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        style={{
                          position: 'sticky',
                          top: 0,
                          backgroundColor: '#f8fafc',
                          color: '#475569',
                          borderBottom: '2px solid #e2e8f0',
                          borderRight: '1px solid #f1f5f9',
                          padding: '16px 20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.75px',
                          whiteSpace: 'nowrap',
                          zIndex: 2
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
  {currentRows.map((row, idx) => {
    const over = isOverCredit(row); // ถ้าช่องใดใน 3 ช่องติดลบ over จะเป็น true ทั้งแถว

    // 🔹 แถวปกติสลับสีขาว-เทาอ่อน แถวที่มีช่องติดลบจะไฮไลต์พื้นหลังเป็นสีแดงพาสเทลนุ่มตา
    const defaultBg = over ? '#ffe4e6' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');
    const hoverBg = over ? '#fecdd3' : '#f1f5f9';

    return (
      <tr
        key={idx}
        style={{
          backgroundColor: defaultBg,
          transition: 'background-color 0.15s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBg}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = defaultBg}
      >
        {mapRow(row).map((value, i) => {
          const isNumberCol = i >= 3; // คอลัมน์ที่ 3 เป็นต้นไปเป็นตัวเลขเงิน
          
          // ตรวจสอบว่าตัวเลขในเซลล์นี้ติดลบหรือไม่ (< 0)
          const numVal = parseFloat(value);
          const isNegative = isNumberCol && !isNaN(numVal) && numVal < 0;

          const formattedValue = isNumberCol ? formatNumber(value) : value;

          return (
            <td
              key={i}
              style={{
                borderBottom: '1px solid #f1f5f9',
                borderRight: '1px solid #f1f5f9',
                padding: '14px 20px',
                fontSize: '13px',
                // 🔹 ถ้าช่องนี้เป็นเลขติดลบ จะแสดงสีแดงเข้มและตัวหนา
                color: isNegative ? '#991b1b' : '#334155',
                fontWeight: isNegative ? '700' : '400',
                textAlign: isNumberCol ? 'right' : 'left',
                whiteSpace: 'nowrap'
              }}
            >
              {value !== null && value !== undefined ? String(formattedValue) : ''}
            </td>
          );
        })}
      </tr>
    );
  })}
</tbody>

              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 28px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                  Page <strong style={{ color: '#0f172a' }}>{currentPage}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages}</strong> (Showing rows {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length})
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                      color: currentPage === 1 ? '#94a3b8' : '#475569',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                      color: currentPage === totalPages ? '#94a3b8' : '#475569',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Axmq140;
