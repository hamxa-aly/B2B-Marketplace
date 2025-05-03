import { useState } from "react"

// Main functional component for the Profile Page
export default function ProfilePage() {
  // Initialize form data state with default empty values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    city: "",
    postalCode: "",
    province: "",
  })

  // Handle input changes and update the state
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value, // dynamically update the specific field
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault() // prevent page reload
    console.log("Profile saved:", formData) // log the form data
    // You can add validation or API call here
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Font Awesome CDN for icons if needed */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div className="max-w-3xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-4xl font-bold text-orange-500 text-center mb-8">PROFILE</h1>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* First & Last Name Fields */}
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

            {/* Address Field */}
            <div>
              <label className="block mb-2">House Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your complete address"
                className="w-full p-3 rounded-lg bg-gray-700 text-white"
              />
            </div>

            {/* Phone Field */}
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

            {/* City & Postal Code Fields */}
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

            {/* Province Field */}
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
          </div>

          {/* Submit Button */}
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
