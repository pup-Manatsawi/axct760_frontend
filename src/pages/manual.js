import React, { useState } from 'react';

// คำแปลภาษาสำหรับคู่มือ (Translations)
const translations = {
  TH: {
    // Navigation Tabs
    tabSystemManual: '📖 คู่มือการใช้งานระบบ Generator',
    tabScanManual: '📱 คู่มือการสแกนด้วย QR Reader',

    // Tab 1: System Manual
    title: '📖 คู่มือการใช้งาน THAISHINKONG QR CODE GENERATOR',
    subtitle: 'ระบบสร้างป้าย QR Code สำหรับติดกล่องเก็บเอกสาร • คู่มือการใช้งานฉบับสมบูรณ์',
    sec1Title: '1. ภาพรวมระบบและคุณสมบัติหลัก',
    sec1Desc: 'ระบบสร้างป้าย QR Code สำหรับติดกล่องเก็บเอกสารของ Thai Shinkong ออกแบบมาเพื่อเพิ่มประสิทธิภาพในการจัดเก็บ ค้นหา และติดตามอายุการเก็บรักษาเอกสารสำคัญภายในองค์กรอย่างเป็นระบบ',
    feat1Title: '🌐 รองรับ 3 ภาษา',
    feat1Desc: 'สลับภาษาใช้งานได้อย่างง่ายดายระหว่าง ไทย (TH), อังกฤษ (EN) และ จีน (TW) ผ่านปุ่มมุมขวาบน',
    feat2Title: '📅 คำนวณวันหมดอายุ',
    feat2Desc: 'ระบบคำนวณวันสิ้นสุดการเก็บเอกสาร (+10 ปี) อัตโนมัติทันทีที่เลือกระบุวันที่จัดเก็บ',
    feat3Title: '🖨️ ส่งออกเอกสาร PDF',
    feat3Desc: 'รองรับการพรีวิวป้ายขนาดมาตรฐานพร้อมปุ่มดาวน์โหลดไฟล์ PDF คุณภาพสูงสำหรับพิมพ์ติดกล่อง',

    sec2Title: '2. ขั้นตอนการสร้างป้าย QR Code ติดกล่อง',
    step1: 'กรอกชื่อกล่อง / รหัสกล่อง: ระบุชื่อหรือรหัสอ้างอิงของกล่อง เช่น กล่องบัญชี 2025 - เล่ม 1',
    step2: 'ระบุหมวดหมู่เอกสาร: เลือกหรือกรอกหมวดหมู่สั้นๆ เช่น ACC, FIN, HR หรือ IMPORT',
    step3: 'ระบุรายละเอียดและผู้จัดทำ: ระบุเอกสารย่อยภายในกล่องคร่าวๆ พร้อมกรอกชื่อผู้บันทึกข้อมูล',
    step4: 'ตรวจสอบตัวอย่างและบันทึก: ตรวจสอบหน้าตาป้ายในฝั่ง "ตัวอย่างหน้าจอ" แล้วกด 💾 บันทึกข้อมูล เพื่อจัดเก็บลงฐานข้อมูล',

    sec3Title: '3. ตัวอย่างรูปแบบป้ายมาตรฐาน (Label Preview)',
    scanMe: 'SCAN ME',
    sampleCategory: 'หมวดหมู่: ACC',
    sampleBoxName: 'ชื่อกล่อง: บัญชีการเงินประจำปี 2025 (เล่ม 1/3)',
    sampleCreator: 'ผู้จัดทำ: สมชาย ใจดี',
    sampleDate: 'วันที่จัดเก็บ: 2026-10-12',
    sampleExpire: 'วันหมดอายุ (+10ปี): 2036-10-12',

    sec4Title: '4. การจัดการประวัติและการส่งออกรายงาน (History & Report)',
    sec4Desc: 'ส่วนล่างของหน้าจอคือระบบรายงานประวัติการบันทึก ช่วยให้ผู้ดูแลระบบสามารถค้นหา กรองข้อมูล แก้ไขรายการ หรือส่งออกข้อมูลไปใช้งานต่อได้สะดวก',
    colTool: 'ฟังก์ชัน / เครื่องมือ',
    colButton: 'ปุ่มกด / ปุ่ม',
    colDesc: 'คำอธิบายการใช้งาน',
    t1Name: 'การค้นหาข้อมูล', t1Btn: '🔍 ค้นหา...', t1Desc: 'พิมพ์ค้นหาด้วย ชื่อกล่อง, ชื่อผู้จัดทำ หรือรายละเอียดภายในกล่องได้ทันที',
    t2Name: 'ตัวกรองหมวดหมู่/ปี', t2Btn: 'หมวดหมู่ / เลือกดูตามปี', t2Desc: 'เลือกกรองเฉพาะหมวดหมู่เอกสารที่ต้องการ หรือกรองย้อนหลังตามปีจัดเก็บ',
    t3Name: 'ส่งออกไฟล์ Excel', t3Btn: '📊 Export to Excel', t3Desc: 'ดาวน์โหลดรายการประวัติทั้งหมดที่เลือกกรองอยู่ ออกมาเป็นไฟล์รายงาน CSV/Excel',
    t4Name: 'พิมพ์ป้าย QR Code', t4Btn: '🖨️ พิมพ์', t4Desc: 'ดึงข้อมูลกล่องนั้นๆ ขึ้นมาพรีวิวเพื่อดาวน์โหลดเป็นไฟล์ PDF สำหรับพิมพ์ใหม่',
    t5Name: 'แก้ไขข้อมูล', t5Btn: '✏️ แก้ไข', t5Desc: 'โหลดข้อมูลกล่องกลับเข้าฟอร์ม เพื่อแก้ไขข้อมูลและกด Update บันทึกทับ',
    t6Name: 'ลบรายการ', t6Btn: '🗑️ ลบ', t6Desc: 'ลบรายการประวัติออกจากระบบ (มีระบบยืนยันก่อนลบเพื่อป้องกันการกดพลาด)',

    sec5Title: '5. ข้อแนะนำและข้อควรระวังในการใช้งาน',
    warnTitle: '⚠️ ข้อควรระวังในการกรอกข้อมูล',
    warn1: 'ช่องที่มีเครื่องหมาย * จำเป็นต้องกรอกให้ครบถ้วนก่อนบันทึก',
    warn2: 'การลบรายการประวัติจะทำให้ข้อมูลหายไปจาก Server และไม่สามารถกู้คืนได้',
    tipTitle: '💡 ข้อแนะนำในการพิมพ์และติดป้าย',
    tip1: 'ควรพิมพ์ป้ายด้วยเครื่องพิมพ์ความละเอียดสูงเพื่อให้ QR Code สแกนได้ง่าย',
    tip2: 'ควรแปะป้าย QR Code ในตำแหน่งที่เห็นชัดเจนด้านหน้ากล่องเอกสาร',

    sec6Title: '6. การติดต่อช่วยเหลือและสนับสนุน (Support)',
    supportDesc: 'หากพบปัญหาการใช้งานระบบ ไม่สามารถบันทึกข้อมูล หรือเกิดข้อผิดพลาดในการสร้างไฟล์ PDF กรุณาติดต่อแผนกไอที (IT Department) หรือผู้ดูแลระบบสารสนเทศของ บริษัท ไทยชินก้อง จำกัด',
    backBtn: '← กลับสู่หน้าหลัก QR Code Generator',

    // Tab 2: QR Scanner Manual
    scanTitle: '📱 คู่มือการสแกนอ่านข้อมูลป้าย QR Code เอกสาร',
    scanSubtitle: 'แนะนำการใช้งานแอปพลิเคชัน QR Reader สำหรับอ่านรายละเอียดข้อมูลภายในกล่องเอกสาร',
    scanStep1Title: '1. การดาวน์โหลดและติดตั้งแอปพลิเคชัน (Download & Install)',
    scanStep1Desc: 'ค้นหาแอปชื่อ "QR Reader" ใน App Store (iOS) หรือ Google Play Store (Android) สังเกตไอคอนที่มีสัญลักษณ์ QR Code สีดำพร้อมเส้นสแกนสีแดง และทำการดาวน์โหลดติดตั้งลงในสมาร์ทโฟน',
    scanStep2Title: '2. ขั้นตอนการสแกน QR Code (How to Scan)',
    scanStep2Desc: 'เปิดแอปพลิเคชัน QR Reader บนมือถือของคุณ แล้วนำกล้องไปส่องตรงที่รูป QR Code บนป้ายหน้ากล่องเอกสาร ให้ QR Code อยู่ตรงกลางกรอบสแกน แอปจะทำการอ่านข้อมูลให้อัตโนมัติทันทีโดยไม่ต้องกดถ่ายภาพ',
    scanStep3Title: '3. รูปแบบข้อมูลที่แสดงผลหลังการสแกน (Scanned Result Format)',
    scanStep3Desc: 'เมื่อสแกนสำเร็จ ข้อมูลรายละเอียดทั้งหมดของกล่องเอกสารจะแสดงผลในรูปแบบข้อความบนหน้าจอมือถือทันที โดยมีโครงสร้างข้อมูลดังนี้:',
    
    // Scanned Result Box
    resCompany: 'Company: ThaiShinkong',
    resBoxName: 'Box Name: PV 12/2025 (BOX NO.2/2)',
    resCategory: 'Category: FIN-PAYMENT',
    resDescTitle: 'Description: DatePV',
    resCreator: 'Creator: VILAIVAN',
    resStorageDate: 'Storage Date: 2025-12-31',
    resExpireDate: 'Expire Date: 2035-12-31',
    resDetailNotice: '💡 หมายเหตุ: ข้อมูล Description จะแสดงรายละเอียดรายการเอกสารย่อย/เลขที่เอกสารทั้งหมดที่จัดเก็บอยู่ในกล่องอย่างชัดเจน ช่วยให้ตรวจสอบเอกสารได้โดยไม่ต้องเปิดกล่อง'
  },
  EN: {
    // Navigation Tabs
    tabSystemManual: '📖 Generator System Manual',
    tabScanManual: '📱 QR Reader Scanner Manual',

    // Tab 1: System Manual
    title: '📖 THAISHINKONG QR CODE GENERATOR MANUAL',
    subtitle: 'QR Code Label Generator System for Document Storage Boxes • Complete User Manual',
    sec1Title: '1. System Overview & Key Features',
    sec1Desc: 'The Thai Shinkong Document Storage Box QR Code Label Generator is designed to enhance efficiency in storing, retrieving, and tracking the retention period of important organizational documents.',
    feat1Title: '🌐 3 Languages Supported',
    feat1Desc: 'Easily switch between Thai (TH), English (EN), and Chinese (TW) using the top-right buttons.',
    feat2Title: '📅 Auto Expiry Calculation',
    feat2Desc: 'The system automatically calculates the document retention end date (+10 years) upon selecting the storage date.',
    feat3Title: '🖨️ PDF Export',
    feat3Desc: 'Supports standard label preview and high-quality PDF download for box printing.',

    sec2Title: '2. Steps to Create a Box QR Code Label',
    step1: 'Box Name / Box ID: Enter the name or reference ID, e.g., ACC Box 2025 - Vol. 1',
    step2: 'Document Category: Select or enter a short category, e.g., ACC, FIN, HR, or IMPORT',
    step3: 'Description & Creator: Briefly specify internal contents and record creator name',
    step4: 'Preview & Save: Check the preview on the right and click 💾 Save Data to store it',

    sec3Title: '3. Label Preview Example',
    scanMe: 'SCAN ME',
    sampleCategory: 'Category: ACC',
    sampleBoxName: 'Box Name: Annual Financial Accounts 2025 (Vol. 1/3)',
    sampleCreator: 'Creator: Somchai Jaidee',
    sampleDate: 'Storage Date: 2026-10-12',
    sampleExpire: 'Expire Date (+10Y): 2036-10-12',

    sec4Title: '4. History Management & Reports',
    sec4Desc: 'The bottom section provides a history report system allowing administrators to search, filter records, edit items, or export data.',
    colTool: 'Function / Tool',
    colButton: 'Button / Action',
    colDesc: 'Description',
    t1Name: 'Search Data', t1Btn: '🔍 Search...', t1Desc: 'Instantly search by box name, creator name, or internal description.',
    t2Name: 'Category / Year Filter', t2Btn: 'Category / Filter by Year', t2Desc: 'Filter by specific document category or retrospective storage year.',
    t3Name: 'Export to Excel', t3Btn: '📊 Export to Excel', t3Desc: 'Download all filtered history records as a CSV/Excel report file.',
    t4Name: 'Print QR Label', t4Btn: '🖨️ Print', t4Desc: 'Load box data into preview to download as a PDF for reprinting.',
    t5Name: 'Edit Data', t5Btn: '✏️ Edit', t5Desc: 'Load box data back into the form to update and overwrite records.',
    t6Name: 'Delete Item', t6Btn: '🗑️ Delete', t6Desc: 'Delete history records from the server (requires confirmation).',

    sec5Title: '5. Best Practices & Precautions',
    warnTitle: '⚠️ Data Entry Precautions',
    warn1: 'Fields marked with * must be filled out completely before saving.',
    warn2: 'Deleting a history record removes it permanently from the server.',
    tipTitle: '💡 Printing & Labeling Tips',
    tip1: 'Print labels using a high-resolution printer for easy QR Code scanning.',
    tip2: 'Attach the QR Code label in a clearly visible spot on the front of the box.',

    sec6Title: '6. Support & Assistance',
    supportDesc: 'If you encounter system issues, data saving errors, or PDF generation failures, please contact the IT Department or System Administrator of Thai Shinkong Co., Ltd.',
    backBtn: '← Back to QR Code Generator',

    // Tab 2: QR Scanner Manual
    scanTitle: '📱 QR Code Label Scanning Guide',
    scanSubtitle: 'Instructions on using the QR Reader app to read box document details.',
    scanStep1Title: '1. Download & Installation',
    scanStep1Desc: 'Search for "QR Reader" in the App Store (iOS) or Google Play Store (Android). Look for the icon featuring a black QR code with a red laser scan line, and install it on your smartphone.',
    scanStep2Title: '2. How to Scan',
    scanStep2Desc: 'Open the QR Reader app on your smartphone and point the camera at the QR code label on the document box. Position the QR code inside the frame; the app will scan and retrieve the data automatically without needing to press a capture button.',
    scanStep3Title: '3. Scanned Result Format',
    scanStep3Desc: 'Upon successful scanning, the full document details of the box will be displayed as text on your smartphone screen in the following format:',

    // Scanned Result Box
    resCompany: 'Company: ThaiShinkong',
    resBoxName: 'Box Name: PV 12/2025 (BOX NO.2/2)',
    resCategory: 'Category: FIN-PAYMENT',
    resDescTitle: 'Description: DatePV',
    resCreator: 'Creator: VILAIVAN',
    resStorageDate: 'Storage Date: 2025-12-31',
    resExpireDate: 'Expire Date: 2035-12-31',
    resDetailNotice: '💡 Note: The Description field displays all stored sub-documents/numbers, allowing you to review contents without opening the box.'
  },
  TW: {
    // Navigation Tabs
    tabSystemManual: '📖 生成器系統手冊',
    tabScanManual: '📱 QR Reader 掃描指南',

    // Tab 1: System Manual
    title: '📖 泰新興 QR CODE 生成器使用手冊',
    subtitle: '文件檔案盒 QR Code 標籤生成系統 • 完整使用指南',
    sec1Title: '1. 系統概述與主要功能',
    sec1Desc: '泰新興文件檔案盒 QR Code 標籤生成系統旨在提高組織內部重要文件存儲、檢索和保留期限追蹤的效率。',
    feat1Title: '🌐 支援 3 種語言',
    feat1Desc: '透過右上角按鈕即可輕鬆切換泰語 (TH)、英語 (EN) 和中文 (TW)。',
    feat2Title: '📅 自動計算到期日',
    feat2Desc: '選擇存放日期後，系統會自動計算文件保存到期日 (+10年)。',
    feat3Title: '🖨️ 匯出 PDF 文件',
    feat3Desc: '支援標準標籤預覽，並可下載高品質 PDF 檔案以列印貼在箱子上。',

    sec2Title: '2. 建立箱子 QR Code 標籤步驟',
    step1: '箱號 / 箱子名稱：輸入名稱或編號，例如：會計箱 2025 - 第 1 冊',
    step2: '文件類別：選擇或輸入簡短類別，例如：ACC、FIN、HR 或 IMPORT',
    step3: '內容說明與製作者：簡述內部文件內容並填寫記錄人姓名',
    step4: '預覽與儲存：檢查右側預覽畫面，然後點擊 💾 儲存資料 即可寫入系統',

    sec3Title: '3. 標籤預覽範例',
    scanMe: '掃描我',
    sampleCategory: '類別：ACC',
    sampleBoxName: '箱號：2025年度會計財務報表 (第 1/3 冊)',
    sampleCreator: '製作者：Somchai Jaidee',
    sampleDate: '存放日期：2026-10-12',
    sampleExpire: '到期日 (+10年)：2036-10-12',

    sec4Title: '4. 歷史記錄與報表管理',
    sec4Desc: '畫面下方為歷史記錄報表系統，方便管理員搜尋、篩選記錄、編輯項目或匯出資料。',
    colTool: '功能 / 工具',
    colButton: '按鈕 / 操作',
    colDesc: '使用說明',
    t1Name: '搜尋資料', t1Btn: '🔍 搜尋...', t1Desc: '可立即透過箱號、製作者或內容說明進行關鍵字搜尋。',
    t2Name: '類別 / 年份篩選', t2Btn: '類別 / 依年份篩選', t2Desc: '依指定文件類別或存放年份進行過濾檢視。',
    t3Name: '匯出 Excel', t3Btn: '📊 匯出 Excel', t3Desc: '將目前篩選出的所有歷史記錄下載為 CSV/Excel 報表。',
    t4Name: '列印 QR 標籤', t4Btn: '🖨️ 編輯', t4Desc: '載入箱子資料進行預覽，以便下載 PDF 重新列印。',
    t5Name: '編輯資料', t5Btn: '✏️ 編輯', t5Desc: '將箱子資料載回表單進行修改，並點擊更新覆蓋。',
    t6Name: '刪除項目', t6Btn: '🗑️ 刪除', t6Desc: '從伺服器中刪除歷史記錄（具備確認提示以防誤按）。',

    sec5Title: '5. 使用建議與注意事項',
    warnTitle: '⚠️ 資料填寫注意事項',
    warn1: '標有 * 的欄位在儲存前必須完整填寫。',
    warn2: '刪除歷史記錄會將資料自伺服器永久移除且無法復原。',
    tipTitle: '💡 列印與貼標建議',
    tip1: '請使用高解析度印列機列印標籤，以確保 QR Code 掃描順暢。',
    tip2: '請將 QR Code 標籤貼在檔案箱正面的明顯位置。',

    sec6Title: '6. 支援與協助',
    supportDesc: '如遇系統使用問題、無法儲存資料或 PDF 生成錯誤，請聯繫泰新興有限公司資訊部 (IT Department) 或系統管理員。',
    backBtn: '← 返回 QR Code 生成器主頁',

    // Tab 2: QR Scanner Manual
    scanTitle: '📱 QR Code 標籤掃描讀取指南',
    scanSubtitle: '使用 QR Reader 應用程式讀取檔案箱詳細資料說明。',
    scanStep1Title: '1. 下載與安裝應用程式 (Download & Install)',
    scanStep1Desc: '在 App Store (iOS) 或 Google Play Store (Android) 搜尋 "QR Reader"，找到帶有紅色掃描線圖示的 App 並進行下載安裝。',
    scanStep2Title: '2. 掃描 QR Code 步驟 (How to Scan)',
    scanStep2Desc: '開啟手機上的 QR Reader App，將鏡頭對準檔案箱標籤上的 QR Code，使其保持在掃描框中央，App 將會自動讀取資料，無需按下拍照鍵。',
    scanStep3Title: '3. 掃描後顯示之資料格式 (Scanned Result Format)',
    scanStep3Desc: '掃描成功後，手機畫面將以純文字格式呈現檔案箱內的完整詳細資料如下：',

    // Scanned Result Box
    resCompany: 'Company: ThaiShinkong',
    resBoxName: 'Box Name: PV 12/2025 (BOX NO.2/2)',
    resCategory: 'Category: FIN-PAYMENT',
    resDescTitle: 'Description: DatePV',
    resCreator: 'Creator: VILAIVAN',
    resStorageDate: 'Storage Date: 2025-12-31',
    resExpireDate: 'Expire Date: 2035-12-31',
    resDetailNotice: '💡 備註：Description 欄位會詳細列出箱內存放的所有文件清單與編號，方便無需開箱即可快速核對。'
  }
};

