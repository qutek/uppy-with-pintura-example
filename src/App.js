import React from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

import uppyPintura from "./pintura/useEditorWithUppy";
import { openDefaultEditor } from "./pintura/pintura";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "./pintura/pintura.css";

const uppy = new Uppy({
  onBeforeFileAdded: uppyPintura(
    openDefaultEditor,
    {
      // imageCropAspectRatio: 1,
      // imageWriter: {
      //   targetSize: {
      //     width: 220,
      //     height: 80,
      //     upscale: true,
      //     // fit: 'cover',
      //   },
      // },
      cropSelectPresetOptions: [
        [
          "Crop",
          [
            [undefined, "Custom"],
            [1, "Square"],
            [4 / 3, "Landscape"],
            [3 / 4, "Portrait"],
          ],
        ],
        [
          "Size",
          [
            [[180, 180], "Profile Picture"],
            [[1200, 600], "Header Image"],
            [[800, 400], "Timeline Photo"],
          ],
        ],
      ],
    },
    // Reference to Uppy addFile API
    (file) => uppy.addFile(file)
  ),
  // onBeforeUpload: (files) => {
  //   // We’ll be careful to return a new object, not mutating the original `files`
  //   alert('No server :)')
  //   return false
  // },
}).use(Tus, {
  endpoint: "https://tusd.tusdemo.net/files/", // use your tus endpoint here
  retryDelays: [0, 1000, 3000, 5000],
});

uppy.on("complete", (result) => {
  const urls = result.successful.map((r) => r.uploadURL);
  alert(urls.join(","));
  console.log("Upload complete! We’ve uploaded these files:", urls);
});

function App() {
  return <Dashboard uppy={uppy} />;
}

export default App;
