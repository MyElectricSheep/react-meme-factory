import React from "react";

const Content = ({ imageContainerRef, activeImage, textTop, textBottom }) => {
  return (
    <div className="content" ref={imageContainerRef}>
      <img src={activeImage} alt="Meme" />
      <h1>{textTop}</h1>
      <h2>{textBottom}</h2>
    </div>
  );
};
export default Content;
