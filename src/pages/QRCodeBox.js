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
    filterCategory: 'หมวดหมู่:',
    allCategories: 'ทุกหมวดหมู่ (All Categories)',
    searchPlaceholder: '🔍 ค้นหาชื่อกล่อง, ผู้จัดทำ...',
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
    errorExcel: 'ไม่มีข้อมูลสำหรับส่งออกรายงาน',
    showing: 'แสดง',
    ofTotal: 'จากทั้งหมด',
    items: 'รายการ'
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
    filterCategory: 'Category:',
    allCategories: 'All Categories',
    searchPlaceholder: '🔍 Search box name, creator...',
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
    errorExcel: 'No data available for export',
    showing: 'Showing',
    ofTotal: 'of total',
    items: 'items'
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
    filterCategory: '類別：',
    allCategories: '全部類別',
    searchPlaceholder: '🔍 搜尋箱號、製作者...',
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
    errorExcel: '沒有可匯出的資料',
    showing: '顯示',
    ofTotal: '共',
    items: '筆記錄'
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
  
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;
  
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverPdf, setHoverPdf] = useState(false);
  const [hoverExcel, setHoverExcel] = useState(false);
  
  const pdfRef = useRef(null);
  const previewWrapperRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.48);
  const [previewHeight, setPreviewHeight] = useState(240);

  useEffect(() => {
    const updatePreviewSize = () => {
      if (previewWrapperRef.current) {
        const containerWidth = previewWrapperRef.current.clientWidth;
        const baseWidth = 900; 
        const baseHeight = 480; 
        const scale = containerWidth / baseWidth;
        setPreviewScale(scale);
        setPreviewHeight(baseHeight * scale);
      }
    };

    updatePreviewSize();
    const observer = new ResizeObserver(updatePreviewSize);
    if (previewWrapperRef.current) {
      observer.observe(previewWrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCategory, searchTerm]);

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
  const availableCategories = ['ALL', ...new Set(history.map(item => item.category ? item.category.trim() : ''))].filter(Boolean);

  const filteredHistory = history.filter(item => {
    const matchYear = selectedYear === 'ALL' || (item.date && item.date.startsWith(selectedYear));
    const matchCategory = selectedCategory === 'ALL' || (item.category && item.category.trim() === selectedCategory);
    
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || 
      (item.boxName && item.boxName.toLowerCase().includes(term)) ||
      (item.creator && item.creator.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term));

    return matchYear && matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredHistory.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredHistory.slice(indexOfFirstRow, indexOfLastRow);

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#475569' }}>{t.previewTitle}</div>
          
          <div ref={previewWrapperRef} style={{ width: '100%', height: `${previewHeight}px`, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center', position: 'absolute', top: '10px', width: '900px' }}>
              <div style={{ background: '#ffffff', padding: '50px', borderRadius: '24px', border: '3px solid #0f172a', display: 'flex', alignItems: 'center', gap: '50px', width: '900px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <QRCodeSVG value={getQRCodeString()} size={280} level={"H"} includeMargin={true} />
                  <span style={{ fontSize: '16px', color: '#475569', marginTop: '14px', fontWeight: '900', letterSpacing: '2px' }}>{t.scanMe}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <img src="tsiclogo.png" alt="Logo" style={{ height: '52px', objectFit: 'contain' }} />
                    <div style={{ fontSize: '30px', fontWeight: '750', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px'}}>TSIC</div>
                  </div>

                  <div style={{ fontSize: '20px', fontWeight: '800', background: '#f1f5f9', color: '#1e293b', padding: '8px 18px', borderRadius: '8px', marginBottom: '16px', display: 'inline-block', width: 'fit-content', border: '2px solid #cbd5e1' }}>
                    {formData.category || 'CATEGORY'}
                  </div>
                  <div style={{ fontSize: '34px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1.2' }}>
                    {formData.boxName || 'BOX NAME'}
                  </div>
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

      {/* ส่วนซ่อนสำหรับสร้าง PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={pdfRef} style={{ background: '#ffffff', padding: '50px', borderRadius: '24px', border: '3px solid #0f172a', display: 'flex', alignItems: 'center', gap: '50px', width: '900px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <QRCodeSVG value={getQRCodeString()} size={280} level={"H"} includeMargin={true} />
            <span style={{ fontSize: '16px', color: '#475569', marginTop: '14px', fontWeight: '900', letterSpacing: '2px' }}>{t.scanMe}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="tsiclogo.png" alt="Logo" style={{ height: '52px', objectFit: 'contain' }} />
              <div style={{ fontSize: '30px', fontWeight: '750', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>TSIC</div>
            </div>

            <div style={{ fontSize: '20px', fontWeight: '800', background: '#f1f5f9', color: '#1e293b', padding: '8px 18px', borderRadius: '8px', marginBottom: '16px', display: 'inline-block', width: 'fit-content', border: '2px solid #cbd5e1' }}>
              {formData.category || 'CATEGORY'}
            </div>
            <div style={{ fontSize: '34px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1.2' }}>
              {formData.boxName || 'BOX NAME'}
            </div>
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {t.reportTitle}
            </h3>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: '0 2px 5px rgba(37,99,235,0.08)'
            }}>
              <span>📦</span>
              {/* 🌟 แก้ไขให้ใช้ตัวแปรภาษา t.items ตรงนี้แล้วครับ */}
              <span>{filteredHistory.length} {t.items}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder={t.searchPlaceholder}
              style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '13px', outline: 'none', width: '220px' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>{t.filterCategory}</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600', fontSize: '13px' }}>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'ALL' ? t.allCategories : cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>{t.filterYear}</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600', fontSize: '13px' }}>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year === 'ALL' ? t.allYears : year}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={exportToExcel}
              onMouseEnter={() => setHoverExcel(true)}
              onMouseLeave={() => setHoverExcel(false)}
              style={{
                background: hoverExcel ? '#15803d' : '#16a34a',
                color: 'white',
                border: 'none',
                padding: '7px 14px',
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
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    {t.noData}
                  </td>
                </tr>
              ) : (
                currentRows.map((item) => (
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '15px' }}>
            
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              padding: '6px 14px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              color: '#475569',
              fontWeight: '600' 
            }}>
              <span>📑</span>
              <span>{t.showing}</span>
              <strong style={{ color: '#0f172a' }}>{indexOfFirstRow + 1}</strong>
              <span>-</span>
              <strong style={{ color: '#0f172a' }}>{Math.min(indexOfLastRow, filteredHistory.length)}</strong>
              <span>{t.ofTotal}</span>
              <strong style={{ color: '#2563eb' }}>{filteredHistory.length}</strong>
              <span>{t.items}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                ◀ Prev
              </button>

              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '320px', padding: '2px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      border: currentPage === num ? 'none' : '1px solid #e2e8f0',
                      background: currentPage === num ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
                      color: currentPage === num ? '#ffffff' : '#475569',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: currentPage === num ? '0 4px 10px rgba(37,99,235,0.3)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                Next ▶
              </button>
            </div>
          </div>
        )}

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