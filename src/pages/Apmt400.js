import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Apmt400() {
  const now = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(formatDate(now));
  const [endDate, setEndDate] = useState(formatDate(now));
  const [status, setStatus] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  const handleStartChange = (value) => {
    setStartDate(value);

    if (endDate && new Date(value) > new Date(endDate)) {
      setEndDate(value);
    }
  };

  const handleEndChange = (value) => {
    if (startDate && new Date(value) < new Date(startDate)) {
      setEndDate(startDate);
    } else {
      setEndDate(value);
    }
  };

  // ฟังก์ชันช่วย Parse วันที่ (รองรับทั้ง YYYY-MM-DD และ DD/MM/YYYY)
  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const str = String(dateStr).trim();
    
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // ฟังก์ชันคำนวณสถานะสีตามกฎ
  const getRowColorStatus = (row) => {
    if (row.PMDSDOCDT && String(row.PMDSDOCDT).trim() !== '') {
      return 'none';
    }

    const expectedDate = parseDateString(row.PMDO012);
    if (!expectedDate) return 'none';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expectedDate.setHours(0, 0, 0, 0);

    const diffTime = expectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 0) {
      return 'red';
    }

    if (diffDays >= 1 && diffDays <= 7) {
      return 'orange';
    }

    return 'none';
  };

  const headers = [
    'Supplier Code',
    'Supplier Name',
    'Department no',
    'Department Name',
    'Requester',
    'PR No.',
    'PR Date',
    'Demand Qty',
    'Item Code',
    'Item Name',
    'Specification',
    'PR Remark',
    'PO No.',
    'PO Date',
    'Note',
    'PO Amount',
    'Currency',
    'LN',
    'Expected Delivery Date',
    'Receipt Date',
    'Reconciliation Statement No.',
    'Bill No.',
    'Invoice No.',
    'Invoice Date',
    'Invoice Amount',
    'Currency',
    'AP Voucher No.',
    'AP Posting Date',
    'No Tax Amount',
    'VAT Amount',
    'WHT Amount',
    'Net Payable Amount',
    'Due Date',
    'AP Status',
    'Payable Write-off No.',
    'Payment Voucher No.',
    'Actual Payment Date',
    'Payment Amount',
    'Payment Type',
    'Bank Account',
    'Receipt Bank',
    'Receipt Account',
    'Remarks'
  ];

  const mapRow = (row) => [
    row.PMDL004,
    row.PMAAL004,
    row.PMDA003,
    row.OOEFL003,
    row.OOAG011,
    row.PMDADOCNO,
    row.PMDADOCDT,
    row.PMDB006,
    row.PMDB004,
    row.IMAAL003,
    row.IMAAL004,
    row.PMDA022,
    row.PMDLDOCNO,
    row.PMDLDOCDT,
    row.OOFF013,
    row.PMDN047,
    row.PMDL015,
    row.PMDOSEQ,
    row.PMDO012,
    row.PMDSDOCDT,
    row.APCA018,
    row.APCADOCNO,
    row.APCA066,
    row.ISAM011,
    row.ISAM025,
    row.ISAM014,
    row.APCA038,
    row.APCADOCDT,
    row.APCA103,
    row.APCA104,
    row.APCA106,
    row.APCA108,
    row.APCA010,
    row.APDASTUS,
    row.APDADOCNO,
    row.APDA014,
    row.APDADOCDT,
    row.APCE119,
    row.APDE006,
    row.APDE008,
    row.APDE039,
    row.APDE040,
    row.APCE010
  ];

  useEffect(() => {
    setLoading(true);

    fetch(`http://192.168.111.19:3001/api/apmt400?startDate=${startDate}&endDate=${endDate}&status=${status}`)
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData)) {
          setData(resData);
        } else {
          console.error('❌ API ไม่ได้ส่ง array:', resData);
          setData([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate, status]);

  const filteredData = data.filter((row) => {
    if (!colorFilter) return true;
    return getRowColorStatus(row) === colorFilter;
  });

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
      `APMT400_${startDate}_to_${endDate}.xlsx`
    );
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
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', // Emerald Theme
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
          }}>
            {/* Modern Procurement Report SVG Icon */}
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
              APMT400 REPORT
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '400' }}>
              ระบบรายงานการจัดซื้อและเจ้าหนี้ (Procurement & Accounts Payable Report)
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
          รายการทั้งหมด: <strong style={{ color: '#0f172a' }}>{filteredData.length}</strong> รายการ
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
        marginBottom: '20px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartChange(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndChange(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Status</label>
          <select 
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500'
            }}
          >
            <option value="">-- All --</option>
            <option value="NoPo">Pending PO</option>
            <option value="NoAp">Pending AP</option>
            <option value="NoWriteOff">Pending Write-off</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Color Warning</label>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontWeight: '500'
            }}
          >
            <option value="">-- All Colors --</option>
            <option value="red">🔴 ถึง/เลยกำหนดส่ง (Overdue)</option>
            <option value="orange">🟠 ใกล้ถึงกำหนดใน 7 วัน (Near Due)</option>
            <option value="none">⚪ ปกติ (Normal)</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={exportToExcel}
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', // Emerald Gradient
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
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.45)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.35)';
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Modern Download Excel SVG Icon */}
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

      {/* Legend Card */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '24px', 
        marginBottom: '20px', 
        fontSize: '13px', 
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        width: 'fit-content',
        margin: '0 auto 24px auto',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 14, height: 14, backgroundColor: '#fee2e2', border: '1px solid #f87171', display: 'inline-block', borderRadius: 4 }}></span>
          <span style={{ color: '#334155', fontWeight: '500' }}><strong>สีแดง:</strong> Receipt Date ว่าง + ถึง/เลย Expected Date</span>
        </div>

        <span style={{ color: '#cbd5e1' }}>|</span>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 14, height: 14, backgroundColor: '#fef3c7', border: '1px solid #fbbf24', display: 'inline-block', borderRadius: 4 }}></span>
          <span style={{ color: '#334155', fontWeight: '500' }}><strong>สีส้ม:</strong> Receipt Date ว่าง + เหลือ ≤ 7 วันจะถึง Expected Date</span>
        </div>

        <span style={{ color: '#cbd5e1' }}>|</span>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 14, height: 14, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', display: 'inline-block', borderRadius: 4 }}></span>
          <span style={{ color: '#334155', fontWeight: '500' }}><strong>ไม่มีสี:</strong> มี Receipt Date หรือ เหลือเวลา &gt; 7 วัน</span>
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
        )  : (
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
                {filteredData.map((row, idx) => {
                  const colorStatus = getRowColorStatus(row);

                  let bgColor = idx % 2 === 0 ? '#ffffff' : '#fcfcfc';
                  if (colorStatus === 'red') {
                    bgColor = '#fee2e2';
                  } else if (colorStatus === 'orange') {
                    bgColor = '#fef3c7';
                  }

                  return (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: bgColor,
                        transition: 'background-color 0.15s'
                      }}
                      onMouseOver={(e) => {
                        if (colorStatus === 'red') {
                          e.currentTarget.style.backgroundColor = '#fecaca';
                        } else if (colorStatus === 'orange') {
                          e.currentTarget.style.backgroundColor = '#fde68a';
                        } else {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = bgColor;
                      }}
                    >
                      {mapRow(row).map((value, i) => (
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Apmt400;