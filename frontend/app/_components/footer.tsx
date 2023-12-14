"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col bg-slate-50 max-w-full px-36 py-10 border-t-2 border-slate-300">
      <label className="tracking-wide uppercase text-lg font-medium">dailyhype</label>
      <div className="flex mt-8 justify-start">
        <div className="flex flex-col me-40">
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            About
          </Link>
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            Payment Methods
          </Link>
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            How to Buy
          </Link>
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            Return and Refund
          </Link>
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            Contact Us
          </Link>
        </div>
        <div className="flex flex-col">
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            Feedback
          </Link>
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            FAQ
          </Link>
          <Link className="mt-3 cursor-pointer hover:font-medium hover:text-black" href="">
            Help and Support
          </Link>
        </div>
        <div className="flex flex-col max-w-xs ms-auto">
          <label className="mt-3 uppercase">social media</label>
          <label className="mt-3">Follow us on social media to find out the latest products</label>
          <div className="flex">
            
          </div>
        </div>
      </div>
    </footer>
  );
}
