
import React from "react";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, X, File } from "lucide-react";

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
    <div className="flex items-end h-11 w-full border-b border-[#232a44] bg-[#181d2e] gap-1 overflow-x-auto px-2 py-2 custom-scrollbar relative">
      {/* Bottom divider line for neatness */}
      <div className="absolute left-0 bottom-0 w-full h-px bg-[#232a44]" />
      {dockedFiles.map((fileName) => {
        const isActive = fileName === currentFile;
        const { color, bgColor } = getTagColorForFile(fileName);
        return (
          <div
            key={fileName}
            className={`relative flex items-center px-4 py-1.5 rounded-t-md border-b-2 cursor-pointer transition-all duration-150
              ${isActive
                ? "border-[#6366f1] text-[#a5b4fc] bg-[#232a44] font-semibold"
                : "border-transparent text-[#9ca3af] hover:bg-[#232a44]/60 font-normal"}
              mr-1 min-w-[102px] max-w-[182px] select-none group`}
            style={{
              fontWeight: isActive ? 600 : 400,
            }}
            tabIndex={0}
            onClick={() => onSelectTab(fileName)}
          >
            <File size={15} color={color} className="flex-shrink-0 mr-1" />
            <span className="truncate max-w-[90px]">{fileName}</span>
            {isFileDocked(fileName) && (
              <Pin size={13} className="ml-1 text-[#6366f1]" />
            )}
            <Button
              size="icon"
              variant="ghost"
              className="ml-2 h-6 w-6 rounded-full p-0 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all absolute -top-2 -right-2 z-10"
              aria-label="Close tab"
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
