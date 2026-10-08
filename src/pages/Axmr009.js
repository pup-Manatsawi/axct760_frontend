import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axmr009() {
  const now = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  const [startDate, setStartDate] = useState(formatDate(now));
  const [endDate, setEndDate] = useState(formatDate(now));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesType, setSalesType] = useState('');

  const handleStartChange = (value) => {
    setStartDate(value);
    if (endDate && value > endDate) {
      setEndDate(value);
    }
  };

  const handleEndChange = (value) => {
    if (startDate && value < startDate) {
      setEndDate(startDate);
    } else {
      setEndDate(value);
    }
  };

  const headers = [
    'Shipping Notice No.',
    'Shipping Notice Date',
    'Estimated Shipping Date',
    'Customer No.',
    'Ordering Customer (Abbrev.)',
    'Delivery Address',
    'Customer Item Name',
    'Order No.',
    'QTY',
    'Unit',
    'Unit Price',
    'Customer PO No.',
    'LOT',
    'Customer Item No./Spec',
    'Name',
    'Shipping Oder',
    'Shipping Oder Date',
    'Status',
    'Salesperson',
    'Department Name',
    'Item Code',
    'Item Name',
    'Shipping Notice Applied Quantity',
    'Actual Shipping Notice Quantity',
    'Brief Description',
    'Shipping Order',
    'Invoice No.',
    'Collection Term',
    'Collection Desc',
    'Trade Term',
    'Trade Desc'
  ];

  const mapRow = (row) => [
    row.XMDGDOCNO,
    row.XMDGDOCDT,
    row.XMDG028,
    row.XMDG005,
    row.PMAAL004,
    row.XMDG017,
    row.PMAO009,
    row.XMDH001,
    row.CALC_QTY,
    row.UNIT,
    row.XMDH023,
    row.XMDA033,
    row.XMDH006_LAST6,
    row.PMAO010,
    row.OOFA011,
    row.XMDKDOCNO,
    row.XMDK001,
    row.STATUS_DESC,
    row.XMDG002,
    row.OOEFL003,
    row.XMDH006,
    row.IMAAL003,
    row.XMDH016,
    row.XMDH017,
    row.OOFB011,
    row.ISAG002_LIST,
    row.ISAF011_LIST,
    row.XMDG008,
    row.OOIBL004,
    row.XMDG009,
    row.OOCQL004
  ];

  useEffect(() => {
    setLoading(true);

    fetch(`http://192.168.111.19:3001/api/axmr009?startDate=${startDate}&endDate=${endDate}&salesType=${salesType}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(text);
        }
      })
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
  }, [startDate, endDate, salesType]);

  const exportToExcel = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return alert('ไม่มีข้อมูลให้ดาวน์โหลด');
    }

    const worksheetData = [
      ['THAI SHINKONG INDUSTRY CORPORATION LTD.'],
      ['Shipping Notice Details'],
      [''],
      headers,
      ...data.map(mapRow),
      [''],
      ['(AXMR009)', ' Date Printed:', now.toLocaleDateString() + ' ' + now.toLocaleTimeString()]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAs(
      new Blob([wbout]),
      `AXMR009_${startDate}_to_${endDate}_${salesType || 'ALL'}.xlsx`
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
            {/* Modern Shipping Notice SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
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
              AXMR009 REPORT
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, fontWeight: '400' }}>
              ระบบรายงานใบส่งสินค้า / Shipping Notice Details
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
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Sales Type</label>
          <select 
            name="salesType"
            value={salesType}
            onChange={(e) => setSalesType(e.target.value)}
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
            <option value="DOMESTIC">Domestic</option>
            <option value="EXPORT">Export</option>
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
                {data.map((row, idx) => {
                  const bgColor = idx % 2 === 0 ? '#ffffff' : '#fcfcfc';

                  return (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: bgColor,
                        transition: 'background-color 0.15s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
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

export default Axmr009;