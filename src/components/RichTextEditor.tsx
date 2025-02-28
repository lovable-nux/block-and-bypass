
import { useState } from "react";
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Image, 
  Quote, 
  Table,
  CheckSquare, 
  Undo, 
  Redo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

const RichTextEditor = ({ value, onChange, language = "en" }: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // For a real implementation, we would use a proper rich text editor library
  // This is a simplified UI demo version
  
  const formatOptions = [
    { icon: <Bold size={16} />, title: "Bold", action: "bold" },
    { icon: <Italic size={16} />, title: "Italic", action: "italic" },
    { icon: <Link size={16} />, title: "Add Link", action: "link" },
    { icon: <List size={16} />, title: "Bullet List", action: "list" },
    { icon: <ListOrdered size={16} />, title: "Numbered List", action: "orderedList" },
    { icon: <Image size={16} />, title: "Insert Image", action: "image" },
    { icon: <Quote size={16} />, title: "Quote", action: "quote" },
    { icon: <Table size={16} />, title: "Table", action: "table" },
    { icon: <CheckSquare size={16} />, title: "Checkbox", action: "checkbox" },
  ];
  
  // In a real implementation, these would perform actual formatting actions
  const handleFormat = (action: string) => {
    console.log(`${action} formatting applied`);
  };
  
  return (
    <div 
      className={cn(
        "border rounded-md overflow-hidden transition-all duration-200",
        isFocused && "ring-1 ring-primary"
      )}
    >
      <div className="bg-muted/50 p-2 border-b flex items-center space-x-1">
        <select className="text-sm bg-transparent border px-2 py-1 rounded">
          <option>Paragraph</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
          <option>Heading 4</option>
        </select>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        <ToggleGroup type="multiple" className="justify-start">
          {formatOptions.map((option) => (
            <ToggleGroupItem 
              key={option.action} 
              value={option.action}
              aria-label={option.title}
              onClick={() => handleFormat(option.action)}
              className="h-8 w-8 p-0"
            >
              {option.icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => handleFormat("undo")}
        >
          <Undo size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => handleFormat("redo")}
        >
          <Redo size={16} />
        </Button>
      </div>
      
      <textarea
        className="w-full p-4 min-h-[200px] outline-none resize-none font-sans text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Enter the message to display to blocked users (${language})`}
      />
    </div>
  );
};

export default RichTextEditor;
