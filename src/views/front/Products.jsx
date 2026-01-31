import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/v2/api/${API_PATH}/products`);
        console.log(res);
        setProducts(res.data.products);
      } catch (error) {
        console.log(error.message);
      }
    };
    getProduct();
  }, []);

  const handleView = async (id) => {
    navigate(`/product/${id}`);
  };
  //   try {
  //     const res = await axios.get(
  //       `${API_BASE}/v2/api/${API_PATH}/product/${id}`,
  //     );
  //     console.log(res.data.product);
  //     navigate(`/product/${id}`, {
  //       state: {
  //         productData: res.data.product,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card">
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
                  onClick={() => handleView(product.id)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
