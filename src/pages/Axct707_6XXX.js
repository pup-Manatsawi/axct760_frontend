import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axct707_6XXX() {
  // 🔹 ตั้งค่าเดือนเริ่มต้นเป็น "เดือนก่อนหน้า" (เช่น ตอนนี้ ต.ค. จะได้ ก.ย. = เดือน 9)
  const getPreviousMonthAndYear = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return {
      month: String(d.getMonth() + 1),
      year: String(d.getFullYear())
    };
  };

  const initialDate = getPreviousMonthAndYear();

  const [month, setMonth] = useState(initialDate.month);
  const [year, setYear] = useState(initialDate.year);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 เพิ่ม State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100); // แสดงหน้าละ 100 รายการ

  // เมื่อเปลี่ยนเดือนหรือปี ให้รีเซ็ตกลับไปหน้า 1 เสมอ
  useEffect(() => {
    setCurrentPage(1);
  }, [month, year]);

  const headers = [
    'Doc No.',
    'Reference Doc No. LN',
    'Item Code',
    'Item Name',
    'Specification',
    'Inventory Title',
    'Inventory Description',
    'Dept',
    'Description',
    'QTY',
    'Cost',
    'Note',
    'Doc Notes',
    'Long Notes'
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`http://192.168.111.19:3001/api/axct707_6xxx?month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData)) {
          setData(resData);
        } else {
          console.error('❌ API ไม่ได้ส่ง array:', resData);
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setData([]);
        setLoading(false);
      });
  }, [month, year]);

  // 🔹 คำนวณตัดแบ่งแถวสำหรับ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = Array.isArray(data) ? data.slice(indexOfFirstRow, indexOfLastRow) : [];
  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage);

  const exportToExcel = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return alert('ไม่มีข้อมูลให้ดาวน์โหลด');
    }

    let worksheetData;
    if (data.length > 0 && !Array.isArray(data[0])) {
      worksheetData = XLSX.utils.json_to_sheet(data, { header: headers });
    } else {
      worksheetData = XLSX.utils.aoa_to_sheet([headers, ...data]);
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetData, 'Data');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `AXCT707_6XXX_${year}_${month}.xlsx`);
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
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)'
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
              AXCT707(6XXX) REPORT
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '400' }}>
              ระบบรายงานต้นทุนและรายการบัญชี 6XXX (Cost & Accounting Report)
            </p>
          </div>
        </div>

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Month</label>
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500',
              width: '100px',
              transition: 'all 0.2s'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Year</label>
          <input
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500',
              width: '120px'
            }}
          />
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={exportToExcel}
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100% )',
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
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 148, 136, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.35)';
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
              borderTop: '3px solid #0d9488',
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
              maxHeight: '66vh',
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
                      {Array.isArray(row) ? (
                        row.map((value, i) => (
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
                            {value !== null && value !== undefined ? String(value) : ''}
                          </td>
                        ))
                      ) : (
                        Object.values(row).map((value, i) => (
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
                            {value !== null && value !== undefined ? String(value) : ''}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Page <strong style={{ color: '#0f172a' }}>{currentPage}</strong> of <strong style={{ color: '#0f172a' }}>{totalPages}</strong> (Showing {rowsPerPage} rows per page)
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
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
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
                      color: currentPage === totalPages ? '#94a3b8' : '#334155',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
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

export default Axct707_6XXX;