
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Folder, 
  FileText, 
  Upload, 
  Search, 
  FilePlus2, 
  X,
  Download,
  FileQuestion,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set the PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface NoteFile {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  content?: string; // For text content
  pdfUrl?: string; // For PDF content
  subject?: string; // Associated subject
  text?: string; // Extracted text content
}

interface Timer {
  seconds: number;
  isRunning: boolean;
  subjectName: string | null;
}

const SAMPLE_FILES: NoteFile[] = [
  {
    id: "1",
    name: "Math Notes.pdf",
    type: "pdf",
    size: "2.4 MB",
    lastModified: "2023-10-15",
    content: "This is a sample PDF content. In a real application, this would be the actual PDF content.",
    subject: "Mathematics"
  },
  {
    id: "2",
    name: "Physics Formulas.doc",
    type: "doc",
    size: "1.8 MB",
    lastModified: "2023-09-28",
    content: "This is a sample DOC content. In a real application, this would be the actual DOC content.",
    subject: "Physics"
  },
  {
    id: "3",
    name: "Chemistry Lab Report.pdf",
    type: "pdf",
    size: "4.2 MB",
    lastModified: "2023-11-05",
    content: "This is a sample PDF content. In a real application, this would be the actual PDF content.",
    subject: "Chemistry"
  }
];

// Helper function to extract subject from filename
const getSubjectFromFilename = (filename: string): string => {
  const knownSubjects = [
    "Mathematics", "Math", 
    "Physics", 
    "Chemistry", 
    "Biology", 
    "Computer Science", "CS", "Programming"
  ];
  
  for (const subject of knownSubjects) {
    if (filename.toLowerCase().includes(subject.toLowerCase())) {
      return subject.includes(" ") ? subject : subject;
    }
  }
  
  // Default to "Other" if no subject found
  return "Other";
};

// Helper function to format time
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
};

// Helper function to extract text from PDF files
const extractTextFromPdf = async (url: string): Promise<string> => {
  try {
    const pdf = await pdfjs.getDocument(url).promise;
    let fullText = '';
    
    // Extract text from first 5 pages (or fewer if the document has fewer pages)
    const maxPages = Math.min(pdf.numPages, 5);
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => (item as TextItem).str)
        .join(' ');
      
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "Failed to extract text from PDF.";
  }
};

// Helper function to read text files
const readTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsText(file);
  });
};

