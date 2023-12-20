"use client";

import { Accordion, AccordionItem, Divider, Link } from "@nextui-org/react";
import { useAppState } from "../app-provider";
import { CurrentActivePage } from "../_enums/global-enums";

export default function UserSideBar() {
  const { token, currentActivePage } = useAppState();

  if (!token) return null;

  return (
    <div className="flex flex-col basis-1/5 items-start">
      <Link href="/personal" className="mb-5 text-large text-black font-semibold dark:text-white">
        Personal Center
      </Link>
      <Accordion className="m-0 p-0" selectionMode="multiple" isCompact>
        <AccordionItem className="font-semibold" aria-label="My Account" title="My Account">
          <div className="flex flex-col cursor-default">
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mt-2 mb-4 ${currentActivePage === CurrentActivePage.Profile ? "font-semibold" : "font-normal"}`} href="/profile">
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
        <AccordionItem className="font-semibold" aria-label="My Orders" title="My Orders">
          <div className="flex flex-col cursor-default">
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mt-2 mb-4 ${currentActivePage === CurrentActivePage.AllOrder ? "font-semibold" : "font-normal"}`} href="/order">
              All Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ConfirmedOrder ? "font-semibold" : "font-normal"}`} href="/order">
              Confirmed Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.DeliveredOrder ? "font-semibold" : "font-normal"}`} href="/order">
              Delivered Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ReceivedOrder ? "font-semibold" : "font-normal"}`} href="/order">
              Received Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.CancelledOrder ? "font-semibold" : "font-normal"}`} href="/order">
              Cancelled Orders
            </Link>
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.ReturnedOrder ? "font-semibold" : "font-normal"}`} href="/order">
              Returned Orders
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem className="font-semibold" aria-label="My Deliveries" title="My Deliveries">
          <div className="flex flex-col cursor-default">
            <Link className={`text-small indent-3 text-slate-800 dark:text-slate-200 mb-4 ${currentActivePage === CurrentActivePage.AllDelivery ? "font-semibold" : "font-normal"}`} href="/delivery">
              All Deliveries
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem className="font-semibold" aria-label="Customer Service" title="Customer Service">
          <div className="flex flex-col cursor-default">
            <Link className="text-small indent-3 text-slate-800 dark:text-slate-200 font-normal mt-2 mb-4" href="">
              Chat
            </Link>
            <Link className="text-small indent-3 text-slate-800 dark:text-slate-200 font-normal mb-4" href="">
              FAQ
            </Link>
          </div>
        </AccordionItem>
        <AccordionItem className="font-semibold text-medium" aria-label="Policy" title="Policy">
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
      <Link href="/signout" className="my-2 text-medium text-black font-semibold dark:text-white">
        Sign Out
      </Link>
    </div>
  );
}
