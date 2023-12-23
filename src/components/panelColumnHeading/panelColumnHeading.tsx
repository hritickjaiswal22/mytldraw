import { ReactNode } from "react";

interface PanelColumnHeadingPropTypes {
  children: ReactNode;
}

function PanelColumnHeading({ children }: PanelColumnHeadingPropTypes) {
  return <h3 className="text-xs m-0 mb-1 font-normal">{children}</h3>;
}

export default PanelColumnHeading;
