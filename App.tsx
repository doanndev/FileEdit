
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { TOOLS, MAX_FILE_SIZE } from './constants';
import { AppFile, Activity, Tool, UserPlan } from './types';
import { INITIAL_ACTIVITY, formatFileSize, processFileMock } from './services/fileService';
import { gemini } from './services/geminiService';
import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';
import SettingsDropdown from './components/SettingsDropdown';

// --- UI Components ---

const StatusBadge: React.FC<{ status: Activity['status'] }> = ({ status }) => {
  const styles = status === 'Completed' 
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${styles}`}>
      {status}
    </span>
  );
};

const FileIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "" }) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('pdf')) return <span className={`material-symbols-outlined text-red-500 ${className}`}>picture_as_pdf</span>;
  if (lowerType.includes('word') || lowerType.includes('doc')) return <span className={`material-symbols-outlined text-blue-500 ${className}`}>description</span>;
  if (lowerType.includes('excel') || lowerType.includes('xls')) return <span className={`material-symbols-outlined text-emerald-500 ${className}`}>table_chart</span>;
  if (lowerType.includes('ppt')) return <span className={`material-symbols-outlined text-orange-500 ${className}`}>present_to_all</span>;
  if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('png')) return <span className={`material-symbols-outlined text-indigo-500 ${className}`}>image</span>;
  return <span className={`material-symbols-outlined text-slate-400 ${className}`}>draft</span>;
};

const Sidebar: React.FC<{ plan: UserPlan, currentToolId: string | null }> = ({ plan, currentToolId }) => {
  const { t } = useLanguage();
  const categories = ['PDF', 'OFFICE', 'CONVERSION'];
  const categoryLabels: Record<string, string> = {
    'PDF': t.pdfTools,
    'OFFICE': t.officeTools,
    'CONVERSION': t.conversionTools,
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-8 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto pr-2 scrollbar-hide">
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="px-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">{categoryLabels[cat]}</h3>
            <div className="space-y-1">
              {TOOLS.filter(t => t.category === cat).map(tool => (
                <Link 
                  key={tool.id} 
                  to={`/tool/${tool.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    currentToolId === tool.id 
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined !text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.yourPlan}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{plan.name}</span>
          {plan.isActive && <span className="px-2 py-0.5 rounded bg-primary text-[10px] font-bold">{t.active}</span>}
        </div>
        <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-500" style={{ width: `${(plan.usedGB / plan.limitGB) * 100}%` }}></div>
        </div>
        <p className="text-[10px] text-slate-400">{Math.round((plan.usedGB / plan.limitGB) * 100)}% {t.monthlyStorageUsed}</p>
      </div>
    </aside>
  );
};

const Header: React.FC<{ searchQuery: string; onSearch: (q: string) => void }> = ({ searchQuery, onSearch }) => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto flex h-16 items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-xl">auto_fix_high</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FileEdit</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">{t.dashboard}</Link>
            <Link to="/history" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">{t.history}</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-xl pointer-events-none">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border-none bg-slate-100 dark:bg-slate-800 dark:text-white pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none" 
              placeholder={t.searchPlaceholder}
              type="text"
            />
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">notifications</span>
          </button>
          <SettingsDropdown />
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 overflow-hidden cursor-pointer hover:border-primary transition-colors">
            <img 
              src="https://picsum.photos/seed/user123/100/100" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Page Components ---

