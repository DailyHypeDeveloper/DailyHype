import PublicContent from "@/components/custom/public-content";

// this is the layout for public user
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicContent>{children}</PublicContent>;
}
