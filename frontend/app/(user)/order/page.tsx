// // Name: Zay Yar Tun
// // Admin No: 2235035
// // Class: DIT/FT/2B/02
// // the layout is taken from
// // https://cdn.dribbble.com/userupload/7778324/file/original-810dda72de79666f64f2a4d62f906721.png?resize=1024x768

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useAppState } from "@/app/app-provider";
// import CustomPagination from "@/app/_components/custom-pagination";
// import { OrderStatusValue, MonthValue } from "@/app/_enums/order-enums";
// import OrderFilter from "./order-filter";
// import OrderList from "./order-list";
// import { CurrentActivePage } from "@/app/_enums/global-enums";
// import { Button, Image } from "@nextui-org/react";
// import { useTheme } from "next-themes";
// import { useRouter } from "next/navigation";

// export default function Page() {
//   const orderDivRef = useRef<HTMLDivElement>(null);

//   const { token, setToken, setCurrentActivePage } = useAppState();
//   const { theme } = useTheme();
//   const router = useRouter();

//   const [searchOrder, setSearchOrder] = useState<string>("");
//   const [searchStatus, setSearchStatus] = useState<OrderStatusValue>(OrderStatusValue.All);
//   const [searchMonth, setSearchMonth] = useState<MonthValue>(MonthValue.All);
//   const [searchYear, setSearchYear] = useState<string>("0");
//   const [showOrderNo, setShowOrderNo] = useState<number>(5);
//   const [orderCount, setOrderCount] = useState<number>(1);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

//   if (!token) {
//     alert("Unauthorized Access!");
//     localStorage.removeItem("token");
//     setToken(null);
//     router.replace("/signin");
//     return null;
//   }

//   const orderFilterProps = {
//     searchOrder,
//     setSearchOrder,
//     searchStatus,
//     setSearchStatus,
//     searchMonth,
//     setSearchMonth,
//     searchYear,
//     setSearchYear,
//     setIsLoading,
//     showOrderNo,
//     setShowOrderNo,
//   };

//   const orderFilterDataProps = {
//     searchOrder,
//     searchStatus,
//     searchMonth,
//     searchYear,
//     showOrderNo,
//     isLoading,
//     orderCount,
//     setOrderCount,
//     setIsLoading,
//     currentPage,
//   };

//   useEffect(() => {
//     if (token) {
//       setCurrentActivePage(CurrentActivePage.AllOrder);
//       const handleScroll = () => {
//         const scrollY = window.scrollY || document.documentElement.scrollTop;
//         const triggerScroll = 200; // Adjust this value based on when you want the button to appear
//         setShowScrollButton(scrollY > triggerScroll);
//       };
//       window.addEventListener("scroll", handleScroll);
//       return () => {
//         window.removeEventListener("scroll", handleScroll);
//       };
//     }
//   }, []);

//   // useEffect(() => {
//   // setIsLoading(true);
//   // getOrderCount(
//   //   {
//   //     searchText: searchOrder,
//   //     status: searchStatus,
//   //     month: searchMonth,
//   //     year: searchYear,
//   //   },
//   //   token
//   // )
//   //   .then((result) => {
//   //     setOrderCount(parseInt(result.count));
//   //     setIsLoading(false);
//   //   })
//   //   .catch((error) => {
//   //     console.error(error);
//   //     setOrderCount(1);
//   //     setIsLoading(false);
//   //   });
//   // }, [searchOrder, searchStatus, searchMonth, searchYear]);

//   // useEffect(() => {
//   //   console.log(orderData);
//   // }, [orderData]);

//   useEffect(() => {
//     setIsLoading(true);
//     if (orderDivRef.current) orderDivRef.current.scrollIntoView();
//   }, [currentPage]);

//   return (
//     <>
//       <div ref={orderDivRef} className="flex flex-col w-full max-w-full py-5">
//         <h2 className="text-2xl font-medium uppercase tracking-wide">Your Orders</h2>
//         <OrderFilter {...orderFilterProps} />
//         <OrderList {...orderFilterDataProps} />
//         {!isLoading && orderCount > 1 && (
//           <CustomPagination
//             onChange={(current) => {
//               setCurrentPage(current);
//             }}
//             total={orderCount}
//             initialPage={currentPage}
//           />
//         )}
//         {showScrollButton && (
//           <Button
//             className="fixed bottom-10 right-10 min-w-0 min-h-0 p-0 w-12 h-12 outline-none rounded-full"
//             onClick={() => {
//               if (orderDivRef.current) orderDivRef.current.scrollIntoView();
//             }}
//           >
//             <Image src={theme === "dark" ? "/icons/arrow-up-dark.svg" : "/icons/arrow-up.svg"} className="w-5 h-5" alt="Top Icon" />
//           </Button>
//         )}
//       </div>
//     </>
//   );
// }
