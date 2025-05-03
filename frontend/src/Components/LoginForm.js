import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toggleLoginStatus } from "../redux/Slices/LoginSlice";
import { SetUserRole } from "../redux/Slices/UserRole";
import { useDispatch } from "react-redux";
import { SetStoreStatus } from "../redux/Slices/Store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const HandleOnChange = (e) => {
    const { name, value } = e.target;
    name === "email" ? setEmail(value) : setPassword(value);
  };

  function ResetFormField() {
    setEmail("");
    setPassword("");
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.status === 200 && data.token) {
        dispatch(SetUserRole(data.role));
        dispatch(SetStoreStatus(data.storeStatus));
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 2);
        document.cookie = `token=${data.token}; path=/; expires=${expirationDate.toUTCString()}`;
        dispatch(toggleLoginStatus());
        navigate('/');
      } else if (response.status === 401) {
        ResetFormField();
        setErrorMessage("Incorrect Credentials!");
      } else if (response.status === 500) {
        ResetFormField();
        setErrorMessage("Internal Server Error!");
      } else {
        console.error('Unexpected response:', data);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      ResetFormField();
      setErrorMessage("An error occurred. Try again later!");
    } finally {
      setIsLoading(false);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="bg-[#ffffff] p-8 rounded-3xl shadow-lg text-[#34383A] w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between overflow-hidden">
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <img src="SHOPPINGMAN.png" alt="shopping man" className="w-full h-auto object-cover rounded-2xl transform transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="w-full md:w-1/2 md:pl-8">
        <form className="space-y-6 flex flex-col items-center" onSubmit={onFormSubmit}>
          <h1 className="text-4xl font-bold text-[#FF7104] mb-2">Welcome Back!</h1>
          <p className="text-lg text-[#34383A] mb-6">Please login to your account</p>
          {errorMessage && (
            <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-lg w-full max-w-md animate-pulse">
              {errorMessage}
            </p>
          )}
          <div className="w-full max-w-md relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF7104]" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={HandleOnChange}
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-lg border-2 border-[#34383A] focus:outline-none focus:ring-2 focus:ring-[#FF7104] focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div className="w-full max-w-md relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF7104]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={HandleOnChange}
              placeholder="Password"
              className="w-full p-3 pl-10 rounded-lg border-2 border-[#34383A] focus:outline-none focus:ring-2 focus:ring-[#FF7104] focus:border-transparent transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#34383A] hover:text-[#FF7104] transition-colors duration-300"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="w-full max-w-md text-right">
            <a href="/forgot-password" className="text-sm text-[#FF7104] hover:underline transition-all duration-300">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full max-w-md bg-[#FF7104] text-white py-3 rounded-lg hover:bg-[#e66700] transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

