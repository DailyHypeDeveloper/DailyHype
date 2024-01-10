// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { useAppState } from "@/app/app-provider";
import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CartItemSkeleton from "@/app/(public)/cart/cart-item-skeleton";
import { getCartData } from "@/functions/cart-functions";
import { CartData } from "@/enums/cart-interfaces";

const CartItem = dynamic(() => import("@/app/(public)/cart/cart-item"), { loading: () => <CartItemSkeleton /> });

export default function Cart() {
  const { cart, setCart, headerCanLoad, isAuthenticated } = useAppState();
  const [cartDetail, setCartDetail] = useState<CartData[] | []>([]);
  const [selectedItems, setSelectedItems] = useState();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (headerCanLoad) {
      if (cart && cart.length > 0) {
        getCartData(isAuthenticated, cart).then((result) => {
          console.log(result);
          if (result.error) {
            alert(result.error);
          } else {
            if (result.data && result.data.length > 0) {
              setCartDetail(result.data);
            } else {
              setCartDetail([]);
              localStorage.removeItem("cart");
              setCart([]);
            }
          }
          setLoading(false);
        });
      }
    }
  }, []);

  return (
    <div className="flex flex-col w-full px-16 my-8">
      <label className="text-xl font-semibold">Shopping Cart</label>
      <div className="flex flex-col w-full mt-8">
        <div className="flex">
          <Checkbox className="mb-2" size="md">
            Select All
          </Checkbox>
        </div>
        {!loading &&
          cartDetail.map((item: CartData, index: number) => {
            return <CartItem key={index} data={item} />;
          })}
      </div>
    </div>
  );
}
