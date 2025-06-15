
import React from "react";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, X, File, Move } from "lucide-react";

// Only responsible for tabs, not editors
interface TabbedEditorsProps {
  dockedFiles: string[];
  currentFile: string;
  onSelectTab: (fileName: string) => void;
  onCloseTab: (fileName: string) => void;
  isFileDocked: (fileName: string) => boolean;
  getTagColorForFile: (fileName: string) => { color: string; bgColor: string };
}

export const TabbedEditors: React.FC<TabbedEditorsProps> = ({
  dockedFiles,
  currentFile,
  onSelectTab,
  onCloseTab,
  isFileDocked,
  getTagColorForFile,
}) => {
  return (
    <div className="flex items-center h-10 px-2 pb-1 w-full border-b border-[#232a44] bg-[#161c2b] gap-1 overflow-x-auto">
      {dockedFiles.map((fileName) => {
        const isActive = fileName === currentFile;
        const { color } = getTagColorForFile(fileName);
        return (
          <div
            key={fileName}
            className={`flex items-center px-3 py-1 rounded-t-lg border-b-2 cursor-pointer transition-all
              ${isActive ? "bg-[#232a44] border-[#6366f1] text-[#a5b4fc]" : "bg-transparent border-transparent text-[#9ca3af] hover:bg-[#232a44]/50"}
              mr-1 min-w-[98px] max-w-[180px]`}
            tabIndex={0}
            style={{ fontWeight: isActive ? 600 : 400 }}
            onClick={() => onSelectTab(fileName)}
          >
            <File size={14} color={color} className="flex-shrink-0 mr-1" />
            <span className="truncate max-w-[90px]">{fileName}</span>
            {isFileDocked(fileName) && (
              <Pin
                size={12}
                className="ml-1 text-[#6366f1]"
                title="Docked"
              />
            )}
            <Button
              size="icon"
              variant="ghost"
              className="ml-2 h-6 w-6 rounded-full p-0 hover:bg-red-500/20 hover:text-red-400"
              title="Close tab"
              onClick={e => {
                e.stopPropagation();
                onCloseTab(fileName);
              }}
              tabIndex={-1}
            >
              <X size={12} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
