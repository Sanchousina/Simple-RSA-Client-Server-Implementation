axios.get('http://127.0.0.1:5000/')
  .then(res => console.log(res.data));

function sendData(e) {
  e.preventDefault();

  let name = document.getElementById("name");
  let password = document.getElementById("password");

  if (name.value == "" || password.value == "") {
    alert("Ensure you input a value in both fields!");
  } else {
    console.log(
      `This form has a name of ${name.value} and password of ${password.value}`
    );

    axios.post(
      'http://127.0.0.1:5000/register', 
      {
        name: name.value,
        password: password.value
      })
      .then(response => console.log(response));
  }
}