import { Button } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { IoHomeOutline, IoSearch } from "react-icons/io5";
import { LuHeart } from "react-icons/lu";
import { BsBagCheck } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { MdOutlineFilterAlt } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { MyContext } from '../../../App';

const MobileNav = () => {
    const context = useContext(MyContext);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/products" || location.pathname === "/search") {
            context?.setisFilterBtnShow(true);
        } else {
            context?.setisFilterBtnShow(false);
        }
    }, [location]);

    const openFilters = () => {
        context?.setOpenFilter(true);
        context?.setOpenSearchPanel(false);
    };

    return (
        <div className='lg:hidden block'>
            <div className='mobileNav bg-white p-1 px-3 w-full flex items-center justify-between fixed bottom-0 left-0 gap-1 z-[51] shadow-md'>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-700"}`
                    } 
                    onClick={() => context?.setOpenSearchPanel(false)}
                >
                    <Button className="flex-col !w-full !min-w-0 !p-0 !capitalize">
                        <IoHomeOutline size={18} />
                        <span className='text-[10px] sm:text-[12px]'>Home</span>
                    </Button>
                </NavLink>

                <Button 
                    className="flex-col !w-full !min-w-0 !p-0 !capitalize !text-gray-700"
                    onClick={() => context?.setOpenSearchPanel(true)}
                >
                    <IoSearch size={18} />
                    <span className='text-[10px] sm:text-[12px]'>Search</span>
                </Button>

                {context?.isFilterBtnShow && (
                    <Button 
                        className="flex-col !w-full !min-w-0 !p-0 !aspect-square !max-w-[40px] !bg-primary !rounded-full"
                        onClick={openFilters}
                    >
                        <MdOutlineFilterAlt size={18} className='text-white' />
                    </Button>
                )}

                <NavLink 
                    to="/my-list" 
                    className={({ isActive }) => 
                        `flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-700"}`
                    }
                    onClick={() => context?.setOpenSearchPanel(false)}
                >
                    <Button className="flex-col !w-full !min-w-0 !p-0 !capitalize">
                        <LuHeart size={18} />
                        <span className='text-[10px] sm:text-[12px]'>Wishlist</span>
                    </Button>
                </NavLink>

                <NavLink 
                    to="/my-orders" 
                    className={({ isActive }) => 
                        `flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-700"}`
                    }
                    onClick={() => context?.setOpenSearchPanel(false)}
                >
                    <Button className="flex-col !w-full !min-w-0 !p-0 !capitalize">
                        <BsBagCheck size={18} />
                        <span className='text-[10px] sm:text-[12px]'>Orders</span>
                    </Button>
                </NavLink>

                <NavLink 
                    to="/my-account" 
                    className={({ isActive }) => 
                        `flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-700"}`
                    }
                    onClick={() => context?.setOpenSearchPanel(false)}
                >
                    <Button className="flex-col !w-full !min-w-0 !p-0 !capitalize">
                        <FiUser size={18} />
                        <span className='text-[10px] sm:text-[12px]'>Account</span>
                    </Button>
                </NavLink>
            </div>
        </div>
    );
};

export default MobileNav;
