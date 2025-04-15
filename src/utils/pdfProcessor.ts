
import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set the PDF.js worker source with the exact version
const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export interface ExtractedScheduleItem {
  date: Date | null;
  title: string;
  description: string;
}

/**
 * Extract schedule items from PDF content
 */
export const extractScheduleFromPDF = async (fileBuffer: ArrayBuffer): Promise<ExtractedScheduleItem[]> => {
  try {
    console.log("Starting PDF processing with pdf.js");
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;
    console.log("PDF loaded, pages:", pdf.numPages);
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (item as TextItem).str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    console.log("Extracted PDF text:", fullText);
    
    // Simple parsing logic - looks for patterns like:
    // Date: MM/DD/YYYY or MM-DD-YYYY
    // Title: Some Title
    // Description: Some description
    const scheduleItems: ExtractedScheduleItem[] = [];
    
    // Simple regex to find date patterns
    const dateRegex = /(?:Date|On|Schedule for|Due):\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/gi;
    const titleRegex = /(?:Title|Topic|Subject|Task):\s*([^\n]+)/gi;
    const descRegex = /(?:Description|Details|Notes):\s*([^\n]+)/gi;
    
    let dateMatches = [...fullText.matchAll(dateRegex)];
    let titleMatches = [...fullText.matchAll(titleRegex)];
    let descMatches = [...fullText.matchAll(descRegex)];
    
    // If structured data wasn't found, try to infer items from the text
    if (dateMatches.length === 0) {
      // Look for date patterns in the text
      const simpleDateRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/g;
      dateMatches = [...fullText.matchAll(simpleDateRegex)];
      
      // Try to extract topics near the dates
      if (dateMatches.length > 0) {
        dateMatches.forEach((match, index) => {
          const dateStr = match[1];
          
          // Try to parse date
          const date = parseDate(dateStr);
          
          // Get the line containing this date
          const lines = fullText.split('\n');
          const dateLine = lines.find(line => line.includes(dateStr)) || '';
          
          // Extract potential title (words after the date)
          const titlePart = dateLine.split(dateStr)[1]?.trim() || `Study Session ${index + 1}`;
          
          scheduleItems.push({
            date,
            title: titlePart || `Study Session ${index + 1}`,
            description: `Extracted from schedule PDF (page ${pdf.numPages})`
          });
        });
      }
    } else {
      // Process structured format
      for (let i = 0; i < Math.max(dateMatches.length, titleMatches.length); i++) {
        const dateStr = dateMatches[i]?.[1] || '';
        const title = titleMatches[i]?.[1] || `Study Session ${i + 1}`;
        const description = descMatches[i]?.[1] || 'Extracted from uploaded schedule';
        
        scheduleItems.push({
          date: parseDate(dateStr),
          title,
          description
        });
      }
    }
    
    // If no items could be extracted, create a single generic item
    if (scheduleItems.length === 0) {
      scheduleItems.push({
        date: new Date(),
        title: "Study Session from PDF",
        description: `Content: ${fullText.substring(0, 100)}...`
      });
    }
    
    console.log("Extracted schedule items:", scheduleItems);
    return scheduleItems;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return [];
  }
};

/**
 * Parse date from string in various formats
 */
const parseDate = (dateStr: string): Date | null => {
  try {
    // Handle various date formats
    const cleanDateStr = dateStr.replace(/[^\d\/\-]/g, '');
    
    // Try MM/DD/YYYY or MM-DD-YYYY
    if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(cleanDateStr)) {
      const parts = cleanDateStr.split(/[\/\-]/);
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10) - 1; // 0-based month
        const day = parseInt(parts[1], 10);
        
        // Handle 2-digit and 4-digit years
        let year = parseInt(parts[2], 10);
        if (year < 100) {
          year += year < 50 ? 2000 : 1900;
        }
        
        return new Date(year, month, day);
      }
    }
    
    // Fallback to standard date parsing
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

/**
 * Utility function to sanitize file names for storage
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove square brackets, parentheses, and other special characters
  return fileName
    .replace(/[\[\]\(\)\{\}<>]/g, '_')
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_');
};
