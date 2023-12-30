// vite.config.js
import { defineConfig } from "file:///D:/NEXTCLI-OFFICE/Admin-Panel/next-cms-adm/node_modules/vite/dist/node/index.js";
import react from "file:///D:/NEXTCLI-OFFICE/Admin-Panel/next-cms-adm/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import rollupReplace from "file:///D:/NEXTCLI-OFFICE/Admin-Panel/next-cms-adm/node_modules/@rollup/plugin-replace/dist/es/index.js";
var __vite_injected_original_dirname = "D:\\NEXTCLI-OFFICE\\Admin-Panel\\next-cms-adm";
var vite_config_default = defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__vite_injected_original_dirname, "./src")
      }
    ]
  },
  server: {
    host: "0.0.0.0",
    port: 3006,
    secure: false,
    strictPort: true,
    hmr: {
      port: 3006,
      host: "localhost"
    }
  },
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        "process.env.NODE_ENV": JSON.stringify("development")
      }
    }),
    react()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxORVhUQ0xJLU9GRklDRVxcXFxBZG1pbi1QYW5lbFxcXFxuZXh0LWNtcy1hZG1cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE5FWFRDTEktT0ZGSUNFXFxcXEFkbWluLVBhbmVsXFxcXG5leHQtY21zLWFkbVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTkVYVENMSS1PRkZJQ0UvQWRtaW4tUGFuZWwvbmV4dC1jbXMtYWRtL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuLy9pbXBvcnQgcmVhY3RSZWZyZXNoIGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1yZWZyZXNoXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJvbGx1cFJlcGxhY2UgZnJvbSBcIkByb2xsdXAvcGx1Z2luLXJlcGxhY2VcIjtcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgLy8gXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgZmluZDogXCJAXCIsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgIHBvcnQ6IDMwMDYsXHJcbiAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgIGhtcjoge1xyXG4gICAgICBwb3J0OiAzMDA2LFxyXG4gICAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxyXG4gICAgfSwgXHJcbiAgfSxcclxuXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcm9sbHVwUmVwbGFjZSh7XHJcbiAgICAgIHByZXZlbnRBc3NpZ25tZW50OiB0cnVlLFxyXG4gICAgICB2YWx1ZXM6IHtcclxuICAgICAgICBfX0RFVl9fOiBKU09OLnN0cmluZ2lmeSh0cnVlKSxcclxuICAgICAgICBcInByb2Nlc3MuZW52Lk5PREVfRU5WXCI6IEpTT04uc3RyaW5naWZ5KFwiZGV2ZWxvcG1lbnRcIiksXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIHJlYWN0KCksXHJcbiAgICAvL3JlYWN0UmVmcmVzaCgpLFxyXG4gIF0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdULFNBQVMsb0JBQW9CO0FBRXJWLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFKMUIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUVFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUM5QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLGNBQWM7QUFBQSxNQUNaLG1CQUFtQjtBQUFBLE1BQ25CLFFBQVE7QUFBQSxRQUNOLFNBQVMsS0FBSyxVQUFVLElBQUk7QUFBQSxRQUM1Qix3QkFBd0IsS0FBSyxVQUFVLGFBQWE7QUFBQSxNQUN0RDtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTTtBQUFBLEVBRVI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
