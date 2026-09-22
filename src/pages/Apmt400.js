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

  // ✅ ฟังก์ชันช่วย Parse วันที่ (รองรับทั้ง YYYY-MM-DD และ DD/MM/YYYY)
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

  // ✅ ฟังก์ชันคำนวณสถานะสีตามกฎ
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
    'Item Name',
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
    row.TOTAL_PMDB006,
    row.IMAAL003,
    row.PMDA022,
    row.PMDLDOCNO,
    row.PMDLDOCDT,
    row.OOFF013,
    row.TOTAL_PMDO033,
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
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 5, maxWidth: '100%', margin: 'auto' }}>

      <h2 style={{ fontSize: 20, color: '#444', textAlign: 'center', marginBottom: 6 }}>
        📝 APMT400 REPORT 📝
      </h2>

      <hr style={{ width: '100%', maxWidth: 800, margin: '10px auto 15px', borderColor: '#ccc' }} />

      {/* Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>

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
          <label>Status:</label>
          <select 
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: '6px 10px', marginLeft: 6 }}
          >
            <option value="">-- All --</option>
            <option value="NoPo">Pending PO</option>
            <option value="NoAp">Pending AP</option>
            <option value="NoWriteOff">Pending Write-off</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>Color Warning:</label>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            style={{ padding: '6px 10px', marginLeft: 6 }}
          >
            <option value="">-- All Colors --</option>
            <option value="red">🔴 ถึง/เลยกำหนดส่ง (Overdue)</option>
            <option value="orange">🟠 ใกล้ถึงกำหนดใน 7 วัน (Near Due)</option>
            <option value="none">⚪ ปกติ (Normal)</option>
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

      {/* ✅ กล่องคำอธิบายกฎของสี (บรรทัดเดียวแบบแนวนอน) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 20, 
        marginBottom: 15, 
        fontSize: '12px', 
        whiteSpace: 'nowrap',
        backgroundColor: '#f9f9f9',
        padding: '6px 15px',
        borderRadius: '4px',
        border: '1px solid #eee',
        width: 'fit-content',
        margin: '0 auto 15px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 12, height: 12, backgroundColor: '#ffcccc', border: '1px solid #ff9999', display: 'inline-block', borderRadius: 2 }}></span>
          <span><strong>สีแดง:</strong> Receipt Date ว่าง + ถึง/เลย Expected Date</span>
        </div>

        <span style={{ color: '#ccc' }}>|</span>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 12, height: 12, backgroundColor: '#ffe5b4', border: '1px solid #ffcc80', display: 'inline-block', borderRadius: 2 }}></span>
          <span><strong>สีส้ม:</strong> Receipt Date ว่าง + เหลือ ≤ 7 วันจะถึง Expected Date</span>
        </div>

        <span style={{ color: '#ccc' }}>|</span>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: 12, height: 12, backgroundColor: '#ffffff', border: '1px solid #ccc', display: 'inline-block', borderRadius: 2 }}></span>
          <span><strong>ไม่มีสี:</strong> มี Receipt Date หรือ เหลือเวลา &gt; 7 วัน</span>
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>⏳ กำลังโหลดข้อมูล / 正在載入資料...</p>
      ) : !Array.isArray(filteredData) || filteredData.length === 0 ? (
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
              {filteredData.map((row, idx) => {
                const colorStatus = getRowColorStatus(row);

                let bgColor = idx % 2 === 0 ? '#fff' : '#fafafa';
                if (colorStatus === 'red') {
                  bgColor = '#ffcccc';
                } else if (colorStatus === 'orange') {
                  bgColor = '#ffe5b4';
                }

                return (
                  <tr key={idx} style={{ backgroundColor: bgColor }}>
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
                );
              })}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default Apmt400;