import React, { useState, useRef } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Folder, File, Plus, Trash2, Pencil, Check, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileType } from "@/types/file";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FileExplorerProps {
  files: Record<string, FileType>;
  currentFile: string;
  onSelectFile: (fileName: string) => void;
  onAddFile: (fileName: string, fileType: string) => void;
  onDeleteFile: (fileName: string) => void;
  onRenameFile?: (oldName: string, newName: string) => void;
  dockedFiles?: string[];
  toggleDockedFile?: (fileName: string) => void;
  onCollapse?: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  currentFile,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  dockedFiles = [],
  toggleDockedFile,
  onCollapse,
}) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("js");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isRenaming, setIsRenaming] = useState(false);
  const [fileToRename, setFileToRename] = useState("");
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isFileDocked = (fileName: string) => {
    return dockedFiles.includes(fileName);
  };

  const handleAddFile = () => {
    if (!newFileName) return;
    let finalFileName = newFileName;
    if (!finalFileName.includes('.')) {
      if (newFileType === 'html') finalFileName += '.html';
      else if (newFileType === 'css') finalFileName += '.css';
      else if (newFileType === 'js') finalFileName += '.js';
    }
    onAddFile(finalFileName, newFileType);
    setNewFileName("");
    setIsDialogOpen(false);
    toast.success(`Created new file: ${finalFileName}`);
  };

  const handleDeleteFile = (fileName: string) => {
    if (fileName === 'index.html' || fileName === 'styles.css' || fileName === 'script.js') {
      toast.error("Cannot delete default files");
      return;
    }
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      onDeleteFile(fileName);
      toast.success(`Deleted ${fileName}`);
    }
  };

  const startRenaming = (fileName: string) => {
    setFileToRename(fileName);
    setNewName(fileName);
    setIsRenaming(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);
  };

  const finishRenaming = () => {
    if (fileToRename && newName && fileToRename !== newName && onRenameFile) {
      const oldExt = fileToRename.split('.').pop();
      const hasExtension = newName.includes('.');
      let finalNewName = newName;
      if (!hasExtension && oldExt) {
        finalNewName = `${newName}.${oldExt}`;
      }
      if (finalNewName === fileToRename) {
        setIsRenaming(false);
        return;
      }
      if (Object.keys(files).includes(finalNewName)) {
        toast.error(`File ${finalNewName} already exists`);
      } else {
        onRenameFile(fileToRename, finalNewName);
        toast.success(`Renamed ${fileToRename} to ${finalNewName}`);
      }
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishRenaming();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  // --- Group + color files by type ---
  const htmlFiles = Object.keys(files).filter(name => name.endsWith('.html'));
  const cssFiles = Object.keys(files).filter(name => name.endsWith('.css'));
  const jsFiles = Object.keys(files).filter(name => name.endsWith('.js'));
  const otherFiles = Object.keys(files).filter(name => !name.endsWith('.html') && !name.endsWith('.css') && !name.endsWith('.js'));

  // --- Helper for tag color ---
  const fileColor = (fileName: string) =>
    fileName.endsWith('.html') ? "#ef4444"
    : fileName.endsWith('.css') ? "#3b82f6"
    : fileName.endsWith('.js') ? "#f59e0b"
    : "#9ca3af";

  // --- Render a single file row ---
  const renderFileRow = (fileName: string) => (
    <div
      key={fileName}
      className={`flex items-center px-2 py-1.5 rounded-md transition-all shadow-sm ${
        currentFile === fileName 
          ? 'bg-[#232a44] text-white border-l-4 border-[#6366f1]' 
          : 'hover:bg-[#232a44]/60 text-[#a1a1aa]'
      } mb-1`}
    >
      {/* Icon + filename */}
      <div
        className="flex-1 flex items-center gap-2 cursor-pointer"
        onClick={() => onSelectFile(fileName)}
      >
        <File size={16} className="flex-shrink-0" color={fileColor(fileName)} />
        {isRenaming && fileToRename === fileName ? (
          <>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={finishRenaming}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-b border-[#6366f1] text-white w-28 px-2 py-0.5 outline-none"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={finishRenaming} className="h-6 w-6 p-0">
              <Check size={14} className="text-green-500" />
            </Button>
          </>
        ) : (
          <span className="truncate font-medium text-[13px]">{fileName}</span>
        )}
        {isFileDocked(fileName) && 
          <span className="ml-1 text-[#6366f1] text-[11px] font-bold">●</span>
        }
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1">
        {toggleDockedFile && (
          <Button
            variant="ghost" size="icon"
            className={`h-6 w-6 p-0 ${isFileDocked(fileName) ? 'text-[#6366f1]' : 'text-[#9ca3af] hover:text-[#6366f1]'}`}
            onClick={e => { e.stopPropagation(); toggleDockedFile(fileName); }}
            aria-label={isFileDocked(fileName) ? "Undock file" : "Dock file"}
          >
            {isFileDocked(fileName) ? <PinOff size={14}/> : <Pin size={14}/>}
          </Button>
        )}
        <Button
          variant="ghost" size="icon"
          className="h-6 w-6 p-0 text-[#9ca3af] hover:text-[#3b82f6]"
          onClick={() => startRenaming(fileName)} aria-label="Rename file"
        >
          <Pencil size={14}/>
        </Button>
        <Button
          variant="ghost" size="icon"
          className="h-6 w-6 p-0 text-[#ef4444] hover:text-red-600"
          onClick={() => handleDeleteFile(fileName)} aria-label="Delete file"
        >
          <Trash2 size={14}/>
        </Button>
      </div>
    </div>
  );

  // --- Main Sidebar/Content ---
  return (
    <Sidebar className="h-full min-w-[220px] max-w-[340px] bg-gradient-to-b from-[#161c2b] to-[#1a1f2c]/90 border-r border-[#374151]/60 glassmorphism">
      <SidebarHeader className="flex justify-between items-center px-4 py-3 bg-[#151922]/90 border-b border-[#232a44] shadow-md">
        <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[#a5b4fc] tracking-wide">
          <Folder size={18} className="text-[#6366f1]" />
          Project Files
        </span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button aria-label="Add file" variant="ghost" size="icon"
              className="hover:bg-[#6366f1]/10">
              <Plus size={18} className="text-[#6366f1]"/>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-b from-[#181d2e] to-[#232a44] border border-[#6366f1]/40">
            <DialogHeader>
              <DialogTitle className="text-[#a5b4fc]">Create New File</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <input
                id="filename"
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g., utils.js"
                className="w-full p-2 bg-[#151922] border border-[#374151]/70 rounded text-[#e4e5e7] focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] outline-none transition-all"
              />
              <select
                id="filetype"
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value)}
                className="w-full p-2 bg-[#151922] border border-[#374151]/70 rounded text-[#e4e5e7] focus:ring-2 focus:ring-[#6366f1]/50 focus:border-[#6366f1] outline-none transition-all"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
              <Button onClick={handleAddFile} className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white mt-4">
                  Create File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarHeader>

      <SidebarContent className="p-4 overflow-y-auto custom-scrollbar">
        {/* Docked Files */}
        {dockedFiles && dockedFiles.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-1 mb-1 text-[#8b5cf6] text-xs font-semibold uppercase tracking-wide">
              <Pin size={14} className="text-[#6366f1]" /> Docked Files
            </div>
            <div>
              {dockedFiles.map((f) => renderFileRow(f))}
            </div>
            <div className="h-[1.5px] mx-1 my-2 bg-gradient-to-r from-[#4f46e5]/60 via-[#6366f1]/20 to-transparent rounded-full"/>
          </div>
        )}

        {/* By type (HTML, CSS, JS, Other) */}
        {htmlFiles.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1 mt-3 mb-1 text-[#ef4444]/90 text-xs font-bold">
              <Folder size={13} className="text-[#ef4444]" /> HTML
            </div>
            {htmlFiles.filter(f => !isFileDocked(f)).map(f => renderFileRow(f))}
          </>
        )}
        {cssFiles.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1 mt-3 mb-1 text-[#3b82f6]/90 text-xs font-bold">
              <Folder size={13} className="text-[#3b82f6]" /> CSS
            </div>
            {cssFiles.filter(f => !isFileDocked(f)).map(f => renderFileRow(f))}
          </>
        )}
        {jsFiles.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1 mt-3 mb-1 text-[#f59e0b]/90 text-xs font-bold">
              <Folder size={13} className="text-[#f59e0b]" /> JavaScript
            </div>
            {jsFiles.filter(f => !isFileDocked(f)).map(f => renderFileRow(f))}
          </>
        )}
        {otherFiles.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1 mt-3 mb-1 text-[#a1a1aa]/80 text-xs font-semibold">
              <Folder size={13} className="text-[#a1a1aa]" /> Other
            </div>
            {otherFiles.filter(f => !isFileDocked(f)).map(f => renderFileRow(f))}
          </>
        )}
      </SidebarContent>
      {onCollapse && (
        <SidebarFooter>
          <button
            className="w-full px-2 py-1 text-xs text-[#6366f1] rounded hover:bg-[#232a44]/40 transition-colors"
            onClick={onCollapse}
          >
            Collapse
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
