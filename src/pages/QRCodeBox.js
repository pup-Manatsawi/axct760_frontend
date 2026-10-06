import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // เปลี่ยนมาใช้ QRCodeSVG เพื่อความคมชัดระดับเวกเตอร์
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
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverPdf, setHoverPdf] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('qr_box_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
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
    return `Company: ThaiShinkong
Box Name: ${formData.boxName}
Category: ${formData.category}
Description: ${formData.description}
Creator: ${formData.creator}
Storage Date: ${formData.date}
Expire Date: ${formData.expireDate}`;
  };

  const handleSaveToHistory = (e) => {
    e.preventDefault();
    if (!formData.boxName) return alert('กรุณากรอกชื่อกล่อง / Please enter box name');

    const newItem = { ...formData, id: Date.now() };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('qr_box_history', JSON.stringify(updatedHistory));
    alert('บันทึกข้อมูลสำเร็จ! / Saved successfully!');
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
      alert('เกิดข้อผิดพลาดในการสร้าง PDF / Error generating PDF');
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", padding: '20px', maxWidth: '1100px', margin: 'auto', color: '#1e293b' }}>
      
      {/* หัวข้อหน้า */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
          📦 THAISHINKONG QR CODE GENERATOR
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          ระบบสร้างป้าย QR Code สำหรับติดกล่องเก็บเอกสาร (Landscape PDF)
        </p>
      </div>

      {/* คอนเทนเนอร์หลัก (Grid 2 ฝั่ง) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '25px', 
        background: '#ffffff', 
        padding: '30px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f1f5f9'
      }}>
        
        {/* ฝั่งซ้าย: ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSaveToHistory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              ชื่อกล่อง / รหัสกล่อง <span style={{ color: '#64748b', fontWeight: '400' }}>/ Box Name (สูงสุด 40 ตัว)</span>
            </label>
            <input 
              type="text" 
              name="boxName" 
              maxLength={40}
              value={formData.boxName} 
              onChange={handleChange} 
              required
              placeholder="เช่น กล่องบัญชี 2025 - เล่ม 1"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              หมวดหมู่เอกสาร <span style={{ color: '#64748b', fontWeight: '400' }}>/ Category (สูงสุด 15 ตัว)</span>
            </label>
            <input 
              type="text" 
              name="category" 
              maxLength={15}
              value={formData.category} 
              onChange={handleChange} 
              placeholder="เช่น ACC / FIN / HR"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              รายละเอียดข้างใน <span style={{ color: '#64748b', fontWeight: '400' }}>/ Description (สูงสุด 100 ตัว)</span>
            </label>
            <textarea 
              name="description" 
              maxLength={100}
              value={formData.description} 
              onChange={handleChange} 
              rows="3"
              placeholder="ระบุเอกสารย่อยด้านในคร่าวๆ..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                ผู้จัดทำ <span style={{ color: '#64748b', fontWeight: '400' }}>/ Creator (สูงสุด 25 ตัว)</span>
              </label>
              <input 
                type="text" 
                name="creator" 
                maxLength={25}
                value={formData.creator} 
                onChange={handleChange} 
                placeholder="ชื่อผู้บันทึก"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                วันที่จัดเก็บ <span style={{ color: '#64748b', fontWeight: '400' }}>/ Storage Date</span>
              </label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#e11d48' }}>
              วันสิ้นสุดเก็บเอกสาร (+10 ปี อัตโนมัติ) <span style={{ color: '#9f1239', fontWeight: '400' }}>/ Expire Date</span>
            </label>
            <input 
              type="date" 
              name="expireDate" 
              value={formData.expireDate} 
              onChange={handleChange} 
              style={{ ...inputStyle, background: '#fff1f2', borderColor: '#fecdd3', color: '#9f1239' }}
            />
          </div>

          <button 
            type="submit"
            onMouseEnter={() => setHoverSubmit(true)}
            onMouseLeave={() => setHoverSubmit(false)}
            style={{
              background: hoverSubmit ? '#15803d' : '#16a34a',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
              transition: 'all 0.2s ease',
              marginTop: '4px'
            }}
          >
            💾 บันทึกข้อมูลลงระบบ / Save Data
          </button>
        </form>

        {/* ฝั่งขวา: พรีวิวป้าย QR Code */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8fafc', 
          padding: '24px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0' 
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#475569' }}>
            ✨ Box Label Preview
          </div>
          
          {/* ป้าย QR Code สำหรับแปลงเป็น PDF */}
          <div 
            ref={qrRef} 
            style={{ 
              background: '#ffffff', 
              padding: '28px', 
              borderRadius: '14px', 
              border: '3px solid #0f172a', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              width: '540px', 
              boxSizing: 'border-box',
              boxShadow: '0 6px 12px -2px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* ฝั่งซ้ายของป้าย: ใช้ QRCodeSVG คมชัดระดับเวกเตอร์ */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <QRCodeSVG 
                value={getQRCodeString()} 
                size={150}
                level={"H"}
                includeMargin={true}
              />
              <span style={{ fontSize: '10px', color: '#475569', marginTop: '6px', fontWeight: '800', letterSpacing: '0.5px' }}>SCAN ME</span>
            </div>

            {/* ฝั่งขวาของป้าย: ข้อมูลรายละเอียด */}
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', whiteSpace: 'nowrap' }}>
                <img 
                  src="/tsiclogo.png" 
                  alt="ThaiShinkong Logo" 
                  style={{ height: '24px', objectFit: 'contain', flexShrink: 0 }} 
                />
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  THAI SHINKONG CO., LTD.
                </div>
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

          {/* ปุ่มดาวน์โหลด PDF */}
          <button 
            onClick={downloadPDF}
            onMouseEnter={() => setHoverPdf(true)}
            onMouseLeave={() => setHoverPdf(false)}
            style={{
              background: hoverPdf ? '#1d4ed8' : '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop: '20px',
              width: '100%',
              maxWidth: '300px',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            📥 Download PDF
          </button>
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
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};