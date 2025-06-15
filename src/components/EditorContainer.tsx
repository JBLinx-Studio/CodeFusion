import React, { useRef, useEffect, useState } from 'react';
import { CodeEditor } from "@/components/CodeEditor";
import { PreviewPanel } from "@/components/PreviewPanel";
import { FileExplorer } from "@/components/FileExplorer";
import { AIAssistant } from "@/components/AiAssistant";
import { BackendPanel } from "@/components/BackendPanel";
import { useLayout } from '@/contexts/LayoutContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "sonner";
import { GripVertical, Play, Save, Server, X, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabbedEditors } from "@/components/TabbedEditors";

// Helper for managing open files in state:
const useOpenFiles = (initial: string) => {
  const [openFiles, setOpenFiles] = useState([initial]);
  const [current, setCurrent] = useState(initial);

  // Open a new tab if needed
  const openFile = (file: string) => {
    setOpenFiles((prev) =>
      prev.includes(file) ? prev : [...prev, file]
    );
    setCurrent(file);
  };

  // Close tab, set next active
  const closeFile = (file: string) => {
    let idx = openFiles.indexOf(file);
    let next = openFiles[Math.max(idx - 1, 0)] || initial;
    setOpenFiles((prev) => prev.filter((f) => f !== file));
    if (file === current) {
      setCurrent(next);
    }
  };

  // Move file to front
  const selectFile = (file: string) => {
    setCurrent(file);
    if (!openFiles.includes(file)) {
      setOpenFiles([...openFiles, file]);
    }
  };

  return { openFiles, current, openFile, closeFile, selectFile, setOpenFiles };
};

