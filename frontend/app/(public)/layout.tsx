import UserContent from "../_components/user-content";

// this is the layout for public user
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <UserContent children={children}></UserContent>;
}
