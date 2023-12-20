import PublicContent from "../_components/public-content";

// this is the layout for public user
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicContent children={children}></PublicContent>;
}
