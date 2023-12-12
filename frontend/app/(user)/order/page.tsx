// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// the layout is taken from
// https://cdn.dribbble.com/userupload/7778324/file/original-810dda72de79666f64f2a4d62f906721.png?resize=1024x768

"use client";

import { Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { useAppState } from "@/app/app-provider";

interface OptionInterface {
  value: string;
  label: string;
}

interface OrderFilterInterface {
  searchText: string;
  status: string;
  month: number;
  year: number;
}

const orderStatusOptions: OptionInterface[] = [
  {
    value: "all",
    label: "All"
  },
  {
    value: "in progress",
    label: "In Progress"
  },
  {
    value: "confirmed",
    label: "Confirmed"
  },
  {
    value: "delivered",
    label: "Delivered"
  },
  {
    value: "received",
    label: "Received"
  },
  {
    value: "cancelled",
    label: "Cancelled"
  }
];

const monthOptions: OptionInterface[] = [
  { value: "0", label: "All" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const yearOptions: OptionInterface[] = [{ value: "0", label: "All" }];

const getOrders = (filterOptions: OrderFilterInterface, offset: number, token: string) => {
  const { searchText, status, month, year } = filterOptions;

  return fetch(`${process.env.BACKEND_URL}/api/orders?offset=${offset}&search=${searchText}&status=${status}&month=${month}&year=${year}`)
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

const getOrderCount = (filterOptions: OrderFilterInterface, token: string) => {
  const { searchText, status, month, year } = filterOptions;

  return fetch(`${process.env.BACKEND_URL}/api/orderCount?status=${status}&year=${year}&month=${month}&search=${searchText}`)
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

const getOrderData = (filterOptions: OrderFilterInterface, offset: number, token: string): Promise<object> => {
  return Promise.all([getOrders(filterOptions, offset, token), getOrderCount(filterOptions, token)])
    .then(([orderData, orderCountData]) => {
      return {};
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
};

export default function Order() {
  const { token, setCurrentPage } = useAppState();

  setCurrentPage("order");

  const [searchOrder, setSearchOrder] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchMonth, setSearchMonth] = useState<string>("0");
  const [searchYear, setSearchYear] = useState<string>("0");

  const date = new Date();
  yearOptions.push({ value: "1", label: date.getFullYear() + "" });
  for (let i = 1; i < 5; i++) {
    date.setFullYear(date.getFullYear() - 1);
    yearOptions.push({ value: i + 1 + "", label: date.getFullYear() + "" });
  }

  return (
    <div className="flex flex-col max-w-full my-10 mx-40">
      <h2 className="text-2xl font-medium uppercase tracking-wide">Your Orders</h2>
      <div className="flex flex-row justify-between my-8 max-h-10">
        <div className="flex flex-1">
          <Input
            isClearable
            type="text"
            placeholder="Search Order ..."
            variant="bordered"
            size="sm"
            radius="sm"
            value={searchOrder}
            className="w-[350px]"
            onChange={(e) => {
              setSearchOrder(e.target.value);
            }}
            onClear={() => {
              setSearchOrder("");
            }}
          />
        </div>
        <div className="flex flex-row flex-1 justify-end">
          <Select
            label="Order Status"
            className="max-w-[150px] mr-8"
            variant="bordered"
            size="sm"
            defaultSelectedKeys={["all"]}
          >
            {orderStatusOptions.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Month"
            className="max-w-[150px] mr-8"
            variant="bordered"
            size="sm"
            defaultSelectedKeys={["0"]}
          >
            {monthOptions.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Year"
            className="max-w-[150px]"
            variant="bordered"
            size="sm"
            defaultSelectedKeys={["0"]}
          >
            {yearOptions.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
