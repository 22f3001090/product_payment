import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Handle Payment
  const handlePayment = async (product) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/getKey");
      const keyData = response.data.key;
      const { data } = await axios.post("http://localhost:3000/pay", {
        productId: product.id,
        amount: product.price,
      });

      const options = {
        key: keyData,
        amount: product.price * 100, // Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Coder",
        description: "Test Transaction",
        order_id: data.order.id, // This is the order_id created in the backend
        callback_url: "http://localhost:3000/paymentVerification", // Your success URL
        prefill: {
          name: "Aman",
          email: "Aman@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed!");
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Available Products</h1>
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                display: "inline-block",
              }}
            >
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <button onClick={() => handlePayment(product)} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
