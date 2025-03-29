
import { useState } from "react";
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
  FileQuestion
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

interface NoteFile {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  content?: string; // For demo purposes
}

const SAMPLE_FILES: NoteFile[] = [
  {
    id: "1",
    name: "Math Notes.pdf",
    type: "pdf",
    size: "2.4 MB",
    lastModified: "2023-10-15",
    content: "This is a sample PDF content. In a real application, this would be the actual PDF content."
  },
  {
    id: "2",
    name: "Physics Formulas.doc",
    type: "doc",
    size: "1.8 MB",
    lastModified: "2023-09-28",
    content: "This is a sample DOC content. In a real application, this would be the actual DOC content."
  },
  {
    id: "3",
    name: "Chemistry Lab Report.pdf",
    type: "pdf",
    size: "4.2 MB",
    lastModified: "2023-11-05",
    content: "This is a sample PDF content. In a real application, this would be the actual PDF content."
  }
];

const MyNotes = () => {
  const [files, setFiles] = useState<NoteFile[]>(SAMPLE_FILES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<NoteFile | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const newFiles: NoteFile[] = Array.from(fileList).map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.name.split('.').pop() || "unknown",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        lastModified: new Date(file.lastModified).toLocaleDateString(),
        content: "This is a sample content for the uploaded file. In a real application, this would be the actual file content."
      }));
      
      setFiles([...files, ...newFiles]);
      toast.success(`Uploaded ${newFiles.length} file(s) successfully`);
      e.target.value = "";
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast.success("File deleted successfully");
  };

  const handleViewFile = (file: NoteFile) => {
    setSelectedFile(file);
    setViewOpen(true);
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
            accept=".pdf,.doc,.docx"
            multiple
          />
          <label htmlFor="file-upload">
            <Button variant="default" className="bg-studyhub-600 hover:bg-studyhub-700 cursor-pointer" asChild>
              <div>
                <Upload className="mr-2 h-4 w-4" />
                Upload
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
                          file.type === "pdf" ? "text-red-500" : "text-blue-500"
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
                      <div className="text-xs text-muted-foreground mb-4">
                        Last modified: {file.lastModified}
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

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedFile?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedFile?.type.toUpperCase()} • {selectedFile?.size}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6 bg-muted/30 rounded-md border">
            {selectedFile && (
              <div className="h-full flex items-center justify-center">
                {/* In a real app, this would render the actual file content */}
                <div className="text-center">
                  <FileText className={cn(
                    "h-16 w-16 mx-auto mb-4",
                    selectedFile.type === "pdf" ? "text-red-500" : "text-blue-500"
                  )} />
                  <h3 className="text-lg font-medium mb-2">Document Preview</h3>
                  <p className="text-muted-foreground">
                    {selectedFile.content}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    In a real application, the document would be rendered here using
                    appropriate viewers for PDF, DOC, etc.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyNotes;
