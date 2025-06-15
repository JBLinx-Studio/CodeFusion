import React from "react";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, X, File, Move } from "lucide-react";
import { useDraggableTabs } from "./useDraggableTabs";

// Props remain the same
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
  onReorderDockedFiles?: (nextFiles: string[]) => void;
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
  // Drag and drop management for vertical stack
  const {
    draggedIdx,
    hoverIdx,
    listeners,
  } = useDraggableTabs(dockedFiles, (updatedTabs) => {
    if (onReorderDockedFiles) {
      onReorderDockedFiles(updatedTabs);
    }
  });

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto p-0.5 gap-2">
      {dockedFiles.map((fileName, idx) => {
        const { color } = getTagColorForFile(fileName);
        const isActive = fileName === currentFile;
        return (
          <div
            key={fileName}
            draggable={!!onReorderDockedFiles}
            onDragStart={() => listeners.onDragStart(idx)}
            onDragEnd={listeners.onDragEnd}
            onDragEnter={() => listeners.onDragEnter(idx)}
            onDragOver={listeners.onDragOver}
            onDrop={() => listeners.onDrop(idx)}
            className={`
              group flex items-center rounded-xl border border-[#232a44] bg-[#181d2e] shadow-sm mb-1 transition-all gap-2
              ${hoverIdx === idx && draggedIdx !== null ? "ring-2 ring-[#6366f1] z-10" : ""}
              ${draggedIdx === idx ? "opacity-60" : "opacity-100"}
              cursor-pointer relative
            `}
            style={{
              boxShadow: isActive
                ? "0 1px 10px 0 #6366f130"
                : "0 1px 6px 0 #232a4435",
            }}
          >
            {/* Drag handle + Filename + Pin */}
            <span className="flex items-center pl-2 pr-1 opacity-60 cursor-move select-none" title="Drag to reorder">
              <Move size={15} />
            </span>
            <div
              onClick={() => onSelectTab(fileName)}
              className={`flex items-center pr-2 py-1 grow min-w-0 gap-2 ${
                isActive ? "bg-[#232a44] rounded-lg" : ""
              }`}
              style={{
                color: isActive ? "#a5b4fc" : "#9ca3af",
                fontWeight: isActive ? 600 : 400,
              }}
              tabIndex={0}
            >
              <File size={13} color={color} />
              <span className="truncate max-w-[110px]">{fileName}</span>
              {isFileDocked(fileName) && (
                <Pin size={12} className="ml-0.5 text-[#6366f1]" />
              )}
            </div>
            {/* Toolbar for each editor */}
            <div className="flex gap-0.5 pr-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-[#232a44]/80 p-0.5 h-7 w-7 text-[#6366f1] hidden group-hover:flex"
                title="Undock file"
                onClick={() => onUndockFile(fileName)}
                tabIndex={-1}
              >
                <PinOff size={12} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-red-500/20 hover:text-red-400 p-0.5 h-7 w-7 text-[#9ca3af] hidden group-hover:flex"
                title="Close tab"
                onClick={() => onCloseTab(fileName)}
                tabIndex={-1}
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        );
      })}

      {/* Display ALL editors vertically stacked, each for a docked file */}
      <div className="flex flex-col gap-6 mt-2">
        {dockedFiles.map((fileName, idx) => (
          <div
            key={fileName}
            className={`rounded-xl shadow-inner transition-all border-2 ${
              fileName === currentFile
                ? "border-[#6366f1]"
                : "border-[#232a44]"
            } bg-gradient-to-br from-[#161c2b]/80 to-[#181d2e]/90 relative`}
            style={{ minHeight: 220 }}
          >
            <CodeEditorComponent
              language={getCurrentFileType(fileName)}
              displayName={fileName}
              value={files[fileName]?.content || ""}
              onChange={handleFileChange}
              tagColor={getTagColorForFile(fileName).color}
              tagBgColor={getTagColorForFile(fileName).bgColor}
              isActive={fileName === currentFile}
              onSelect={() => handleFileSelect(fileName)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
