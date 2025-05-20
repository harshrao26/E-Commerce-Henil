import React, { useContext, useEffect, useState } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdZoomOutMap, MdOutlineShoppingCart, MdClose } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { deleteData, editData, postData } from "../../utils/api";

const ProductItem = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);

  const handleClickActiveTab = (index, name) => {
    setActiveTab(index);
    setSelectedTabName(name);
  };

  const addToCart = (product, userId, quantity) => {
    const productItem = {
      _id: product._id,
      name: product.name,
      image: product.images[0],
      rating: product.rating,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      quantity,
      subTotal: parseInt(product.price * quantity),
      productId: product._id,
      countInStock: product.countInStock,
      brand: product.brand,
      size: item.size?.length ? selectedTabName : "",
      weight: item.productWeight?.length ? selectedTabName : "",
      ram: item.productRam?.length ? selectedTabName : "",
    };

    const hasVariants =
      item.size?.length || item.productRam?.length || item.productWeight?.length;

    setIsLoading(true);

    if (hasVariants && activeTab === null) {
      setIsShowTabs(true);
      return;
    }

    context?.addToCart(productItem, userId, quantity);
    setIsAdded(true);
    setIsShowTabs(false);

    setTimeout(() => setIsLoading(false), 500);
  };

  const minusQty = () => {
    if (quantity === 1) {
      deleteData(`/api/cart/delete-cart-item/${cartItem[0]?._id}`).then(() => {
        setIsAdded(false);
        setQuantity(1);
        setIsShowTabs(false);
        setActiveTab(null);
        context.alertBox("success", "Item Removed");
        context?.getCartItems();
      });
    } else {
      const obj = {
        _id: cartItem[0]?._id,
        qty: quantity - 1,
        subTotal: item.price * (quantity - 1),
      };
      editData(`/api/cart/update-qty`, obj).then((res) => {
        setQuantity(quantity - 1);
        context.alertBox("success", res?.data?.message);
        context?.getCartItems();
      });
    }
  };

  const addQty = () => {
    const obj = {
      _id: cartItem[0]?._id,
      qty: quantity + 1,
      subTotal: item.price * (quantity + 1),
    };
    editData(`/api/cart/update-qty`, obj).then((res) => {
      setQuantity(quantity + 1);
      context.alertBox("success", res?.data?.message);
      context?.getCartItems();
    });
  };

  const handleAddToMyList = (product) => {
    if (!context?.userData) {
      context.alertBox("error", "Please login first");
      return;
    }

    const obj = {
      productId: product._id,
      userId: context.userData._id,
      productTitle: product.name,
      image: product.images[0],
      rating: product.rating,
      price: product.price,
      oldPrice: product.oldPrice,
      brand: product.brand,
      discount: product.discount,
    };

    postData("/api/myList/add", obj).then((res) => {
      if (!res?.error) {
        context.alertBox("success", res.message);
        setIsAddedInMyList(true);
        context.getMyListData();
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  useEffect(() => {
    const itemInCart = context?.cartData?.find(
      (cart) => cart.productId === item._id
    );

    const inMyList = context?.myListData?.find(
      (listItem) => listItem.productId === item._id
    );

    if (itemInCart) {
      setCartItem([itemInCart]);
      setIsAdded(true);
      setQuantity(itemInCart.quantity);
    } else {
      setIsAdded(false);
      setQuantity(1);
    }

    setIsAddedInMyList(!!inMyList);
  }, [context?.cartData, context?.myListData, item._id]);

  const renderVariantTabs = (type, values) =>
    values?.length > 0 &&
    values.map((val, idx) => (
      <span
        key={`${type}-${idx}`}
        className={`flex items-center justify-center p-1 px-2 bg-[rgba(255,255,255,0.8)] max-w-[45px] h-[25px]  
          rounded-sm cursor-pointer hover:bg-white 
          ${activeTab === idx && "!bg-primary text-white"}`}
        onClick={() => handleClickActiveTab(idx, val)}
      >
        {val}
      </span>
    ));

  return (
    <div className="productItem shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
      <div className="group imgWrapper w-full overflow-hidden relative rounded-md rounded-bl-none rounded-br-none">
        <Link to={`/product/${item?._id}`}>
          <div className="img h-[200px] overflow-hidden">
            <img src={item.images[0]} className="w-full" />
            <img
              src={item.images[1]}
              className="w-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          </div>
        </Link>

        {isShowTabs && (
          <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-60 p-3 gap-2">
            <Button
              className="!absolute top-2 right-2 !w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-white text-black"
              onClick={() => setIsShowTabs(false)}
            >
              <MdClose className="text-black text-[25px]" />
            </Button>

            {renderVariantTabs("size", item.size)}
            {renderVariantTabs("ram", item.productRam)}
            {renderVariantTabs("weight", item.productWeight)}
          </div>
        )}

        <span className="discount absolute top-2 left-2 z-50 bg-primary text-white rounded-lg px-2 py-1 text-xs font-medium">
          {item.discount}%
        </span>

        <div className="actions absolute top-[-20px] right-2 z-50 flex flex-col items-center gap-2 w-[50px] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-4">
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white"
            onClick={() => context.handleOpenProductDetailsModal(true, item)}
          >
            <MdZoomOutMap className="text-[18px]" />
          </Button>
          <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white">
            <IoGitCompareOutline className="text-[18px]" />
          </Button>
          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white"
            onClick={() => handleAddToMyList(item)}
          >
            {isAddedInMyList ? (
              <IoMdHeart className="text-[18px] text-primary" />
            ) : (
              <FaRegHeart className="text-[18px]" />
            )}
          </Button>
        </div>
      </div>

      <div className="info p-3 py-5 relative pb-[50px] h-[190px]">
        <h6 className="text-[13px] font-normal">{item.brand}</h6>
        <h3 className="text-[13px] font-medium text-black mt-1 mb-1">
          <Link to={`/product/${item?._id}`}>
            {item.name.length > 25 ? item.name.substr(0, 25) + "..." : item.name}
          </Link>
        </h3>
        <Rating name="size-small" defaultValue={item.rating} size="small" readOnly />
        <div className="flex justify-between items-center gap-4">
          <span className="line-through text-gray-500 text-[13px] font-medium">
            {item.oldPrice?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
          <span className="text-primary text-[14px] font-semibold">
            {item.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </div>

        <div className="absolute bottom-4 left-0 pl-3 pr-3 w-full">
          {!isAdded ? (
            <Button
              className="btn-org addToCartBtn btn-border flex w-full btn-sm gap-2"
              size="small"
              onClick={() => addToCart(item, context?.userData?._id, quantity)}
            >
              <MdOutlineShoppingCart className="text-[18px]" /> Add to Cart
            </Button>
          ) : isLoading ? (
            <Button className="btn-org btn-border flex w-full btn-sm gap-2" size="small">
              <CircularProgress size={20} />
            </Button>
          ) : (
            <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)]">
              <Button className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1] !rounded-none" onClick={minusQty}>
                <FaMinus className="text-[rgba(0,0,0,0.7)]" />
              </Button>
              <span>{quantity}</span>
              <Button
                className="!min-w-[35px] !w-[35px] !h-[30px] !bg-gray-800 !rounded-none"
                onClick={addQty}
              >
                <FaPlus className="text-white" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
