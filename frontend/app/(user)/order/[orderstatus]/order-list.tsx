// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { OrderStatusValue, MonthValue } from "@/app/_enums/order-enums";
import { Button, Divider, Image, Link, Skeleton, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { capitaliseWord, formatDateByMonthDayYear, formatMoney } from "@/app/_functions/formatter";
import { mapStringToOrderStatusValue } from "@/app/_functions/order-utils";
import { useAppState } from "@/app/app-provider";

interface OrderFilterDataProps {
  searchOrder: string;
  orderStatus: string;
  searchMonth: MonthValue;
  searchYear: string;
  showOrderNo: number;
  isLoading: boolean;
  orderCount: number;
  setOrderCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
}

interface FilterOptions {
  searchText: string;
  status: OrderStatusValue;
  month: MonthValue;
  year: string;
}

interface OrderStatusInfoText {
  "in progress": string;
  delivered: string;
  cancelled: string;
  received: string;
  confirmed: string;
  refunded: string;
}

const orderStatusInfoText: OrderStatusInfoText = {
  "in progress": "If your order is not confirmed within a week, it will be automatically cancelled.",
  delivered: "Once delivered, clicking 'Receive Order' will prevent refunds. This status changes to 'Received' after 10 days automatically.",
  cancelled: "Your order is cancelled.",
  confirmed: "",
  received: "",
  refunded: "",
};

const getOrders = (filterOptions: FilterOptions, offset: number, limit: number, token: string | null) => {
  const { searchText, status, month, year } = filterOptions;
  offset = (offset - 1) * limit;
  return fetch(`${process.env.BACKEND_URL}/api/orders?limit=${limit}&offset=${offset}&search=${searchText}&status=${status}&month=${month}&year=${year}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("Unauthorized Access");
      }
      return response.json();
    })
    .then((result) => {
      return result;
    });
};

const getOrderCount = (filterOptions: FilterOptions, token: string | null) => {
  const { searchText, status, month, year } = filterOptions;

  return fetch(`${process.env.BACKEND_URL}/api/orderCount?status=${status}&year=${year}&month=${month}&search=${searchText}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("Unauthorized Access");
      }
      return response.json();
    })
    .then((result) => {
      return result;
    });
};

const getOrderData = (filterOptions: FilterOptions, offset: number, limit: number, token: string | null) => {
  return Promise.all([getOrders(filterOptions, offset, limit, token), getOrderCount(filterOptions, token)])
    .then(([orderData, orderCount]) => {
      return [orderData.order, orderCount];
    })
    .catch((error) => {
      console.error(error);
      return [[], [1]];
    });
};

