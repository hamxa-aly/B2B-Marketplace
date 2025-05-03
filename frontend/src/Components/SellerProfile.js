

import { useState } from "react"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    businessName: "",
    ntnNumber: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission - you can add validation here
    console.log("Profile saved:", formData)
  }

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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 text-center mb-8">PROFILE</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Phone No.</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block mb-2">Business Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your business address"
                className="w-full p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter your postal code"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Province</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                placeholder="Enter your province"
                className="w-full p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>

            {/* Additional Fields (without separator line) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block mb-2">NTN Number</label>
                <input
                  type="text"
                  name="ntnNumber"
                  value={formData.ntnNumber}
                  onChange={handleChange}
                  placeholder="Enter your NTN number"
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button type="submit" className="bg-orange-500 text-white px-8 py-3 rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

