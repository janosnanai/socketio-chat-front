import { Fragment, ReactNode } from "react";

import LayoutHeader from "./header/layout-header-main";
import LayoutFooter from "./footer/layout-footer-main";

function LayoutMain(props: { children: ReactNode | ReactNode[] }) {
  return (
    <Fragment>
      <LayoutHeader />
      {props.children}
      <LayoutFooter />
    </Fragment>
  );
}

export default LayoutMain;
