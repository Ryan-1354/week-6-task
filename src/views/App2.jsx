import { useState, useEffect, useRef } from "react";
import ProductModal from "../component/ProductModal";
import Pagination from "../component/Pagination";

// 引入axios
import axios from "axios";
import * as bootstrap from "bootstrap";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 引入css
import "./assets/style.css";

//modal資料抽出
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
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
  //modal input輸入處理
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTemplateProduct((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleRemoveImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  //All useState
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);

  //call 取得產品API
  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/v2/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      alert(err.message);
    }
  };

  //更新產品API
  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";
    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imageUrl: [...templateProduct.imagesUrl.filter((url) => url !== "")],
      },
    };

    try {
      const response = await axios[method](url, productData);
      // (response.data);
      getProducts();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  //刪除產品API
  const delProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      // console.log(response);
      getProducts();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
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
      getProducts();
    } catch (err) {
      setIsAuth(false);
      alert("帳號或密碼錯誤");
    }
  };

  //上傳圖片API
  const uploadImage = async (e) => {
    console.log(e);
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const response = await axios.post(
        `${API_BASE}/v2/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTemplateProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/v2/api/user/check`);
        console.log(`登入狀態${res.data.success}`);
        setIsAuth(true);
        getProducts();
      } catch (err) {
        console.log(err);
      }
    };
    checkLogin();
  }, []);

  const openModal = (type, product) => {
    // console.log(product);
    setModalType(type);
    setTemplateProduct((pre) => {
      return {
        ...pre,
        ...product,
      };
    });
    productModalRef.current.show();
  };
  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {isAuth ? (
        <div className="container mt-5">
          <h2>產品列表</h2>
          {/* 新增產品按鈕 */}
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <table className="table mt-5">
            <thead>
              <tr>
                <th scope="col">分類</th>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  {/* <th scope="row">1</th> */}
                  <td>{item.category}</td>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td className={item.is_enabled && "text-success"}>
                    {item.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        onClick={() => openModal("edit", item)}
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", item)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
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
                laceholder="Password"
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
      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        handleAddImage={handleAddImage}
        handleModalImageChange={handleModalImageChange}
        handleModalInputChange={handleModalInputChange}
        handleRemoveImage={handleRemoveImage}
        delProduct={delProduct}
        closeModal={closeModal}
        updateProduct={updateProduct}
        uploadImage={uploadImage}
      />
    </>
  );
}

export default App;
