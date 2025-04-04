import NavClient from "./navclient";
import AuthButton from "../header-auth";

const NavBar = async () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-[50px] print:hidden">
      <NavClient />
      <div className="flex-1 flex justify-end items-center pr-4">
        <AuthButton />
      </div>
    </nav>
  );
};

export default NavBar;
