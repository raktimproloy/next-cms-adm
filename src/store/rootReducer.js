import layout, { userSlice, updateInfoSlice } from "./layout";

const rootReducer = {
  layout,
  users: userSlice.reducer,
  update: updateInfoSlice.reducer
};
export default rootReducer;
