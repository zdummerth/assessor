import NavClient from "./navclient";
import AuthButton from "../header-auth";
import Link from "next/link";
import { Search } from "lucide-react";
import SearchDialog from "../search-dialogue";
import { ThemeSwitcher } from "@/components/theme-switcher";

const NavBar = async () => {
  return (
    <nav className="w-full border-b border-b-foreground/10 print:hidden p-2 lg:flex">
      <div className="w-full flex items-center justify-bewteen lg:order-2">
        {/* <Link href={"/"} className={` hover:text-blue-500`}>
          <Search />
        </Link> */}
        <SearchDialog />
        <div className="flex-1 flex gap-2 justify-end items-center">
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
      <NavClient />
    </nav>
  );
};

export default NavBar;
