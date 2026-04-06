import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axmr009() {
  const now = new Date();

const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // yyyy-mm-dd
};

const handleStartChange = (value) => {
  setStartDate(value);

  // ถ้า start มากกว่า end → บังคับ end = start
  if (endDate && value > endDate) {
    setEndDate(value);
  }
};

const handleEndChange = (value) => {
  // ถ้า end น้อยกว่า start → บังคับให้เท่ากับ start
  if (startDate && value < startDate) {
    setEndDate(startDate);
  } else {
    setEndDate(value);
  }
};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(formatDate(now));
  const [endDate, setEndDate] = useState(formatDate(now));

  /*const pad = (n) => n.toString().padStart(2, '0');*/

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
    'Status',
    'Salesperson',
    'Department Name',
    'Item Code',
    'Item Name',
    'Shipping Notice Applied Quantity',
    'Actual Shipping Notice Quantity',
    'Brief Description',
    'Shipping Order',
    'Invoice No.'
  ];

  // ✅ map object → table
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
    row.STATUS_DESC,
    row.XMDG002,
    row.OOEFL003,
    row.XMDH006,
    row.IMAAL003,
    row.XMDH016,
    row.XMDH017,
    row.OOFB011,
    row.ISAG002_LIST,
    row.ISAF011_LIST
  ];

  useEffect(() => {
    setLoading(true);

    fetch(`http://192.168.111.19:3001/api/axmr009?startDate=${startDate}&endDate=${endDate}`)
      .then(async (res) => {
        const text = await res.text();

        try {
          return JSON.parse(text);
        } catch {
          throw new Error(text);
        }
      })
      .then((data) => {
        console.log('DATA:', data);
        setData(data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  const exportToExcel = () => {
    if (data.length === 0) return alert('ไม่มีข้อมูลให้ดาวน์โหลด');

    const worksheetData = [
      ['THAI SHINKONG INDUSTRY CORPORATION LTD.'],
      ['Shipping Notice Details'],
      [''],
      headers,
      ...data.map(mapRow),
      [''],
      ['(AXMR009)', '	Date Printed:', now.toLocaleDateString() + now.toLocaleTimeString()]

    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAs(
      new Blob([wbout]),
      `AXMR009_${startDate}_to_${endDate}.xlsx`
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 5, maxWidth: '100%', margin: 'auto' }}>
      
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          textAlign: 'center',
          marginBottom: 6
        }}
      >
        <img src="/tsic-logo.png" alt="TSIC Logo" style={{ width: 100, height: 100 }} />
        <h1 style={{ fontSize: 24, color: '#003366', margin: 0 }}>
          THAI SHINKONG INDUSTRY CORPORATION LIMITED
        </h1>
      </div>

      <h2 style={{ fontSize: 20, color: '#444', textAlign: 'center', marginBottom: 6 }}>
        📝 AXMR009 REPORT 📝
      </h2>

      <hr style={{ width: '100%', maxWidth: 800, margin: '10px auto 30px', borderColor: '#ccc' }} />

      {/* Filter */}
     <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>

  <div>
    <label>Start Date:</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => handleStartChange(e.target.value)} 
      style={{ padding: '6px 10px', marginLeft: 6 }}
    />
  </div>

  <div>
    <label>End Date:</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => handleEndChange(e.target.value)}
      style={{ padding: '6px 10px', marginLeft: 6 }}
    />
  </div>

  <button
    onClick={exportToExcel}
    style={{
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: 4,
      cursor: 'pointer'
    }}
  >
    💾 Download Excel
  </button>

</div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>⏳ กำลังโหลดข้อมูล / 正在載入資料...</p>
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center' }}>❗ไม่พบข้อมูล กรุณาตรวจสอบช่วงวันที่อีกครั้ง / 未找到資料，請再次確認日期。</p>
      ) : (
        <div style={{
          maxWidth: '100vw',
          maxHeight: '60vh',
          overflowX: 'auto',
          overflowY: 'auto',
          border: '1px solid #ccc'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      position: 'sticky',
                      top: 0,
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      padding: '8px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      zIndex: 1
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                  {mapRow(row).map((value, i) => (
                    <td
                      key={i}
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
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
      )}
    </div>
  );
}

export default Axmr009;