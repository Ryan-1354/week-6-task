import { useState, useEffect, useRef } from "react";

// 引入axios
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 引入css
import "../../assets/style.css";

export default function Login() {
  //管理登入資訊
  const [formData, setFormData] = useState({
    username: "1354ark@gmail.com",
    password: "hexschool666",
  });
  //管理登入狀態
  const [isAuth, setIsAuth] = useState(false);
  // 表單輸入處理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //call 登入API
  const onSubmit = async (e) => {
    // console.log(`${API_BASE}/v2/admin/signin`); 驗證路徑正確
    try {
      e.preventDefault();
      const response = await axios.post(
        `${API_BASE}/v2/admin/signin`,
        formData,
      );
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      // 之後用 axios 發出的所有請求，都會自動帶上 Authorization header
      axios.defaults.headers.common["Authorization"] = `${token}`;
      setIsAuth(true); //只要api打成功不管帳密對不對都登入成功
    } catch (err) {
      setIsAuth(false);
      alert("帳號或密碼錯誤");
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/v2/api/user/check`);
        console.log(`登入狀態${res.data.success}`);
        setIsAuth(true);
      } catch (err) {
        console.log(err);
      }
    };

    checkLogin();
  }, []);

  return (
    <>
      {isAuth ? (
        <>
          <h1>登入成功</h1>
        </>
      ) : (
        <div className="container login">
          <h1>請先登入</h1>
          <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              登入
            </button>
          </form>
        </div>
      )}
    </>
  );
}
