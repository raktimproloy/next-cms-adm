import layout, {profileSlice, userSlice, updateInfoSlice, roleSlice, pageSlice, userRoleSlice, blogSlice, menuSlice, linkSlice, settingSlice } from "./layout";
import pageReducer from "./reducers/pageReducer"
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  layout,
  setting: settingSlice.reducer,
  profile: profileSlice.reducer,
  users: userSlice.reducer,
  userRoles: userRoleSlice.reducer,
  roles: roleSlice.reducer,
  pages: pageSlice.reducer,
  menus: menuSlice.reducer,
  update: updateInfoSlice.reducer,
  blogs: blogSlice.reducer,
  links: linkSlice.reducer,
  pageStore: pageReducer,
});