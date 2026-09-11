import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
const MenuContext = createContext<{
  open: boolean;
  setOpen: (value: boolean) => void;
}>({ open: false, setOpen: () => undefined });
export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  );
}
export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useContext(MenuContext);
  if (asChild && typeof children === "object" && children !== null)
    return <span onClick={() => setOpen(true)}>{children}</span>;
  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}
export function DropdownMenuContent({
  children,
  align = "end",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  align?: "start" | "center" | "end";
}) {
  const { open } = useContext(MenuContext);
  return open ? (
    <div
      {...props}
      className={`absolute z-20 mt-2 min-w-40 rounded border bg-white p-1 shadow-lg ${align === "start" ? "left-0" : "right-0"} ${className}`}
    >
      {children}
    </div>
  ) : null;
}
export function DropdownMenuItem({
  children,
  onClick,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  asChild?: boolean;
}) {
  const className = `flex w-full items-center rounded px-2 py-1.5 text-left text-sm hover:bg-muted ${props.className ?? ""}`;

  if (asChild) {
    return <span className={className}>{children}</span>;
  }

  return (
    <button {...props} type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
  className = "",
}: {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
      />
      {children}
    </label>
  );
}
