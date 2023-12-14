import { configureStore, createStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";


const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
console.log(store)
export default store;
