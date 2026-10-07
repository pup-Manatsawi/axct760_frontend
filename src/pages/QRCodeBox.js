import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// คำแปลภาษา (Translations)
const translations = {
  TH: {
    title: '📦 THAISHINKONG QR CODE GENERATOR',
    subtitle: 'ระบบสร้างป้าย QR Code สำหรับติดกล่องเก็บเอกสาร',
    newEntry: '📝 สร้างรายการใหม่',
    editEntry: 'กำลังแก้ไขข้อมูล ID:',
    viewingMode: '👁️ โหมดดูข้อมูลป้าย (ล็อคการแก้ไข)',
    cancelView: '✖️ กลับสู่โหมดสร้างปกติ',
    cancelEdit: 'ยกเลิกแก้ไข',
    boxName: 'ชื่อกล่อง / รหัสกล่อง',
    boxNamePlaceholder: 'เช่น กล่องบัญชี 2025 - เล่ม 1',
    category: 'หมวดหมู่เอกสาร',
    categoryPlaceholder: 'เช่น ACC / FIN / HR',
    description: 'รายละเอียดข้างใน',
    descriptionPlaceholder: 'ระบุเอกสารย่อยด้านในคร่าวๆ...',
    creator: 'ผู้จัดทำ',
    creatorPlaceholder: 'ชื่อผู้บันทึก',
    date: 'วันที่จัดเก็บ',
    expireDate: 'วันสิ้นสุดเก็บเอกสาร (+10 ปี)',
    saveNew: '💾 บันทึกข้อมูล',
    saveUpdate: '💾 บันทึกการแก้ไข (Update)',
    previewTitle: '✨ ตัวอย่างหน้าจอ',
    scanMe: 'SCAN ME',
    downloadPdf: '📥 Download PDF',
    reportTitle: '📊 รายงานประวัติการบันทึกกล่องเอกสาร',
    exportExcel: '📊 Export to Excel',
    filterYear: 'เลือกดูตามปี:',
    allYears: 'ทั้งหมด (All Years)',
    colBox: 'รหัส / ชื่อกล่อง',
    colCategory: 'หมวดหมู่',
    colCreator: 'ผู้จัดทำ',
    colDate: 'วันที่จัดเก็บ',
    colExpire: 'วันหมดอายุ',
    colActions: 'จัดการ (Actions)',
    print: '🖨️ พิมพ์',
    edit: '✏️ แก้ไข',
    delete: '🗑️ ลบ',
    noData: 'ไม่พบข้อมูลประวัติการบันทึกในระบบ',
    alertBoxName: 'กรุณากรอกชื่อกล่อง / Please enter box name',
    alertCategory: 'กรุณากรอกหมวดหมู่เอกสาร / Please enter category',
    alertCreator: 'กรุณากรอกชื่อผู้จัดทำ / Please enter creator',
    confirmDelete: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
    successSave: 'บันทึกข้อมูลลง Server สำเร็จ!',
    successUpdate: 'อัปเดตข้อมูลสำเร็จ!',
    errorConn: 'ไม่สามารถเชื่อมต่อกับ Server ได้',
    errorPdf: 'เกิดข้อผิดพลาดในการสร้าง PDF',
    errorExcel: 'ไม่มีข้อมูลสำหรับส่งออกรายงาน'
  },
  EN: {
    title: '📦 THAISHINKONG QR CODE GENERATOR',
    subtitle: 'QR Code Label Generator System for Document Storage Boxes',
    newEntry: '📝 Create New Entry',
    editEntry: 'Editing Entry ID:',
    viewingMode: '👁️ Viewing Label Mode (Locked)',
    cancelView: '✖️ Back to Create Mode',
    cancelEdit: 'Cancel Edit',
    boxName: 'Box Name / Box ID',
    boxNamePlaceholder: 'e.g., ACC Box 2025 - Vol. 1',
    category: 'Document Category',
    categoryPlaceholder: 'e.g., ACC / FIN / HR',
    description: 'Internal Description',
    descriptionPlaceholder: 'Specify sub-documents inside...',
    creator: 'Creator',
    creatorPlaceholder: 'Recorder name',
    date: 'Storage Date',
    expireDate: 'Expire Date (+10 Years)',
    saveNew: '💾 Save Data',
    saveUpdate: '💾 Save Update',
    previewTitle: '✨ Box Label Preview',
    scanMe: 'SCAN ME',
    downloadPdf: '📥 Download PDF',
    reportTitle: '📊 Document Box History Report',
    exportExcel: '📊 Export to Excel',
    filterYear: 'Filter by Year:',
    allYears: 'All Years',
    colBox: 'Box Name / ID',
    colCategory: 'Category',
    colCreator: 'Creator',
    colDate: 'Storage Date',
    colExpire: 'Expire Date',
    colActions: 'Actions',
    print: '🖨️ Print',
    edit: '✏️ Edit',
    delete: '🗑️ Delete',
    noData: 'No history records found in the system',
    alertBoxName: 'Please enter box name',
    alertCategory: 'Please enter document category',
    alertCreator: 'Please enter creator name',
    confirmDelete: 'Are you sure you want to delete this item?',
    successSave: 'Data saved to server successfully!',
    successUpdate: 'Data updated successfully!',
    errorConn: 'Unable to connect to the server',
    errorPdf: 'Error generating PDF',
    errorExcel: 'No data available for export'
  },
  TW: {
    title: '📦 泰新興 QR CODE 生成器',
    subtitle: '文件檔案盒 QR Code 標籤生成系統',
    newEntry: '📝 建立新記錄',
    editEntry: '正在編輯記錄 ID:',
    viewingMode: '👁️ 檢視標籤模式 (唯讀)',
    cancelView: '✖️ 返回建立模式',
    cancelEdit: '取消編輯',
    boxName: '箱號 / 箱子名稱',
    boxNamePlaceholder: '例如：會計箱 2025 - 第 1 冊',
    category: '文件類別',
    categoryPlaceholder: '例如：ACC / FIN / HR',
    description: '內容詳細說明',
    descriptionPlaceholder: '請簡述內部文件內容...',
    creator: '製作者',
    creatorPlaceholder: '記錄人姓名',
    date: '存放日期',
    expireDate: '保存到期日 (+10年)',
    saveNew: '💾 儲存資料',
    saveUpdate: '💾 儲存更新',
    previewTitle: '✨ 標籤預覽',
    scanMe: '掃描我',
    downloadPdf: '📥 下載 PDF',
    reportTitle: '📊 文件箱歷史記錄報告',
    exportExcel: '📊 匯出 Excel',
    filterYear: '依年份篩選：',
    allYears: '全部年份',
    colBox: '箱號 / 名稱',
    colCategory: '類別',
    colCreator: '製作者',
    colDate: '存放日期',
    colExpire: '到期日',
    colActions: '操作',
    print: '🖨️ 編輯',
    edit: '✏️ 編輯',
    delete: '🗑️ 刪除',
    noData: '系統中找不到歷史記錄',
    alertBoxName: '請輸入箱子名稱',
    alertCategory: '請輸入文件類別',
    alertCreator: '請輸入製作者姓名',
    confirmDelete: '您確定要刪除此項目嗎？',
    successSave: '資料成功儲存至伺服器！',
    successUpdate: '資料更新成功！',
    errorConn: '無法連接到伺服器',
    errorPdf: '生成 PDF 時發生錯誤',
    errorExcel: '沒有可匯出的資料'
  }
};

