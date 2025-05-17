import { Button } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser, FaRegEye, FaEyeSlash } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App.jsx";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const [formFields, setFormFields] = useState({
    email: '',
    password: ''
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo?.[0]?.logo || "");
    });
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = Object.values(formFields).every((val) => val);

  const forgotPassword = () => {
    if (!formFields.email) {
      context.alertBox("error", "Please enter email id");
      return;
    }

    context.alertBox("success", `OTP sent to ${formFields.email}`);
    localStorage.setItem("userEmail", formFields.email);
    localStorage.setItem("actionType", 'forgot-password');

    postData("/api/user/forgot-password", {
      email: formFields.email,
    }).then((res) => {
      if (res?.error === false) {
        context.alertBox("success", res.message);
        history("/verify-account");
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.email) {
      context.alertBox("error", "Please enter email id");
      setIsLoading(false);
      return;
    }

    if (!formFields.password) {
      context.alertBox("error", "Please enter password");
      setIsLoading(false);
      return;
    }

    postData("/api/user/login", formFields, { withCredentials: true }).then((res) => {
      setIsLoading(false);
      if (res?.error !== true) {
        context.alertBox("success", res.message);
        setFormFields({ email: "", password: "" });

        localStorage.setItem("accessToken", res?.data?.accesstoken);
        localStorage.setItem("refreshToken", res?.data?.refreshToken);

        context.setIsLogin(true);
        history("/");
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  const authWithGoogle = () => {
    setLoadingGoogle(true);

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          avatar: user.providerData[0].photoURL,
          mobile: user.providerData[0].phoneNumber,
          role: "USER"
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          setLoadingGoogle(false);
          if (res?.error !== true) {
            context.alertBox("success", res.message);
            localStorage.setItem("userEmail", fields.email);
            localStorage.setItem("accessToken", res?.data?.accesstoken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);

            context.setIsLogin(true);
            history("/");
          } else {
            context.alertBox("error", res.message);
          }
        });
      })
      .catch((error) => {
        setLoadingGoogle(false);
        context.alertBox("error", "Google login failed");
      });
  };

  return (
    <section className="bg-white w-full">
      <header className="w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50">
        <Link to="/">
          <img src={localStorage.getItem('logo')} className="w-[200px]" alt="logo" />
        </Link>

        <div className="hidden sm:flex items-center gap-0">
          <NavLink to="/login">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <CgLogIn className="text-[18px]" /> Login
            </Button>
          </NavLink>

          <NavLink to="/sign-up">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <FaRegUser className="text-[15px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>

      <img src="/patern.webp" className="w-full fixed top-0 left-0 opacity-5" alt="background pattern" />

      <div className="loginBox card w-full md:w-[600px] h-auto pb-20 mx-auto pt-5 lg:pt-20 relative z-50">
        <div className="text-center">
          <img src="/icon.svg" className="m-auto" alt="icon" />
        </div>

        <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4">
          Welcome Back!
          <br />
          Sign in with your credentials.
        </h1>

        <div className="flex items-center justify-center w-full mt-5 gap-4">
          <LoadingButton
            size="small"
            onClick={authWithGoogle}
            endIcon={<FcGoogle />}
            loading={loadingGoogle}
            loadingPosition="end"
            variant="outlined"
            className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)]"
          >
            Sign in with Google
          </LoadingButton>
        </div>

        <div className="w-full flex items-center justify-center gap-3 my-6">
          <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]" />
          <span className="text-[10px] lg:text-[14px] font-[500]">Or, Sign in with your email</span>
          <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]" />
        </div>

        <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Email</h4>
            <input
              type="email"
              name="email"
              value={formFields.email}
              onChange={onChangeInput}
              disabled={isLoading}
              className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
            />
          </div>

          <div className="form-group mb-4 w-full">
            <h4 className="text-[14px] font-[500] mb-1">Password</h4>
            <div className="relative w-full">
              <input
                type={isPasswordShow ? 'text' : 'password'}
                name="password"
                value={formFields.password}
                onChange={onChangeInput}
                disabled={isLoading}
                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
              />
              <Button
                type="button"
                className="!absolute top-[7px] right-[10px] !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                onClick={() => setIsPasswordShow((prev) => !prev)}
              >
                {isPasswordShow ? <FaEyeSlash className="text-[18px]" /> : <FaRegEye className="text-[18px]" />}
              </Button>
            </div>
          </div>

          <div className="form-group mb-4 w-full flex items-center justify-between">
            <FormControlLabel control={<Checkbox defaultChecked />} label="Remember Me" />
            <span onClick={forgotPassword} className="text-primary font-[700] text-[15px] hover:underline hover:text-gray-700 cursor-pointer">
              Forgot Password?
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px]">Don't have an account?</span>
            <Link to="/sign-up" className="text-primary font-[700] text-[15px] hover:underline hover:text-gray-700">
              Sign Up
            </Link>
          </div>

          <Button type="submit" disabled={!isFormValid || isLoading} className="btn-blue btn-lg w-full">
            {isLoading ? <CircularProgress color="inherit" size={24} /> : "Sign In"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
