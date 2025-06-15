
import React from "react";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, X, File, Move } from "lucide-react";
import { useDraggableTabs } from "./useDraggableTabs";

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
    <div className="flex flex-col h-full w-full overflow-y-auto p-0 gap-0">
      {/* Tabs navigation/top row */}
      <div className="flex border-b border-[#232a44] bg-[#191e30] rounded-t-lg">
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
                group flex items-center px-3 py-1.5 min-w-0 gap-2 border-r border-[#232a44] select-none relative
                ${isActive ? "bg-[#232a44] border-b-2 border-b-[#6366f1]" : "hover:bg-[#222640]"}
                ${draggedIdx === idx ? "opacity-60" : "opacity-100"}
                cursor-pointer transition-all
              `}
              style={{
                color: isActive ? "#a5b4fc" : "#9ca3af",
                fontWeight: isActive ? 600 : 400,
              }}
              onClick={() => onSelectTab(fileName)}
              tabIndex={0}
            >
              <span className="flex items-center opacity-40 cursor-move select-none mr-1" title="Drag to reorder">
                <Move size={13} />
              </span>
              <File size={12} color={color} />
              <span className="truncate max-w-[110px]">{fileName}</span>
              {isFileDocked(fileName) && (
                <Pin size={11} className="ml-0.5 text-[#6366f1]" />
              )}
              {/* Toolbar: Only shows on hover */}
              <div className="flex gap-0.5 ml-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded hover:bg-[#232a44]/70 p-0.5 h-6 w-6 text-[#6366f1] hidden group-hover:flex"
                  title="Undock file"
                  onClick={(e) => { e.stopPropagation(); onUndockFile(fileName); }}
                  tabIndex={-1}
                >
                  <PinOff size={11} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded hover:bg-red-500/20 hover:text-red-400 p-0.5 h-6 w-6 text-[#8d97ac] hidden group-hover:flex"
                  title="Close tab"
                  onClick={(e) => { e.stopPropagation(); onCloseTab(fileName); }}
                  tabIndex={-1}
                >
                  <X size={11} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editors stacked vertically - each like a modern card with divider */}
      <div className="flex flex-col gap-0 w-full">
        {dockedFiles.map((fileName, idx) => (
          <div
            key={fileName}
            className={`
              rounded-b-lg transition-all border-x border-b
              ${fileName === currentFile ? "border-[#6366f1] bg-[#191e30]" : "border-[#232a44] bg-[#181d2e]"}
              relative
              shadow-[0_1px_4px_0_rgba(30,40,70,0.07)]
              ${idx !== 0 ? "mt-2" : ""}
            `}
            style={{ minHeight: 220, borderTop: "none" }}
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
            {/* Subtle divider between editors */}
            {idx < dockedFiles.length - 1 && (
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#232a44] to-transparent opacity-60 mx-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