export default function QRCodeBox() {
  const [lang, setLang] = useState('TH');
  const t = translations[lang];

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

  const [touched, setTouched] = useState({
    boxName: false,
    category: false,
    creator: false
  });

  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedYear, setSelectedYear] = useState('ALL');
  
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverPdf, setHoverPdf] = useState(false);
  const [hoverExcel, setHoverExcel] = useState(false);
  
  const pdfRef = useRef(null);

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
    if (isViewOnly) return;
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
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
    if (isViewOnly) return;

    setTouched({ boxName: true, category: true, creator: true });

    if (!formData.boxName) return alert(t.alertBoxName);
    if (!formData.category) return alert(t.alertCategory);
    if (!formData.creator) return alert(t.alertCreator);

    try {
      if (editingId) {
        const response = await fetch(`http://192.168.111.19:3001/api/history/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert(t.successUpdate);
          setEditingId(null);
          setFormData({ boxName: '', category: '', description: '', creator: '', date: todayStr, expireDate: calculateExpireDate(todayStr) });
          setTouched({ boxName: false, category: false, creator: false });
          fetchHistory();
        }
      } else {
        const response = await fetch('http://192.168.111.19:3001/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          alert(t.successSave);
          setFormData({ boxName: '', category: '', description: '', creator: '', date: todayStr, expireDate: calculateExpireDate(todayStr) });
          setTouched({ boxName: false, category: false, creator: false });
          fetchHistory();
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert(t.errorConn);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
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
    setIsViewOnly(false);
    setFormData({
      boxName: item.boxName || '',
      category: item.category || '',
      description: item.description || '',
      creator: item.creator || '',
      date: item.date || todayStr,
      expireDate: item.expireDate || ''
    });
    setTouched({ boxName: false, category: false, creator: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintQRClick = (item) => {
    setEditingId(null);
    setIsViewOnly(true);
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
    const element = pdfRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 285; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (297 - imgWidth) / 2;
      const y = (210 - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`QRCode_Box_${formData.boxName || 'Document'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t.errorPdf);
    }
  };

  const exportToExcel = () => {
    if (filteredHistory.length === 0) {
      alert(t.errorExcel);
      return;
    }

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

  const isBoxNameError = touched.boxName && !formData.boxName;
  const isCategoryError = touched.category && !formData.category;
  const isCreatorError = touched.creator && !formData.creator;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", padding: '20px', maxWidth: '1500px', margin: 'auto', color: '#1e293b' }}>
      
      {/* ส่วนเลือกภาษา */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px', gap: '8px' }}>
        <button onClick={() => setLang('TH')} style={{ padding: '5px 10px', borderRadius: '6px', border: lang === 'TH' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: lang === 'TH' ? '#eff6ff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>ไทย</button>
        <button onClick={() => setLang('EN')} style={{ padding: '5px 10px', borderRadius: '6px', border: lang === 'EN' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: lang === 'EN' ? '#eff6ff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>EN</button>
        <button onClick={() => setLang('TW')} style={{ padding: '5px 10px', borderRadius: '6px', border: lang === 'TW' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: lang === 'TW' ? '#eff6ff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>中文</button>
      </div>

      {/* หัวข้อหน้า */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          {t.subtitle}
        </p>
      </div>

      {/* คอนเทนเนอร์หลัก (Grid 2 ฝั่ง) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '25px', background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        
        {/* ฝั่งซ้าย: ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSaveToHistory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: isViewOnly ? '#2563eb' : (editingId ? '#d97706' : '#16a34a') }}>
              {isViewOnly ? t.viewingMode : (editingId ? `${t.editEntry} ${editingId}` : t.newEntry)}
            </span>
            {(editingId || isViewOnly) && (
              <button type="button" onClick={() => { setEditingId(null); setIsViewOnly(false); setFormData({ boxName: '', category: '', description: '', creator: '', date: todayStr, expireDate: calculateExpireDate(todayStr) }); setTouched({ boxName: false, category: false, creator: false }); }} style={{ background: '#cbd5e1', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                {isViewOnly ? t.cancelView : t.cancelEdit}
              </button>
            )}
          </div>

          {/* ชื่อกล่อง */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: isBoxNameError ? '#dc2626' : '#334155' }}>
              {t.boxName} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input 
              type="text" 
              name="boxName" 
              maxLength={40} 
              value={formData.boxName} 
              onChange={handleChange} 
              readOnly={isViewOnly}
              placeholder={t.boxNamePlaceholder} 
              style={{
                ...inputStyle,
                borderColor: isBoxNameError ? '#dc2626' : '#cbd5e1',
                backgroundColor: isViewOnly ? '#e2e8f0' : (isBoxNameError ? '#fef2f2' : '#f8fafc'),
                cursor: isViewOnly ? 'not-allowed' : 'text'
              }} 
            />
            {isBoxNameError && <span style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px', display: 'block' }}>* จำเป็นต้องกรอกข้อมูลนี้</span>}
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: isCategoryError ? '#dc2626' : '#334155' }}>
              {t.category} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input 
              type="text" 
              name="category" 
              maxLength={15} 
              value={formData.category} 
              onChange={handleChange} 
              readOnly={isViewOnly}
              placeholder={t.categoryPlaceholder} 
              style={{
                ...inputStyle,
                borderColor: isCategoryError ? '#dc2626' : '#cbd5e1',
                backgroundColor: isViewOnly ? '#e2e8f0' : (isCategoryError ? '#fef2f2' : '#f8fafc'),
                cursor: isViewOnly ? 'not-allowed' : 'text'
              }} 
            />
            {isCategoryError && <span style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px', display: 'block' }}>* จำเป็นต้องกรอกข้อมูลนี้</span>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>{t.description}</label>
            <textarea name="description" maxLength={300} value={formData.description} onChange={handleChange} readOnly={isViewOnly} rows="4" placeholder={t.descriptionPlaceholder} style={{ ...inputStyle, resize: 'vertical', backgroundColor: isViewOnly ? '#e2e8f0' : '#f8fafc', cursor: isViewOnly ? 'not-allowed' : 'text' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: isCreatorError ? '#dc2626' : '#334155' }}>
                {t.creator} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input 
                type="text" 
                name="creator" 
                maxLength={25} 
                value={formData.creator} 
                onChange={handleChange} 
                readOnly={isViewOnly}
                placeholder={t.creatorPlaceholder} 
                style={{
                  ...inputStyle,
                  borderColor: isCreatorError ? '#dc2626' : '#cbd5e1',
                  backgroundColor: isViewOnly ? '#e2e8f0' : (isCreatorError ? '#fef2f2' : '#f8fafc'),
                  cursor: isViewOnly ? 'not-allowed' : 'text'
                }} 
              />
              {isCreatorError && <span style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px', display: 'block' }}>* จำเป็น</span>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>{t.date}</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} readOnly={isViewOnly} style={{ ...inputStyle, backgroundColor: isViewOnly ? '#e2e8f0' : '#f8fafc', cursor: isViewOnly ? 'not-allowed' : 'text' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#e11d48' }}>{t.expireDate}</label>
            <input type="date" name="expireDate" value={formData.expireDate} onChange={handleChange} readOnly={isViewOnly} style={{ ...inputStyle, background: isViewOnly ? '#e2e8f0' : '#fff1f2', borderColor: '#fecdd3', color: '#9f1239', cursor: isViewOnly ? 'not-allowed' : 'text' }} />
          </div>

          {!isViewOnly && (
            <button type="submit" onMouseEnter={() => setHoverSubmit(true)} onMouseLeave={() => setHoverSubmit(false)} style={{ background: hoverSubmit ? (editingId ? '#b45309' : '#15803d') : (editingId ? '#d97706' : '#16a34a'), color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s ease', marginTop: '4px' }}>
              {editingId ? t.saveUpdate : t.saveNew}
            </button>
          )}
        </form>

        {/* ฝั่งขวา: พรีวิวป้าย QR Code ในหน้าจอ */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#475569' }}>{t.previewTitle}</div>
          
          <div style={{ width: '100%', maxWidth: '470px', height: '240px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ transform: 'scale(0.5125)', transformOrigin: 'top center', position: 'absolute', top: 0, width: '900px' }}>
              <div style={{ background: '#ffffff', padding: '50px', borderRadius: '24px', border: '3px solid #0f172a', display: 'flex', alignItems: 'center', gap: '50px', width: '900px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <QRCodeSVG value={getQRCodeString()} size={280} level={"H"} includeMargin={true} />
                  <span style={{ fontSize: '16px', color: '#475569', marginTop: '14px', fontWeight: '900', letterSpacing: '2px' }}>{t.scanMe}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <img src="tsiclogo.png" alt="Logo" style={{ height: '52px', objectFit: 'contain' }} />
                    <div style={{ fontSize: '26px', fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>THAI SHINKONG CO., LTD.</div>
                  </div>

                  <div style={{ fontSize: '20px', fontWeight: '800', background: '#f1f5f9', color: '#1e293b', padding: '8px 18px', borderRadius: '8px', marginBottom: '16px', display: 'inline-block', width: 'fit-content', border: '2px solid #cbd5e1' }}>
                    {formData.category || 'CATEGORY'}
                  </div>
                  <div style={{ fontSize: '34px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1.2' }}>
                    {formData.boxName || 'BOX NAME'}
                  </div>
                  {/*<div style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '24px', maxHeight: '130px', overflow: 'hidden', lineHeight: '1.5' }}>
                    {formData.description || 'Description details...'}
                  </div>*/}
                  <div style={{ fontSize: '17px', color: '#0f172a', borderTop: '2px solid #0f172a', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '800' }}>
                    <div><b>Creator:</b> {formData.creator || '-'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><b>Storage Date:</b> {formData.date}</span>
                      <span style={{ color: '#e11d48' }}><b>Expire Date:</b> {formData.expireDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={downloadPDF} onMouseEnter={() => setHoverPdf(true)} onMouseLeave={() => setHoverPdf(false)} style={{ background: hoverPdf ? '#1d4ed8' : '#2563eb', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', marginTop: '16px', width: '100%', maxWidth: '280px', fontWeight: '700', fontSize: '13px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {t.downloadPdf}
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* ส่วนซ่อนสำหรับสร้าง PDF (ตัวหนังสือใหญ่สะใจเต็ม A4) */}
      {/* ========================================= */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={pdfRef} style={{ background: '#ffffff', padding: '50px', borderRadius: '24px', border: '3px solid #0f172a', display: 'flex', alignItems: 'center', gap: '50px', width: '900px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <QRCodeSVG value={getQRCodeString()} size={280} level={"H"} includeMargin={true} />
            <span style={{ fontSize: '16px', color: '#475569', marginTop: '14px', fontWeight: '900', letterSpacing: '2px' }}>{t.scanMe}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="tsiclogo.png" alt="Logo" style={{ height: '52px', objectFit: 'contain' }} />
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>THAI SHINKONG CO., LTD.</div>
            </div>

            <div style={{ fontSize: '20px', fontWeight: '800', background: '#f1f5f9', color: '#1e293b', padding: '8px 18px', borderRadius: '8px', marginBottom: '16px', display: 'inline-block', width: 'fit-content', border: '2px solid #cbd5e1' }}>
              {formData.category || 'CATEGORY'}
            </div>
            <div style={{ fontSize: '34px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1.2' }}>
              {formData.boxName || 'BOX NAME'}
            </div>
           {/* <div style={{ fontSize: '18px', fontWeight: '600', color: '#334155', marginBottom: '24px', maxHeight: '130px', overflow: 'hidden', lineHeight: '1.5' }}>
              {formData.description || 'Description details...'}
            </div>*/}
            <div style={{ fontSize: '17px', color: '#0f172a', borderTop: '2px solid #0f172a', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '800' }}>
              <div><b>Creator:</b> {formData.creator || '-'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><b>Storage Date:</b> {formData.date}</span>
                <span style={{ color: '#e11d48' }}><b>Expire Date:</b> {formData.expireDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนตารางรายงานประวัติ (Report Table) */}
      <div style={{ marginTop: '40px', background: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            {t.reportTitle}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
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
              {t.exportExcel}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>{t.filterYear}</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600' }}>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year === 'ALL' ? t.allYears : year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px' }}>{t.colBox}</th>
                <th style={{ padding: '12px' }}>{t.colCategory}</th>
                <th style={{ padding: '12px' }}>{t.colCreator}</th>
                <th style={{ padding: '12px' }}>{t.colDate}</th>
                <th style={{ padding: '12px' }}>{t.colExpire}</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>{t.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    {t.noData}
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
                        <button title="Print" onClick={() => handlePrintQRClick(item)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {t.print}
                        </button>
                        <button title="Edit" onClick={() => handleEditClick(item)} style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#d97706', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {t.edit}
                        </button>
                        <button title="Delete" onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {t.delete}
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