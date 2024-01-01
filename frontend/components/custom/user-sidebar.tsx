// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// this layout is taken from shein website

"use client";

import { Accordion, AccordionItem, Divider, Link, Selection } from "@nextui-org/react";
import { useAppState } from "@/app/app-provider";
import { CurrentActivePage, URL } from "@/enums/global-enums";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSideBar() {
  const { currentActivePage } = useAppState();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const router = useRouter();

  useEffect(() => {
    const storedKeys = localStorage.getItem("selectedKeys");
    if (storedKeys) {
      setSelectedKeys(new Set(JSON.parse(storedKeys)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedKeys", JSON.stringify(Array.from(selectedKeys)));
  }, [selectedKeys]);

  return (
    <div className="flex flex-col basis-1/5 items-start">
      <Link href={URL.Personal} className="mb-5 text-large text-black font-semibold dark:text-white">
        Personal Center
      </Link>
      <Accordion selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} className="m-0 p-0" selectionMode="multiple" isCompact>
        <AccordionItem key="1" className="font-semibold" aria-label="My Account" title="My Account">
          <div className="flex flex-col cursor-default">
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mt-2 mb-4 ${currentActivePage === CurrentActivePage.Profile ? "font-semibold" : "font-normal"}`} href={URL.Profile}>
              My Profile
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.AddressBook ? "font-semibold" : "font-normal"}`} href="">
              Address Book
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ManageAccount ? "font-semibold" : "font-normal"}`} href="">
              Manage My Account
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem key="2" className="font-semibold" aria-label="My Orders" title="My Orders">
          <div className="flex flex-col cursor-default">
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mt-2 mb-4 ${currentActivePage === CurrentActivePage.AllOrder ? "font-semibold" : "font-normal"}`} href={URL.AllOrder}>
              All Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.InProgressOrder ? "font-semibold" : "font-normal"}`} href="/order/inprogress">
              In Progress Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ConfirmedOrder ? "font-semibold" : "font-normal"}`} href="/order/confirmed">
              Confirmed Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.DeliveredOrder ? "font-semibold" : "font-normal"}`} href="/order/delivered">
              Delivered Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ReceivedOrder ? "font-semibold" : "font-normal"}`} href="/order/received">
              Received Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.CancelledOrder ? "font-semibold" : "font-normal"}`} href="/order/cancelled">
              Cancelled Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ReturnedOrder ? "font-semibold" : "font-normal"}`} href="/order/returned">
              Returned Orders
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem key="3" className="font-semibold" aria-label="My Deliveries" title="My Deliveries">
          <div className="flex flex-col cursor-default">
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.AllDelivery ? "font-semibold" : "font-normal"}`} href={URL.Delivery}>
              All Deliveries
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem key="4" className="font-semibold" aria-label="Customer Service" title="Customer Service">
          <div className="flex flex-col cursor-default">
            <Link className="text-small indent-3 text-slate-800 dark:text-slate-200 font-normal mt-2 mb-4" href="">
              Chat
            </Link>
            <Link className="text-small indent-3 text-slate-800 dark:text-slate-200 font-normal mb-4" href="">
              FAQ
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem key="5" className="font-semibold text-medium" aria-label="Policy" title="Policy">
          <div className="flex flex-col cursor-default">
            <Link className="text-small indent-3 text-slate-800 dark:text-slate-200 font-normal mt-2 mb-4" href="">
              Shipping Info
            </Link>
            <Link className="text-small indent-3 text-slate-800 dark:text-slate-200 font-normal mb-4" href="">
              Return Policy
            </Link>
          </div>
        </AccordionItem>
      </Accordion>
      <Divider />
      <label
        onClick={() => {
          router.push(URL.SignOut);
        }}
        className="my-2 cursor-pointer text-medium text-black font-semibold dark:text-white"
      >
        Sign Out
      </label>
    </div>
  );
}