export default function Manual() {
  const [lang, setLang] = useState('TH');
  const [activeTab, setActiveTab] = useState('system'); // 'system' or 'scanner'
  const t = translations[lang];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", padding: '20px', maxWidth: '1100px', margin: 'auto', color: '#1e293b', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ส่วนหัว: ปุ่มกลับหน้าหลัก และ ปุ่มเปลี่ยนภาษา */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <button 
          onClick={() => window.location.href = '/QRCodeBox'}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            color: '#2563eb',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          {t.backBtn}
        </button>

        {/* ปุ่มเลือกภาษา */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setLang('TH')} style={{ padding: '6px 12px', borderRadius: '6px', border: lang === 'TH' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: lang === 'TH' ? '#eff6ff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>ไทย</button>
          <button onClick={() => setLang('EN')} style={{ padding: '6px 12px', borderRadius: '6px', border: lang === 'EN' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: lang === 'EN' ? '#eff6ff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>EN</button>
          <button onClick={() => setLang('TW')} style={{ padding: '6px 12px', borderRadius: '6px', border: lang === 'TW' ? '2px solid #2563eb' : '1px solid #cbd5e1', background: lang === 'TW' ? '#eff6ff' : '#fff', fontWeight: 'bold', cursor: 'pointer' }}>中文</button>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('system')}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'system' ? '#1e3a8a' : '#e2e8f0',
            color: activeTab === 'system' ? '#ffffff' : '#475569',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'system' ? '0 4px 12px rgba(30, 58, 138, 0.25)' : 'none'
          }}
        >
          {t.tabSystemManual}
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'scanner' ? '#1e3a8a' : '#e2e8f0',
            color: activeTab === 'scanner' ? '#ffffff' : '#475569',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'scanner' ? '0 4px 12px rgba(30, 58, 138, 0.25)' : 'none'
          }}
        >
          {t.tabScanManual}
        </button>
      </div>

      {/* Main Container */}
      <div style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        
        {/* ================= TAB 1: SYSTEM MANUAL ================= */}
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#ffffff', padding: '30px', borderRadius: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0' }}>{t.title}</h1>
              <p style={{ fontSize: '14px', color: '#93c5fd', margin: 0, fontWeight: '500' }}>{t.subtitle}</p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#1e3a8a', borderBottom: '2px solid #3b82f6', paddingBottom: '6px', marginBottom: '12px' }}>{t.sec1Title}</h2>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', marginBottom: '16px' }}>{t.sec1Desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #2563eb', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', color: '#1e293b', margin: '0 0 6px 0' }}>{t.feat1Title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{t.feat1Desc}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #2563eb', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', color: '#1e293b', margin: '0 0 6px 0' }}>{t.feat2Title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{t.feat2Desc}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #2563eb', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', color: '#1e293b', margin: '0 0 6px 0' }}>{t.feat3Title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{t.feat3Desc}</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#1e3a8a', borderBottom: '2px solid #3b82f6', paddingBottom: '6px', marginBottom: '15px' }}>{t.sec2Title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[t.step1, t.step2, t.step3, t.step4].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#2563eb', color: 'white', fontWeight: 'bold', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: '14px', color: '#334155' }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#1e3a8a', borderBottom: '2px solid #3b82f6', paddingBottom: '6px', marginBottom: '15px' }}>{t.sec3Title}</h2>
              <div style={{ background: '#ffffff', border: '3px solid #0f172a', padding: '25px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <div style={{ background: '#f1f5f9', border: '2px solid #000', width: '130px', height: '130px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                  [ QR CODE ]<br/>{t.scanMe}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#0f172a' }}>
                  <div style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '6px', fontWeight: 'bold', width: 'fit-content', border: '1px solid #cbd5e1' }}>{t.sampleCategory}</div>
                  <div style={{ fontWeight: '800', fontSize: '18px' }}>{t.sampleBoxName}</div>
                  <div>{t.sampleCreator}</div>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span>{t.sampleDate}</span>
                    <span style={{ color: '#e11d48', fontWeight: 'bold' }}>{t.sampleExpire}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#1e3a8a', borderBottom: '2px solid #3b82f6', paddingBottom: '6px', marginBottom: '12px' }}>{t.sec4Title}</h2>
              <p style={{ fontSize: '14px', color: '#334155', marginBottom: '15px' }}>{t.sec4Desc}</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#1e3a8a', color: 'white' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>{t.colTool}</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>{t.colButton}</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>{t.colDesc}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: t.t1Name, btn: t.t1Btn, desc: t.t1Desc },
                      { name: t.t2Name, btn: t.t2Btn, desc: t.t2Desc },
                      { name: t.t3Name, btn: t.t3Btn, desc: t.t3Desc },
                      { name: t.t4Name, btn: t.t4Btn, desc: t.t4Desc },
                      { name: t.t5Name, btn: t.t5Btn, desc: t.t5Desc },
                      { name: t.t6Name, btn: t.t6Btn, desc: t.t6Desc },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#0f172a' }}>{row.name}</td>
                        <td style={{ padding: '10px' }}><code style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>{row.btn}</code></td>
                        <td style={{ padding: '10px', color: '#475569' }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#1e3a8a', borderBottom: '2px solid #3b82f6', paddingBottom: '6px', marginBottom: '15px' }}>{t.sec5Title}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #d97706', padding: '16px', borderRadius: '10px' }}>
                  <h3 style={{ fontSize: '15px', color: '#b45309', margin: '0 0 8px 0' }}>{t.warnTitle}</h3>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#78350f', lineHeight: '1.5' }}>
                    <li>{t.warn1}</li>
                    <li>{t.warn2}</li>
                  </ul>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a', padding: '16px', borderRadius: '10px' }}>
                  <h3 style={{ fontSize: '15px', color: '#15803d', margin: '0 0 8px 0' }}>{t.tipTitle}</h3>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                    <li>{t.tip1}</li>
                    <li>{t.tip2}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#1e3a8a', borderBottom: '2px solid #3b82f6', paddingBottom: '6px', marginBottom: '12px' }}>{t.sec6Title}</h2>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '10px' }}>
                <p style={{ fontSize: '14px', color: '#1e3a8a', margin: 0, lineHeight: '1.6' }}>{t.supportDesc}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SCANNER MANUAL ================= */}
        {activeTab === 'scanner' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', padding: '30px', borderRadius: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0' }}>{t.scanTitle}</h1>
              <p style={{ fontSize: '14px', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>{t.scanSubtitle}</p>
            </div>

            {/* Section 1: Download App */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#0369a1', borderBottom: '2px solid #0284c7', paddingBottom: '6px', marginBottom: '15px' }}>
                {t.scanStep1Title}
              </h2>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                {/* App Icon Mockup */}
                <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #cbd5e1' }}>
                  <div style={{ width: '48px', height: '48px', background: '#e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ fontSize: '20px' }}>🔳</div>
                    <div style={{ position: 'absolute', width: '100%', height: '2px', background: '#ef4444', top: '50%' }}></div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>QR Reader</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Barcode & QR Scanner</div>
                  </div>
                </div>
                <p style={{ flex: 1, fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: 0, minWidth: '260px' }}>
                  {t.scanStep1Desc}
                </p>
              </div>
            </div>

            {/* Section 2: How to Scan */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#0369a1', borderBottom: '2px solid #0284c7', paddingBottom: '6px', marginBottom: '15px' }}>
                {t.scanStep2Title}
              </h2>
              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#0369a1', margin: 0 }}>
                  {t.scanStep2Desc}
                </p>
              </div>
            </div>

            {/* Section 3: Result Preview */}
            <div>
              <h2 style={{ fontSize: '18px', color: '#0369a1', borderBottom: '2px solid #0284c7', paddingBottom: '6px', marginBottom: '15px' }}>
                {t.scanStep3Title}
              </h2>
              <p style={{ fontSize: '14px', color: '#334155', marginBottom: '15px' }}>
                {t.scanStep3Desc}
              </p>

              {/* Display Result Box Mockup */}
              <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '24px', borderRadius: '16px', fontFamily: 'monospace', fontSize: '14px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: 'auto' }}>
                <div style={{ marginBottom: '4px' }}>{t.resCompany}</div>
                <div style={{ marginBottom: '4px' }}>{t.resBoxName}</div>
                <div style={{ marginBottom: '4px' }}>{t.resCategory}</div>
                <div style={{ marginBottom: '8px' }}>{t.resDescTitle}</div>
                
                {/* Internal Items List */}
                <div style={{ paddingLeft: '16px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '12px' }}>
                  <div>01 001-002</div>
                  <div>02 001-002</div>
                  <div>03 001-003</div>
                  <div>04 002-008</div>
                  <div>08 001-004</div>
                  <div>12 004</div>
                  <div>12 001-006</div>
                  <div>15 001-004</div>
                  <div>17 001</div>
                  <div>18 001-002</div>
                  <div>19 001-006</div>
                  <div>22 001-002</div>
                  <div>23 001-002</div>
                  <div>24 021</div>
                  <div>26 064</div>
                  <div>26 001-008</div>
                  <div>29 001-004</div>
                  <div>30 007</div>
                  <div>30 001-006</div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
                  <div>{t.resCreator}</div>
                  <div>{t.resStorageDate}</div>
                  <div>{t.resExpireDate}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '15px' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                  {t.resDetailNotice}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}