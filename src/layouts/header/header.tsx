import { ReactNode } from "react";

interface HeaderPropTypes {
  children: ReactNode;
}

function Header({ children }: HeaderPropTypes) {
  return (
    <header className="fixed z-50 top-0 w-full p-4 flex items-center gap-4 pointer-events-none">
      {children}
    </header>
  );
}

export default Header;
