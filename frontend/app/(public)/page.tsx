import {currentUser} from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  console.log(user);

  return (
    <div>
      <label>This is home page!</label>
    </div>
  );
}
