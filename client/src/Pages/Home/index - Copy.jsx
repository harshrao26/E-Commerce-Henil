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
import { Navigation } from "swiper/modules";
import BlogItem from "../../components/BlogItem";
import HomeBannerV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/bannerBoxV2";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import ProductLoading from "../../components/ProductLoading";
import ProductCard from "../../components/ProductCard";

const Home = () => {
  const [value, setValue] = useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [productsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [bannerList2Data, setBannerList2Data] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [randomCatProducts, setRandomCatProducts] = useState([]);
  const [handcraftProducts, setHandcraftProducts] = useState([]);
  const [dressProducts, setDressProducts] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/homeSlides").then((res) => setHomeSlidesData(res?.data));
    fetchDataFromApi("/api/product/getAllProducts").then((res) => setAllProductsData(res?.products));
    fetchDataFromApi("/api/product/getAllFeaturedProducts").then((res) => setFeaturedProducts(res?.products));
    fetchDataFromApi("/api/bannerV1").then((res) => setBannerV1Data(res?.data));
    fetchDataFromApi("/api/bannerList2").then((res) => setBannerList2Data(res?.data));
    fetchDataFromApi("/api/blog").then((res) => setBlogData(res?.blogs));
  }, []);

  useEffect(() => {
    if (context?.catData?.length !== 0) {
      fetchDataFromApi(`/api/product/getAllProductsByCatName/handcraft`)
        .then((res) => res?.error === false && setHandcraftProducts(res?.products));
      fetchDataFromApi(`/api/product/getAllProductsByCatName/dress`)
        .then((res) => res?.error === false && setDressProducts(res?.products));

      const numbers = new Set();
      while (numbers.size < context?.catData?.length - 1) {
        const number = Math.floor(1 + Math.random() * 9);
        numbers.add(number);
      }

      getRendomProducts(Array.from(numbers), context?.catData);
    }
  }, [context?.catData]);

  const getRendomProducts = (arr, catArr) => {
    const filterData = [];

    for (let i = 0; i < arr.length; i++) {
      let catId = catArr[arr[i]]?._id;

      fetchDataFromApi(`/api/product/getAllProductsByCatId/${catId}`).then((res) => {
        filterData.push({
          catName: catArr[arr[i]]?.name,
          data: res?.products
        });

        setRandomCatProducts([...filterData]);
      });
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="mt-[80px]">
        {homeSlidesData?.length !== 0 && <HomeSlider data={homeSlidesData} />}
        {context?.catData?.length !== 0 && <HomeCatSlider data={context?.catData} />}
      </div>

      <section className="bg-white py-8">
        <div className="container">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="leftSec">
              <h2 className="text-[20px] font-[600]">Popular Products</h2>
              <p className="text-[14px] font-[400] mt-0 mb-0">
                Do not miss the current offers until the end of March.
              </p>
            </div>
          </div>

          {/* Handcraft Products */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-[600]">Handcraft Collection</h3>
              <a href="/category/handcraft" className="text-[#ff5252] text-sm font-medium hover:underline">
                View All
              </a>
            </div>
            {handcraftProducts?.length === 0 ? (
              <ProductLoading />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {handcraftProducts.slice(0, 6).map((product, index) => (
                  <ProductCard key={`handcraft-${index}`} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Dress Products */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-[600]">Dress Collection</h3>
              <a href="/category/dress" className="text-[#ff5252] text-sm font-medium hover:underline">
                View All
              </a>
            </div>
            {dressProducts?.length === 0 ? (
              <ProductLoading />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {dressProducts.slice(0, 6).map((product, index) => (
                  <ProductCard key={`dress-${index}`} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-6 pt-0 bg-white">
        <div className="container flex gap-5 flex-col lg:flex-row">
          <div className="part1 lg:w-[70%] w-full">
            {productsData?.length !== 0 && <HomeBannerV2 data={productsData} />}
          </div>
          <div className="part2 lg:w-[30%] w-full flex items-center gap-5 justify-between flex-col">
            <BannerBoxV2 info={bannerV1Data.at(-1)?.alignInfo} image={bannerV1Data.at(-1)?.images[0]} item={bannerV1Data.at(-1)} />
            <BannerBoxV2 info={bannerV1Data.at(-2)?.alignInfo} image={bannerV1Data.at(-2)?.images[0]} item={bannerV1Data.at(-2)} />
          </div>
        </div>
      </section>

      <section className="py-4 pt-8 pb-0 bg-white">
        <div className="container">
          <div className="freeShipping w-[90%] mx-auto py-4 p-4 border-2 border-[#ff5252] flex flex-col md:flex-row items-center justify-between rounded-md mb-7 gap-4">
            <div className="col1 flex items-center gap-4">
              <LiaShippingFastSolid className="text-[50px]" />
              <span className="text-[20px] font-[600] uppercase">Free Shipping</span>
            </div>
            <div className="col2 text-center md:text-left">
              <p className="mb-0 mt-0 font-[500]">Free Delivery Now On Your First Order and over $200</p>
            </div>
            <p className="font-bold text-[25px]">- Only $200*</p>
          </div>

          {bannerV1Data?.length !== 0 && <AdsBannerSliderV2 items={4} data={bannerV1Data} />}
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600]">Latest Products</h2>
          {productsData?.length === 0 && <ProductLoading />}
          {productsData?.length !== 0 && <ProductsSlider items={6} data={productsData} />}
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600]">Featured Products</h2>
          {featuredProducts?.length === 0 && <ProductLoading />}
          {featuredProducts?.length !== 0 && <ProductsSlider items={6} data={featuredProducts} />}
          {bannerList2Data?.length !== 0 && <AdsBannerSlider items={4} data={bannerList2Data} />}
        </div>
      </section>

      {randomCatProducts?.length !== 0 &&
        randomCatProducts.map((productRow, index) => (
          productRow?.catName && productRow?.data?.length !== 0 && (
            <section className="py-5 pt-0 bg-white" key={index}>
              <div className="container">
                <h2 className="text-[20px] font-[600]">{productRow?.catName}</h2>
                {productRow?.data?.length === 0 && <ProductLoading />}
                {productRow?.data?.length !== 0 && <ProductsSlider items={6} data={productRow?.data} />}
              </div>
            </section>
          )
        ))
      }

      {blogData?.length !== 0 && (
        <section className="py-5 pb-8 pt-0 bg-white blogSection">
          <div className="container">
            <h2 className="text-[20px] font-[600] mb-4">From The Blog</h2>
            <Swiper slidesPerView={1} spaceBetween={20} breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }} navigation={true} modules={[Navigation]} className="blogSlider">
              {blogData.map((item, index) => (
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
