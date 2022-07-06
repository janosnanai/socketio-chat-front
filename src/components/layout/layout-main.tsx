import { ReactNode } from "react";

import LayoutHeader from "./header/layout-header-main";
import LayoutFooter from "./footer/layout-footer-main";

function LayoutMain(props: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="h-screen antialiased">
      <LayoutHeader />
      {props.children}
      <LayoutFooter />
    </div>
  );
}

export default LayoutMain;
