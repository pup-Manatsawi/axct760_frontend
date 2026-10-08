import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axct201() {
  const now = new Date();
  
  let defaultYear = now.getFullYear();
  let defaultMonth = now.getMonth();
  if (defaultMonth === 0) {
    defaultMonth = 12;
    defaultYear -= 1;
  }
  
  const formattedDefaultMonth = String(defaultMonth).padStart(2, '0');
  
  const [startYear, setStartYear] = useState(String(defaultYear));
  const [startMonth, setStartMonth] = useState(formattedDefaultMonth);
  
  const [endYear, setEndYear] = useState(String(defaultYear));
  const [endMonth, setEndMonth] = useState(formattedDefaultMonth);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State สำหรับระบบแบ่งหน้า (Pagination) - กำหนดหน้าละ 100 บรรทัด
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const years = [];
  for (let y = defaultYear - 5; y <= defaultYear + 2; y++) {
    years.push(String(y));
  }

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const headers = [
    'Corporation',
    'ABook Set',
    'Year',
    'Period',
    'Cost Center',
    'Expense Type',
    'Allocation Method',
    'Account No.',
    'Description',
    'Dept.',
    'Description(Abbr.)',
    'Allocation Cost'
  ];

  const startYearMonth = `${startYear}-${startMonth}`;
  const endYearMonth = `${endYear}-${endMonth}`;

  const handleStartChange = (newYear, newMonth) => {
    const sVal = `${newYear}-${newMonth}`;
    const eVal = `${endYear}-${endMonth}`;
    if (sVal > eVal) {
      setEndYear(newYear);
      setEndMonth(newMonth);
    }
    setStartYear(newYear);
    setStartMonth(newMonth);
    setCurrentPage(1);
  };

  const handleEndChange = (newYear, newMonth) => {
    const sVal = `${startYear}-${startMonth}`;
    const eVal = `${newYear}-${newMonth}`;
    if (eVal < sVal) {
      setStartYear(newYear);
      setStartMonth(newMonth);
    }
    setEndYear(newYear);
    setEndMonth(newMonth);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`http://192.168.111.19:3001/api/axct201?startYearMonth=${startYearMonth}&endYearMonth=${endYearMonth}`)
        .then((res) => res.json())
        .then((resData) => {
          if (Array.isArray(resData)) {
            setData(resData);
          } else {
            console.error('❌ API ไม่ได้ส่ง array:', resData);
            setData([]);
          }
          setLoading(false);
          setCurrentPage(1);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setData([]);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [startYearMonth, endYearMonth]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = Array.isArray(data) ? data.slice(indexOfFirstRow, indexOfLastRow) : [];
  const totalPages = Math.ceil((data.length || 0) / rowsPerPage);

  const exportToExcel = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return alert('ไม่มีข้อมูลให้ดาวน์โหลด');
    }

    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `AXCT201_${startYearMonth}_to_${endYearMonth}.xlsx`);
  };

  const selectStyle = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '32px 24px',
      maxWidth: '1940px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '28px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 4px 0',
              letterSpacing: '-0.3px'
            }}>
              AXCT201 REPORT
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '400' }}>
              ระบบรายงานการจัดสรรต้นทุนและค่าใช้จ่าย (Cost Allocation Report)
            </p>
          </div>
        </div>

        {/* ปรับยอดรวมมุมบนขวาเป็นภาษาอังกฤษ */}
        <div style={{
          fontSize: '13px',
          color: '#475569',
          backgroundColor: '#f1f5f9',
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: '500',
          border: '1px solid #e2e8f0'
        }}>
          รายการทั้งหมด: <strong style={{ color: '#0f172a' }}>{data.length}</strong> รายการ
        </div>
      </div>

      {/* Filter Card */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '20px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Start Period */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>เริ่มต้น (Start Period)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={startYear}
              onChange={(e) => handleStartChange(e.target.value, startMonth)}
              style={{ ...selectStyle, width: '100px' }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={startMonth}
              onChange={(e) => handleStartChange(startYear, e.target.value)}
              style={{ ...selectStyle, width: '130px' }}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* End Period */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>สิ้นสุด (End Period)</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={endYear}
              onChange={(e) => handleEndChange(e.target.value, endMonth)}
              style={{ ...selectStyle, width: '100px' }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={endMonth}
              onChange={(e) => handleEndChange(endYear, e.target.value)}
              style={{ ...selectStyle, width: '130px' }}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={exportToExcel}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '11px 22px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #2563eb',
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
              <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>กำลังโหลดข้อมูล...</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>正在載入資料，請稍候...</p>
            </div>
          </div>
        ) : !Array.isArray(data) || data.length === 0 ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              marginBottom: '4px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>ไม่พบข้อมูล กรุณาตรวจสอบเดือนและปีอีกครั้ง</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>未找到資料，請再次檢查月份和年份。</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              maxHeight: '60vh',
              overflowX: 'auto',
              overflowY: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800, textAlign: 'left' }}>
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
                          padding: '14px 16px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
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
                  {currentRows.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fcfcfc',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fcfcfc'}
                    >
                      {row.map((value, i) => (
                        <td
                          key={i}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            borderRight: '1px solid #f8fafc',
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: '#334155',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (ภาษาอังกฤษ) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Page <strong style={{ color: '#0f172a' }}>{currentPage}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages || 1}</strong> (Showing 100 rows per page)
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
                    color: currentPage === 1 ? '#94a3b8' : '#334155',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: (currentPage === totalPages || totalPages === 0) ? '#f1f5f9' : '#ffffff',
                    color: (currentPage === totalPages || totalPages === 0) ? '#94a3b8' : '#334155',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Axct201;