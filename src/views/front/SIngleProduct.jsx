import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
import axios from "axios";

export default function SingleProduct() {
  // const location = useLocation();
  // const product = location.state?.productData;
  const { id } = useParams();
  const [product, setProduct] = useState();
  useEffect(() => {
    const handleView = async (id) => {
      try {
        const res = await axios.get(
          `${API_BASE}/v2/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.message);
      }
    };
    handleView(id);
  }, [id]);

  //addcart api
  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      const res = await axios.post(`${API_BASE}/v2/api/${API_PATH}/cart`, {
        data,
      });
      alert(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  return !product ? (
    <h2>載入中</h2>
  ) : (
    <div className="container mt-3">
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={
            product.imageUrl ||
            "https://t4.ftcdn.net/jpg/06/57/37/01/360_F_657370150_pdNeG5pjI976ZasVbKN9VqH1rfoykdYU.jpg"
          }
          className="card-img-top"
          style={{ maxHeight: "200px", objectFit: "cover" }}
          alt={product.description}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.content}</p>
          <p className="card-text">{product.description}</p>
          <p className="card-text">價格：{product.price}</p>
          <p className="card-text">{product.unit}</p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => addCart(product.id)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
