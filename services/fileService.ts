
import { AppFile, FileStatus, Activity } from '../types';

/**
 * Simulates an asynchronous file processing task.
 */
export const processFileMock = async (
  file: AppFile,
  toolId: string,
  onProgress: (progress: number) => void
): Promise<{ status: FileStatus; processedUrl?: string }> => {
  return new Promise((resolve) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        onProgress(100);
        // Simulate successful processing
        resolve({
          status: 'completed',
          processedUrl: URL.createObjectURL(new Blob(['Processed content'], { type: 'application/pdf' }))
        });
      } else {
        onProgress(currentProgress);
      }
    }, 400);
  });
};

export const INITIAL_ACTIVITY: Activity[] = [
  {
    id: '1',
    fileName: 'Q4_Financial_Report.pdf',
    fileType: 'pdf',
    action: 'Compressed',
    date: '2 hours ago',
    status: 'Completed',
    downloadUrl: '#'
  },
  {
    id: '2',
    fileName: 'Contract_Draft_v2.docx',
    fileType: 'docx',
    action: 'PDF Convert',
    date: 'Yesterday',
    status: 'Completed',
    downloadUrl: '#'
  }
];

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
