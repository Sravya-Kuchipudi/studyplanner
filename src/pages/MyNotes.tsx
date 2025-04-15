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
  AlertCircle,
  ChevronLeft,
  ChevronRight
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
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeFileName } from "@/utils/pdfProcessor";

const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

interface NoteFile {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  content?: string;
  pdfUrl?: string;
  subject?: string;
  text?: string;
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
  
  return "Other";
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
};

const extractTextFromPdf = async (url: string): Promise<string> => {
  try {
    console.log("Extracting text from PDF with worker URL:", pdfWorkerSrc);
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
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
  
  const [timer, setTimer] = useState<Timer>({
    seconds: 0,
    isRunning: false,
    subjectName: null
  });
  
  const timerRef = useRef<number | null>(null);
  
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
  
  useEffect(() => {
    localStorage.setItem('studyNotes', JSON.stringify(files));
  }, [files]);
  
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
  
  useEffect(() => {
    if (!timer.isRunning && timer.seconds > 0 && timer.subjectName) {
      const timeSpent = JSON.parse(localStorage.getItem('studyTimeSpent') || '{}');
      timeSpent[timer.subjectName] = (timeSpent[timer.subjectName] || 0) + timer.seconds;
      localStorage.setItem('studyTimeSpent', JSON.stringify(timeSpent));
      
      toast.success(`Study session saved: ${formatTime(timer.seconds)} on ${timer.subjectName}`);
    }
  }, [timer.isRunning, timer.seconds, timer.subjectName]);
  
  useEffect(() => {
    if (!viewOpen && timer.isRunning) {
      setTimer(prev => ({
        ...prev,
        isRunning: false
      }));
    }
  }, [viewOpen]);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserFiles();
    }
  }, [user]);

  const loadUserFiles = async () => {
    try {
      const { data: files, error } = await supabase
        .from('study_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (files) {
        const loadedFiles = await Promise.all(files.map(async (file) => {
          const { data: signedUrl } = await supabase
            .storage
            .from('study-files')
            .createSignedUrl(`${user?.id}/${file.storage_path}`, 3600);
            
          const fileDate = new Date(file.created_at || Date.now()).toISOString().split('T')[0];

          return {
            id: file.id,
            name: file.name,
            type: file.file_type,
            size: file.size,
            pdfUrl: signedUrl?.signedUrl,
            subject: file.subject,
            lastModified: fileDate
          };
        }));

        setFiles(loadedFiles);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load your files");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || !user) return;
    
    setIsUploadingFile(true);
    
    try {
      for (const file of Array.from(fileList)) {
        const fileId = crypto.randomUUID();
        const fileType = file.name.split('.').pop()?.toLowerCase() || "unknown";
        const subject = getSubjectFromFilename(file.name);
        
        const sanitizedFileName = sanitizeFileName(file.name);
        const storagePath = `${sanitizedFileName}-${fileId}`;
        
        const { error: uploadError } = await supabase.storage
          .from('study-files')
          .upload(`${user.id}/${storagePath}`, file);

        if (uploadError) throw uploadError;

        const { data: signedUrl } = await supabase.storage
          .from('study-files')
          .createSignedUrl(`${user.id}/${storagePath}`, 3600);

        const { error: dbError } = await supabase
          .from('study_files')
          .insert({
            id: fileId,
            user_id: user.id,
            name: file.name,
            file_type: fileType,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            storage_path: storagePath,
            subject: subject
          });

        if (dbError) throw dbError;

        const currentDate = new Date().toISOString().split('T')[0];

        const newFile: NoteFile = {
          id: fileId,
          name: file.name,
          type: fileType,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          lastModified: currentDate,
          pdfUrl: signedUrl?.signedUrl,
          subject: subject
        };

        setFiles(prev => [...prev, newFile]);
      }
      
      toast.success(`Uploaded file(s) successfully`);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error uploading file(s). Please try again.");
    } finally {
      setIsUploadingFile(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!user) return;

    try {
      const fileToDelete = files.find(file => file.id === id);
      if (!fileToDelete) return;

      const { error: storageError } = await supabase.storage
        .from('study-files')
        .remove([`${user.id}/${fileToDelete.name}-${fileToDelete.id}`]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('study_files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setFiles(files.filter(file => file.id !== id));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleViewFile = async (file: NoteFile) => {
    setSelectedFile(file);
    setViewOpen(true);
    
    setTimer({
      seconds: 0,
      isRunning: true,
      subjectName: file.subject || null
    });
    
    if (file.type === 'pdf' && file.pdfUrl) {
      try {
        setIsLoadingPdf(true);
        console.log("Loading PDF for viewing:", file.name, "URL:", file.pdfUrl);
        
        const loadingTask = pdfjs.getDocument(file.pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfTotalPages(pdf.numPages);
        setPdfPageNum(1);
        
        setPdfPageText("PDF loaded successfully");
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF. Please try again.");
        setPdfPageText("Error loading PDF content. The file might be corrupted or unsupported.");
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
        const loadingTask = pdfjs.getDocument(selectedFile.pdfUrl);
        const pdf = await loadingTask.promise;
        
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
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
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
                          <iframe 
                            src={`${selectedFile.pdfUrl}#page=${pdfPageNum}`} 
                            className="w-full h-full min-h-[500px] border-none"
                            title={selectedFile.name}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Button 
                            onClick={() => setPdfPageNum(prev => Math.max(1, prev - 1))} 
                            disabled={pdfPageNum <= 1}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous Page
                          </Button>
                          <span className="text-sm font-medium">
                            Page {pdfPageNum} of {pdfTotalPages}
                          </span>
                          <Button 
                            onClick={() => setPdfPageNum(prev => Math.min(pdfTotalPages, prev + 1))} 
                            disabled={pdfPageNum >= pdfTotalPages}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            Next Page
                            <ChevronRight className="h-4 w-4" />
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
