import React from "react";

export const ImageProccessor = ({ imgOld = "/03.jfif", imgNew = "/02.jfif" }) => {
  const audio = new Audio("/buy_sound.mp3");

  const [isCvReady, setIsCvReady] = React.useState(false);
  const [svgPaths, setSvgPaths] = React.useState([]);
  const isMounted = useIsMounted();
  const abortControllerOld = new AbortController();
  const abortControllerNew = new AbortController();

  const generateSvgPath = (cnt) => {
    let points = cnt.data32S;
    let svgPath = `M ${points[0]} ${points[1]}`;
    for (let i = 2; i < points.length; i += 2) {
      svgPath += ` L ${points[i]} ${points[i + 1]}`;
    }
    svgPath += " Z";
    return svgPath;
  };

  React.useEffect(() => {
    const handleCvReady = () => setIsCvReady(true);
    document.addEventListener("onOpenCvReady", handleCvReady);

    return () => document.removeEventListener("onOpenCvReady", handleCvReady);
  }, []);

  React.useEffect(() => {
    if (!isCvReady) {
      console.log("OpenCV not loaded yet");
      return;
    }
    const processImages = async () => {
      try {
        //   let oldImage = cv.imread(document.getElementById("imageOld"));
        //   let newImage = cv.imread(document.getElementById("imageNew"));

        const oldImage = await imageUrlToMat(imgOld, isMounted, abortControllerOld);
        const newImage = await imageUrlToMat(imgNew, isMounted, abortControllerNew);

        if (isMounted.current) {
          let diffImage = new cv.Mat();

          cv.absdiff(oldImage, newImage, diffImage);
          cv.cvtColor(diffImage, diffImage, cv.COLOR_BGR2GRAY);
          cv.threshold(diffImage, diffImage, 3, 255, cv.THRESH_BINARY);

          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          cv.findContours(diffImage, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

          let newSvgPaths = [];
          for (let i = 0; i < contours.size(); ++i) {
            let cnt = contours.get(i);
            newSvgPaths.push(generateSvgPath(cnt));
          }

          //   let newSvgPaths = [];
          //   for (let i = 0; i < contours.size(); ++i) {
          //     let cnt = contours.get(i);
          //     if (cv.contourArea(cnt) < 5) {
          //       continue;
          //     }
          //     let epsilon = 0.0001 * cv.arcLength(cnt, true); // Start with a lower value
          //     let approx = new cv.Mat();
          //     cv.approxPolyDP(cnt, approx, epsilon, true);
          //     newSvgPaths.push(generateSvgPath(approx));
          //     approx.delete();
          //   }

          setSvgPaths(newSvgPaths);

          //   console.log(newSvgPaths);
          oldImage.delete();
          newImage.delete();
          diffImage.delete();
          contours.delete();
          hierarchy.delete();
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    processImages();

    return () => {
      abortControllerOld.abort();
      abortControllerNew.abort();
    };
  }, [imgOld, imgNew, isCvReady]);

  const [imageDimensions, setImageDimensions] = React.useState({});
  const [actualImageDimensions, setActualImageDimensions] = React.useState({});

  const handleImageLoad = () => {
    const image = document.getElementById("imageNew");

    // Get displayed dimensions
    const { width, height } = image.getBoundingClientRect();
    setImageDimensions({ width, height });

    // Get actual dimensions
    const actualWidth = image.naturalWidth;
    const actualHeight = image.naturalHeight;
    setActualImageDimensions({ width: actualWidth, height: actualHeight });
  };

  const [animate, setAnimate] = React.useState(false);
  const handleClick = () => {
    setAnimate(false);
    setTimeout(() => {
      audio.play();
      setAnimate(true);
    }, 0);
  };

  return (
    <div className="relative" style={imageDimensions}>
      {/* <img id="imageOld" src={imgOld} alt="Old" style={{ position: "absolute" }} className="" /> */}
      {/* <img id="imageNew" src={imgNew} alt="New" style={{ position: "absolute" }} className="" /> */}
      <img id="imageNew" src={imgNew} alt="New" style={imageDimensions} className="" onLoad={handleImageLoad} />
      <div id="svgContainer" className="absolute top-0 z-50 w-full h-full">
        <svg
          viewBox={`0 0 ${actualImageDimensions.width} ${actualImageDimensions.height}`}
          style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}
        >
          <defs>
            <filter id="blur" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          {svgPaths.map((path, index) => (
            <path
              key={index}
              d={path}
              stroke="white"
              className={` ${animate ? "animate-growStroke" : ""}`}
              fill="none"
              filter="url(#blur)"
            />
          ))}
        </svg>
      </div>
      <button id="status" onClick={handleClick}>
        {isCvReady ? "OpenCV is ready" : "Loading..."}
      </button>
    </div>
  );
};

function useIsMounted() {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

async function imageUrlToMat(url, isMounted, abortController) {
  return new Promise((resolve, reject) => {
    if (abortController.signal.aborted) {
      reject(new Error("Image load aborted"));
      return;
    }

    let image = new Image();
    image.crossOrigin = "anonymous"; // If needed
    image.src = url;

    const handleAbort = () => {
      image.onload = null;
      image.onerror = null;
      reject(new Error("Image load aborted"));
    };

    abortController.signal.addEventListener("abort", handleAbort);

    image.onload = () => {
      if (!isMounted.current) {
        reject(new Error("Component unmounted"));
        return;
      }

      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      let src = cv.imread(canvas);
      resolve(src);

      abortController.signal.removeEventListener("abort", handleAbort);
    };

    image.onerror = () => {
      reject(new Error("Image load error"));
      abortController.signal.removeEventListener("abort", handleAbort);
    };
  });
}
