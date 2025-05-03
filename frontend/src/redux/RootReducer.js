import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from './Slices/LoginSlice';
import  UserRoleReducer  from './Slices/UserRole';
import StoreReducer from './Slices/Store';
import productReducer from "./Slices/ProductsSlice";
import productImageReducer  from "./Slices/ProductImagesSlice";
import productTimeStampReducer from "./Slices/ProductTimeStampSlice";

const rootReducer = combineReducers({
    login: loginReducer,
    userrole: UserRoleReducer,
    storeStatus: StoreReducer,
    products: productReducer,
    productImages: productImageReducer,
    timestamp: productTimeStampReducer
  });
  
  export default rootReducer;