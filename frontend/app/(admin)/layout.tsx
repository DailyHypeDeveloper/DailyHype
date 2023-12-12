export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav></nav>
      <main>{children}</main>
    </>
  );
}
