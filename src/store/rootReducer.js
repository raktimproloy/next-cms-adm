import layout, { userSlice, updateInfoSlice, roleSlice } from "./layout";
import pageReducer from "./reducers/pageReducer"
import { combineReducers } from "@reduxjs/toolkit";


// const rootReducer = {
//   layout,
//   users: userSlice.reducer,
//   roles: roleSlice.reducer,
//   update: updateInfoSlice.reducer,
//   pageStore: pageReducer
// };
// export default rootReducer;

export default combineReducers({
  layout,
  users: userSlice.reducer,
  roles: roleSlice.reducer,
  update: updateInfoSlice.reducer,
  pageStore: pageReducer,
});