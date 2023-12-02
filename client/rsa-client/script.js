const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', sendData);

let decodedN = 0n;
let decodedE = 0n;

async function getKey() {
  try {
    const res = await axios.get('http://127.0.0.1:5000/publicKey');

    let publicKey = JSON.parse(res.data.publicKey);
    
    decodedN = base64ToBigInt(publicKey.n).value;
    decodedE = base64ToBigInt(publicKey.e).value;

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

    const encodedName = encryptMessage(name.value, decodedN, decodedE);
    const encodedPassword = encryptMessage(password.value, decodedN, decodedE);

    let data = JSON.stringify({
      name: encodedName,
      password: encodedPassword
    });

    axios.post('http://127.0.0.1:5000/register', data,
      {
        headers: {
            'Content-Type': 'application/json',
        }
      })
      .then(response => console.log(response));
  }
}

function encryptMessage(str, decodedN, decodedE) {
  let byteArray = textToByteArray(str);
  let encryptedBytesArr = []

  byteArray.forEach(charCode => {
    let charBigInt = bigInt(charCode);
    let encryptedBigInt = charBigInt.modPow(decodedE, decodedN).toString();
    let encryptedString = String(encryptedBigInt);
    
    encryptedBytesArr.push(encryptedString);
  });

  return encryptedBytesArr;
}

function base64ToBigInt(str) {
  let base64Encoded = str.replace(/-/g, '+').replace(/_/g, '/');

  // Pad the string with '=' until it is a multiple of 4
  while (base64Encoded.length % 4) {
    base64Encoded += '=';
  }

  // Decode the base64 string and convert to BigInt
  let decoded = BigInt('0x' + Array.from(atob(base64Encoded), (c) => c.charCodeAt(0)).map((b) => b.toString(16).padStart(2, '0')).join(''));
  return bigInt(decoded);
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



