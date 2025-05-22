import { Button } from "@/components/ui/button";
import { languages } from "@/lib/utils";
import { Maximize2, LayoutGridIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditorToolbarProps {
  onRun: () => void;
  onShare: () => void;
  onFullscreen: () => void;
  showOutput: boolean;
  onToggleOutput: () => void;
  onClear: () => void;
  isVertical: boolean;
  onToggleOrientation: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export function EditorToolbar({
  onRun,
  onFullscreen,
  onClear,
  isVertical,
  onToggleOrientation,
  language,
  onLanguageChange,
}: EditorToolbarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onRun}
          className="bg-blue-600 hover:bg-blue-700 dark:text-white"
        >
          Run
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleOrientation}>
          {isVertical ? (
            <LayoutGridIcon className="h-4 w-4" />
          ) : (
            <LayoutGridIcon className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
