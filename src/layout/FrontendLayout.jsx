import { Outlet } from "react-router-dom";
export default function FrontendLAyout() {
  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}
