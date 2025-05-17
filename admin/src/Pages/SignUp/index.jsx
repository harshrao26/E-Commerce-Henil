import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser, FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { fetchDataFromApi, postData } from '../../utils/api.js';
import { MyContext } from "../../App.jsx";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [formFields, setFormFields] = useState({ name: "", email: "", password: "" });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDataFromApi("/api/logo").then((res) => {
            localStorage.setItem('logo', res?.logo?.[0]?.logo);
        });
    }, []);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const valideValue = Object.values(formFields).every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { name, email, password } = formFields;

        if (!name || !email || !password) {
            context.alertBox("error", "All fields are required");
            setIsLoading(false);
            return;
        }

        const res = await postData("/api/user/register", formFields);
        if (!res?.error) {
            context.alertBox("success", res.message);
            localStorage.setItem("userEmail", email);
            setFormFields({ name: "", email: "", password: "" });
            navigate("/verify-account");
        } else {
            context.alertBox("error", res?.message);
        }
        setIsLoading(false);
    };

    const authWithGoogle = () => {
        setLoadingGoogle(true);

        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                const fields = {
                    name: user.displayName,
                    email: user.email,
                    password: null,
                    avatar: user.photoURL,
                    mobile: user.phoneNumber,
                    role: "USER"
                };

                postData("/api/user/authWithGoogle", fields).then((res) => {
                    if (!res?.error) {
                        context.alertBox("success", res.message);
                        localStorage.setItem("userEmail", fields.email);
                        localStorage.setItem("accessToken", res.data?.accesstoken);
                        localStorage.setItem("refreshToken", res.data?.refreshToken);
                        context.setIsLogin(true);
                        navigate("/");
                    } else {
                        context.alertBox("error", res?.message);
                    }
                    setLoadingGoogle(false);
                    setIsLoading(false);
                });
            })
            .catch(() => {
                context.alertBox("error", "Google authentication failed");
                setLoadingGoogle(false);
            });
    };

    return (
        <section className="bg-white w-full">
            <header className="w-full static lg:fixed top-0 left-0 px-4 py-3 flex items-center justify-center sm:justify-between z-50">
                <Link to="/">
                    <img src={localStorage.getItem("logo")} className="w-[200px]" alt="Logo" />
                </Link>

                <div className="hidden sm:flex items-center gap-0">
                    <NavLink to="/login" className={({ isActive }) => isActive ? "isActive" : ""}>
                        <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
                            <CgLogIn className="text-[18px]" /> Login
                        </Button>
                    </NavLink>

                    <NavLink to="/sign-up" className={({ isActive }) => isActive ? "isActive" : ""}>
                        <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
                            <FaRegUser className="text-[15px]" /> Sign Up
                        </Button>
                    </NavLink>
                </div>
            </header>

            <img src="/patern.webp" className="w-full fixed top-0 left-0 opacity-5" alt="background pattern" />

            <div className="loginBox card w-full md:w-[600px] pb-20 mx-auto pt-5 lg:pt-20 relative z-50">
                <div className="text-center">
                    <img src="/icon.svg" className="m-auto" alt="Icon" />
                </div>

                <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4">
                    Join us today! Get special <br />benefits and stay up-to-date.
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
                        Signin with Google
                    </LoadingButton>
                </div>

                <div className="w-full flex items-center justify-center gap-3 my-6">
                    <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
                    <span className="text-[10px] lg:text-[14px] font-[500]">Or, Sign Up with your email</span>
                    <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
                </div>

                <form className="w-full px-8" onSubmit={handleSubmit}>
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Full Name</h4>
                        <input
                            type="text"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            name="name"
                            value={formFields.name}
                            disabled={isLoading}
                            onChange={onChangeInput}
                        />
                    </div>

                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                        <input
                            type="email"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            name="email"
                            value={formFields.email}
                            disabled={isLoading}
                            onChange={onChangeInput}
                        />
                    </div>

                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Password</h4>
                        <div className="relative w-full">
                            <input
                                type={isPasswordShow ? 'text' : 'password'}
                                className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                                name="password"
                                value={formFields.password}
                                disabled={isLoading}
                                onChange={onChangeInput}
                            />
                            <Button
                                type="button"
                                className="!absolute top-[7px] right-[10px] !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600"
                                onClick={() => setIsPasswordShow(prev => !prev)}
                            >
                                {isPasswordShow ? <FaEyeSlash className="text-[18px]" /> : <FaRegEye className="text-[18px]" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[14px]">Already have an account?</span>
                        <Link to="/login" className="text-primary font-[700] text-[15px] hover:underline hover:text-gray-700">
                            Sign In
                        </Link>
                    </div>

                    <Button type="submit" className="btn-blue btn-lg w-full" disabled={!valideValue || isLoading}>
                        {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Sign Up'}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default SignUp;
