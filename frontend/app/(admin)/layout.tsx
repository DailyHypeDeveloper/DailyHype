import SideBar from "../_components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SideBar>{children}</SideBar>;
}
