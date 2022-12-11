const startApp = ((hashName) => {
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
    const dropzone = $("#file");
    const dropzonetext = $("#dztext");
    const output = $("#hash");
    const progress = document.getElementById("progress");
    // The following code was (partially) stolen from https://emn178.github.io/online-tools/ because it is 12:00 am and I am too tired to write my own code for this. Full credit to this guy.
    let file;
    let hashFinished = false;
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
        hashFinished = false;
        const reader = new FileReader();
        let batch = 1024 * 1024 * 2;
        let start = 0;
        let total = file.size;
        const hash = await hashwasm[`create${hashName}`]();
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
                progress.style.width = ((start / total) * 100).toFixed(2) + "%";
                let end = Math.min(start + batch, total);
                reader.readAsArrayBuffer(file.slice(start, end));
                start = end;
            } else {
                hashFinished = true;
                progress.style.width = "100%";
                output.val(hash.digest("hex"));
            }
        };
        asyncUpdate();
    }
    output.click(async () => {
        if (hashFinished) {
            selectText("hash");
            await copyText("hash");
        }
    });
});