"use client";

import { MonthValue } from "@/enums/order-enums";
import { mapStringToMonthValue, mapStringToNoOfOrder } from "@/functions/order-utils";
import { Tabs, Tab, Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";

interface orderFilterProps {
  searchMonth: MonthValue;
  setSearchMonth: React.Dispatch<React.SetStateAction<MonthValue>>;
  searchYear: string;
  setSearchYear: React.Dispatch<React.SetStateAction<string>>;
  showOrderNo: number;
  setShowOrderNo: React.Dispatch<React.SetStateAction<number>>;
  selectedTab: string;
}

interface Month {
  value: MonthValue;
  label: string;
}

interface Year {
  value: string;
  label: string;
}

const noOfOrderOptions: { value: string; label: string }[] = [
  { value: "5", label: "5 orders" },
  { value: "10", label: "10 orders" },
  { value: "15", label: "15 orders" },
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

export default function OrderFilter({ searchMonth, setSearchMonth, searchYear, setSearchYear, showOrderNo, setShowOrderNo, selectedTab }: orderFilterProps) {
  const yearOptions: Year[] = [{ value: "0", label: "All" }];

  const date = new Date();
  yearOptions.push({ value: "1", label: date.getFullYear() + "" });
  for (let i = 1; i < 5; i++) {
    date.setFullYear(date.getFullYear() - 1);
    yearOptions.push({ value: i + 1 + "", label: date.getFullYear() + "" });
  }

  return (
    <div className="flex w-full justify-between mb-5">
      <Tabs classNames={{ tab: "data-[selected=true]:bg-gradient-to-r from-custom-color1 to-custom-color2", tabContent: "group-data-[selected=true]:text-white", cursor: "bg-gradient-to-r from-custom-color1 to-custom-color2" }} aria-label="Options" selectedKey={selectedTab}>
        <Tab key="all" href="/order/all" title="All"></Tab>
        <Tab key="inprogress" href="/order/inprogress" title="In Progress"></Tab>
        <Tab key="confirmed" href="/order/confirmed" title="Confirmed"></Tab>
        <Tab key="delivered" href="/order/delivered" title="Delivered"></Tab>
        <Tab key="received" href="/order/received" title="Received"></Tab>
        <Tab key="cancelled" href="/order/cancelled" title="Cancelled"></Tab>
        <Tab key="returned" href="/order/returned" title="Returned"></Tab>
      </Tabs>
      <div className="flex w-full justify-end">
        <Select
          label="Show"
          className="max-w-[120px] mr-3"
          selectedKeys={[showOrderNo + ""]}
          variant="bordered"
          size="sm"
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
          label="Month"
          className="max-w-[125px] mr-3"
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
          className="max-w-[100px]"
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
