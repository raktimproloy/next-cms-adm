import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
// image import
import bgImage from "@/assets/images/all-img/page-bg.png";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
const login3 = () => {
  const [isDark] = useDarkMode();
  const [error, setError] = useState(false)
  return (
    <>
      <ToastContainer />
      <div
        className="loginwrapper bg-cover bg-no-repeat bg-center flex justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
          <div className="">
            <div className="auth-box-3">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h4 className="font-medium">Sign In</h4>
                
                <div className="text-red-500 dark:text-red-400 text-base">
                {
                  error ?
                  "Your credential do not matching !" :
                  ""
                }
                </div>
              </div>
              <LoginForm setError={setError} />
            </div>
          </div>
      </div>
    </>
  );
};

export default login3;
