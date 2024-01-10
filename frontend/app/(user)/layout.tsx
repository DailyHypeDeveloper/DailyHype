// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

import UserContent from "@/components/custom/user-content";

// this is the layout for public user view
// don't change this unless necessary
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <UserContent>{children}</UserContent>;
}
