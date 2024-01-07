// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

"use client";

import { CartData } from "@/enums/cart-interfaces";
import { URL } from "@/enums/global-enums";
import { formatMoney } from "@/functions/formatter";
import CrossIcon from "@/icons/cross-icon";
import { Checkbox } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

export default function CartItem({ data }: { data: CartData }) {
  return (
    <div className="flex w-full max-w-full items-center mt-3">
      <Checkbox defaultSelected className="mr-2"></Checkbox>
      <Image priority={true} src={data.url} className="rounded-lg border-1 border-slate-300 dark:border-slate-700" width={80} height={100} alt={data.productname} />
      <Link className="self-start ms-6 min-w-[300px] max-w-[400px]" href={URL.Man}>
        {data.productname}
      </Link>
      <label>${formatMoney(data.unitprice)}</label>
      <CrossIcon width={25} height={25} className="cursor-pointer" />
    </div>
  );
}
