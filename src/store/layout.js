import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// theme config import
import themeConfig from "@/configs/themeConfig";

const initialDarkMode = () => {
  const item = window.localStorage.getItem("darkMode");
  return item ? JSON.parse(item) : themeConfig.layout.darkMode;
};

const initialSidebarCollapsed = () => {
  const item = window.localStorage.getItem("sidebarCollapsed");
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed;
};

const initialSemiDarkMode = () => {
  const item = window.localStorage.getItem("semiDarkMode");
  return item ? JSON.parse(item) : themeConfig.layout.semiDarkMode;
};

const initialRtl = () => {
  const item = window.localStorage.getItem("direction");
  return item ? JSON.parse(item) : themeConfig.layout.isRTL;
};

const initialSkin = () => {
  const item = window.localStorage.getItem("skin");
  return item ? JSON.parse(item) : themeConfig.layout.skin;
};

const initialType = () => {
  const item = window.localStorage.getItem("type");
  return item ? JSON.parse(item) : themeConfig.layout.type;
};

const initialMonochrome = () => {
  const item = window.localStorage.getItem("monochrome");
  return item ? JSON.parse(item) : themeConfig.layout.isMonochrome;
};

const initialState = {
  isRTL: initialRtl(),
  darkMode: initialDarkMode(),
  isCollapsed: initialSidebarCollapsed(),
  customizer: themeConfig.layout.customizer,
  semiDarkMode: initialSemiDarkMode(),
  skin: initialSkin(),
  contentWidth: themeConfig.layout.contentWidth,
  type: initialType(),
  menuHidden: themeConfig.layout.menu.isHidden,
  navBarType: themeConfig.layout.navBarType,
  footerType: themeConfig.layout.footerType,
  mobileMenu: themeConfig.layout.mobileMenu,
  isMonochrome: initialMonochrome(),
};



export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    // handle dark mode
    handleDarkMode: (state, action) => {
      state.darkMode = action.payload;
      window.localStorage.setItem("darkMode", action.payload);
    },
    // handle sidebar collapsed
    handleSidebarCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
      window.localStorage.setItem("sidebarCollapsed", action.payload);
    },
    // handle customizer
    handleCustomizer: (state, action) => {
      state.customizer = action.payload;
    },
    // handle semiDark
    handleSemiDarkMode: (state, action) => {
      state.semiDarkMode = action.payload;
      window.localStorage.setItem("semiDarkMode", action.payload);
    },
    // handle rtl
    handleRtl: (state, action) => {
      state.isRTL = action.payload;
      window.localStorage.setItem("direction", JSON.stringify(action.payload));
    },
    // handle skin
    handleSkin: (state, action) => {
      state.skin = action.payload;
      window.localStorage.setItem("skin", JSON.stringify(action.payload));
    },
    // handle content width
    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload;
    },
    // handle type
    handleType: (state, action) => {
      state.type = action.payload;
      window.localStorage.setItem("type", JSON.stringify(action.payload));
    },
    // handle menu hidden
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload;
    },
    // handle navbar type
    handleNavBarType: (state, action) => {
      state.navBarType = action.payload;
    },
    // handle footer type
    handleFooterType: (state, action) => {
      state.footerType = action.payload;
    },
    handleMobileMenu: (state, action) => {
      state.mobileMenu = action.payload;
    },
    handleMonoChrome: (state, action) => {
      state.isMonochrome = action.payload;
      window.localStorage.setItem("monochrome", JSON.stringify(action.payload));
    },
  },
});


// Setting Data Slice
export const settingSlice = createSlice({
  name: "setting",
  initialState: {},
  reducers: {
    addSetting: (state, action) => {
      return {...action.payload}; // Concatenate the new users with the existing ones
    },
    removeSetting(state, action) {
      state.splice(action.payload, 1)
    },
  },
});


// Profile Data Slice
export const profileSlice = createSlice({
  name: "profile",
  initialState: {},
  reducers: {
    addProfile: (state, action) => {
      return {...action.payload}; // Concatenate the new users with the existing ones
    },
    removeProfile(state, action) {
      state.splice(action.payload, 1)
    },
  },
});

