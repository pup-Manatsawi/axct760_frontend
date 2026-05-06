import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



function Aist310() {
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
  'DATE', 'INV. NO.', 'DESCRIPTION', 'ITEM CODE', 'TAX REGISTER NUMBER',
    'BRANCH NO.', 'CUSTOMER NAME', 'CODE CUSTOMER', 'UNIT PRICE',
    'SALES INCOME AMOUNT', 'SALES VAT(7%)', 'TOTAL AMOUNT',
    'SALES QTY(MT)', 'Shipping Notice No.', 'Unit', 'Customer PO No.'
  ];

  // ✅ map object → table
  const mapRow = (row) => [
    row.FORMATTED_DATE ?? '',
    row.ISAF011 ?? '',
    row.ISAG017 ?? '',
    row.PMAO010 ?? '',
    row.ISAF022 ?? '',
    row.BRANCH_NO ?? '',
    row.ISAF021 ?? '',
    row.ISAF002 ?? '',
    row.XMDH023 ?? '',
    row.XMDH026 ?? '',
    row.XMDH028 ?? '',
    row.XMDH027 ?? '',
    row.XMDH021 ?? '',
    row.XMDL001 ?? '',
    // ✅ FIX: SQL alias เป็น "Unit" (mixed case) — Oracle อาจคืนเป็น UNIT หรือ Unit
    row.UNIT ?? row['Unit'] ?? '',
    row.XMDA033 ?? ''
  ];

 useEffect(() => {
  setLoading(true);

  fetch(`http://192.168.111.19:3001/api/aist310?startDate=${startDate}&endDate=${endDate}`)
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
      ['(AIST310)', '	Date Printed:', now.toLocaleDateString() + now.toLocaleTimeString()]

    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAs(
      new Blob([wbout]),
      `AIST310_${startDate}_to_${endDate}.xlsx`
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 5, maxWidth: '100%', margin: 'auto' }}>
      
    

      <h2 style={{ fontSize: 20, color: '#444', textAlign: 'center', marginBottom: 6 }}>
        📝 AIST310 REPORT 📝
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
          maxHeight: '72vh',
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
  {Array.isArray(data) ? (
    data.map((row, idx) => (
      <tr key={idx}>
        {mapRow(row).map((value, i) => (
          <td key={i}>{value}</td>
        ))}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={headers.length} style={{ textAlign: 'center' }}>
        ❌ Data format ผิด (ไม่ใช่ array)
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default Aist310;