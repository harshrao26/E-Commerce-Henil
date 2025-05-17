import React, { useContext, useEffect, useState } from "react";
import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlider";
import { LiaShippingFastSolid } from "react-icons/lia";
import AdsBannerSlider from "../../components/AdsBannerSlider";
import AdsBannerSliderV2 from "../../components/AdsBannerSliderV2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductsSlider from "../../components/ProductsSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import BlogItem from "../../components/BlogItem";
import HomeBannerV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/bannerBoxV2";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import ProductLoading from "../../components/ProductLoading";
import BannerLoading from "../../components/LoadingSkeleton/bannerLoading";

const Home = () => {
  const [value, setValue] = useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [productsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [bannerList2Data, setBannerList2Data] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [reelData, setReelData] = useState([]);
  const [randomCatProducts, setRandomCatProducts] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi("/api/homeSlides").then((res) => {
      setHomeSlidesData(res?.data);
    });
    fetchDataFromApi("/api/product/getAllProducts").then((res) => {
      setAllProductsData(res?.products);
    });

    fetchDataFromApi("/api/product/getAllFeaturedProducts").then((res) => {
      setFeaturedProducts(res?.products);
    });

    fetchDataFromApi("/api/bannerV1").then((res) => {
      setBannerV1Data(res?.data);
    });

    fetchDataFromApi("/api/bannerList2").then((res) => {
      setBannerList2Data(res?.data);
    });

    fetchDataFromApi("/api/blog").then((res) => {
      setBlogData(res?.blogs);
    });
  }, []);

  useEffect(() => {
    if (context?.catData?.length !== 0) {
      fetchDataFromApi(`/api/product/getAllProductsByCatId/${context?.catData[0]?._id}`).then((res) => {
        if (res?.error === false) {
          setPopularProductsData(res?.products);
        }
      });
    }

    const numbers = new Set();
    while (numbers.size < context?.catData?.length - 1) {
      const number = Math.floor(1 + Math.random() * 8);
      numbers.add(number);
    }

    getRendomProducts(Array.from(numbers), context?.catData);
  }, [context?.catData]);

  const getRendomProducts = (arr, catArr) => {
    const filterData = [];

    for (let i = 0; i < arr.length; i++) {
      let catId = catArr[arr[i]]?._id;

      fetchDataFromApi(`/api/product/getAllProductsByCatId/${catId}`).then((res) => {
        filterData.push({
          catName: catArr[arr[i]]?.name,
          data: res?.products,
        });
        setRandomCatProducts([...filterData]);
      });
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByCatId = (id) => {
    setPopularProductsData([]);
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      if (res?.error === false) {
        setPopularProductsData(res?.products);
      }
    });
  };

  return (
    <>
      {homeSlidesData?.length === 0 && <BannerLoading />}
      {homeSlidesData?.length !== 0 && (
        <div className="mt-[64px] md:mt-[80px]">
          <HomeSlider data={homeSlidesData} />
        </div>
      )}

      {context?.catData?.length !== 0 && <HomeCatSlider data={context?.catData} />}

      <section className="bg-white py-3 lg:py-8 px-4 sm:px-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div className="leftSec w-full lg:w-[40%]">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Popular Products</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Do not miss the current offers until the end of March.
              </p>
            </div>

            <div className="rightSec w-full lg:w-[60%] overflow-x-auto">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '0.75rem',
                    minWidth: 'unset',
                    padding: '6px 12px',
                    '@media (min-width: 600px)': {
                      fontSize: '0.875rem',
                      padding: '6px 16px',
                    },
                  },
                }}
              >
                {context?.catData?.length !== 0 &&
                  context?.catData?.map((cat, index) => (
                    <Tab label={cat?.name} key={index} onClick={() => filterByCatId(cat?._id)} />
                  ))}
              </Tabs>
            </div>
          </div>

          <div className="min-h-max lg:min-h-[60vh]">
            {popularProductsData?.length === 0 && <ProductLoading />}
            {popularProductsData?.length !== 0 && <ProductsSlider items={6} data={popularProductsData} />}
          </div>
        </div>
      </section>

      <section className="py-6 pt-0 bg-white px-4 sm:px-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-5">
            <div className="w-full">{productsData?.length !== 0 && <HomeBannerV2 data={productsData} />}</div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {bannerV1Data?.slice(-3).map((item, index) => (
                <BannerBoxV2
                  key={index}
                  info={item?.alignInfo}
                  image={item?.images?.[0]}
                  item={item}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-0 lg:py-4 pt-0 lg:pt-8 pb-0 bg-white px-4 sm:px-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="freeShipping w-full md:w-[80%] mx-auto py-4 px-4 border-2 border-[#ff5252] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 rounded-md mb-7">
            <div className="col1 flex items-center gap-3 lg:gap-4">
              <LiaShippingFastSolid className="text-3xl lg:text-[50px]" />
              <span className="text-base lg:text-xl font-semibold uppercase">
                Free Shipping
              </span>
            </div>
            <div className="col2 text-center lg:text-left">
              <p className="mb-0 mt-0 font-medium text-sm lg:text-base">
                Free Delivery Now On Your First Order and over ₹200
              </p>
            </div>
            <p className="font-bold text-xl lg:text-2xl">- Only ₹200*</p>
          </div>

          {bannerV1Data?.length !== 0 && <AdsBannerSliderV2 items={4} data={bannerV1Data} />}
        </div>
      </section>

      <section className="py-3 lg:py-2 pt-0 bg-white px-4 sm:px-0">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
          {productsData?.length === 0 && <ProductLoading />}
          {productsData?.length !== 0 && <ProductsSlider items={6} data={productsData} />}
        </div>
      </section>

      <section className="py-2 lg:py-0 pt-0 bg-white px-4 sm:px-0">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          {featuredProducts?.length === 0 && <ProductLoading />}
          {featuredProducts?.length !== 0 && <ProductsSlider items={6} data={featuredProducts} />}
          {bannerList2Data?.length !== 0 && <AdsBannerSlider items={4} data={bannerList2Data} />}
        </div>
      </section>

      {randomCatProducts?.length !== 0 &&
        randomCatProducts?.map(
          (productRow, index) =>
            productRow?.catName !== undefined &&
            productRow?.data?.length !== 0 && (
              <section className="py-5 pt-0 bg-white px-4 sm:px-0" key={index}>
                <div className="container mx-auto px-4 sm:px-6">
                  <h2 className="text-xl font-semibold mb-4">{productRow?.catName}</h2>
                  {productRow?.data?.length === 0 && <ProductLoading />}
                  {productRow?.data?.length !== 0 && <ProductsSlider items={6} data={productRow?.data} />}
                </div>
              </section>
            )
        )}

      {blogData?.length !== 0 && (
        <section className="py-5 pb-8 pt-0 bg-white blogSection px-4 sm:px-0">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-semibold mb-4">From The Blog</h2>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              navigation={context?.windowWidth < 992 ? false : true}
              modules={[Navigation, FreeMode]}
              freeMode={true}
              breakpoints={{
                250: { slidesPerView: 1, spaceBetween: 10 },
                330: { slidesPerView: 1, spaceBetween: 10 },
                500: { slidesPerView: 2, spaceBetween: 20 },
                700: { slidesPerView: 3, spaceBetween: 20 },
                1100: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="blogSlider"
            >
              {blogData?.slice()?.reverse()?.map((item, index) => (
                <SwiperSlide key={index}>
                  <BlogItem item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
