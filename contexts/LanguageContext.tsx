import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type Language = 'en' | 'vi';

// Translation keys and their values
export interface Translations {
  // Header
  dashboard: string;
  history: string;
  searchPlaceholder: string;

  // Dashboard
  dashboardTitle: string;
  dashboardSubtitle: string;
  dragDropTitle: string;
  dragDropDescription: string;
  selectFiles: string;
  fromUrlCloud: string;
  recentActivity: string;
  viewAllHistory: string;

  // File types
  word: string;
  powerPoint: string;
  excel: string;
  pdf: string;

  // Table headers
  fileName: string;
  action: string;
  date: string;
  status: string;
  actions: string;

  // Status
  completed: string;
  failed: string;
  processing: string;
  pending: string;

  // Tool page
  uploadToStart: string;
  processFiles: string;
  processing_: string;
  downloadAll: string;

  // User plan
  yourPlan: string;
  active: string;
  monthlyStorageUsed: string;

  // Tool categories
  pdfTools: string;
  officeTools: string;
  conversionTools: string;

  // Common
  download: string;
  delete: string;
  cancel: string;
  confirm: string;
  settings: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    dashboard: 'Dashboard',
    history: 'History',
    searchPlaceholder: 'Search tools or files...',

    // Dashboard
    dashboardTitle: 'Document Processing Dashboard',
    dashboardSubtitle: 'Start by uploading your files or choose a tool from the sidebar.',
    dragDropTitle: 'Drag and drop files here',
    dragDropDescription: 'Upload multiple documents for batch processing. Support for DOCX, PPTX, XLSX, and PDF up to 50MB per file.',
    selectFiles: 'Select Files',
    fromUrlCloud: 'From URL / Cloud',
    recentActivity: 'Recent Activity',
    viewAllHistory: 'View All History',

    // File types
    word: 'Word',
    powerPoint: 'PowerPoint',
    excel: 'Excel',
    pdf: 'PDF',

    // Table headers
    fileName: 'File Name',
    action: 'Action',
    date: 'Date',
    status: 'Status',
    actions: 'Actions',

    // Status
    completed: 'Completed',
    failed: 'Failed',
    processing: 'Processing',
    pending: 'Pending',

    // Tool page
    uploadToStart: 'Upload files to get started',
    processFiles: 'Process Files',
    processing_: 'Processing...',
    downloadAll: 'Download All',

    // User plan
    yourPlan: 'Your Plan',
    active: 'ACTIVE',
    monthlyStorageUsed: 'of monthly storage used',

    // Tool categories
    pdfTools: 'PDF Tools',
    officeTools: 'Office Tools',
    conversionTools: 'Conversion Tools',

    // Common
    download: 'Download',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  vi: {
    // Header
    dashboard: 'Bảng điều khiển',
    history: 'Lịch sử',
    searchPlaceholder: 'Tìm kiếm công cụ hoặc tệp...',

    // Dashboard
    dashboardTitle: 'Bảng điều khiển Xử lý Tài liệu',
    dashboardSubtitle: 'Bắt đầu bằng cách tải lên tệp của bạn hoặc chọn công cụ từ thanh bên.',
    dragDropTitle: 'Kéo và thả tệp vào đây',
    dragDropDescription: 'Tải lên nhiều tài liệu để xử lý hàng loạt. Hỗ trợ DOCX, PPTX, XLSX và PDF tối đa 50MB mỗi tệp.',
    selectFiles: 'Chọn tệp',
    fromUrlCloud: 'Từ URL / Cloud',
    recentActivity: 'Hoạt động gần đây',
    viewAllHistory: 'Xem tất cả lịch sử',

    // File types
    word: 'Word',
    powerPoint: 'PowerPoint',
    excel: 'Excel',
    pdf: 'PDF',

    // Table headers
    fileName: 'Tên tệp',
    action: 'Hành động',
    date: 'Ngày',
    status: 'Trạng thái',
    actions: 'Thao tác',

    // Status
    completed: 'Hoàn thành',
    failed: 'Thất bại',
    processing: 'Đang xử lý',
    pending: 'Đang chờ',

    // Tool page
    uploadToStart: 'Tải tệp lên để bắt đầu',
    processFiles: 'Xử lý tệp',
    processing_: 'Đang xử lý...',
    downloadAll: 'Tải tất cả',

    // User plan
    yourPlan: 'Gói của bạn',
    active: 'ĐANG HOẠT ĐỘNG',
    monthlyStorageUsed: 'dung lượng hàng tháng đã sử dụng',

    // Tool categories
    pdfTools: 'Công cụ PDF',
    officeTools: 'Công cụ Office',
    conversionTools: 'Công cụ Chuyển đổi',

    // Common
    download: 'Tải xuống',
    delete: 'Xóa',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    settings: 'Cài đặt',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    system: 'Hệ thống',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'fileedit-language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (stored && ['en', 'vi'].includes(stored)) {
        return stored;
      }
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'vi') return 'vi';
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  // Set document language on mount
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const availableLanguages = useMemo(() => [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'vi' as Language, name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  ], []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
