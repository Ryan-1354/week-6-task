const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
        setCart(res.data.data);
      } catch (error) {
        alert(error.message);
      }
    };
    getCart();
  }, []);

  //updateCart api
  const updateCart = async (cartId, productId, qty = 1) => {
    setLoadingProductId(id);
    const data = {
      product_id: productId,
      qty,
    };
    try {
      const res = await axios.put(
        `${API_BASE}/v2/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      const res2 = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
      setCart(res2.data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  //deleteCart api
  const deleteeCart = async (cartId) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/v2/api/${API_PATH}/cart/${cartId}`,
      );
      const res2 = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
      setCart(res2.data.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingProductId(null);
    }
  };

  //deleteCarts api
  const deleteCarts = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/v2/api/${API_PATH}/carts`);
      const res2 = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
      setCart(res2.data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  //form onSubmit

  const onSubmit = async (formData) => {
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const res = await axios.post(`${API_BASE}/v2/api/${API_PATH}/order`, {
        data,
      });
      const res2 = await axios.get(`${API_BASE}/v2/api/${API_PATH}/cart`);
      setCart(res2.data.data);
      console.log(res);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h2>結帳</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={(e) => deleteCarts()}
        >
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
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  data-id={item.id}
                  onClick={(e) => deleteeCart(e.target.dataset.id)}
                  disabled={loadingProductId === item.id}
                >
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
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test@gamil.com"
              {...register("email", {
                required: "請輸入 Email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email 格式不正確",
                },
              })}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="小明"
              {...register("name", {
                required: "請輸入姓名",
                minLength: {
                  value: 2,
                  message: "姓名最少兩個字",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register("tel", {
                required: "請輸入收件人電話",
                minLength: { value: 8, message: "電話至少 8 碼" },
                pattern: {
                  value: /^\d+$/,
                  message: "電話僅能輸入數字",
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺北市信義區信義路5段7號"
              {...register("address", {
                required: "請輸入地址",
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
