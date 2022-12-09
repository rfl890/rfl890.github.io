(() => {
    const input = $("#file_select");
    const dropzone = $("#file");
    const dropzonetext = $("#dztext");
    const output = $("#hash");
    // The following code was stolen from https://emn178.github.io/online-tools/ because it is 12:00 am and I am too tired to write my own code for this. Full credit to this guy.
    let file;
    dropzone.bind("dragover", function () {
        dropzone.addClass("hover");
    });
    dropzone.bind("dragleave", function () {
        dropzone.removeClass("hover");
    });
    dropzone.bind("drop", function (e) {
        dropzone.removeClass("hover");
        file = e.originalEvent.dataTransfer.files[0];
        dropzonetext.text(file.name);
        autoUpdate();
    });
    input.bind("change", function () {
        file = input[0].files[0];
        dropzonetext.text(file.name);
        autoUpdate();
    });
    async function autoUpdate() {
        const reader = new FileReader();
        let batch = 1024 * 1024 * 2;
        let start = 0;
        let total = file.size;
        const hash = await hashwasm.createSHA256();
        hash.init();
        reader.onload = function (event) {
            try {
                const view = new Uint8Array(event.target.result);
                hash.update(view);
                asyncUpdate();
            } catch (e) {
                output.val(e);
            }
        };
        let asyncUpdate = function () {
            if (start < total) {
                output.val(
                    "hashing..." + ((start / total) * 100).toFixed(2) + "%"
                );
                let end = Math.min(start + batch, total);
                reader.readAsArrayBuffer(file.slice(start, end));
                start = end;
            } else {
                output.val(hash.digest("hex"));
            }
        };
        asyncUpdate();
    }
})();
