const startApp = (hashName, optionalArg) => {
    const selectText = (containerid) => {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    };
    const copyText = async (id) => {
        const copyText = document.getElementById(id);
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        await navigator.clipboard.writeText(copyText.value);
        return "";
    };
    const input = $("#file_select");
    const dropzone = $("#the-file");
    const dropzonetext = $("#dztext");
    const output = $("#output_text");
    const progress = document.getElementById("progress");
    // The following code was (partially) taken from https://emn178.github.io/online-tools/. Big credit, I am just too lazy to write my own code LOL.
    let file;
    let hashFinished = false;
    const readers = [];
    dropzone.bind("drop", async function (e) {
        if (e.originalEvent.dataTransfer.files[0]) {
            file = e.originalEvent.dataTransfer.files[0];
            dropzonetext.text(file.name);
            progress.style.width = "0%";
            output.val("");
            // aborts the other reader when switching files
            const reader = await autoUpdate();
            readers.forEach((reader2, i) => {
                if (reader2 === reader) {} else {
                    reader2.abort();
                    readers.splice(i, 1);
                }
            });
        }
    });
    input.bind("change", async function () {
        if (input[0].files[0]) {
            file = input[0].files[0];
            dropzonetext.text(file.name);
            progress.style.width = "0%";
            progress.innerText = "";
            output.val("");
            // aborts the other reader when switching files
            const reader = await autoUpdate();
            readers.forEach((reader2, i) => {
                if (reader2 === reader) {} else {
                    reader2.abort();
                    readers.splice(i, 1);
                }
            });
        }
    });
    async function autoUpdate() {
        hashFinished = false;
        const reader = new FileReader();
        let batch = 1024 * 1024 * 2;
        let start = 0;
        let total = file.size;
        const hash = await hashwasm[`create${hashName}`](optionalArg);
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
                (async () => { progress.style.width = ((start / total) * 100).toFixed(2) + "%";
                progress.innerText = ((start / total) * 100).toFixed(2) + "%"; })();
                let end = Math.min(start + batch, total);
                reader.readAsArrayBuffer(file.slice(start, end));
                start = end;
            } else {
                hashFinished = true;
                progress.style.width = "100%";
                progress.innerText = "100%";
                output.val(hash.digest("hex"));
            }
        };
        asyncUpdate();
        readers.push(reader);
        return reader;
    }
    output.click(async () => {
        if (hashFinished) {
            selectText("output_text");
            await copyText("output_text");
        }
    });
};
