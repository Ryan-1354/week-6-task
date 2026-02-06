import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function FrontendLAyout() {
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="product">
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="cart">
              Cart
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="checkout">
              Checkout
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="login">
              Login
            </Link>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>2026我的網站</footer>
    </>
  );
}
