import rsa from 'js-crypto-rsa';
import base64url from 'base64url'

//let publicKey = {kty: 'RSA'};

const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', sendData);

// let publicKey = {};
// let privateKey = {};
let decodedN = 0n;
let decodedE = 0n;

async function getKey() {
  try {
    const res = await axios.get('http://127.0.0.1:5000/publicKey');

    let publicKey = JSON.parse(res.data.publicKey);
    
    decodedN = base64ToBigInt(publicKey.n);
    decodedE = base64ToBigInt(publicKey.e);
    
    console.log("Decoded n (BigInt): ", decodedN);
    console.log("Decoded e (BigInt): ", decodedE);

  } catch (err) {
    console.log(err)
  }
}

async function sendData(e) {
  e.preventDefault();

  let name = document.getElementById("name");
  let password = document.getElementById("password");

  if (name.value == "" || password.value == "") {
    alert("Ensure you input a value in both fields!");
  } else {
    console.log(
      `This form has a name of ${name.value} and password of ${password.value}`
    );

    const encodedName = await encodeMessage(textToByteArray(name.value), publicKey);
    const encodedPassword = await encodeMessage(textToByteArray(password.value), publicKey)

    // console.log(encodedName);

    let data = JSON.stringify({
      name: encodedName,
      password: encodedPassword
    });

    console.log("DATA: ", data);

    axios.post('http://127.0.0.1:5000/register', data,
      {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then(response => console.log(response));
  }
}

function encodeMessage(msg, publicKey) {
  return new Promise((resolve, reject) => {
    rsa.encrypt(msg, publicKey)
      .then((encrypted) => {
        resolve(encrypted);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// function encodeMessage(msg, publicKey) {
//   return new Promise((resolve, reject) => {
//     rsa.encrypt(msg, publicKey)
//       .then((encrypted) => {
//         return rsa.decrypt(
//           encrypted,
//           privateKey,
//         )
//       }).then( (decrypted) => {
//         // now you get the decrypted message
//         console.log(byteArrayToText(decrypted));   // -> correct
//         resolve(decrypted);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }

function base64ToBigInt(str) {
  let base64Encoded = str.replace(/-/g, '+').replace(/_/g, '/');

  // Pad the string with '=' until it is a multiple of 4
  while (base64Encoded.length % 4) {
    base64Encoded += '=';
  }

  // Decode the base64 string and convert to BigInt
  let decoded = BigInt('0x' + Array.from(atob(base64Encoded), (c) => c.charCodeAt(0)).map((b) => b.toString(16).padStart(2, '0')).join(''));
  return decoded;
}

function textToByteArray(str) {
  const utf8EncodeText = new TextEncoder();
  const byteArray = utf8EncodeText.encode(str); // Uint8Array
  return byteArray;
}

function byteArrayToText(arr) {
  let decoder = new TextDecoder("utf-8"); 
  let str = decoder.decode(arr); 
  return str;
}

await getKey();



