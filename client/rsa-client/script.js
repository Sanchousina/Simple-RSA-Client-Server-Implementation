import rsa from 'js-crypto-rsa';

//let publicKey = {kty: 'RSA'};

const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', sendData);

let publicKey = {};
let privateKey = {};

async function getKey() {
  try {
    const res = await axios.get('http://127.0.0.1:5000/publicKey');

    // publicKey.n = res.data.publicKeyN;
    // publicKey.e = res.data.publicKeyE;

    publicKey = JSON.parse(res.data.publicKey);
    privateKey = JSON.parse(res.data.privateKey);

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

console.log('Public key: ', publicKey);


