"use client";

import { CurrentActivePage, URL } from "@/enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MonthValue, OrderStatusValue } from "@/enums/order-enums";
import { Button, Image, Input, Skeleton } from "@nextui-org/react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const OrderFilter = dynamic(() => import("@/app/(user)/order/[orderstatus]/order-filter"));
const OrderList = dynamic(() => import("@/app/(user)/order/[orderstatus]/order-list"), {
  loading: () => (
    <div className="flex flex-col max-w-full mb-8 border-1 rounded-xl">
      <div className="flex py-4 border-b-1">
        <Skeleton className="flex basis-3/5 mx-8 rounded-lg h-6" />
        <Skeleton className="flex ms-auto basis-2/5 me-8 rounded-lg w-full h-6" />
      </div>
      <div className="flex flex-col mx-8 my-4">
        <div className="flex justify-start">
          <div className="me-5">
            <Skeleton className="flex w-[80px] rounded-lg h-[100px]" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="flex w-80 h-8 rounded-lg" />
            <Skeleton className="mt-3 flex w-52 h-6 rounded-lg" />
            <Skeleton className="mt-3 flex w-32 h-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  ),
});
const CustomPagination = dynamic(() => import("@/components/custom/custom-pagination"));

export default function Page({ params }: { params: { orderstatus: string } }) {
  const orderDivRef = useRef<HTMLDivElement>(null);
  const orderStatus = params.orderstatus;
  const router = useRouter();
  const { theme } = useTheme();
  const { setCurrentActivePage } = useAppState();
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
  }, []);

  useEffect(() => {
    let typingTimeout = setTimeout(() => {
      setIsLoading(true);
      setCurrentPage(1);
    }, 1000);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [searchOrder, searchMonth, searchYear, showOrderNo]);

  useEffect(() => {
    setIsLoading(true);
    if (orderDivRef.current) orderDivRef.current.scrollIntoView();
  }, [currentPage]);

  return (
    <div ref={orderDivRef} className="flex flex-col w-full">
      <OrderFilter {...orderFilterProps} selectedTab={orderStatus} />
      <div className="flex justify-between mb-4 items-center">
        {!isLoading && <label className="mb-2 ms-2">{orderCount <= 1 ? orderCount + " order " : orderCount + " orders "}found</label>}
        <Input
          isClearable
          type="text"
          placeholder="Search Order"
          variant="bordered"
          size="sm"
          radius="sm"
          startContent={theme === "dark" ? <Image width={20} src="/icons/search-dark.svg" className="flex items-center justify-center" alt="Search Icon" /> : <Image width={20} src="/icons/search.svg" className="flex items-center justify-center" alt="Search Icon" />}
          value={searchOrder}
          className="w-full max-w-[365px] ms-auto"
          onChange={(e) => {
            setSearchOrder(e.target.value);
          }}
          onClear={() => {
            setSearchOrder("");
          }}
        />
      </div>
      <OrderList {...orderFilterDataProps} />
      {!isLoading && orderCount > 0 && Math.ceil(orderCount / showOrderNo) > 1 && <CustomPagination currentPage={currentPage} total={Math.ceil(orderCount / showOrderNo)} onChange={(current) => setCurrentPage(current)} />}
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
