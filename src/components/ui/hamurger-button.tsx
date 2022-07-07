import { useState } from "react";

function HamburgerButton() {
  const [open, setOpen] = useState(false);

  const basicBurgerLineStyle =
    "absolute left-1/2 top-1/2 -translate-x-1/2 h-0.5 w-7 rounded-full bg-white opacity-50 transition ease transform duration-300 group-hover:opacity-80";

  function clickHandler() {
    setOpen((prev) => !prev);
  }

  return (
    <button className="relative h-12 w-12 group" onClick={clickHandler}>
      <span
        className={`${basicBurgerLineStyle} ${
          open ? "rotate-45" : "translate-y-2.5"
        }`}
      ></span>
      <span
        className={`${basicBurgerLineStyle} ${open ? "scale-x-0" : ""}`}
      ></span>
      <span
        className={`${basicBurgerLineStyle} ${
          open ? "-rotate-45" : "-translate-y-2.5"
        }`}
      ></span>
    </button>
  );
}

export default HamburgerButton;
