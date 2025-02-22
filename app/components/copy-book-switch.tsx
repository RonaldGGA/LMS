import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CopyBookSwitchProps {
  switchValue: boolean;
  setSwitchValue: (val: boolean) => void;
  disabled?: boolean;
  className?: string;
}
const CopyBookSwitch: React.FC<CopyBookSwitchProps> = ({
  switchValue,
  setSwitchValue,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        onCheckedChange={() => setSwitchValue(!switchValue)}
        id="add-copy"
        disabled={disabled}
        aria-label="Toggle wether to make a copy of a book or create a new one"
      />
      <Label className="text-sm" htmlFor="add-copy">
        Make a copy of an existent book
      </Label>
    </div>
  );
};

export default CopyBookSwitch;
