import React from "react";

export const ImageProccessor = ({ imgOld = "/01.jfif", imgNew = "/02.jfif" }) => {
  const [isCvReady, setIsCvReady] = React.useState(false);

  React.useEffect(() => {
    // Listen for the custom event dispatched in the HTML file
    const handleCvReady = () => setIsCvReady(true);
    document.addEventListener("onOpenCvReady", handleCvReady);

    // Don't forget to clean up
    return () => document.removeEventListener("onOpenCvReady", handleCvReady);
  }, []);

  React.useEffect(() => {
    if (!isCvReady) {
      console.log("OpenCV not loaded yet");
      return;
    }

    try {
      let oldImage = cv.imread(document.getElementById("imageOld"));
      let newImage = cv.imread(document.getElementById("imageNew"));

      let diffImage = new cv.Mat();

      // Assuming oldImage and newImage are the same size and type
      cv.absdiff(oldImage, newImage, diffImage);

      cv.cvtColor(diffImage, diffImage, cv.COLOR_BGR2GRAY);
      cv.threshold(diffImage, diffImage, 5, 255, cv.THRESH_BINARY);

      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(diffImage, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

      for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(255, 255, 0, 255); // RGBA for Yellow
        let cnt = contours.get(i);

        // Draw exact contours instead of bounding rectangle
        cv.drawContours(newImage, contours, i, color, 5, cv.LINE_8, hierarchy, 100);
      }

      cv.imshow("imageDiff", newImage);

      // Free the memory
      oldImage.delete();
      newImage.delete();
      diffImage.delete();
      contours.delete();
      hierarchy.delete();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [imgOld, imgNew, isCvReady]);

  return (
    <div>
      <img id="imageOld" src={imgOld} alt="Old" />
      <img id="imageNew" src={imgNew} alt="New" />
      <canvas id="imageDiff"></canvas>
      <div id="status">{isCvReady ? "OpenCV is ready" : "Loading..."}</div>
    </div>
  );
};
//   return (
//     <div className="relative">
//       <img src="/01.jfif" alt="1" />
//       <img src="/02.jfif" alt="1" className="absolute top-0 opacity-50" />
//     </div>
//   );
