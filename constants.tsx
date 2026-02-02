
import React from 'react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  // PDF Tools
  { id: 'merge-pdf', name: 'Merge PDF', icon: 'picture_as_pdf', category: 'PDF', description: 'Combine multiple PDFs into one single document.' },
  { id: 'compress-pdf', name: 'Compress PDF', icon: 'compress', category: 'PDF', description: 'Reduce PDF file size while maintaining quality.' },
  { id: 'split-pdf', name: 'Split PDF', icon: 'content_cut', category: 'PDF', description: 'Extract specific pages from your PDF files.' },
  { id: 'protect-pdf', name: 'Protect PDF', icon: 'lock', category: 'PDF', description: 'Add password protection to your sensitive documents.' },
  
  // Office Tools
  { id: 'word-to-pdf', name: 'Word to PDF', icon: 'description', category: 'OFFICE', description: 'Convert Microsoft Word documents to PDF format.' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', icon: 'table_chart', category: 'OFFICE', description: 'Convert Excel spreadsheets into professional PDFs.' },
  { id: 'ppt-to-pdf', name: 'PPT to PDF', icon: 'present_to_all', category: 'OFFICE', description: 'Turn PowerPoint slides into high-quality PDFs.' },
  
  // Conversion Tools
  { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: 'image', category: 'CONVERSION', description: 'Convert image files like JPG and PNG to PDF.' },
  { id: 'ocr-pdf', name: 'OCR PDF', icon: 'translate', category: 'CONVERSION', description: 'Extract editable text from scanned PDF documents.' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: 'article', category: 'CONVERSION', description: 'Convert PDF back to editable Word documents.' },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
