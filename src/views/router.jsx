import { createHashRouter } from "react-router-dom";
import FrontendLAyout from "../layout/FrontendLayout";
import Home from "./front/Home";
import Products from "./front/Products";
import SingleProduct from "./front/SingleProduct";
import Cart from "./front/Cart";
import NotFound from "./front/NotFound";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLAyout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
