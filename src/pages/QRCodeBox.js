import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function QRCodeBox() {
  const calculateExpireDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    d.setFullYear(d.getFullYear() + 10);
    return d.toLocaleDateString('en-CA');
  };

  const todayStr = new Date().toLocaleDateString('en-CA');

  const [formData, setFormData] = useState({
    boxName: '',
    category: '',
    description: '',
    creator: '',
    date: todayStr,
    expireDate: calculateExpireDate(todayStr)
  });

  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedYear, setSelectedYear] = useState('ALL');
  
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverPdf, setHoverPdf] = useState(false);
  const [hoverExcel, setHoverExcel] = useState(false);
  const qrRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://192.168.111.19:3001/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setFormData({
        ...formData,
        date: value,
        expireDate: calculateExpireDate(value)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getQRCodeString = () => {
    if (!formData.boxName && !formData.category) return 'THAI SHINKONG BOX SYSTEM';
    return `Company: ThaiShinkong
Box Name: ${formData.boxName || '-'}
Category: ${formData.category || '-'}
Description: ${formData.description || '-'}
Creator: ${formData.creator || '-'}
Storage Date: ${formData.date || '-'}
Expire Date: ${formData.expireDate || '-'}`;
  };

  const handleSaveToHistory = async (e) => {
    e.preventDefault();
    if (!formData.boxName) return alert('กรุณากรอกชื่อกล่อง / Please enter box name');

    try {
      if (editingId) {
        const response = await fetch(`http://192.168.111.19:3001/api/history/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert('อัปเดตข้อมูลสำเร็จ!');
          setEditingId(null);
          setFormData({ boxName: '', category: '', description: '', creator: '', date: todayStr, expireDate: calculateExpireDate(todayStr) });
          fetchHistory();
        }
      } else {
        const response = await fetch('http://192.168.111.19:3001/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert('บันทึกข้อมูลลง Server สำเร็จ!');
          setFormData({ boxName: '', category: '', description: '', creator: '', date: todayStr, expireDate: calculateExpireDate(todayStr) });
          fetchHistory();
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('ไม่สามารถเชื่อมต่อกับ Server ได้');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`http://192.168.111.19:3001/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      boxName: item.boxName || '',
      category: item.category || '',
      description: item.description || '',
      creator: item.creator || '',
      date: item.date || todayStr,
      expireDate: item.expireDate || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintQRClick = (item) => {
    setFormData({
      boxName: item.boxName || '',
      category: item.category || '',
      description: item.description || '',
      creator: item.creator || '',
      date: item.date || todayStr,
      expireDate: item.expireDate || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadPDF = async () => {
    const element = qrRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 210; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (297 - imgWidth) / 2;
      const y = (210 - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`QRCode_Box_${formData.boxName || 'Document'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('เกิดข้อผิดพลาดในการสร้าง PDF');
    }
  };

  // ฟังก์ชันดาวน์โหลดรายงานเป็น Excel (CSV Format รองรับภาษาไทย UTF-8)
  const exportToExcel = () => {
    if (filteredHistory.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออกรายงาน');
      return;
    }

    // สร้างหัวตาราง
    const headers = ['ID', 'Box Name', 'Category', 'Description', 'Creator', 'Storage Date', 'Expire Date'];
    const rows = filteredHistory.map(item => [
      item.id,
      `"${(item.boxName || '').replace(/"/g, '""')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      `"${(item.creator || '').replace(/"/g, '""')}"`,
      item.date,
      item.expireDate
    ]);

    let csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Box_Report_${selectedYear}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableYears = ['ALL', ...new Set(history.map(item => item.date ? item.date.substring(0, 4) : ''))].filter(Boolean);

  const filteredHistory = history.filter(item => {
    if (selectedYear === 'ALL') return true;
    return item.date && item.date.startsWith(selectedYear);
  });

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", padding: '20px', maxWidth: '1100px', margin: 'auto', color: '#1e293b' }}>
      
      {/* หัวข้อหน้า */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
          📦 THAISHINKONG QR CODE GENERATOR
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          ระบบสร้างป้าย QR Code สำหรับติดกล่องเก็บเอกสาร (เชื่อมต่อ Server กลาง)
        </p>
      </div>

      {/* คอนเทนเนอร์หลัก (Grid 2 ฝั่ง) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        
        {/* ฝั่งซ้าย: ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSaveToHistory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: editingId ? '#d97706' : '#16a34a' }}>
              {editingId ? `กำลังแก้ไขข้อมูล ID: ${editingId}` : '📝 สร้างรายการใหม่'}
            </span>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ boxName: '', category: '', description: '', creator: '', date: todayStr, expireDate: calculateExpireDate(todayStr) }); }} style={{ background: '#cbd5e1', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                ยกเลิกแก้ไข
              </button>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>ชื่อกล่อง / รหัสกล่อง</label>
            <input type="text" name="boxName" maxLength={40} value={formData.boxName} onChange={handleChange} required placeholder="เช่น กล่องบัญชี 2025 - เล่ม 1" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>หมวดหมู่เอกสาร</label>
            <input type="text" name="category" maxLength={15} value={formData.category} onChange={handleChange} placeholder="เช่น ACC / FIN / HR" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>รายละเอียดข้างใน</label>
            <textarea name="description" maxLength={100} value={formData.description} onChange={handleChange} rows="3" placeholder="ระบุเอกสารย่อยด้านในคร่าวๆ..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>ผู้จัดทำ</label>
              <input type="text" name="creator" maxLength={25} value={formData.creator} onChange={handleChange} placeholder="ชื่อผู้บันทึก" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>วันที่จัดเก็บ</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#e11d48' }}>วันสิ้นสุดเก็บเอกสาร (+10 ปี)</label>
            <input type="date" name="expireDate" value={formData.expireDate} onChange={handleChange} style={{ ...inputStyle, background: '#fff1f2', borderColor: '#fecdd3', color: '#9f1239' }} />
          </div>

          <button type="submit" onMouseEnter={() => setHoverSubmit(true)} onMouseLeave={() => setHoverSubmit(false)} style={{ background: hoverSubmit ? (editingId ? '#b45309' : '#15803d') : (editingId ? '#d97706' : '#16a34a'), color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s ease', marginTop: '4px' }}>
            {editingId ? '💾 บันทึกการแก้ไข (Update)' : '💾 บันทึกข้อมูลลง Server (Save Data)'}
          </button>
        </form>

        {/* ฝั่งขวา: พรีวิวป้าย QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#475569' }}>✨ Box Label Preview</div>
          
          <div ref={qrRef} style={{ background: '#ffffff', padding: '28px', borderRadius: '14px', border: '3px solid #0f172a', display: 'flex', alignItems: 'center', gap: '24px', width: '540px', boxSizing: 'border-box', boxShadow: '0 6px 12px -2px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <QRCodeSVG value={getQRCodeString()} size={150} level={"H"} includeMargin={true} />
              <span style={{ fontSize: '10px', color: '#475569', marginTop: '6px', fontWeight: '800', letterSpacing: '0.5px' }}>SCAN ME</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>THAI SHINKONG CO., LTD.</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', background: '#f1f5f9', color: '#334155', padding: '3px 10px', borderRadius: '6px', marginTop: '2px', display: 'inline-block', width: 'fit-content' }}>
                {formData.category || 'CATEGORY'}
              </div>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formData.boxName || 'BOX NAME'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', height: '32px', overflow: 'hidden', lineHeight: '1.4' }}>
                {formData.description || 'Description details...'}
              </div>
              <div style={{ fontSize: '10px', color: '#334155', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div><b>Creator:</b> {formData.creator || '-'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><b>Storage Date:</b> {formData.date}</span>
                  <span style={{ color: '#e11d48' }}><b>Expire:</b> {formData.expireDate}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={downloadPDF} onMouseEnter={() => setHoverPdf(true)} onMouseLeave={() => setHoverPdf(false)} style={{ background: hoverPdf ? '#1d4ed8' : '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', marginTop: '20px', width: '100%', maxWidth: '300px', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* ส่วนตารางรายงานประวัติ (Report Table) ด้านล่าง */}
      <div style={{ marginTop: '40px', background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            📊 รายงานประวัติการบันทึกกล่องเอกสาร (Server Database)
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {/* ปุ่ม Export Excel */}
            <button 
              onClick={exportToExcel}
              onMouseEnter={() => setHoverExcel(true)}
              onMouseLeave={() => setHoverExcel(false)}
              style={{
                background: hoverExcel ? '#15803d' : '#16a34a',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Export to Excel
            </button>

            {/* ตัวเลือกกรองตามปี */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>เลือกดูตามปี:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600' }}>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year === 'ALL' ? 'ทั้งหมด (All Years)' : year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ตารางแสดงผล */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px' }}>รหัส / ชื่อกล่อง</th>
                <th style={{ padding: '12px' }}>หมวดหมู่</th>
                <th style={{ padding: '12px' }}>ผู้จัดทำ</th>
                <th style={{ padding: '12px' }}>วันที่จัดเก็บ</th>
                <th style={{ padding: '12px' }}>วันหมดอายุ</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>จัดการ (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    ไม่พบข้อมูลประวัติการบันทึกในระบบ
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{item.boxName}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', color: '#334155' }}>
                        {item.category || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{item.creator || '-'}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{item.date}</td>
                    <td style={{ padding: '12px', color: '#e11d48', fontWeight: '600' }}>{item.expireDate}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button title="พิมพ์ QR ใหม่" onClick={() => handlePrintQRClick(item)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                          🖨️ พิมพ์
                        </button>
                        <button title="แก้ไข" onClick={() => handleEditClick(item)} style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#d97706', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                          ✏️ แก้ไข
                        </button>
                        <button title="ลบ" onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  fontSize: '14px',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box'
};