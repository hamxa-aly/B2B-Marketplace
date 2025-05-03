import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, useNavigate } from "react-router-dom"
import { TextAnimationClasses, IconsAnimationClasses } from "../Utilities"
import { toggleLoginStatus } from "../redux/Slices/LoginSlice"
import { useDispatch, useSelector } from "react-redux"
import Sidebar from "./Sidebar"

const Header = () => {
  const isLoggedIn = useSelector((state) => state.login.value)
  const UserRole = useSelector((state) => state.userrole.value)
  const HasStore = useSelector((state) => state.storeStatus.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [profileOptionsVisible, setProfileOptionsVisible] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function Logout(e) {
    e.preventDefault()
    const pastDate = new Date(0)
    document.cookie = `token=; expires=${pastDate.toUTCString()}; path=/;`
    dispatch(toggleLoginStatus())
    localStorage.clear()
    navigate("/")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <header className="flex flex-wrap justify-between items-center px-4 py-2 bg-[#34383A] sticky top-0 z-10">
        <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
          <Link to="/" className="mr-4">
            <img
              src="KaroobarLogo.png"
              alt="KAROOBAR Logo"
              className="h-12"
            />
          </Link>
          <div className="flex-grow md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Products here..."
                className="outline-none h-10 w-full rounded-2xl p-5 text-black"
              />
              <FontAwesomeIcon icon="magnifying-glass" size="lg" color="black" className="absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        <nav className="hidden md:flex space-x-10 items-center">
          <button
            className={`appearance-button border-0 rounded-md text-[#FF7104] font-bold text-lg ${TextAnimationClasses.OrangeToWhite}`}
          >
            Track your order
          </button>
          <Link to="/cart">
          <img
            alt="cart"
            src="/cart-icon.png"
            className={`object-contain ${IconsAnimationClasses.TranslateY}`}
            style={{ width: "30px", height: "30px" }}
          />
          </Link>
          {isLoggedIn === true ? (
            <>
              <img
                alt="notifications"
                src="/notification-icon.png"
                className={`object-contain ${IconsAnimationClasses.TranslateY}`}
                style={{ width: "40px", height: "40px" }}
              />
              <div className="bg-[#FF7104] w-[1px] h-8"></div>
              <div className="relative">
                <button
                  onClick={() => setProfileOptionsVisible(!profileOptionsVisible)}
                  className={`relative ${IconsAnimationClasses.TranslateY}`}
                >
                  <FontAwesomeIcon icon="user" size="lg" color="white" />
                </button>
                {profileOptionsVisible && (
                  <div className="absolute top-12 right-0 bg-[#2B2B2B] rounded-md shadow-lg w-64 h-72 flex flex-col text-white items-start">
                    <button className={`px-4 py-2 cursor-pointer ${TextAnimationClasses.WhiteToOrange_SmallText}`}>
                      <Link to="/profile">Go to Profile</Link>
                    </button>
                    {UserRole === "buyer" ? (
                      <button className={`px-4 py-2 cursor-pointer ${TextAnimationClasses.WhiteToOrange_SmallText}`}>
                        <Link to="/SellerRegistration">Become a Seller</Link>
                      </button>
                    ) : !HasStore ? (
                      <button className={`px-4 py-2 cursor-pointer ${TextAnimationClasses.WhiteToOrange_SmallText}`}>
                        <Link to="/CreateStore">Create Store</Link>
                      </button>
                    ) : (
                      <></>
                    )}
                    {HasStore && (
                      <button className={`px-4 py-2 cursor-pointer ${TextAnimationClasses.WhiteToOrange_SmallText}`}>
                        <Link to="/Dashboard">Dashboard</Link>
                      </button>
                    )}
                    <button className={`px-4 py-2 cursor-pointer ${TextAnimationClasses.WhiteToOrange_SmallText}`}>
                      <Link to="/orders">Current Orders</Link>
                    </button>
                    <button className={`px-4 py-2 cursor-pointer ${TextAnimationClasses.WhiteToOrange_SmallText}`}>
                      <Link to="/history">History</Link>
                    </button>
                    <button
                      className={`px-4 py-2  cursor-pointer text-[#FF7104] ${TextAnimationClasses.OrangeToWhite_SmallText}`}
                      onClick={(e) => Logout(e)}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#FF7104] font-semibold">
                Login
              </Link>
              <div className="bg-[#FF7104] w-[1px] h-8"></div>
              <button
                onClick={() => navigate("/signup")}
                className="bg-red-500 border border-red-500 rounded-md shadow-sm text-white font-bold text-sm leading-4 min-h-[40px] px-4 py-3 hover:bg-transparent hover:text-red-500 active:opacity-50"
              >
                Signup
              </button>
            </>
          )}
        </nav>

        <button className="md:hidden text-white w-full text-left mt-2" onClick={toggleSidebar} aria-label="Open menu">
          <FontAwesomeIcon icon="bars" size="lg" /> Menu
        </button>
      </header>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        isLoggedIn={isLoggedIn}
        UserRole={UserRole}
        HasStore={HasStore}
        Logout={Logout}
      />
    </>
  )
}

export default Header
