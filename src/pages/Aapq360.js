import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Aapq360() {
  const now = new Date();

  const formatDate = (date) => {
    //return date.toISOString().split('T')[0]; // yyyy-mm-dd
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(formatDate(now));
  const [endDate, setEndDate] = useState(formatDate(now));
  const [apca004, setApca004] = useState('');

  // ✅ FIX compare date ให้ถูกต้อง
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

  const headers = [
    'AP Sheet No.',
    'Accounted Date',
    'Accounted Date',
    'Billed to',
    'DESCRIPTION',
    'Source Bus Doc',
    'Product No.',
    'Item Name/Spec.',
    'Quantity',
    'U/P',
    'No Tax Amount',
    'TAX',
    'Taxed Amount',
    'Note',
    'Invoice No.'
  ];

  const mapRow = (row) => [
    row.APCADOCNO,
    row.APCADOCDT,
    row.BRANCH_NO,
    row.APCA004,
    row.PMAAL004,
    row.APCB002,
    row.APCB004,
    row.APCB005,
    row.APCB007,
    row.APCB101,
    row.APCB103,
    row.APCB104,
    row.APCB105,
    row.APCA053,
    row.APCB028
  ];

  useEffect(() => {
    setLoading(true);

    fetch(`http://192.168.111.19:3001/api/aapq360?startDate=${startDate}&endDate=${endDate}&apca004=${apca004}`)
      .then((res) => res.json())
      .then((resData) => {
        console.log('DATA:', resData);
        console.log('IS ARRAY:', Array.isArray(resData));

        // ✅ กัน data.map พัง
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
  }, [startDate, endDate, apca004]);

  const exportToExcel = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return alert('ไม่มีข้อมูลให้ดาวน์โหลด');
    }

    const worksheetData = [
      headers,
      ...data.map(mapRow),
    
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAs(
      new Blob([wbout]),
      `AAPQ360_${startDate}_to_${endDate}_(${apca004}).xlsx`
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 5, maxWidth: '100%', margin: 'auto' }}>

      <h2 style={{ fontSize: 20, color: '#444', textAlign: 'center', marginBottom: 6 }}>
        📝 AAPQ360 REPORT 📝
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
        <div>
          <label>Vender:</label>
          <select 
              name="apca004"
              value={apca004}
              onChange={(e) => setApca004(e.target.value)}
               style={{ padding: '6px 10px', marginLeft: 6 }}
>
          <option value="">-- All --</option>
          <option value="IVI10001">IVICT</option>
          <option value="SHI30001">SSFC</option>
        </select>
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
      ) : !Array.isArray(data) || data.length === 0 ? (
        <p style={{ textAlign: 'center' }}>
          ❗ไม่พบข้อมูล หรือข้อมูลผิดพลาด กรุณาตรวจสอบช่วงวันที่ / 未找到資料或資料錯誤
        </p>
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

export default Aapq360;