const MyNotes = () => {
  const [files, setFiles] = useState<NoteFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<NoteFile | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [pdfPageText, setPdfPageText] = useState<string>("");
  const [pdfPageNum, setPdfPageNum] = useState<number>(1);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  
  // Timer state
  const [timer, setTimer] = useState<Timer>({
    seconds: 0,
    isRunning: false,
    subjectName: null
  });
  
  const timerRef = useRef<number | null>(null);
  
  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('studyNotes');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);
      } catch (error) {
        console.error("Error parsing saved files:", error);
        setFiles(SAMPLE_FILES);
      }
    } else {
      setFiles(SAMPLE_FILES);
    }
  }, []);
  
  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyNotes', JSON.stringify(files));
  }, [files]);
  
  // Timer logic
  useEffect(() => {
    if (timer.isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimer(prev => ({
          ...prev,
          seconds: prev.seconds + 1
        }));
      }, 1000);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer.isRunning]);
  
  // Save timer data when it stops
  useEffect(() => {
    if (!timer.isRunning && timer.seconds > 0 && timer.subjectName) {
      // Save time spent to localStorage
      const timeSpent = JSON.parse(localStorage.getItem('studyTimeSpent') || '{}');
      timeSpent[timer.subjectName] = (timeSpent[timer.subjectName] || 0) + timer.seconds;
      localStorage.setItem('studyTimeSpent', JSON.stringify(timeSpent));
      
      // Show toast notification
      toast.success(`Study session saved: ${formatTime(timer.seconds)} on ${timer.subjectName}`);
    }
  }, [timer.isRunning, timer.seconds, timer.subjectName]);
  
  // Stop timer when dialog closes
  useEffect(() => {
    if (!viewOpen && timer.isRunning) {
      setTimer(prev => ({
        ...prev,
        isRunning: false
      }));
    }
  }, [viewOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      setIsUploadingFile(true);
      const newFiles: NoteFile[] = [];
      
      try {
        for (const file of Array.from(fileList)) {
          const fileId = crypto.randomUUID();
          const fileType = file.name.split('.').pop()?.toLowerCase() || "unknown";
          const subject = getSubjectFromFilename(file.name);
          
          // Create a URL for the file
          const fileUrl = URL.createObjectURL(file);
          
          const newFile: NoteFile = {
            id: fileId,
            name: file.name,
            type: fileType,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            lastModified: new Date(file.lastModified).toLocaleDateString(),
            subject: subject
          };
          
          // Handle different file types
          if (fileType === 'pdf') {
            newFile.pdfUrl = fileUrl;
            // Extract text from PDF for preview
            const extractedText = await extractTextFromPdf(fileUrl);
            newFile.text = extractedText;
          } else if (['txt', 'md', 'csv'].includes(fileType)) {
            // Read text files directly
            const textContent = await readTextFile(file);
            newFile.content = textContent;
            newFile.text = textContent.substring(0, 500) + (textContent.length > 500 ? '...' : '');
          } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType)) {
            // For Office documents, just store the URL and a placeholder
            newFile.pdfUrl = fileUrl;
            newFile.content = `Content for ${fileType.toUpperCase()} file. Upload a PDF for better preview.`;
          } else {
            // For other files, just store a placeholder
            newFile.content = `Content for uploaded file. File type: ${fileType.toUpperCase()}`;
          }
          
          newFiles.push(newFile);
        }
        
        setFiles([...files, ...newFiles]);
        toast.success(`Uploaded ${newFiles.length} file(s) successfully`);
      } catch (error) {
        console.error("Error processing uploaded files:", error);
        toast.error("Error processing some files. Please try again.");
      } finally {
        setIsUploadingFile(false);
        if (e.target) {
          e.target.value = "";
        }
      }
    }
  };

  const handleDeleteFile = (id: string) => {
    // Revoke object URL if it exists
    const fileToDelete = files.find(file => file.id === id);
    if (fileToDelete?.pdfUrl) {
      URL.revokeObjectURL(fileToDelete.pdfUrl);
    }
    
    setFiles(files.filter(file => file.id !== id));
    toast.success("File deleted successfully");
  };

  const handleViewFile = async (file: NoteFile) => {
    setSelectedFile(file);
    setViewOpen(true);
    
    // Start the timer
    setTimer({
      seconds: 0,
      isRunning: true,
      subjectName: file.subject || null
    });
    
    // If it's a PDF and has a URL, load it
    if (file.type === 'pdf' && file.pdfUrl) {
      try {
        setIsLoadingPdf(true);
        const pdf = await pdfjs.getDocument(file.pdfUrl).promise;
        setPdfTotalPages(pdf.numPages);
        setPdfPageNum(1);
        
        // Load first page
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => (item as TextItem).str)
          .join(' ');
        
        setPdfPageText(pageText);
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF. Please try again.");
      } finally {
        setIsLoadingPdf(false);
      }
    }
  };

  const handlePdfPageChange = async (direction: 'prev' | 'next') => {
    if (!selectedFile?.pdfUrl) return;
    
    try {
      setIsLoadingPdf(true);
      const newPageNum = direction === 'next' 
        ? Math.min(pdfPageNum + 1, pdfTotalPages)
        : Math.max(pdfPageNum - 1, 1);
      
      if (newPageNum !== pdfPageNum) {
        const pdf = await pdfjs.getDocument(selectedFile.pdfUrl).promise;
        const page = await pdf.getPage(newPageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => (item as TextItem).str)
          .join(' ');
        
        setPdfPageText(pageText);
        setPdfPageNum(newPageNum);
      }
    } catch (error) {
      console.error("Error changing PDF page:", error);
      toast.error("Failed to change page. Please try again.");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleDownloadFile = (file: NoteFile) => {
    if (file.pdfUrl) {
      const link = document.createElement('a');
      link.href = file.pdfUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${file.name}`);
    } else {
      toast.error("Download link not available for this file");
    }
  };

  const handleDialogClose = () => {
    setViewOpen(false);
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
          <p className="text-muted-foreground">
            Manage and view your study notes and documents
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.md,.csv"
            multiple
            disabled={isUploadingFile}
          />
          <label htmlFor="file-upload">
            <Button 
              variant="default" 
              className={cn(
                "bg-studyhub-600 hover:bg-studyhub-700 cursor-pointer",
                isUploadingFile && "opacity-70 cursor-not-allowed"
              )} 
              disabled={isUploadingFile}
              asChild
            >
              <div>
                {isUploadingFile ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </div>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-studyhub-500" />
              Document Library
            </CardTitle>
            <div className="ml-auto text-sm text-muted-foreground">
              {filteredFiles.length} file(s)
            </div>
          </CardHeader>
          <CardContent>
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No files found</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  {searchQuery 
                    ? "Try adjusting your search query or upload new files." 
                    : "Upload PDF or DOC files to get started."}
                </p>
                <label htmlFor="file-upload">
                  <Button variant="outline" className="mt-4 cursor-pointer" asChild>
                    <div>
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Upload New File
                    </div>
                  </Button>
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border rounded-lg overflow-hidden hover:border-studyhub-300 transition-colors"
                  >
                    <div className="flex items-center justify-between p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <FileText className={cn(
                          "h-5 w-5",
                          file.type === "pdf" ? "text-red-500" : 
                          file.type === "doc" || file.type === "docx" ? "text-blue-500" : 
                          file.type === "txt" || file.type === "md" ? "text-green-500" : 
                          "text-gray-500"
                        )} />
                        <span className="font-medium truncate max-w-[120px]">
                          {file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-3">
                        <span>{file.type.toUpperCase()}</span>
                        <span>{file.size}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-4 flex flex-col gap-1">
                        <div>Last modified: {file.lastModified}</div>
                        {file.subject && (
                          <div className="flex items-center gap-1">
                            <span>Subject:</span>
                            <span className="font-medium">{file.subject}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => handleViewFile(file)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={viewOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  {selectedFile?.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedFile?.type.toUpperCase()} • {selectedFile?.size}
                </DialogDescription>
              </div>
              {timer.isRunning && (
                <div className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-studyhub-500" />
                  <span>{formatTime(timer.seconds)}</span>
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6 bg-muted/30 rounded-md border">
            {selectedFile && (
              <div className="h-full">
                {selectedFile.type === 'pdf' && selectedFile.pdfUrl ? (
                  <div className="flex flex-col h-full">
                    {isLoadingPdf ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white p-4 rounded-md shadow mb-4 flex-1 overflow-auto">
                          <p className="whitespace-pre-line">{pdfPageText}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Button 
                            onClick={() => handlePdfPageChange('prev')} 
                            disabled={pdfPageNum <= 1}
                            variant="outline"
                            size="sm"
                          >
                            Previous Page
                          </Button>
                          <span className="text-sm font-medium">
                            Page {pdfPageNum} of {pdfTotalPages}
                          </span>
                          <Button 
                            onClick={() => handlePdfPageChange('next')} 
                            disabled={pdfPageNum >= pdfTotalPages}
                            variant="outline"
                            size="sm"
                          >
                            Next Page
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ) : selectedFile.type === 'txt' || selectedFile.type === 'md' || selectedFile.type === 'csv' ? (
                  <div className="bg-white p-4 rounded-md shadow h-full overflow-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {selectedFile.content}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className={cn(
                        "h-16 w-16 mx-auto mb-4",
                        selectedFile.type === "pdf" ? "text-red-500" : 
                        selectedFile.type === "doc" || selectedFile.type === "docx" ? "text-blue-500" : 
                        "text-gray-500"
                      )} />
                      <h3 className="text-lg font-medium mb-2">Document Preview</h3>
                      {selectedFile.text ? (
                        <div className="text-muted-foreground max-h-[400px] overflow-auto p-4 text-left border rounded-md bg-white">
                          <p className="whitespace-pre-line">{selectedFile.text}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-6 w-6 text-yellow-500" />
                          <p className="text-muted-foreground">
                            Preview not available for this file type.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyNotes;