export const EditorContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackendPanel, setShowBackendPanel] = useState<boolean>(false);
  const [showShortcutsPanel, setShowShortcutsPanel] = useState<boolean>(true);
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState(false);

  const {
    view,
    setView,
    panelWidth,
    isMobile,
    startResize,
    showAiAssistant,
    setShowAiAssistant,
  } = useLayout();

  const {
    files,
    currentFile,
    handleFileSelect,
    handleAddFile,
    handleDeleteFile,
    handleFileChange,
    getCurrentFileType,
    getTagColorForFile,
    handleRenameFile,
  } = useFileSystem();

  // --- NEW: Manage open files and selected tab! ---
  const openFilesApi = useOpenFiles(currentFile);

  useEffect(() => {
    // Sync open files if currentFile changes externally:
    if (!openFilesApi.openFiles.includes(currentFile)) {
      openFilesApi.openFile(currentFile);
    }
    openFilesApi.selectFile(currentFile);
    // eslint-disable-next-line
  }, [currentFile]);

  // --- End openFiles/bar logic ---

  // Pin state for files (optional, can be extended) --
  const [pinnedFiles, setPinnedFiles] = useState<string[]>([]);
  const isFilePinned = (file: string) => pinnedFiles.includes(file);
  const onPinFile = (file: string) => setPinnedFiles((prev) => [...prev, file]);
  const onUnpinFile = (file: string) => setPinnedFiles((prev) => prev.filter(f => f !== file));

  // Action buttons
  const saveCode = () => { toast.success("Changes saved successfully"); };
  const runCode = () => { setView('preview'); toast.success("Running your code"); };
  const toggleBackendPanel = () => { setShowBackendPanel((b) => !b); toast.info(showBackendPanel ? "Backend panel closed" : "Backend panel opened"); };

  // Insert code from AI
  const insertCodeFromAI = (code: string) => {
    handleFileChange(files[currentFile].content + '\n' + code);
    toast.success("Code inserted successfully");
  };

  // File explorer show/hide
  const shouldShowFileExplorer = () => !isFileExplorerCollapsed && (view !== "preview" || !isMobile);

  return (
    <motion.div
      className="flex flex-1 overflow-hidden rounded-xl shadow-2xl border border-[#2d3748]/30 bg-gradient-to-br from-[#0c1018]/90 to-[#151d2e]/90 backdrop-blur-sm h-full"
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height: 'calc(100vh - 120px)' }}
    >
      {/* ----- SIDEBAR ------ */}
      <AnimatePresence>
        {shouldShowFileExplorer() && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="relative w-60 h-full flex-shrink-0 bg-gradient-to-b from-[#0c101a]/95 to-[#151d2e]/95"
          >
            <FileExplorer
              files={files}
              currentFile={currentFile}
              onSelectFile={(file) => {
                openFilesApi.openFile(file);
                handleFileSelect(file);
                isMobile && toast.info(`Editing ${file}`);
              }}
              onAddFile={handleAddFile}
              onDeleteFile={(file) => {
                handleDeleteFile(file);
                openFilesApi.closeFile(file);
                toast.success("File deleted");
              }}
              onRenameFile={(oldName, newName) => {
                handleRenameFile(oldName, newName);
              }}
              dockedFiles={[]} // Remove docked file logic; just tabs now!
              toggleDockedFile={() => {}}
              onCollapse={() => setIsFileExplorerCollapsed(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/collapse sidebar button */}
      {isFileExplorerCollapsed && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-[#151922]/90 border border-[#374151]/70 rounded-r-lg px-2 py-2 shadow-lg flex items-center hover:bg-[#232a44]/80 transition-all group"
          aria-label="Show Project Files"
          style={{ width: '32px', minHeight: '56px' }}
          onClick={() => setIsFileExplorerCollapsed(false)}
        >
          <span className="sr-only">Expand Project Files</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}

      {/* ------- MAIN EDITOR & TABS ------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab bar */}
        <TabbedEditors
          openFiles={openFilesApi.openFiles}
          currentFile={openFilesApi.current}
          files={files}
          onSelectTab={(file) => { openFilesApi.selectFile(file); handleFileSelect(file); }}
          onCloseTab={(file) => { openFilesApi.closeFile(file); }}
          onPinFile={onPinFile}
          onUnpinFile={onUnpinFile}
          isFilePinned={isFilePinned}
          getTagColorForFile={getTagColorForFile}
        />
        {/* Main compact toolbar */}
        <div className="flex gap-2 px-4 py-2 border-b border-[#212744] items-center bg-[#181d2e]">
          <Button
            size="sm"
            onClick={saveCode}
            className="primary-button"
          >
            <Save size={14} /> Save
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white shadow-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1"
          >
            <Play size={14} /> Run
          </Button>
          <Button
            size="sm"
            onClick={toggleBackendPanel}
            className={`${showBackendPanel ? 'bg-[#6366f1] hover:bg-[#4f46e5]' : 'bg-[#374151] hover:bg-[#4b5563]'} text-white shadow-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1`}
          >
            <Server size={14} /> Backend
          </Button>
        </div>
        {/* The single visible code editor */}
        <ScrollArea className="h-full flex-1">
          {files[openFilesApi.current] && (
            <div className="min-h-[340px] pt-2">
              <CodeEditor
                language={getCurrentFileType(openFilesApi.current)}
                displayName={openFilesApi.current}
                value={files[openFilesApi.current]?.content || ''}
                onChange={handleFileChange}
                tagColor={getTagColorForFile(openFilesApi.current).color}
                tagBgColor={getTagColorForFile(openFilesApi.current).bgColor}
                isActive={openFilesApi.current === currentFile}
                onSelect={() => handleFileSelect(openFilesApi.current)}
              />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ----------- PREVIEW + BACKEND ------------- */}
      {(view === 'preview') && (
        <div className="flex-1 flex flex-col bg-[#181d2e]">
          <PreviewPanel
            html={files['index.html']?.content || ''}
            css={files['styles.css']?.content || ''}
            js={files['script.js']?.content || ''}
            showBackendPanel={showBackendPanel}
            onToggleBackendPanel={toggleBackendPanel}
          />
          {showBackendPanel && (
            <BackendPanel />
          )}
        </div>
      )}

      {/* --- AI Assistant (unchanged) --- */}
      <AnimatePresence>
        {showAiAssistant && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 z-50"
            style={{ pointerEvents: showAiAssistant ? 'auto' : 'none' }}
          >
            <AIAssistant
              visible={showAiAssistant}
              onClose={() => setShowAiAssistant(false)}
              onInsertCode={insertCodeFromAI}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Shortcuts/help unchanged */}
      {showShortcutsPanel && (
        <motion.div 
          className="fixed bottom-4 left-4 rounded-md bg-[#1a1f2c]/80 backdrop-blur-sm border border-[#374151]/50 px-3 py-2 z-20 shadow-lg hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {/* Close ("X") Button */}
          <button
            aria-label="Close keyboard shortcuts"
            className="absolute top-2 right-2 p-1 rounded hover:bg-[#232a44]/80 transition-colors"
            onClick={() => setShowShortcutsPanel(false)}
            style={{ zIndex: 10 }}
          >
            <X size={15} className="text-[#a5b4fc]" />
          </button>
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#9ca3af] font-medium">Keyboard Shortcuts</span>
              <GripVertical size={12} className="text-[#9ca3af]" />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <div className="flex items-center">
                <kbd className="kbd">Alt+1-3</kbd>
                <span className="text-[10px] text-[#9ca3af] ml-1.5">Views</span>
              </div>
              <div className="flex items-center">
                <kbd className="kbd">Alt+D</kbd>
                <span className="text-[10px] text-[#9ca3af] ml-1.5">Dock</span>
              </div>
              <div className="flex items-center">
                <kbd className="kbd">Alt+A</kbd>
                <span className="text-[10px] text-[#9ca3af] ml-1.5">AI</span>
              </div>
              <div className="flex items-center">
                <kbd className="kbd">Alt+B</kbd>
                <span className="text-[10px] text-[#9ca3af] ml-1.5">Backend</span>
              </div>
              <div className="flex items-center">
                <kbd className="kbd">Ctrl+S</kbd>
                <span className="text-[10px] text-[#9ca3af] ml-1.5">Save</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Restore Shortcuts Floating Button */}
      {!showShortcutsPanel && (
        <button
          aria-label="Show keyboard shortcuts"
          className="fixed bottom-4 left-4 z-30 bg-[#1e293b]/70 border border-[#2d3748]/50 shadow-lg backdrop-blur-sm rounded-full p-2 hover:bg-[#374151] transition-all flex items-center md:block hidden"
          onClick={() => setShowShortcutsPanel(true)}
        >
          <Keyboard size={18} className="text-[#a5b4fc]" />
        </button>
      )}
    </motion.div>
  );
};
