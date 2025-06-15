
import React from "react";
import { Pin, PinOff, X, File, Move } from "lucide-react";
import { Button } from "@/components/ui/button";

// Props simplified for tab mode only
interface TabbedEditorsProps {
  openFiles: string[];
  currentFile: string;
  files: Record<string, { content: string }>;
  onSelectTab: (fileName: string) => void;
  onCloseTab: (fileName: string) => void;
  onPinFile: (fileName: string) => void;
  onUnpinFile: (fileName: string) => void;
  isFilePinned: (fileName: string) => boolean;
  getTagColorForFile: (fileName: string) => { color: string; bgColor: string };
}

export const TabbedEditors: React.FC<TabbedEditorsProps> = ({
  openFiles,
  currentFile,
  files,
  onSelectTab,
  onCloseTab,
  onPinFile,
  onUnpinFile,
  isFilePinned,
  getTagColorForFile,
}) => {
  return (
    <div className="w-full border-b border-[#232a44] bg-[#161c2b]/90 flex flex-row items-center h-11 px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#212744] no-scrollbar-horizontal">
      {openFiles.map((fileName) => {
        const { color } = getTagColorForFile(fileName);
        const isActive = fileName === currentFile;
        return (
          <div
            key={fileName}
            className={`flex items-center px-3 py-1.5 rounded-t-lg mr-1 group transition-all 
              ${isActive ? "bg-[#232a44] text-[#a5b4fc] font-semibold border-b-2 border-[#6366f1]" : "text-[#9ca3af] border-b-2 border-transparent"}
              hover:bg-[#232a44]/70
            `}
            style={{ minWidth: 85, maxWidth: 220, cursor: "pointer" }}
            onClick={() => onSelectTab(fileName)}
          >
            <File size={15} color={color} className="mr-1 flex-shrink-0" />
            <span className="truncate max-w-[100px]">{fileName}</span>
            {isFilePinned(fileName) ? (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full ml-1 p-0.5 h-6 w-6 text-[#6366f1] hidden group-hover:flex"
                title="Unpin file"
                onClick={(e) => { e.stopPropagation(); onUnpinFile(fileName); }}
                tabIndex={-1}
              >
                <Pin size={12} />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full ml-1 p-0.5 h-6 w-6 text-[#9ca3af] hidden group-hover:flex"
                title="Pin file"
                onClick={(e) => { e.stopPropagation(); onPinFile(fileName); }}
                tabIndex={-1}
              >
                <PinOff size={12} />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full ml-1.5 p-0.5 h-6 w-6 text-[#ea4e4e] hidden group-hover:flex"
              title="Close file"
              onClick={(e) => { e.stopPropagation(); onCloseTab(fileName); }}
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
