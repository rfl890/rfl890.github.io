const startApp = ((hashName, optionalArg) => {
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
        const textToCopy = document.getElementById(id);
        textToCopy.select();
        textToCopy.setSelectionRange(0, 99999);
        await navigator.clipboard.writeText(copyText.value);
    };
    const str_textarea = $("#input_text");
    const hash_textarea = $("#output_text");
    str_textarea.bind("input propertychange", async () => {
        const textToHash = str_textarea.val();
        const hashed = await hashwasm[hashName](textToHash, optionalArg);
        hash_textarea.val(hashed);
    });
    $("#output_text").click(async () => {
        const hashed = hash_textarea.val();
        if (hashed.trim() === "") return;
        selectText("output_text");
        await copyText("output_text");
    });
});
