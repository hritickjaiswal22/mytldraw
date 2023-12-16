import { ReactNode } from "react";

interface HeaderPropTypes {
  children: ReactNode;
}

function Header({ children }: HeaderPropTypes) {
  return (
    <header className="fixed w-full p-4 flex items-center gap-4 pointer-events-none">
      {children}
    </header>
  );
}

export default Header;
