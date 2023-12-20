// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { Image, Input, Link, Select, SelectItem, Divider, Button, Pagination } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { OrderStatusValue, MonthValue } from "@/app/_enums/order-enums";
import { mapStringToMonthValue, mapStringToNoOfOrder, mapStringToOrderStatusValue } from "@/app/_functions/order-utils";
import { useEffect } from "react";

interface OrderStatus {
  value: OrderStatusValue;
  label: string;
}

interface Month {
  value: MonthValue;
  label: string;
}

interface Year {
  value: string;
  label: string;
}

interface OrderFilterProps {
  searchOrder: string;
  setSearchOrder: React.Dispatch<React.SetStateAction<string>>;
  searchStatus: OrderStatusValue;
  setSearchStatus: React.Dispatch<React.SetStateAction<OrderStatusValue>>;
  searchMonth: MonthValue;
  setSearchMonth: React.Dispatch<React.SetStateAction<MonthValue>>;
  searchYear: string;
  setSearchYear: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  showOrderNo: number;
  setShowOrderNo: React.Dispatch<React.SetStateAction<number>>;
}

const orderStatusOptions: OrderStatus[] = [
  {
    value: OrderStatusValue.All,
    label: "All",
  },
  {
    value: OrderStatusValue.InProgress,
    label: "In Progress",
  },
  {
    value: OrderStatusValue.Confirmed,
    label: "Confirmed",
  },
  {
    value: OrderStatusValue.Delivered,
    label: "Delivered",
  },
  {
    value: OrderStatusValue.Received,
    label: "Received",
  },
  {
    value: OrderStatusValue.Cancelled,
    label: "Cancelled",
  },
];

const monthOptions: Month[] = [
  { value: MonthValue.All, label: "All" },
  { value: MonthValue.Jan, label: "January" },
  { value: MonthValue.Feb, label: "February" },
  { value: MonthValue.Mar, label: "March" },
  { value: MonthValue.Apr, label: "April" },
  { value: MonthValue.May, label: "May" },
  { value: MonthValue.Jun, label: "June" },
  { value: MonthValue.Jul, label: "July" },
  { value: MonthValue.Aug, label: "August" },
  { value: MonthValue.Sep, label: "September" },
  { value: MonthValue.Oct, label: "October" },
  { value: MonthValue.Nov, label: "November" },
  { value: MonthValue.Dec, label: "December" },
];

const noOfOrderOptions: { value: string; label: string }[] = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
];

export default function OrderFilter({ searchOrder, setSearchOrder, searchStatus, setSearchStatus, searchMonth, setSearchMonth, searchYear, setSearchYear, setIsLoading, showOrderNo, setShowOrderNo }: OrderFilterProps) {
  const { theme } = useTheme();

  const yearOptions: Year[] = [{ value: "0", label: "All" }];

  const date = new Date();
  yearOptions.push({ value: "1", label: date.getFullYear() + "" });
  for (let i = 1; i < 5; i++) {
    date.setFullYear(date.getFullYear() - 1);
    yearOptions.push({ value: i + 1 + "", label: date.getFullYear() + "" });
  }

  useEffect(() => {
    setIsLoading(true);
  }, [searchOrder, searchStatus, searchMonth, searchYear, showOrderNo]);

  return (
    <div className="flex flex-row justify-between mt-8 mb-16 max-h-10">
      <div className="flex flex-1">
        <Input
          isClearable
          type="text"
          placeholder="Search Order"
          variant="bordered"
          size="sm"
          radius="sm"
          startContent={theme === "dark" ? <Image width={20} src="/icons/search-dark.svg" className="flex items-center justify-center" alt="Search Icon" /> : <Image width={20} src="/icons/search.svg" className="flex items-center justify-center" alt="Search Icon" />}
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
          label="No of Orders"
          className="max-w-[150px] mr-8"
          variant="bordered"
          size="sm"
          defaultSelectedKeys={["all"]}
          selectedKeys={[showOrderNo + ""]}
          onChange={(e) => {
            setShowOrderNo(mapStringToNoOfOrder(e.target.value));
          }}
        >
          {noOfOrderOptions.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Order Status"
          className="max-w-[150px] mr-8"
          variant="bordered"
          size="sm"
          defaultSelectedKeys={["all"]}
          selectedKeys={[searchStatus]}
          onChange={(e) => {
            setSearchStatus(mapStringToOrderStatusValue(e.target.value));
          }}
        >
          {orderStatusOptions.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Month"
          className="max-w-[150px] mr-8"
          variant="bordered"
          size="sm"
          selectedKeys={[searchMonth]}
          defaultSelectedKeys={["0"]}
          onChange={(e) => {
            setSearchMonth(mapStringToMonthValue(e.target.value));
          }}
        >
          {monthOptions.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Year"
          className="max-w-[150px]"
          variant="bordered"
          size="sm"
          selectedKeys={[searchYear]}
          defaultSelectedKeys={["0"]}
          onChange={(e) => {
            setSearchYear(e.target.value);
          }}
        >
          {yearOptions.map((item) => (
            <SelectItem value={item.value} key={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
