import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function CartPage() {
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/GetCart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`, // Ensure token is properly retrieved
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cart = await response.json();
      
      if (cart && cart.products) {
        const formattedCartItems = cart.products.map((item) => ({
          id: item.product._id,
          name: item.product.Name,
          image: item.product.ThumbnailURL || "/placeholder.svg",
          price: parseFloat(item.product.Price.$numberDecimal),
          quantity: item.quantity,
        }
      
      ));        
        setCartItems(formattedCartItems);
        fetchThumbnails(formattedCartItems); // Fetch images after setting cart items
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchThumbnail = async (url) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getImage${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Failed to fetch image");

      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error("Error fetching image:", error);
      return "/placeholder.svg"; // Fallback image
    }
  };

  const fetchThumbnails = async (items) => {
    const updatedCartItems = await Promise.all(
      items.map(async (item) => {
        const imageUrl = await fetchThumbnail(item.image);
        return { ...item, image: imageUrl };
      })
    );
    setCartItems(updatedCartItems);
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const increaseQuantity = async (id) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/IncrementCartItem`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `${token}`,
            },
            body: JSON.stringify({ productID: id }),
        });

        const data = await response.json();

        if (response.ok) {
            setCartItems(cartItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            console.error("Error increasing quantity:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const decreaseQuantity = async (id) => {
  try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/DecrementCartItem`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              authorization: `${token}`,
          },
          body: JSON.stringify({ productID: id }),
      });

      const data = await response.json();

      if (response.ok) {
          setCartItems(cartItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          ));
      } else {
          console.error("Error decreasing quantity:", data.message);
      }
  } catch (error) {
      console.error("Error:", error);
  }
};


  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/RemoveFromCart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`, 
        },
        body: JSON.stringify({ productID: id }), 
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove product");
      }
  
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold text-orange-500">CART</h1>
            <div className="flex flex-col items-end">
              <Link to="/shippingAddress">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md transition-colors mb-2">
                  Proceed to Checkout
                </button>
              </Link>
              <div className="text-xl">
                <span className="text-orange-500 font-medium">Total: </span>
                <span className="font-bold">PKR {total.toLocaleString()}/-</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="bg-gray-800 text-white rounded-t-lg grid grid-cols-12 p-4">
                <div className="col-span-6 md:col-span-5 font-medium">PRODUCT</div>
                <div className="col-span-2 text-center font-medium">QTY</div>
                <div className="col-span-2 text-center font-medium">PRICE PER UNIT</div>
                <div className="col-span-2 md:col-span-3 text-center font-medium">ACTIONS</div>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-white p-8 text-center text-gray-500">Your cart is empty.</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 p-4 border-b items-center">
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded border"
                        />
                        <span className="font-medium text-gray-700">{item.name}</span>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">{item.quantity}</div>

                    <div className="col-span-2 text-center font-medium">{item.price.toLocaleString()}</div>

                    <div className="col-span-2 md:col-span-3 flex flex-col md:flex-row items-center justify-center gap-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
