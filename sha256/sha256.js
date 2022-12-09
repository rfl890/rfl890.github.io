/*
    Minified with Terser 5.16.1.
    Unminified source: /rsagen/rsa.src.js
*/
(()=>{const e=$("#str"),t=$("#hash");e.bind("input propertychange",(()=>{const n=(e=>{const t=sjcl.hash.sha256.hash(e);return sjcl.codec.hex.fromBits(t)})(e.val());t.val(n)})),$("#hash").click((async()=>{""!==t.val().trim()&&((e=>{if(document.selection)(t=document.body.createTextRange()).moveToElementText(document.getElementById(e)),t.select();else if(window.getSelection){var t;(t=document.createRange()).selectNode(document.getElementById(e)),window.getSelection().removeAllRanges(),window.getSelection().addRange(t)}})("hash"),await(async e=>{const t=document.getElementById(e);return t.select(),t.setSelectionRange(0,99999),await navigator.clipboard.writeText(t.value),""})("hash"))}))})();
