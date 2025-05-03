import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import { TextAnimationClasses } from "../Utilities"

const Sidebar = ({ isOpen, onClose, isLoggedIn, UserRole, HasStore, Logout }) => {
  const navigate = useNavigate()

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-20 w-64 bg-[#2B2B2B] shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <button onClick={onClose} className="text-white">
          <FontAwesomeIcon icon="times" size="lg" />
        </button>
      </div>
      <nav className="flex flex-col p-4">
        <button
          onClick={handleLinkClick}
          className={`appearance-button border-0 rounded-md text-[#FF7104] font-bold text-lg mb-4 ${TextAnimationClasses.OrangeToWhite}`}
        >
          Track your order
        </button>
        <Link to="/cart" onClick={handleLinkClick} className="flex items-center text-white mb-4">
          <img alt="cart" src="/cart-icon.png" className="w-6 h-6 mr-2" />
          <span>Cart</span>
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/notifications" onClick={handleLinkClick} className="flex items-center text-white mb-4">
              <img alt="notifications" src="/notification-icon.png" className="w-6 h-6 mr-2" />
              <span>Notifications</span>
            </Link>
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className={`text-white mb-2 ${TextAnimationClasses.WhiteToOrange_SmallText}`}
            >
              Go to Profile
            </Link>
            {UserRole === "buyer" && (
              <Link
                to="/SellerRegistration"
                onClick={handleLinkClick}
                className={`text-white mb-2 ${TextAnimationClasses.WhiteToOrange_SmallText}`}
              >
                Become a Seller
              </Link>
            )}
            {!HasStore && UserRole !== "buyer" && (
              <Link
                to="/CreateStore"
                onClick={handleLinkClick}
                className={`text-white mb-2 ${TextAnimationClasses.WhiteToOrange_SmallText}`}
              >
                Create Store
              </Link>
            )}
            {HasStore && (
              <Link
                to="/Dashboard"
                onClick={handleLinkClick}
                className={`text-white mb-2 ${TextAnimationClasses.WhiteToOrange_SmallText}`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/orders"
              onClick={handleLinkClick}
              className={`text-white mb-2 ${TextAnimationClasses.WhiteToOrange_SmallText}`}
            >
              Current Orders
            </Link>
            <Link
              to="/history"
              onClick={handleLinkClick}
              className={`text-white mb-2 ${TextAnimationClasses.WhiteToOrange_SmallText}`}
            >
              History
            </Link>
            <button
              onClick={(e) => {
                Logout(e)
                onClose()
              }}
              className={`text-[#FF7104] mt-4 ${TextAnimationClasses.OrangeToWhite_SmallText}`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={handleLinkClick} className="text-[#FF7104] font-semibold mb-4">
              Login
            </Link>
            <button
              onClick={() => {
                navigate("/signup")
                onClose()
              }}
              className="bg-red-500 border border-red-500 rounded-md shadow-sm text-white font-bold text-sm leading-4 min-h-[40px] px-4 py-3 hover:bg-transparent hover:text-red-500 active:opacity-50"
            >
              Signup
            </button>
          </>
        )}
      </nav>
    </div>
  )
}

export default Sidebar

