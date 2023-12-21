"use client";

import { CurrentActivePage } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import OrderFilter from "./order-filter";
import { MonthValue, OrderStatusValue } from "@/app/_enums/order-enums";
import OrderList from "./order-list";
import { Button, Image } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function Page({ params }: { params: { orderstatus: string } }) {
  const orderDivRef = useRef<HTMLDivElement>(null);
  const orderStatus = params.orderstatus;
  const router = useRouter();
  const { theme } = useTheme();
  const { token, setToken, setCurrentActivePage } = useAppState();
  const [searchOrder, setSearchOrder] = useState<string>("");
  const [searchMonth, setSearchMonth] = useState<MonthValue>(MonthValue.All);
  const [searchYear, setSearchYear] = useState<string>("0");
  const [showOrderNo, setShowOrderNo] = useState<number>(5);
  const [orderCount, setOrderCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const orderFilterProps = {
    searchMonth,
    setSearchMonth,
    searchYear,
    setSearchYear,
    showOrderNo,
    setShowOrderNo,
  };

  const orderFilterDataProps = {
    searchOrder,
    orderStatus,
    searchMonth,
    searchYear,
    showOrderNo,
    isLoading,
    orderCount,
    setOrderCount,
    setIsLoading,
    currentPage,
  };

  useEffect(() => {
    if (token) {
      const handleScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const triggerScroll = 200; // Adjust this value based on when you want the button to appear
        setShowScrollButton(scrollY > triggerScroll);
      };
      window.addEventListener("scroll", handleScroll);

      if (orderStatus === OrderStatusValue.All) setCurrentActivePage(CurrentActivePage.AllOrder);
      else if (orderStatus === OrderStatusValue.InProgress) setCurrentActivePage(CurrentActivePage.InProgressOrder);
      else if (orderStatus === OrderStatusValue.Confirmed) setCurrentActivePage(CurrentActivePage.ConfirmedOrder);
      else if (orderStatus === OrderStatusValue.Delivered) setCurrentActivePage(CurrentActivePage.DeliveredOrder);
      else if (orderStatus === OrderStatusValue.Received) setCurrentActivePage(CurrentActivePage.ReceivedOrder);
      else if (orderStatus === OrderStatusValue.Cancelled) setCurrentActivePage(CurrentActivePage.CancelledOrder);
      else if (orderStatus === OrderStatusValue.Returned) setCurrentActivePage(CurrentActivePage.ReturnedOrder);
      else {
        alert("Invalid Order Status!");
        router.replace("/personal");
      }

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      alert("Unauthorized Access!");
      localStorage.removeItem("token");
      setToken(null);
      router.replace("/signin");
    }
  }, []);

  if (!token) return <></>;

  return (
    <div ref={orderDivRef} className="flex flex-col w-full">
      <OrderFilter {...orderFilterProps} selectedTab={orderStatus} />
      <OrderList {...orderFilterDataProps} />
      {showScrollButton && (
        <Button
          className="fixed bottom-10 right-10 min-w-0 min-h-0 p-0 w-12 h-12 outline-none rounded-full"
          onClick={() => {
            if (orderDivRef.current) orderDivRef.current.scrollIntoView();
          }}
        >
          <Image src={theme === "dark" ? "/icons/arrow-up-dark.svg" : "/icons/arrow-up.svg"} className="w-5 h-5" alt="Top Icon" />
        </Button>
      )}
    </div>
  );
}
