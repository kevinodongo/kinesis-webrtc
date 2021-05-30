import * as React from "react";

function Loader() {
  return (
    <div id="loaderSection">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loaderText">Loading...</div>
      </div>
    </div>
  );
}

export default Loader;
