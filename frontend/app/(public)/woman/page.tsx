"use client";

import React from "react";
import { useAppState } from "@/app/app-provider";
import { useEffect, useState } from "react";
import {Card, CardBody, CardFooter, Image, Tooltip} from "@nextui-org/react";
import {Pagination} from "@nextui-org/react";

export default function WomanProduct() {
  const { setCurrentActivePage } = useAppState();
  const [currentPage, setCurrentPage] = useState(1);
  const list = [
    {
      title: "Orange",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      title: "Tangerine",
      img: "/images/fruit-2.jpeg",
      price: "$3.00",
    },
    {
      title: "Raspberry",
      img: "/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      title: "Lemon",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Avocado",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },
    {
      title: "Lemon 2",
      img: "/images/fruit-6.jpeg",
      price: "$8.00",
    },
  ];

  const handleCurrentPageChange = (page: number) => {
    // Handle the pagination change (e.g., fetching data for the new page)
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentActivePage("woman");
  }, []);

  return (
    <div className="gap-5 m-5 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">
      {list.map((item, index) => (
        
        <Tooltip key={index} color={'warning'} content={item.title} className="capitalize">
        <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.title}
              className="w-full object-cover h-[140px]"
              src={item.img}
            />
            
          </CardBody>
          <CardBody className="top-2 py-0">
          <b>{item.title}</b>
          </CardBody>
          <CardFooter className="py-2 text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter>
        </Card>
        </Tooltip>
      ))}
      <p> page {currentPage} of 10</p>
       <Pagination loop showControls color="success" total={10} initialPage={1} onChange={handleCurrentPageChange}/>
    </div>
  );
}
