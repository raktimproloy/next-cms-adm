import { useEffect, useState } from "react";

function Sidebar() {
  const [content, setContent] = useState("components")
// useEffect(() => {
//   const localContent = localStorage.getItem("content")
// }, [localStorage])

  return (
    <>
      <ul className="nav nav-tabs flex px-2 py-2" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="block-tab"
            data-bs-toggle="tab"
            data-bs-target="#block"
            type="button"
            role="tab"
            aria-controls="block"
            aria-selected="true"
            onClick={() => setContent("components")}
            title="components"
          >
            <i className="fa fa-th" aria-hidden="true"></i>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="style-tab"
            data-bs-toggle="tab"
            data-bs-target="#style"
            type="button"
            role="tab"
            aria-controls="style"
            aria-selected="false"
            onClick={() => setContent("styles")}
            title="styles"
          >
            {/* <i className="fa fa-paint-brush"></i> */}
            <i className="fa fa-cog"></i>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="layer-tab"
            data-bs-toggle="tab"
            data-bs-target="#layer"
            type="button"
            role="tab"
            aria-controls="layer"
            aria-selected="false"
            onClick={() => setContent("layers")}
            title="layers"
          >
            <i className="fa fa-tree" aria-hidden="true"></i>
          </button>
        </li>
        {/* <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trait-tab"
            data-bs-toggle="tab"
            data-bs-target="#trait"
            type="button"
            role="tab"
            aria-controls="trait"
            aria-selected="false"
            onClick={() => setContent("settings")}
            title="settings"
          >
            <i className="fa fa-cog"></i>
          </button>
        </li> */}
      </ul>
      <div className="tab-content">
        {/* Row */}
        <div
          className={`tab-pane fade ${content === "components"? "block" : "hidden"}`}
          id="block"
          role="tabpanel"
          aria-labelledby="block-tab"
        >
          <div id="blocks"></div>
        </div>
        {/* Body */}
        <div
          className={`tab-pane fade ${content === "layers"? "block" : "hidden"}`}
          id="layer"
          role="tabpanel"
          aria-labelledby="layer-tab"
        >
          <div id="layers-container"></div>
        </div>
        {/* Decoration */}
        <div
          className={`tab-pane fade ${content === "styles"? "block" : "hidden"}`}
          id="style"
          role="tabpanel"
          aria-labelledby="style-tab"
        >
          <div id="trait-container"></div>
          <div id="styles-container"></div>
        </div>
        {/* Setting */}
        {/* <div
          className={`tab-pane fade ${content === "settings"? "block" : "hidden"}`}
          id="trait"
          role="tabpanel"
          aria-labelledby="trait-tab"
        >
          <div id="trait-container"></div>
        </div> */}
      </div>
    </>
  );
}

export default Sidebar;
