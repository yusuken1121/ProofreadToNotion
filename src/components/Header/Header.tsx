import React from "react";
import { Breadcrumbs } from "../BreadCrumbs";
import { siteLinks } from "@/config/siteLinks";

const Header = () => {
  return (
    <header className="h-[64px] bg-slate-700 text-white font-bold">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="hidden md:block">
          <nav>laptop</nav>
        </div>
        {/* 
        <div className="flex md:hidden">
          <Breadcrumbs segments={siteLinks} />
        </div> */}
      </div>
    </header>
  );
};

export default Header;
