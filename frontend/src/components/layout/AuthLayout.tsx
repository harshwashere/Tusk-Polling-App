import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full justify-center items-center flex">
      <div className="loginBox w-1/2 h-screen px-12 py-8">
        <h2 className="text-lg font-medium text-black">Polling App</h2>
        {children}
      </div>
      <div className="w-1/2 bg-blue-400 h-full hidden md:block justify-center items-center  ">
        <img
          src="https://img.freepik.com/premium-vector/online-voting-concept-flat-illustration-with-computer-screen_212889-5497.jpg"
          width="626"
          height="519"
          className="w-2/3 h-2/3 rounded-[10px] mx-auto"
          alt="Online voting concept flat illustration with computer screen"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
