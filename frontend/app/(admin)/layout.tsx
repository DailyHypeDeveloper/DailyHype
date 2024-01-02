import SideBar from "@/components/custom/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SideBar>{children}</SideBar>;
}
