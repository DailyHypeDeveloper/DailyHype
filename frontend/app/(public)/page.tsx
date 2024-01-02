"use client";

import { useEffect, useState } from "react";
import { useAppState } from "../app-provider";
import { Button, Divider, Image, Link } from "@nextui-org/react";
import { getLatestProducts } from "@/functions/product-functions";

export default function Home() {
  const { setCurrentActivePage } = useAppState();
  const [latestProduct, setLatestProduct] = useState<any>([]);

  useEffect(() => {
    setCurrentActivePage("home");
    getLatestProducts(6).then((data) => {
      console.log(data);
      setLatestProduct(data);
    });
  }, []);

  return (
    <>
      <div className="flex mx-40 justify-around max-w-full my-12">
        <div className="flex flex-col justify-center pt-8">
          <label className="before:border-2 before:me-3 before:border-black before:dark:border-white text-2xl font-semibold tracking-wider uppercase">Latest Arrival</label>
          <Link href="/woman" className="mt-4 w-fit text-black dark:text-white">
            {latestProduct.length > 0 ? latestProduct[0].productname : "Product Name"}
          </Link>
          <label className="mt-8 max-w-[400px]">{latestProduct.length > 0 ? latestProduct[0].description : "Description"}</label>
          <Button className="max-w-[150px] h-12 mt-12 tracking-wide">Explore Now</Button>
        </div>
        <div className="flex justify-center">
          <Image width={400} className="rounded-2xl" src={latestProduct.length > 0 ? latestProduct[0].url : ""} alt={latestProduct.length > 0 ? latestProduct[0].productname : ""} />
        </div>
      </div>
      {latestProduct.length > 1 && (
        <div className="flex flex-col max-w-full my-20">
          <label className="flex mx-auto text-2xl font-semibold uppercase">New Arrivals</label>
          <div className="flex max-w-full mt-12 mx-12 justify-around">
            {latestProduct.map((item: any) => {
              return (
                <div key={item.productid} className="flex flex-col w-[200px]">
                  <Image src={item.url} width={200} alt={item.productname} />
                  <Link href="" className="mt-4 text-black dark:text-white">
                    {item.productname}
                  </Link>
                  <label className="mt-3 text-small">${item.unitprice}</label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
