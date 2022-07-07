import HamburgerButton from "../../ui/hamurger-button";

function LayoutHeaderMain() {
  return (
    <header>
      <div className="flex justify-between px-4 items-center bg-black">
        <h1 className="text-3xl  text-zinc-300 p-3 font-thin text-center tracking-widest uppercase">
          simpleChat
        </h1>
        <HamburgerButton />
      </div>
    </header>
  );
}

export default LayoutHeaderMain;
