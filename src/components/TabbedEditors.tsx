import React from "react";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, X, File, Move } from "lucide-react"; // Fixed import
import { useDraggableTabs } from "./useDraggableTabs"; // Import hook

interface TabbedEditorsProps {
  dockedFiles: string[];
  currentFile: string;
  files: Record<string, { content: string }>;
  onSelectTab: (fileName: string) => void;
  onCloseTab: (fileName: string) => void;
  onUndockFile: (fileName: string) => void;
  isFileDocked: (fileName: string) => boolean;
  getTagColorForFile: (fileName: string) => { color: string; bgColor: string };
  getCurrentFileType: (fileName: string) => string;
  handleFileChange: (content: string) => void;
  handleFileSelect: (fileName: string) => void;
  CodeEditorComponent: any;
  onReorderDockedFiles?: (nextFiles: string[]) => void; // New, used for reordering
}

export const TabbedEditors: React.FC<TabbedEditorsProps> = ({
  dockedFiles,
  currentFile,
  files,
  onSelectTab,
  onCloseTab,
  onUndockFile,
  isFileDocked,
  getTagColorForFile,
  getCurrentFileType,
  handleFileChange,
  handleFileSelect,
  CodeEditorComponent,
  onReorderDockedFiles,
}) => {
  // Only show docked files as tabs in split view
  const activeIndex = dockedFiles.indexOf(currentFile);
  // If current file not docked, show it as an extra tab
  const allTabs = dockedFiles.includes(currentFile)
    ? dockedFiles
    : [...dockedFiles, currentFile];

  const {
    draggedIdx,
    hoverIdx,
    listeners,
  } = useDraggableTabs(dockedFiles, (updatedTabs) => {
    // Optional: Only call on reorder if prop is given (just for docked files)
    if (onReorderDockedFiles) {
      onReorderDockedFiles(updatedTabs);
    }
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#232a44] bg-[#151922]/80 px-2 py-1 rounded-t-lg max-w-full">
        {allTabs.map((fileName, idx) => {
          const { color } = getTagColorForFile(fileName);
          const isActive = fileName === currentFile;
          const dockedIdx = dockedFiles.indexOf(fileName);
          // Show drag-n-drop for docked tabs only
          const isDraggable = dockedIdx !== -1 && Boolean(onReorderDockedFiles);

          return (
            <div
              key={fileName}
              draggable={isDraggable}
              onDragStart={() => isDraggable && listeners.onDragStart(dockedIdx)}
              onDragEnd={isDraggable ? listeners.onDragEnd : undefined}
              onDragEnter={isDraggable ? () => listeners.onDragEnter(dockedIdx) : undefined}
              onDragOver={isDraggable ? listeners.onDragOver : undefined}
              onDrop={isDraggable ? () => listeners.onDrop(dockedIdx) : undefined}
              className={`
                flex items-center rounded-t-md border-b-2 transition-all mr-0.5 select-none min-w-[88px] group cursor-pointer
                ${isActive
                  ? "bg-[#232a44] border-b-[#6366f1] shadow"
                  : "hover:bg-[#232a44]/70 border-b-transparent"}
                ${dockedIdx === hoverIdx && draggedIdx !== null ? "ring-2 ring-[#6366f1] z-10" : ""}
                ${isDraggable ? "draggable-tab": ""}
                `}
              style={{
                borderColor: isActive ? "#6366f1" : "transparent",
                opacity: draggedIdx === dockedIdx ? 0.5 : 1,
              }}
            >
              {isDraggable && (
                <span className="flex items-center pr-1 opacity-60 cursor-move drag-handle">
                  {/* Drag handle icon (Move) */}
                  <Move size={13} />
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className={`flex items-center px-2 py-1 text-xs gap-1 rounded-t-md h-8 transition-all
                  ${isActive ? "text-[#a5b4fc]" : "text-[#9ca3af]"}
                  ${isActive ? "font-semibold" : "font-normal"}
                  `}
                onClick={() => onSelectTab(fileName)}
                style={{ background: "none", boxShadow: "none" }}
              >
                <File size={12} className="mr-0.5" color={color} />
                <span className="truncate max-w-[100px]">{fileName}</span>
                {isFileDocked(fileName) && (
                  <Pin size={11} className="ml-0.5 text-[#6366f1]" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-[#232a44]/70 p-0.5 h-7 w-7 ml-0.5 text-[#6366f1] hidden group-hover:flex"
                title="Undock file"
                onClick={() => onUndockFile(fileName)}
                tabIndex={-1}
              >
                <PinOff size={12} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-red-500/20 hover:text-red-400 p-0.5 h-7 w-7 ml-0.5 text-[#9ca3af] hidden group-hover:flex"
                title="Close tab"
                onClick={() => onCloseTab(fileName)}
                tabIndex={-1}
              >
                <X size={12} />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex-1 min-h-[260px] relative rounded-b-lg shadow-inner bg-gradient-to-br from-[#161c2b]/80 to-[#181d2e]/90">
        {/* Show only the active tab's editor */}
        {allTabs.map((fileName) =>
          fileName === currentFile ? (
            <div key={fileName} className="h-full w-full">
              <CodeEditorComponent
                language={getCurrentFileType(fileName)}
                displayName={fileName}
                value={files[fileName]?.content || ""}
                onChange={handleFileChange}
                tagColor={getTagColorForFile(fileName).color}
                tagBgColor={getTagColorForFile(fileName).bgColor}
                isActive={true}
                onSelect={() => handleFileSelect(fileName)}
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
