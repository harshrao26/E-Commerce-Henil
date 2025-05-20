import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGitCompareOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import logo from '../../assets/logo.webp'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { fetchDataFromApi } from "../../utils/api";
import { LuMapPin } from "react-icons/lu";
import { HiOutlineMenu } from "react-icons/hi";
import { FaHandshake } from "react-icons/fa"; // Added affiliate icon

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo[0]?.logo)
    });

    const token = localStorage.getItem('accessToken');
    if (token !== undefined && token !== null && token !== "") {
      history(location.pathname);
    } else {
      history("/login");
    }
  }, [context?.isLogin]);

  const logout = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { withCredentials: true }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        context.setUserData(null);
        context?.setCartData([]);
        context?.setMyListData([]);
        history("/");
      }
    });
  }

  return (
    <>
      <header className="bg-white fixed top-0 left-0 w-full z-[1000] shadow-sm">
        {/* Top Strip - Desktop Only */}
        <div className="top-strip hidden lg:block py-2 border-t border-b border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="w-full md:w-1/2">
                <p className="text-xs md:text-sm font-medium text-center md:text-left">
                  Get up to 50% off new season styles, limited time only
                </p>
              </div>

              <div className="hidden md:flex items-center justify-end space-x-4 w-full md:w-1/2">
                <Link to="/help-center" className="text-xs md:text-sm font-medium hover:text-primary transition">
                  {/* Help Center */}
                </Link>
                <Link to="/order-tracking" className="text-xs md:text-sm font-medium hover:text-primary transition">
                  {/* Order Tracking */}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="header py-2 lg:py-3 border-b border-gray-200 bg-[#f6e8d1]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-2">
                <Button 
                  className="!min-w-[40px] !h-[40px] !p-0 !rounded-full !text-gray-800"
                  onClick={() => setIsOpenCatPanel(true)}
                >
                  <HiOutlineMenu size={22} />
                </Button>
                
                {/* Mobile Affiliate Button (Icon only) */}
                <Tooltip title="Affiliate Program">
                  <IconButton 
                    component={Link} 
                    to="/affiliate-program"
                    className="!text-gray-800"
                  >
                    <FaHandshake size={20} />
                  </IconButton>
                </Tooltip>
              </div>

              {/* Logo */}
              <div className="flex-1 lg:flex-none lg:w-1/4 text-center lg:text-left">
                <Link to="/">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-10 lg:h-12 mx-auto lg:mx-0 object-contain" 
                  />
                </Link>
              </div>

             

              {/* User Actions */}
              <div className="flex items-center justify-end space-x-2 lg:space-x-4 lg:w-1/4">
                {/* Desktop Affiliate Button */}
                <div className="hidden lg:block">
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/affiliate-program"
                    startIcon={<FaHandshake />}
                    className="!normal-case !text-sm !font-medium !border-gray-300 !text-gray-700 hover:!border-primary hover:!text-primary"
                  >
                    Affiliate
                  </Button>
                </div>

                {context.isLogin === false ? (
                  <div className="hidden lg:flex items-center space-x-2">
                    <Link to="/login" className="text-sm font-medium hover:text-primary">
                      Login
                    </Link>
                    <span>|</span>
                    <Link to="/register" className="text-sm font-medium hover:text-primary">
                      Register
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* User Account - Desktop */}
                    <div className="hidden lg:block">
                      <Button
                        className="!text-black !flex !items-center !gap-2 !p-1"
                        onClick={handleClick}
                      >
                        <div className="!w-9 !h-9 !min-w-[36px] !rounded-full !bg-gray-200 !flex !items-center !justify-center">
                          <FaRegUser className="text-base" />
                        </div>
                        <div className="text-left hidden lg:block">
                          <p className="text-sm font-medium capitalize">
                            {context?.userData?.name}
                          </p>
                        </div>
                      </Button>

                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          elevation: 3,
                          sx: {
                            mt: 1.5,
                            minWidth: 200,
                            '& .MuiMenuItem-root': {
                              fontSize: '0.875rem',
                              gap: '0.75rem'
                            }
                          }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={handleClose} component={Link} to="/my-account">
                          <FaRegUser /> My Account
                        </MenuItem>
                        <MenuItem onClick={handleClose} component={Link} to="/address">
                          <LuMapPin /> Address
                        </MenuItem>
                        <MenuItem onClick={handleClose} component={Link} to="/my-orders">
                          <IoBagCheckOutline /> Orders
                        </MenuItem>
                        <MenuItem onClick={handleClose} component={Link} to="/my-list">
                          <IoMdHeartEmpty /> My List
                        </MenuItem>
                        <MenuItem onClick={logout}>
                          <IoIosLogOut /> Logout
                        </MenuItem>
                      </Menu>
                    </div>

                    {/* Wishlist - Desktop */}
                    <div className="hidden lg:block">
                      <Tooltip title="Wishlist">
                        <IconButton component={Link} to="/my-list">
                          <StyledBadge 
                            badgeContent={context?.myListData?.length || 0} 
                            color="secondary"
                          >
                            <FaRegHeart />
                          </StyledBadge>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </>
                )}

                {/* Cart - Always visible */}
                <Tooltip title="Cart">
                  <IconButton onClick={() => context.setOpenCartPanel(true)}>
                    <StyledBadge 
                      badgeContent={context?.cartData?.length || 0} 
                      color="secondary"
                    >
                      <MdOutlineShoppingCart />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <Navigation 
          isOpenCatPanel={isOpenCatPanel} 
          setIsOpenCatPanel={setIsOpenCatPanel} 
        />
      </header>

      {/* Spacer to push content down */}
      <div className="h-[70px] "></div>
    </>
  );
};

export default Header;