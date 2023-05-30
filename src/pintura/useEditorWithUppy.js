export default function uppyPintura(
  openEditor,
  editorOptions = {},
  getUppyAddFileRef
) {
  const queue = [];
  let __handledByEditor = false;

  const canEditFile = (file) => {
    if (file.isRemote) return false;
    if (!(file.data instanceof Blob)) return false;
    return /^image/.test(file.type) && !/svg/.test(file.type);
  };

  const editNextFile = () => {
    const next = queue[0];
    if (next) next();
  };

  const queueFile = (file) => {
    queue.push(function () {
      const editor = openEditor({
        ...editorOptions,
        src: file.data,
      });

      editor.on("hide", () => {
        // Remove this item from the queue
        queue.shift();

        // Edit next item in queue
        editNextFile();
      });

      editor.on("process", ({ dest }) => {
        // Don't add file if cancelled
        if (!dest) return;

        __handledByEditor = true;

        // add the modified file
        const add = getUppyAddFileRef
          ? getUppyAddFileRef
          : window["uppy"].addFile;

        // add back into uppy file queue
        add({
          ...file,
          data: dest,
          __handledByEditor: true,
        });
      });
    });

    // If this is first item, let's open the editor immmidiately
    if (queue.length === 1) editNextFile();
  };

  return (file) => {
    const allowAdd = __handledByEditor;

    // reset the `__handledByEditor`
    __handledByEditor = false;

    if (allowAdd || file.__handledByEditor || !canEditFile(file)) {
      return true;
    }

    // edit first, then add manually
    queueFile(file);

    // // can't add now, we have to wait for editing to finish
    return false;
  };
}
