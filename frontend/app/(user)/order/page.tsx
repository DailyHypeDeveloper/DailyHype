// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// the layout is taken from
// https://cdn.dribbble.com/userupload/7778324/file/original-810dda72de79666f64f2a4d62f906721.png?resize=1024x768

"use client";

import { Image, Input, Link, Select, SelectItem, Divider, Button, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAppState } from "@/app/app-provider";
import CustomPagination from "@/app/_components/custom-pagination";
import { OrderStatusValue, MonthValue } from "@/app/_enums/order-enums";
import OrderFilter from "./order-filter";
import { CurrentActivePage } from "@/app/_enums/global-enums";

// const getOrders = (filterOptions: any, offset: any, token: any) => {
//   const { searchText, status, month, year } = filterOptions;

//   return fetch(`${process.env.BACKEND_URL}/api/orders?offset=${offset}&search=${searchText}&status=${status}&month=${month}&year=${year}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => {
//       if (response.status === 403) {
//         throw new Error("Unauthorized Access");
//       }
//       return response.json();
//     })
//     .then((result) => {
//       return result;
//     });
// };

// const getOrderCount = (filterOptions: any, token: any) => {
//   const { searchText, status, month, year } = filterOptions;

//   return fetch(`${process.env.BACKEND_URL}/api/orderCount?status=${status}&year=${year}&month=${month}&search=${searchText}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => {
//       if (response.status === 403) {
//         throw new Error("Unauthorized Access");
//       }
//       return response.json();
//     })
//     .then((result) => {
//       return result;
//     });
// };

// const getOrderData = (filterOptions: any, offset: any, token: any) => {
//   return Promise.all([getOrders(filterOptions, offset, token), getOrderCount(filterOptions, token)])
//     .then(([orderData, orderCount]) => {
//       return [orderData.order, orderCount];
//     })
//     .catch((error) => {
//       console.error(error);
//       return [];
//     });
// };

export default function Order() {
  const { token, setCurrentActivePage } = useAppState();

  const [searchOrder, setSearchOrder] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<OrderStatusValue>(OrderStatusValue.All);
  const [searchMonth, setSearchMonth] = useState<MonthValue>(MonthValue.All);
  const [searchYear, setSearchYear] = useState<string>("0");
  const [orderCount, setOrderCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const orderFilterProps = {
    searchOrder,
    setSearchOrder,
    searchStatus,
    setSearchStatus,
    searchMonth,
    setSearchMonth,
    searchYear,
    setSearchYear,
  };

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.None);
  //   if (!token) {
  //     alert("Invalid Token!");
  //     setCurrentActivePage("signout");
  //   } else {
  //     const dataObj = { searchText: searchOrder, status: searchStatus, month: searchMonth, year: searchYear };
  //     getOrderData(dataObj, 5 * (currentPage - 1), token).then(([orderData, orderCount]) => {
  //       setOrderCount(parseInt(orderCount.count) as number);
  //       setOrderData(orderData);
  //       setIsLoading(false);
  //     });
  //   }
  }, []);

  // useEffect(() => {
  // setIsLoading(true);
  // getOrderCount(
  //   {
  //     searchText: searchOrder,
  //     status: searchStatus,
  //     month: searchMonth,
  //     year: searchYear,
  //   },
  //   token
  // )
  //   .then((result) => {
  //     setOrderCount(parseInt(result.count));
  //     setIsLoading(false);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     setOrderCount(1);
  //     setIsLoading(false);
  //   });
  // }, [searchOrder, searchStatus, searchMonth, searchYear]);

  // useEffect(() => {
  //   console.log(orderData);
  // }, [orderData]);

  // useEffect(() => {}, [currentPage]);

  return (
    <div className="flex flex-col max-w-full py-10 px-40">
      <h2 className="text-2xl font-medium uppercase tracking-wide">Your Orders</h2>

      <OrderFilter {...orderFilterProps} />

      {isLoading &&
        orderData.map((order, index) => {
          return (
            <div className="flex flex-col max-w-full mb-16 border-1 rounded-xl">
              <div className="flex py-4 border-b-1">
                <div className="flex justify-start basis-3/5">
                  <div className="flex flex-col mx-16">
                    <label className="text-small mb-2">Order placed</label>
                    <label className="text-small font-medium">June 2, 2023</label>
                  </div>
                  <div className="flex flex-col me-16">
                    <label className="text-small mb-2">Total</label>
                    <label className="text-small font-medium">$157.99</label>
                  </div>
                  <div className="flex flex-col me-16">
                    <label className="text-small mb-2">Order Status</label>
                    <label className="text-small font-medium">In Progress</label>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-small mb-2">Delivered to</label>
                    <label className="text-small font-medium">Dover</label>
                  </div>
                </div>
                <div className="flex justify-end basis-2/5 me-16">
                  <div className="flex flex-col">
                    <label className="text-right text-small mb-2">Order #100000</label>
                    <div className="flex">
                      <Link href="" className="me-3 text-custom-color2 underline text-small">
                        Cancel Order
                      </Link>
                      <Divider orientation="vertical" />
                      <Link href="" className="ms-3 text-custom-color2 underline text-small">
                        View Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mx-16 my-6">
                <div className="flex justify-start">
                  <div className="me-5">
                    <Image src="/images/sample.jpg" width={120} alt="Product Image" />
                  </div>
                  <div className="flex flex-col">
                    <Link href="" className="text-black max-w-2xl dark:text-white leading-normal">
                      Product Name
                    </Link>
                    <label className="text-small mt-3">
                      <span className="me-10">
                        Colour: <span className="capitalize">Blue</span>
                      </span>
                      <span className="me-10">
                        Size: <span className="uppercase">xl</span>
                      </span>
                      <span className="tracking-widest">x1</span>
                    </label>
                    <label className="text-small mt-3">
                      <span className="tracking-wide">$88.0</span>
                    </label>
                  </div>
                  <Button className="ms-auto self-center text-white bg-gradient-to-r from-custom-color1 to-custom-color2">Review</Button>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col mx-16 my-6">
                <div className="flex justify-start">
                  <div className="me-5">
                    <Image src="/images/sample.jpg" width={120} alt="Product Image" />
                  </div>
                  <div className="flex flex-col">
                    <Link href="" className="text-black max-w-2xl dark:text-white leading-normal">
                      Product Name
                    </Link>
                    <label className="text-small mt-3">
                      <span className="me-10">
                        Colour: <span className="capitalize">Blue</span>
                      </span>
                      <span className="me-10">
                        Size: <span className="uppercase">xl</span>
                      </span>
                      <span className="tracking-widest">x1</span>
                    </label>
                    <label className="text-small mt-3">
                      <span className="tracking-wide">$88.0</span>
                    </label>
                  </div>
                  <Button className="ms-auto self-center text-white bg-gradient-to-r from-custom-color1 to-custom-color2">Review</Button>
                </div>
              </div>
            </div>
          );
        })}
      {!isLoading && (
        <CustomPagination
          className="ms-auto mb-5"
          onChange={(current) => {
            setCurrentPage(current);
          }}
          total={orderCount}
          initialPage={currentPage}
        />
      )}
    </div>
  );
}
