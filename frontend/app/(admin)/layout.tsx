// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

import SideBar from "@/components/custom/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SideBar>{children}</SideBar>;
}
