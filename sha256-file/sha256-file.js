/*
Minified with Terser 5.16.1
Unminified source: /sha256-file/sha256-file.src.js
*/
(()=>{const e=$("#file_select"),t=$("#file"),n=$("#dztext"),a=$("#hash");let i;async function s(){const e=new FileReader;let t=0,n=i.size;const s=await hashwasm.createSHA256();s.init(),e.onload=function(e){try{const t=new Uint8Array(e.target.result);s.update(t),r()}catch(e){a.val(e)}};let r=function(){if(t<n){a.val("hashing..."+(t/n*100).toFixed(2)+"%");let s=Math.min(t+2097152,n);e.readAsArrayBuffer(i.slice(t,s)),t=s}else a.val(s.digest("hex"))};r()}t.bind("dragover",(function(){t.addClass("hover")})),t.bind("dragleave",(function(){t.removeClass("hover")})),t.bind("drop",(function(e){t.removeClass("hover"),i=e.originalEvent.dataTransfer.files[0],n.text(i.name),s()})),e.bind("change",(function(){i=e[0].files[0],n.text(i.name),s()}))})();
