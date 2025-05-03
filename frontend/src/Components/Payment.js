import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { useEffect } from "react";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("mastercard");
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
  const [formData, setFormData] = useState({
    fullName: "",
    cardNumber: "",
    cvc: "",
    expiry: "",
  });
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("text-green-600");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/GetCart`, {
      method: "GET",
      headers: {
        authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setCart(data.products);
          let subtotal = data.products.reduce(
            (sum, item) => sum + parseFloat(item.product.Price.$numberDecimal) * item.quantity,
            0
          );
          let gst = subtotal * 0.05;
          setTotalAmount(subtotal + gst);
        }
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const placeOrder = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/placeOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ paymentMethod, cart, totalAmount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          // setMessage("Order placed successfully!");
          // setMessageColor("text-green-600");
          setTimeout(() => navigate("/"), 5000);
        } else {
          // setMessage("Order placement failed. Please try again.");
          // setMessageColor("text-red-200");
          setTimeout(() => navigate("/"), 5000);
        }
      })
      .catch((error) => {
        setMessage("An error occurred. Please try again later.");
        setTimeout(() => navigate("/"), 5000);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12 max-w-md mx-auto">
          <div className="relative bg-orange-500 rounded-full text-white p-4 flex justify-between items-center">
            <div className="flex flex-col items-center z-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500">
                <i className="fas fa-check"></i>
              </div>
              <span className="mt-1 text-sm">Shipping</span>
            </div>

            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-white"></div>

            <div className="flex flex-col items-center z-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500">
                <i className="fas fa-check"></i>
              </div>
              <span className="mt-1 text-sm">Review</span>
            </div>

            <div className="flex flex-col items-center z-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500">
                <i className="fas fa-credit-card"></i>
              </div>
              <span className="mt-1 text-sm">Payment</span>
            </div>
          </div>
        </div>
        {message && <div className={`text-center text-lg font-bold ${messageColor} mb-4`}>{message}</div>}        <h1 className="text-4xl font-bold text-orange-500 text-center mb-8">Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={placeOrder}>
              {/* Payment Method Selection */}
              <div className="mb-6 flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mastercard"
                    checked={paymentMethod === "mastercard"}
                    onChange={() => setPaymentMethod("mastercard")}
                    className="form-radio h-5 w-5"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="MasterCard"
                    className="h-10 ml-2 border rounded p-1"
                  />
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="visa"
                    checked={paymentMethod === "visa"}
                    onChange={() => setPaymentMethod("visa")}
                    className="form-radio h-5 w-5"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png"
                    alt="Visa"
                    className="h-10 ml-2 border rounded p-1"
                  />
                </label>
              </div>

              {/* Card Details */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2">Card Number:</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full p-3 rounded bg-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">CVC:</label>
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleChange}
                      required
                      placeholder="XXX"
                      className="w-full p-3 rounded bg-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Expiry:</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                      placeholder="MM/YY"
                      className="w-full p-3 rounded bg-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Link to="/shippingAddress">
                  <button type="button" className="bg-gray-700 text-white px-8 py-3 rounded">
                    Previous
                  </button>
                </Link>
                <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary - Always on the right */}
          <div className="md:col-span-1 h-fit sticky top-4">
          <div className="bg-gray-800 rounded-lg text-white p-6">
            <h2 className="text-2xl font-bold text-orange-500 text-center mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{item.quantity} x {item.product.Name}</span>
                  <span>RS.{parseFloat(item.product.Price.$numberDecimal) * item.quantity}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>RS.{(totalAmount * 0.05).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-500 p-4 mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>RS.{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

