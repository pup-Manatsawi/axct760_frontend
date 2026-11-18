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

  // รีเซ็ตกลับไปหน้า 1 เมื่อเปลี่ยนตัวกรอง
  useEffect(() => {
    setCurrentPage(1);
  }, [creditFilter]);

  const headers = [
    'Supplier Code',
    'Supplier Name',
    'Rate',
    'Credit Quota',
    'Calculated Cost',
    'Calculated Shipping Cost'
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
    row.CALSHIPPING_COST
  ];

  // 🔹 ตรวจสอบว่าติดลบ (OverCredit) หรือไม่
  const isOverCredit = (row) => {
    const val = parseFloat(row.CALSHIPPING_COST);
    return !isNaN(val) && val < 0;
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
      return alert('ไม่มีข้อมูลให้ดาวน์โหลด');
    }

    const worksheetData = [
      headers,
      ...filteredData.map(mapRow),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAs(
      new Blob([wbout]),
      `AXMQ140_Credit_Limit_Report.xlsx`
    );
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '32px 24px',
      maxWidth: '1940px',
      margin: '0 auto',
      backgroundColor: '#f1f5f9', // ปรับพื้นหลังหลักให้หรูหราขึ้นด้วยสี Slate สว่าง
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
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', // ปรับเฉดมรกตพรีเมียม
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(16, 185, 129, 0.25)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
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
              AXMQ140 REPORT
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '500' }}>
              ระบบรายงานวิเคราะห์ข้อมูลและตรวจสอบวงเงินสินเชื่อคู่ค้า (Query Credit Limit)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {lastUpdated && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                อัปเดตล่าสุด: <strong style={{ color: '#0f172a' }}>{lastUpdated.toLocaleTimeString('th-TH')}</strong>
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Auto-refresh ทุก 3 นาที</span>
            </div>
          )}
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
            <span>คู่ค้าทั้งหมด: <strong style={{ color: '#0284c7' }}>{data.length}</strong> ราย</span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span>เกินวงเงิน: <strong style={{ color: '#ef4444' }}>{overCreditCount}</strong> ราย</span>
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
            ตัวกรองวงเงิน (Credit Status)
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
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          >
            <option value="ALL">แสดงทั้งหมด ({data.length} ราย)</option>
            <option value="OVER">🔴 เกินวงเงินสะสม / ติดลบ ({overCreditCount} ราย)</option>
            <option value="NORMAL">⚪ วงเงินสถานะปกติ ({data.length - overCreditCount} ราย)</option>
          </select>
        </div>

        <button
          onClick={() => fetchData(false)}
          style={{
            background: '#ffffff',
            color: '#475569',
            border: '1px solid #cbd5e1',
            padding: '11px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
        >
          🔄 ดึงข้อมูลใหม่
        </button>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={exportToExcel}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(16, 185, 129, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.3)';
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
              borderTop: '3px solid #10b981',
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
              <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>กำลังสืบค้นข้อมูลวงเงินคู่ค้า...</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '400' }}>กำลังดึงข้อมูลสดจากระบบ ERP กรุณารอสักครู่...</p>
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
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>ไม่พบรายการข้อมูลในระบบ</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>ไม่มีรายชื่อคู่ค้าในเงื่อนไขสถานะตัวเลือกนี้</p>
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
                    const over = isOverCredit(row);
                    // 🔹 สีแถวปกติสลับสีขาว-ฟ้าสว่าง แถวติดลบเป็นสีแดงพาสเทลหรูหรา
                    const defaultBg = over ? '#fef2f2' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');
                    const hoverBg = over ? '#fee2e2' : '#f1f5f9';

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
                          const isNumberCol = i >= 3; // คอลัมน์ Credit Quota, Calculated Cost, Calculated Shipping Cost
                          const isCalShippingCostCol = (i === 5);
                          const formattedValue = isNumberCol ? formatNumber(value) : value;

                          return (
                            <td
                              key={i}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                borderRight: '1px solid #f1f5f9',
                                padding: '14px 20px',
                                fontSize: '13px',
                                color: (isCalShippingCostCol && over) ? '#991b1b' : '#334155', // แดงเข้มหรูหรา
                                fontWeight: (isCalShippingCostCol && over) ? '700' : '400',
                                textAlign: isNumberCol ? 'right' : 'left', // ชิดขวาสำหรับคอลัมน์ที่เป็นตัวเลข
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
                  แสดงหน้า <strong style={{ color: '#0f172a' }}>{currentPage}</strong> จากทั้งหมด <strong style={{ color: '#0f172a' }}>{totalPages}</strong> หน้า (แสดงแถวที่ {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} จากทั้งหมด {filteredData.length} รายการ)
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
                    ก่อนหน้า
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
                    ถัดไป
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
