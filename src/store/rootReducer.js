import layout, { userSlice } from "./layout";

const rootReducer = {
  layout,
  users: userSlice.reducer
};
export default rootReducer;