export default function OrderList({ searchOrder, orderStatus, searchMonth, searchYear, showOrderNo, isLoading, orderCount, setOrderCount, setIsLoading, currentPage }: OrderFilterDataProps) {
  const { token, setToken } = useAppState();
  const { theme } = useTheme();
  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (isLoading)
      getOrderData({ searchText: searchOrder, status: mapStringToOrderStatusValue(orderStatus), month: searchMonth, year: searchYear }, currentPage, showOrderNo, token).then((result) => {
        setOrderData(result[0]);
        setOrderCount(Math.ceil(result[1].count / showOrderNo));
        console.log(result);
        setIsLoading(false);
      });
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col max-w-full mb-8 border-1 rounded-xl">
          <label>{}</label>
          <div className="flex py-4 border-b-1">
            <Skeleton className="flex basis-4/5 mx-8 rounded-lg h-12" />
            <Skeleton className="flex ms-auto basis-1/5 me-8 rounded-lg w-full h-12" />
          </div>
          <div className="flex flex-col mx-8 my-4">
            <div className="flex justify-start">
              <div className="me-5">
                <Skeleton className="flex w-[120px] rounded-lg h-[150px]" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="flex w-80 h-8 rounded-lg" />
                <Skeleton className="mt-3 flex w-52 h-6 rounded-lg" />
                <Skeleton className="mt-3 flex w-32 h-6 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
      {!isLoading &&
        orderData.map((order: any, index: number) => {
          return (
            <div key={index} className="flex flex-col max-w-full mb-8 border-1 rounded-xl">
              <div className="flex py-4 border-b-1">
                <div className="flex justify-start basis-4/5">
                  <div className="flex flex-col ms-8 me-12">
                    <label className="text-small mb-2">Order placed</label>
                    <label className="text-small font-medium">{formatDateByMonthDayYear(order.createdat)}</label>
                  </div>
                  <div className="flex flex-col me-12">
                    <label className="text-small mb-2">Total</label>
                    <label className="text-small font-medium">${formatMoney(order.totalamount)}</label>
                  </div>
                  <div className="flex flex-col me-12">
                    <label className="text-small mb-2">Order Status</label>
                    <label className="flex items-center text-small font-medium w-fit">
                      {capitaliseWord(order.orderstatus)}
                      {theme === "dark" ? (
                        <Tooltip showArrow={true} offset={12} content={<div className="px-2 py-2">{orderStatusInfoText[order.orderstatus as keyof OrderStatusInfoText]}</div>}>
                          <Image src="/icons/info-dark.svg" className="ms-2 cursor-pointer" width={15} alt="Info Icon" />
                        </Tooltip>
                      ) : (
                        <Tooltip showArrow={true} offset={12} content={<div className="px-2 py-2 max-w-lg text-small">{orderStatusInfoText[order.orderstatus as keyof OrderStatusInfoText]}</div>}>
                          <Image src="/icons/info.svg" className="ms-2 cursor-pointer" width={15} alt="Info Icon" />
                        </Tooltip>
                      )}
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-small mb-2">Delivered to</label>
                    <label className="text-small font-medium">{order.deliveryaddress}</label>
                  </div>
                </div>
                <div className="flex justify-end basis-1/5 me-8">
                  <div className="flex flex-col">
                    <Link href={`/order/orderdetail/${order.orderid}`} className="text-right text-black dark:text-white underline font-medium text-small mb-2">
                      Order #{order.orderid}
                    </Link>
                    <div className="flex">
                      {order.orderstatus === "in progress" && (
                        <Link href="" className="text-custom-color2 underline text-small">
                          Cancel Order
                        </Link>
                      )}
                      {order.orderstatus === "delivered" && (
                        <>
                          <Link href="" className="me-2 text-custom-color2 underline text-small">
                            Receive Order
                          </Link>
                          <Divider orientation="vertical" />
                          <Link href="" className="ms-2 text-custom-color2 underline text-small">
                            Return Order
                          </Link>
                        </>
                      )}
                      {order.orderstatus === "received" && (
                        <Link href="" className="text-custom-color2 underline text-small">
                          View Invoice
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {order.productdetails.map((product: any, index: number) => {
                console.log(product);
                return (
                  <div key={index}>
                    <div className="flex flex-col mx-8 my-4">
                      <div className="flex justify-start">
                        <div className="me-5">
                          <Image src={product.image} width={120} height={150} alt="Product Image" />
                        </div>
                        <div className="flex flex-col">
                          <Link href="" className="text-black max-w-2xl dark:text-white leading-normal">
                            {product.productname}
                          </Link>
                          <label className="text-small mt-3">
                            <span className="me-10">
                              Colour: <span className="capitalize">{capitaliseWord(product.colour)}</span>
                            </span>
                            <span className="me-10">
                              Size: <span className="uppercase">{product.size}</span>
                            </span>
                            <span className="tracking-widest">x{product.qty}</span>
                          </label>
                          <label className="text-small mt-3">
                            <span className="tracking-wide">${formatMoney((product.qty * product.unitprice).toString())}</span>
                          </label>
                        </div>
                        <Button className="ms-auto self-center text-white bg-gradient-to-r from-custom-color1 to-custom-color2">Review</Button>
                      </div>
                    </div>
                    {index !== order.productdetails.length - 1 && <Divider />}
                  </div>
                );
              })}
            </div>
          );
        })}
      {!isLoading && orderData.length <= 0 && (
        <div className="flex flex-col max-w-full mb-16 py-4 border-1 rounded-xl">
          <label className="text-small text-center text-red-700 dark:text-red-200 font-medium">No Order Found!</label>
        </div>
      )}
    </>
  );
}
