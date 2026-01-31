const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import axios from "axios";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
        console.log(res.data.data);
        setCart(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getCart();
  }, []);

  //updateCart api
  const updateCart = async (cartId, productId, qty = 1) => {
    const data = {
      product_id: productId,
      qty,
    };
    try {
      const res = await axios.put(
        `${API_BASE}/v2/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      console.log(res);
      const res2 = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
      console.log(res2.data.data);
      setCart(res2.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button type="button" className="btn btn-outline-danger">
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((item) => (
            <tr key={item.id}>
              <td>
                <button type="button" className="btn btn-outline-danger btn-sm">
                  刪除
                </button>
              </td>
              <th scope="row">{item.product.title}</th>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={item.qty}
                    onChange={(e) =>
                      updateCart(
                        item.id,
                        item.product_id,
                        Number(e.target.value),
                      )
                    }
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {item.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{item.final_total}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{cart.final_total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
