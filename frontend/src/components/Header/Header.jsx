import React from "react";

const Header = () => {
  return (
    <div className="flex fixed top-0 z-[99] left-0 bg-white w-full justify-between px-52 items-center">
      <div className="py-4">
        <h3 className="text-3xl font-bold">ConcertSite</h3>
      </div>
      <div className="flex gap-8 list-none">
        <a href="">
          <li>Home</li>
        </a>
        <a href="">
          <li>About</li>
        </a>
        <a href="">
          <li>Concerts</li>
        </a>

        <a href="">
          <li>Contact</li>
        </a>
      </div>
    </div>
  );
};

export default Header;
