import { toggleSidebar } from "@/utils/api/geditor_utils";

function TopNav() {
  const handleClick = () => {
    toggleSidebar(false);
  };
  return (
    <nav className="navbar container" style={{background: "#463a3c", display: "flex", justifyContent: "space-between"}}>
  {/* <button className="btn btn-sm btn-outline-primary" onClick={handleClick}>
    <i className="fa fa-bars"></i>
  </button> */}
  <div className="panel__devices"></div>
  <div className="panel__editor"></div>
  <div className="panel__basic-actions"></div>
</nav>

  );
}

export default TopNav;
