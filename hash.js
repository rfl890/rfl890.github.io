const startApp = ((hashName) => {
    "use strict";
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
    const str_textarea = $("#str");
    const hash_textarea = $("#hash");
    str_textarea.bind("input propertychange", async () => {
        const textToHash = str_textarea.val();
        const hashed = await hashwasm[hashName.toLowerCase()](textToHash);
        hash_textarea.val(hashed);
    });
    $("#hash").click(async () => {
        const hashed = hash_textarea.val();
        if (hashed.trim() === "") return;
        selectText("hash");
        await copyText("hash");
    });
});