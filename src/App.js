import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import domtoimage from "dom-to-image";
import Content from "./components/Content";
import Form from "./components/Form";
import Result from "./components/Result";
import "./styles/styles.css";

const App = () => {
  let imageContainerRef = useRef(null);
  let resultContainerRef = useRef(null);

  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [textTop, setTextTop] = useState("");
  const [textBottom, setTextBottom] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get("https://api.imgflip.com/get_memes");
      return res.data.data.memes;
    };
    fetchImages().then(res => {
      setImages(res);
      setActiveImage(res[0].url);
    });
  }, []);

  const handleInputChange = e => {
    const {
      target: { value, name }
    } = e;
    name === "text-top" ? setTextTop(value) : setTextBottom(value);
  };

  const handleImageChange = () => {
    const newPic = images[Math.floor(Math.random() * images.length)];
    setActiveImage(newPic.url);
  };

  const handleImageInputChange = e => {
    const {
      target: { files }
    } = e;
    setActiveImage(window.URL.createObjectURL(files[0]));
  };

  const handleGenerateMeme = () => {
    const { current } = resultContainerRef;
    if (current.childNodes.length > 0) {
      current.removeChild(current.childNodes[0]);
    }
    domtoimage
      .toPng(imageContainerRef.current)
      .then(dataUrl => {
        let meme = new Image();
        meme.src = dataUrl;
        current.appendChild(meme);
        setIsGenerated(true);
      })
      .catch(error => {
        console.error("oops, something went wrong!", error);
      });
  };

  const handleResetMeme = () => {
    const { current } = resultContainerRef;
    current.removeChild(current.childNodes[0]);
    setIsGenerated(false);
    setTextTop("");
    setTextBottom("");
  };

  return (
    <>
      <p className="generatorTitle">I Can Has Memes?</p>
      <Form
        textTop={textTop}
        textBottom={textBottom}
        handleImageInputChange={handleImageInputChange}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleGenerateMeme={handleGenerateMeme}
        handleResetMeme={handleResetMeme}
        isGenerated={isGenerated}
      />
      <Content
        activeImage={activeImage}
        imageContainerRef={imageContainerRef}
        textBottom={textBottom}
        textTop={textTop}
      />
      <Result resultContainerRef={resultContainerRef} />
    </>
  );
};

export default App;
