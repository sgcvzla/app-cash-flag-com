function numero(id) {
  pin.value += id.substr(2);
  // mensaje.innerHTML = pin.value;
}

function borrar() {
  pin.value = pin.value.slice(0, -1);
  // mensaje.innerHTML = pin.value;
}

function ok() {
  if (pin.value != undefined && pin.value != "") {
  	window.opener.localStorage.setItem("pin",pin.value);
    window.close();
  }
}