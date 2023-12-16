import { ReactNode } from "react";

import "./button.style.css";

interface ButtonPropTypes {
  children: ReactNode;
  className?: "gray" | "purple";
}

function Button({ children, className = "gray" }: ButtonPropTypes) {
  return (
    <button
      className={`w-[36px] h-[36px] rounded-[10px] p-[10px] flex justify-center items-center ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
