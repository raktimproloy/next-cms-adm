import { toggleSidebar } from "@/utils/api/geditor_utils";

function TopNav({editorPageData}) {
  const CMS_API = import.meta.env.VITE_CMS_LINK
  const pathname = window.location.pathname.split("/")
  console.log(pathname[1])
  const handleClick = () => {
    toggleSidebar(false);
  };
  return (
    // Object.keys(editorPageData).length !== 0 && (
      <nav className="navbar container" style={{background: "rgb(30 41 59)", display: "flex", justifyContent: "space-between", maxWidth: "100%", alignItems:"center"}}>
        <div className="flex items-center">
          <div className="panel__devices">
          </div>
          {
              pathname[1] !== "blog" ?
          <div className="flex items-center bg-blue-700 px-4 rounded-full shadow-xl py-1" style={{cursor:"pointer"}}>
          
            <a className="ml-1 text-sm" target="_blank" href={`${CMS_API}${editorPageData.slug}`}>{editorPageData.title}</a>
          </div>: ""
            }
        </div>
        <div className="panel__editor"></div>
        <div className="panel__basic-actions"></div>
      </nav>
    // )
  );
}

export default TopNav;