const Dashboard: React.FC<{ 
  onUpload: (files: FileList | null) => void, 
  activities: Activity[] 
}> = ({ onUpload, activities }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t.dashboardTitle}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t.dashboardSubtitle}</p>
      </div>

      <div 
        className="relative group cursor-pointer"
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-primary/5', 'border-primary/50'); }}
        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-primary/5', 'border-primary/50'); }}
        onDrop={(e) => { e.preventDefault(); onUpload(e.dataTransfer.files); e.currentTarget.classList.remove('bg-primary/5', 'border-primary/50'); }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col items-center justify-center gap-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-8 py-20 text-center transition-all">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined !text-4xl">cloud_upload</span>
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.dragDropTitle}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.dragDropDescription}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <label className="flex h-12 items-center gap-3 px-8 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 cursor-pointer">
              <span className="material-symbols-outlined">add</span>
              <span>{t.selectFiles}</span>
              <input type="file" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
            </label>
            <button className="flex h-12 items-center gap-3 px-8 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">
              <span className="material-symbols-outlined">link</span>
              <span>{t.fromUrlCloud}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t.word, ext: '.docx, .doc', icon: 'description', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
          { label: t.powerPoint, ext: '.pptx, .ppt', icon: 'present_to_all', color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
          { label: t.excel, ext: '.xlsx, .xls', icon: 'table_chart', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
          { label: t.pdf, ext: '.pdf', icon: 'picture_as_pdf', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
        ].map((fmt) => (
          <div key={fmt.label} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:shadow-md transition-all hover:-translate-y-1">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${fmt.color}`}>
              <span className="material-symbols-outlined">{fmt.icon}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt.label}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{fmt.ext}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.recentActivity}</h2>
          <Link to="/history" className="text-sm font-semibold text-primary hover:underline">{t.viewAllHistory}</Link>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{t.fileName}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{t.action}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{t.date}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{t.status}</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {activities.map(activity => (
                <tr key={activity.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileIcon type={activity.fileType} />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{activity.fileName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{activity.action}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{activity.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={activity.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={activity.downloadUrl} className="text-primary hover:text-primary-dark transition-colors inline-flex items-center">
                      <span className="material-symbols-outlined !text-lg">download</span>
                    </a>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No recent activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ToolView: React.FC<{ 
  tool: Tool, 
  onProcess: (files: FileList | null) => void,
  isProcessing: boolean,
  processingFiles: AppFile[]
}> = ({ tool, onProcess, isProcessing, processingFiles }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <nav className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 font-medium">
        <Link to="/" className="hover:text-primary">{t.dashboard}</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">{tool.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined !text-3xl">{tool.icon}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{tool.name}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{tool.description}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        {processingFiles.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Current Files ({processingFiles.length})</h3>
              {isProcessing && <div className="flex items-center gap-2 text-primary animate-pulse text-sm font-semibold">
                <span className="material-symbols-outlined animate-spin !text-sm">sync</span>
                {t.processing_}
              </div>}
            </div>
            <div className="space-y-3">
              {processingFiles.map(file => (
                <div key={file.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <FileIcon type={file.type} className="!text-2xl" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(file.progress)}%</p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${file.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'}`} 
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {file.status === 'completed' ? (
                      <a href={file.processedUrl} download className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">{t.download}</a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">{file.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById('tool-file-input')?.click()}
          >
            <span className="material-symbols-outlined !text-4xl text-slate-300 dark:text-slate-600 mb-4">add_circle</span>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t.uploadToStart}</p>
            <input 
              id="tool-file-input" 
              type="file" 
              multiple 
              className="hidden" 
              onChange={(e) => onProcess(e.target.files)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Wrapper ---

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITY);
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);
  const [processingFiles, setProcessingFiles] = useState<AppFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>({
    name: 'Pro Plan',
    limitGB: 10,
    usedGB: 7.5,
    isActive: true
  });

  const handleUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const fileList = Array.from(files);
    
    // Validate
    const oversized = fileList.filter(f => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error(`Some files are too large (max ${formatFileSize(MAX_FILE_SIZE)})`, {
        duration: 4000,
        icon: '⚠️',
      });
      return;
    }

    const newFiles: AppFile[] = fileList.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      type: f.name.split('.').pop() || '',
      size: f.size,
      progress: 0,
      status: 'pending',
      uploadDate: new Date()
    }));

    setProcessingFiles(prev => [...prev, ...newFiles]);
    setIsProcessing(true);

    // Simulate batch processing
    newFiles.forEach(async (appFile) => {
      const { status, processedUrl } = await processFileMock(appFile, 'general', (p) => {
        setProcessingFiles(prev => prev.map(f => f.id === appFile.id ? { ...f, progress: p, status: p === 100 ? 'completed' : 'processing' } : f));
      });

      // Add to history
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: appFile.name,
        fileType: appFile.type,
        action: 'Batch Processed',
        date: 'Just now',
        status: 'Completed',
        downloadUrl: processedUrl
      };
      setActivities(prev => [newActivity, ...prev]);
    });
  }, []);

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities;
    return activities.filter(a => a.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || a.action.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activities, searchQuery]);

  return (
    <HashRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-slate-900 transition-colors duration-300">
        <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
        
        <div className="flex flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-8 gap-8">
          <SidebarWrapper plan={userPlan} onToolSelect={setCurrentToolId} />
          
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard onUpload={handleUpload} activities={filteredActivities} />} />
              <Route path="/history" element={<Dashboard onUpload={handleUpload} activities={filteredActivities} />} />
              {TOOLS.map(tool => (
                <Route 
                  path={`/tool/${tool.id}`} 
                  element={
                    <ToolView 
                      tool={tool} 
                      onProcess={handleUpload} 
                      isProcessing={isProcessing} 
                      processingFiles={processingFiles.filter(f => f.toolUsed === tool.id || !f.toolUsed)} 
                    />
                  } 
                />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}

// Simple wrapper to detect tool context from URL
const SidebarWrapper: React.FC<{ plan: UserPlan; onToolSelect: (id: string | null) => void }> = ({ plan, onToolSelect }) => {
  const location = useLocation();
  const currentId = location.pathname.startsWith('/tool/') ? location.pathname.split('/').pop() || null : null;
  
  useEffect(() => {
    onToolSelect(currentId);
  }, [currentId, onToolSelect]);

  return <Sidebar plan={plan} currentToolId={currentId} />;
};
