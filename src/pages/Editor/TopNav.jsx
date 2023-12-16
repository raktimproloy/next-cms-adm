import { toggleSidebar } from "@/utils/api/geditor_utils";

function TopNav() {
  const handleClick = () => {
    toggleSidebar(false);
  };
  return (
    <nav className="navbar container" style={{background: "rgb(30 41 59)", display: "flex", justifyContent: "space-between", maxWidth: "100%"}}>
      <div className="panel__devices"></div>
      <div className="panel__editor"></div>
      <div className="panel__basic-actions"></div>
    </nav>
  );
}

export default TopNav;
