(() => {
   let keyAlreadyGenerated = false;
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
   }

   const copyText = async (id) => {
      const copyText = document.getElementById(id);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      await navigator.clipboard.writeText(copyText.value);
      return "";
   }
   const generateKey = async (length, hash) => {
      const subtle = crypto.subtle;

      const arrayBufferToBase64 = (arrayBuffer) => {
         const byteArray = new Uint8Array(arrayBuffer);
         let byteString = '';
         for (var i = 0; i < byteArray.byteLength; i++) {
            byteString += String.fromCharCode(byteArray[i]);
         }
         let b64D = btoa(byteString);
         b64D = b64D.match(/.{1,64}/g).join('\n');
         return b64D;
      }
      const beginning = '-----BEGIN RSA PRIVATE KEY-----\n';
      const ending = '\n-----END RSA PRIVATE KEY-----\n';
      const beginningp = '-----BEGIN PUBLIC KEY-----\n';
      const endingp = '\n-----END PUBLIC KEY-----\n';
      const keyConfig = {
         name: "RSA-OAEP",
         modulusLength: length,
         publicExponent: new Uint8Array([1, 0, 1]),
         hash: hash
      }
      const key = await subtle.generateKey(keyConfig, true, ["encrypt", "decrypt"]);
      const publicKey = key.publicKey;
      const privateKey = key.privateKey;

      const exported_public = await subtle.exportKey("spki", publicKey);
      const exported_private = await subtle.exportKey("pkcs8", privateKey);

      const pem_private = arrayBufferToBase64(exported_private);
      const pem_public = arrayBufferToBase64(exported_public);

      const final_private = beginning + pem_private + ending;
      const final_public = beginningp + pem_public + endingp;

      return {
         private: final_private,
         public: final_public
      }
   }
   const Gen = $("#gen");
   const pvKey = $("#privateKey");
   const pbKey = $("#publicKey");
   const keyLen = $("#keySize");
   const keyHash = $("#hash")

   const mappings = {
      "2048": 2048,
      "3072": 3072,
      "4096": 4096,

      "SHA256": "SHA-256",
      "SHA384": "SHA-284",
      "SHA512": "SHA-512"
   }
   Gen.click(() => {
      const selectedSize = keyLen.val();
      const selectedHash = keyHash.val();
      generateKey(mappings[selectedSize], mappings[selectedHash])
         .then(keys => {
            pvKey.text(keys.private);
            pbKey.text(keys.public);
            keyAlreadyGenerated = true;
         })
         .catch((err) => {
            alert("There was an error generating your keys. Check debug console for more info.");
            console.error(err);
         });
   });
   const toaster = document.getElementById('copyToast');
   pvKey.click(() => {
      if (keyAlreadyGenerated) {
         selectText("privateKey");
         copyText("privateKey").then(() => {
            new bootstrap.Toast(toaster).show();
         });
      }
   });
   pbKey.click(() => {
      if (keyAlreadyGenerated) {
         selectText("publicKey");
         copyText("publicKey").then(() => {
            new bootstrap.Toast(toaster).show();
         });
      }
   })
})();