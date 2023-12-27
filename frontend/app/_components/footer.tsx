"use client";

import { Image } from "@nextui-org/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { URL } from "../_enums/global-enums";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="flex flex-col dark:bg-slate-900 bg-slate-50 max-w-full px-36 py-10 border-t-2 border-slate-300">
      <label className="tracking-wide uppercase text-2xl font-medium">dailyhype</label>
      <div className="flex mt-8 justify-start">
        <div className="flex flex-col me-60">
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href={URL.About}>
            About Us
          </Link>
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href="">
            Payment Methods
          </Link>
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href="">
            How to Buy
          </Link>
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href="">
            Return and Refund
          </Link>
        </div>
        <div className="flex flex-col">
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href={URL.Feedback}>
            Feedback
          </Link>
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href={URL.Help}>
            Help and Support
          </Link>
          <Link className="mt-3 text-slate-500 dark:text-slate-300 cursor-pointer hover:font-medium" href={URL.Contact}>
            Contact Us
          </Link>
        </div>
        <div className="flex flex-col max-w-sm ms-auto">
          <label className="mt-3 text-slate-500 dark:text-slate-300 uppercase tracking-wide font-medium">social media</label>
          <label className="mt-3 text-slate-500 dark:text-slate-300 text-sm">Follow us on social media to find out the latest products</label>
          <div className="flex justify-start mt-7">
            {theme === "light" ? (
              <>
                <Link href="https://www.facebook.com" className="me-8" title="Facebook">
                  <Image src="/icons/facebook.svg" radius="none" alt="Facebook Icon" />
                </Link>
                <Link href="https://www.instagram.com" className="me-8" title="Instagram">
                  <Image src="/icons/instagram.svg" radius="none" alt="Instagram Icon" />
                </Link>
                <Link href="https://www.twitter.com" className="me-8" title="Twitter">
                  <Image src="/icons/twitter.svg" radius="none" alt="Twitter Icon" />
                </Link>
                <Link href="https://www.youtube.com" className="me-8" title="Youtube">
                  <Image src="/icons/youtube.svg" radius="none" alt="Youtube Icon" />
                </Link>
                <Link href="https://www.linkedin.com" title="LinkedIn">
                  <Image src="/icons/linkedin.svg" radius="none" alt="LinkedIn Icon" />
                </Link>
              </>
            ) : (
              <>
                <Link href="https://www.facebook.com" className="me-8" title="Facebook">
                  <Image src="/icons/facebook-dark.svg" radius="none" alt="Facebook Icon" />
                </Link>
                <Link href="https://www.instagram.com" className="me-8" title="Instagram">
                  <Image src="/icons/instagram-dark.svg" radius="none" alt="Instagram Icon" />
                </Link>
                <Link href="https://www.twitter.com" className="me-8" title="Twitter">
                  <Image src="/icons/twitter-dark.svg" radius="none" alt="Twitter Icon" />
                </Link>
                <Link href="https://www.youtube.com" className="me-8" title="Youtube">
                  <Image src="/icons/youtube-dark.svg" radius="none" alt="Youtube Icon" />
                </Link>
                <Link href="https://www.linkedin.com" title="LinkedIn">
                  <Image src="/icons/linkedin-dark.svg" radius="none" alt="LinkedIn Icon" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex mt-10 pt-6 border-t-2 justify-between text-slate-500 dark:text-slate-300">
        <label>&copy; 2023 DailyHype. All rights reserved</label>
        <div>
          <Link className="cursor-pointer hover:font-medium me-8" href={URL.PrivacyPolicy}>
            Privacy Policy
          </Link>
          <Link className="cursor-pointer hover:font-medium me-8" href={URL.TermsNConditions}>
            Terms and Conditions
          </Link>
          <Link className="cursor-pointer hover:font-medium" href={URL.SiteMap}>
            Sitemap
          </Link>
        </div>
        <label>Country & Region: Singapore</label>
      </div>
    </footer>
  );
}