// User Data Slice
export const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    addUser: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removeUser(state, action) {
      state.splice(action.payload, 1)
    },
  },
});

// User Role Data SLice
export const userRoleSlice = createSlice({
  name: "userRole",
  initialState: [],
  reducers: {
    addUserRole: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removeUserRole(state, action) {
      state.splice(action.payload, 1)
    },
  },
});


// Role Data SLice
export const roleSlice = createSlice({
  name: "role",
  initialState: [],
  reducers: {
    addRole: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removeRole(state, action) {
      state.splice(action.payload, 1)
    },
  },
});

// page Data SLice
export const pageSlice = createSlice({
  name: "page",
  initialState: [],
  reducers: {
    addPage: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removePage(state, action) {
      state.splice(action.payload, 1)
    },
  },
});

// page Data SLice
export const menuSlice = createSlice({
  name: "menu",
  initialState: [],
  reducers: {
    addMenu: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removeMenu(state, action) {
      state.splice(action.payload, 1)
    },
  },
});

// Blog Data SLice
export const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    addBlog: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removeBlog(state, action) {
      state.splice(action.payload, 1)
    },
  },
});

// Blog Data Slice
export const blogPageSlice = createSlice({
  name: "blog",
  initialState: {},
  reducers: {
    addBlogPage: (state, action) => {
      const { page, data } = action.payload;
      return { ...state, [page]: data };
    },
    removeBlogPage: (state, action) => {
      const pageToRemove = action.payload;
      const { [pageToRemove]: _, ...newState } = state;
      return newState;
    },
  },
});

// Link Data Slice
export const linkSlice = createSlice({
  name: "link",
  initialState: [],
  reducers: {
    addLink: (state, action) => {
      return [...action.payload]; // Concatenate the new users with the existing ones
    },
    removeLink(state, action) {
      state.splice(action.payload, 1)
    },
  },
});


// All Update info Slice
export const updateInfoSlice = createSlice({
  name: "updateInfo",
  initialState: {
    profileUpdate: "",
    settingUpdate: "",
    userUpdate: "",
    userRoleUpdate: "",
    roleUpdate: "",
    pageUpdate: "",
    menuUpdate: "",
    blogUpdate: "",
    linkUpdate: "",
  },
  reducers: {
    addInfo: (state, action) => {
      const { field, value } = action.payload;
      if (field === 'userUpdate') {
        state.userUpdate = value;
      }else if (field === 'userRoleUpdate') {
        state.userRoleUpdate = value;
      } else if (field === 'roleUpdate') {
        state.roleUpdate = value;
      } else if (field === 'pageUpdate') {
        state.pageUpdate = value;
      } else if (field === 'menuUpdate') {
        state.menuUpdate = value;
      } else if (field === 'blogUpdate') {
        state.blogUpdate = value;
      } else if (field === 'linkUpdate') {
        state.linkUpdate = value;
      } else if (field === 'profileUpdate') {
        state.profileUpdate = value;
      } else if (field === 'settingUpdate') {
        state.settingUpdate = value;
      }
    }
  }
});


export const {addProfile, removeProfile} = profileSlice.actions
export const {addSetting, removeSetting} = settingSlice.actions
export const {addUser, removeUser} = userSlice.actions
export const {addUserRole, removeUserRole} = userRoleSlice.actions
export const {addRole, removeRole} = roleSlice.actions
export const {addPage, removePage} = pageSlice.actions
export const {addMenu, removeMenu} = menuSlice.actions
export const {addBlog, removeBlog} = blogSlice.actions
export const {addBlogPage, removeBlogPage} = blogPageSlice.actions
export const {addLink, removeLink} = linkSlice.actions
export const {addInfo} = updateInfoSlice.actions

export const {
  handleDarkMode,
  handleSidebarCollapsed,
  handleCustomizer,
  handleSemiDarkMode,
  handleRtl,
  handleSkin,
  handleContentWidth,
  handleType,
  handleMenuHidden,
  handleNavBarType,
  handleFooterType,
  handleMobileMenu,
  handleMonoChrome,
} = layoutSlice.actions;

export default layoutSlice.reducer;
