import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Axct201() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    fetch(`http://192.168.111.19:3001/api/axct201?month=${month}&year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setData([]);
        setLoading(false);
      });
  }, [month, year]);

  const exportToExcel = () => {
    if (data.length === 0) return alert('ไม่มีข้อมูลให้ดาวน์โหลด');

    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `AXCT201_${year}_${month}.xlsx`);
  };

  return (
       <div style={{ fontFamily: 'Arial, sans-serif', padding: 5, maxWidth: 'auto', margin: 'auto' }}>
      {/* แถวที่ 1: โลโก้และชื่อบริษัท */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
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

      {/* แถวที่ 2: ชื่อรายงาน */}
      <h2 style={{ fontSize: 20, color: '#444', textAlign: 'center', marginBottom: 6 }}>
        📝 AXCT201 REPORT 📝
      </h2>

      

      {/* แถวที่ 3: เส้นคั่นล่าง */}
      <hr style={{ width: '100%', maxWidth: 800, margin: '10px auto 30px', borderColor: '#ccc' }} />

      {/* ฟิลเตอร์และปุ่มดาวน์โหลด */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
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

      {/* แสดงผลข้อมูล */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>⏳ กำลังโหลดข้อมูล / 正在載入資料...</p>
      ) : data.length === 0 ? (
        <p style={{ textAlign: 'center' }}>❗ ไม่พบข้อมูล กรุณาตรวจสอบเดือนและปีอีกครั้ง / 未找到資料，請再次檢查月份和年份。</p>
      ) : (
        <div style={{  
          maxWidth: '100vw',
          maxHeight: '60vh', // ปรับความสูงให้เลื่อนใน div นี้ ไม่พึ่ง body
          overflowX: 'auto',
          overflowY: 'auto',
          border: '1px solid #ccc', // เพิ่มขอบให้ดูขอบเขตชัด
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    style={{
                       position: 'sticky', // 👈 ทำให้หัวตารางติดอยู่ด้านบน
                      top: 0,
                      backgroundColor: '#f0f0f0', // จำเป็น เพื่อให้หัวตารางมองเห็นเมื่อเลื่อน
                      border: '1px solid #ddd',
                      padding: '8px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      zIndex: 1 // ช่วยให้แสดงทับข้อมูลได้กรณีมีเนื้อหาซ้อนกัน
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
                  {row.map((value, i) => (
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

export default Axct201;