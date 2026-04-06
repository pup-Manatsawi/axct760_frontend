import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axmr009() {
  const now = new Date();

  const [day, setDay] = useState(String(now.getDate()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const pad = (n) => n.toString().padStart(2, '0');

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

    fetch(`http://192.168.111.19:3001/api/axmr009?day=${pad(day)}&month=${pad(month)}&year=${year}`)
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
  }, [day, month, year]);

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
      `AXMR009_${year}_${pad(month)}_${pad(day)}.xlsx`
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
          <label>Day:</label>
          <input
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{ padding: '6px 10px', marginLeft: 6 }}
          />
        </div>

        <div>
          <label>Month:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: '6px 10px', marginLeft: 6 }}
          />
        </div>

        <div>
          <label>Year:</label>
          <input
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
        <p style={{ textAlign: 'center' }}>⏳ กำลังโหลดข้อมูล...</p>
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center' }}>❗ไม่พบข้อมูล</p>
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