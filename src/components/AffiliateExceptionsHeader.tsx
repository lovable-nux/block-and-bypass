
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AffiliateExceptionsHeaderProps {
  isEditing: boolean;
  onAddNew: () => void;
}

const AffiliateExceptionsHeader = ({ isEditing, onAddNew }: AffiliateExceptionsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <p className="text-muted-foreground">
          Create exceptions for specific affiliates to bypass blocking rules
        </p>
      </div>
      
      {!isEditing && (
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exception
        </Button>
      )}
    </div>
  );
};

export default AffiliateExceptionsHeader;
