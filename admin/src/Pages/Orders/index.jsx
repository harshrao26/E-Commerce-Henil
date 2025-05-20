import React, { useState, useEffect, useContext } from 'react';
import { Button, Select, MenuItem, Pagination } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import SearchBox from '../../Components/SearchBox';
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from "../../App.jsx";

export const Orders = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageOrder, setPageOrder] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const context = useContext(MyContext);

  const getPaginatedOrders = async () => {
    context?.setProgress(50);
    const res = await fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`);
    if (res?.error === false) {
      setOrdersData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
      context?.setProgress(100);
    }
  };

  const getAllOrdersForSearch = async () => {
    const res = await fetchDataFromApi(`/api/order/order-list`);
    if (res?.error === false) {
      const filtered = res?.data?.filter(order => {
        const orderId = order?._id?.toLowerCase() || "";
        const name = order?.userId?.name?.toLowerCase() || "";
        const email = order?.userId?.email?.toLowerCase() || "";
        const createdAt = order?.createdAt?.split("T")[0] || "";

        return (
          orderId.includes(searchQuery.toLowerCase()) ||
          name.includes(searchQuery.toLowerCase()) ||
          email.includes(searchQuery.toLowerCase()) ||
          createdAt.includes(searchQuery)
        );
      });
      setOrdersData(filtered || []);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      getAllOrdersForSearch();
    } else {
      getPaginatedOrders();
    }
  }, [pageOrder, searchQuery]);

  const toggleProductView = (index) => {
    setIsOpenOrderdProduct(prev => (prev === index ? null : index));
  };

  const handleStatusChange = async (e, id) => {
    const newStatus = e.target.value;
    const obj = { id, order_status: newStatus };

    const res = await editData(`/api/order/order-status/${id}`, obj);
    if (res?.data?.error === false) {
      context.alertBox("success", res?.data?.message);
      getPaginatedOrders();
    }
  };

  const deleteOrder = async (id) => {
    if (context?.userData?.role !== "ADMIN") {
      return context.alertBox("error", "Only admin can delete data");
    }

    const res = await deleteData(`/api/order/deleteOrder/${id}`);
    if (res?.error === false) {
      context.alertBox("success", "Order deleted successfully!");
      getPaginatedOrders();
    }
  };

  return (
    <div className="card my-2 md:mt-4 shadow-md sm:rounded-lg bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5">
        <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">Recent Orders</h2>
        <div className="ml-auto w-full">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
              setPageOrder(1); // Reset pagination on new search
            }}
            setPageOrder={setPageOrder}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {["", "Order Id", "Payment Id", "Name", "Phone Number", "Address", "Pincode", "Total Amount", "Email", "User Id", "Order Status", "Date", "Action"]
                .map((header, i) => <th key={i} className="px-6 py-3 whitespace-nowrap">{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {ordersData?.map((order, index) => (
              <React.Fragment key={order._id}>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">
                    <Button onClick={() => toggleProductView(index)} className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]">
                      {isOpenOrderdProduct === index ? <FaAngleUp /> : <FaAngleDown />}
                    </Button>
                  </td>
                  <td className="px-6 py-4 text-primary">{order?._id}</td>
                  <td className="px-6 py-4">{order?.paymentId || 'CASH ON DELIVERY'}</td>
                  <td className="px-6 py-4">{order?.userId?.name}</td>
                  <td className="px-6 py-4">{order?.delivery_address?.mobile}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                      {order?.delivery_address?.addressType}
                    </span>
                    <div className="w-[400px]">
                      {[order?.delivery_address?.address_line1, order?.delivery_address?.city, order?.delivery_address?.landmark, order?.delivery_address?.state, order?.delivery_address?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">{order?.delivery_address?.pincode}</td>
                  <td className="px-6 py-4">{order?.totalAmt}</td>
                  <td className="px-6 py-4">{order?.userId?.email}</td>
                  <td className="px-6 py-4 text-primary">{order?.userId?._id}</td>
                  <td className="px-6 py-4">
                    <Select
                      value={order?.order_status || "pending"}
                      size="small"
                      style={{ zoom: '80%' }}
                      onChange={(e) => handleStatusChange(e, order?._id)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirm">Confirm</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </td>
                  <td className="px-6 py-4">{order?.createdAt?.split("T")[0]}</td>
                  <td className="px-6 py-4">
                    <Button variant="outlined" color="error" size="small" onClick={() => deleteOrder(order._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>

                {isOpenOrderdProduct === index && (
                  <tr>
                    <td colSpan="13" className="pl-20">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>{["Product Id", "Product Title", "Image", "Quantity", "Price", "Sub Total"].map((h, i) => <th key={i} className="px-6 py-3">{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {order?.products?.map((item, idx) => (
                              <tr key={idx} className="bg-white border-b">
                                <td className="px-6 py-4">{item?._id}</td>
                                <td className="px-6 py-4 w-[200px]">{item?.productTitle}</td>
                                <td className="px-6 py-4">
                                  <img src={item?.image} alt="product" className="w-[40px] h-[40px] object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4">{item?.quantity}</td>
                                <td className="px-6 py-4">
                                  {item?.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                </td>
                                <td className="px-6 py-4">
                                  {(item?.price * item?.quantity)?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-10 pb-5">
          <Pagination
            showFirstButton
            showLastButton
            count={totalPages}
            page={pageOrder}
            onChange={(e, value) => setPageOrder(value)}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
