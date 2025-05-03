import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ShippingAddressPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    alternatePhone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    landmark: "",
    deliveryInstructions: "",
    isDefault: true,
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [existingAddress, setExistingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/GetShippingAddresses`, {
      method: "GET",
      headers: { authorization: `${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses && data.addresses.length > 0) {
          const address = data.addresses[0];
  
          setExistingAddress(address);
  
          setFormData({
            fullName: address.fullName || "",
            phone: address.phone || "",
            alternatePhone: address.alternatePhone || "",
            street: address.address.street || "",
            city: address.address.city || "",
            state: address.address.state || "",
            zipCode: address.address.zipCode || "",
            country: address.address.country || "Pakistan", // <-- Ensure country is inside address
            landmark: address.landmark || "",
            deliveryInstructions: address.deliveryInstructions || "",
            isDefault: address.isDefault
          });
          
        }
      })
      .catch((error) => console.error("Error fetching address:", error))
      .finally(() => setLoading(false));
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConsentChange = () => {
    setConsentChecked(!consentChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = existingAddress 
      ? `${process.env.REACT_APP_API_BASE_URL}/users/UpdateShippingAddress`
      : `${process.env.REACT_APP_API_BASE_URL}/users/AddShippingAddress`;
  
    const method = existingAddress ? "PUT" : "POST";
  
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, addressID: existingAddress?._id }),
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (response.ok) {
        navigate("/checkout");  // Redirect after success
      } 
    } catch (error) {
      console.error("Error saving address:", error);
      alert("An error occurred while saving the address.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Font Awesome Icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="bg-orange-500 rounded-full text-white p-4 flex justify-between items-center">
            <div className="flex flex-col items-center z-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500">
                <i className="fas fa-check"></i>
              </div>
              <span className="mt-1 text-sm">Shipping</span>
            </div>

            <div className="flex flex-col items-center z-1">
              <div className="w-8 h-8 bg-white bg-opacity-50 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-list"></i>
              </div>
              <span className="mt-1 text-sm">Review</span>
            </div>

            <div className="flex flex-col items-center z-1">
              <div className="w-8 h-8 bg-white bg-opacity-50 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-credit-card"></i>
              </div>
              <span className="mt-1 text-sm">Payment</span>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading shipping details...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-orange-500 text-center mb-8">SHIPPING ADDRESS</h1>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Full Name *</label>
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
                  <label className="block mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Alternate Phone</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2">Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Delivery Instructions</label>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-gray-700 text-white"
                />
              </div>

              <div className="flex items-center">
                <input type="checkbox" checked={consentChecked} onChange={handleConsentChange} className="mr-2" />
                <span className="text-gray-800">The above information is correct and I take full responsibility.</span>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Link to="/cart">
                  <button type="button" className="bg-gray-700 text-white px-8 py-3 rounded">Cancel</button>
                </Link>
                <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded" disabled={!consentChecked}>
                Save and Continue
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
