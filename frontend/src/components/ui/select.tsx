import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
const SelectContext = createContext<{
  value?: string;
  disabled: boolean;
  setValue: (value: string) => void;
}>({ disabled: false, setValue: () => undefined });
export function Select({
  value,
  onValueChange,
  disabled = false,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [internal, setInternal] = useState(value);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setInternal(value);
  }, [value]);
  const setValue = (next: string) => {
    setInternal(next);
    onValueChange?.(next);
    setOpen(false);
  };
  return (
    <SelectContext.Provider value={{ value: internal, disabled, setValue }}>
      <div className="relative">
        <SelectOpenContext.Provider value={{ open, setOpen }}>
          {children}
        </SelectOpenContext.Provider>
      </div>
    </SelectContext.Provider>
  );
}

const SelectOpenContext = createContext({
  open: false,
  setOpen: (_open: boolean) => {},
});

export function SelectTrigger({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
}) {
  const { open, setOpen } = useContext(SelectOpenContext);
  const { disabled } = useContext(SelectContext);
  return (
    <button
      type="button"
      {...props}
      disabled={disabled}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={`flex h-9 items-center rounded border bg-background px-3 text-sm ${className}`}
    >
      {children}
    </button>
  );
}
export function SelectValue({ placeholder }: { placeholder?: ReactNode }) {
  const { value } = useContext(SelectContext);
  return <span>{value ?? placeholder}</span>;
}
export function SelectContent({
  children,
}: {
  children: ReactNode;
  side?: string;
}) {
  const { open } = useContext(SelectOpenContext);
  if (!open) return null;
  return (
    <div className="absolute z-20 mt-1 min-w-full rounded border bg-white p-1 shadow-lg">
      {children}
    </div>
  );
}
export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const context = useContext(SelectContext);
  return (
    <button
      type="button"
      disabled={context.disabled}
      className="block w-full px-2 py-1 text-left text-sm hover:bg-muted"
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}
