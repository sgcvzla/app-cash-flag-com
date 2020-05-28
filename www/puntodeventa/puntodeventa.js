let monto="", idproveedor=sessionStorage.getItem("idproveedor"), moneda='bs', tarjeta='';
let beep = '../lector/audio/beep.mp3';
let scanner = "";

var socket = io('https://ws.sgc-consultores.com.ve');

socket.on('manual', function(msg){
	datos = JSON.parse(msg);
	document.getElementById("status-"+datos.pdv_id).innerHTML = "Confirmada";
	document.getElementById("status-"+datos.pdv_id).classList.remove("rojo");
	document.getElementById("status-"+datos.pdv_id).classList.add("negro");
});

socket.on('card', function(msg){
	datos = JSON.parse(msg);
	console.log(msg);
	console.log('card '+datos);
});

idproveedor = (idproveedor==undefined) ? 2 : idproveedor;

function inicio() {
	// console.log(sessionStorage);
	limpiar();
	// document.getElementById("btnenviar").addEventListener('click', function(){
		// window.open(sessionStorage.getItem("url_bck2"), "_self") });
	div10_1.style.display = 'block';
	div10_2.style.display = 'none';
	btn_enviar.style.display = 'none';

	document.getElementById("btnvolver").addEventListener('click', function(){
		// mysocket.close();
		window.open(sessionStorage.getItem("url_bck2"), "_self") });
	// cargar parámetros de la tabla
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			if (respuesta.exito == 'SI') {
				// document.title = 'Menú principal';
				logo = respuesta.proveedor.logo;
				if (logo!="") {
					document.getElementById("logo").src = "../img/" + logo;
				} else {
					document.getElementById("logo").src = "../img/" + 'sin_imagen.jpg';
				}
				document.getElementById("logo").title = respuesta.proveedor.nombre;
				transacciones = respuesta.transacciones;
				rellenatransacciones(transacciones);
				// inicializarSocket();
			}
		}
	};
	xmlhttp.open("GET", "https://app.cash-flag.com/php/proveedores3.php?prov="+idproveedor, true);
	xmlhttp.send();
}

// // Abrir socket
// function inicializarSocket() {
// 	mysocket.onopen = function(evt) {
// 		console.log("Websocket abierto");
// 	};

// 	mysocket.onmessage = function(evt) {
// 		console.log("RECIBIDO: " + evt.data);	
// 	};

// 	mysocket.onclose = function(evt) {
// 		console.log("Websocket cerrado");
// 	};

// 	mysocket.onerror = function(evt) {
// 		console.log("ERROR: " + evt.data);
// 	}
// }

// limpia el formulario
function limpiar() {
	moneda = 'bs';
	monto = "";
	tarjeta = '';
	document.getElementById("divisa").value = "bs";
	document.getElementById("monto").value = "";

	document.getElementById("tarjeta").value = "";

	// btnpinpad.style.display = 'inline-block';
	// btnenviar.style.display = 'none';
	// document.getElementById("btnescanearqr").style.display = 'inline-block';
	// document.getElementById("btnpresentarqr").style.display = 'inline-block';

	document.getElementById("divisa").focus();
}

// valida la entrada en los campos
function validaciones() {
	let continuar = true, nocontinuar = false, vacios = 0, campo = "";
	if (document.getElementById("divisa").value=="" || document.getElementById("divisa").value==undefined) {
		alert("El campo moneda no puede quedar en blanco");
		vacios++;
		campo = "divisa";
		continuar = false;
		nocontinuar = true;
	}
	if ((document.getElementById("monto").value=="" || document.getElementById("monto").value==undefined) && vacios == 0) {
		alert("El campo monto no puede quedar en blanco");
		vacios++;
		campo = "monto";
	}
	if ((document.getElementById("tarjeta").value=="" || document.getElementById("tarjeta").value==undefined) && vacios == 0) {
		alert("El campo tarjeta no puede quedar en blanco");
		vacios++;
		campo = "tarjeta";
	}
	if (vacios>0) {
		continuar = false;
		nocontinuar = true;
	}
	if (nocontinuar) {
		document.getElementById(campo).focus();
	}
	return continuar;
}

// valida la entrada en los campos
function validaciones2() {
	let continuar = true, nocontinuar = false, vacios = 0, campo = "";
	if (document.getElementById("divisa").value=="" || document.getElementById("divisa").value==undefined) {
		alert("El campo moneda no puede quedar en blanco");
		vacios++;
		campo = "divisa";
		continuar = false;
		nocontinuar = true;
	}
	if ((document.getElementById("monto").value=="" || document.getElementById("monto").value==undefined) && vacios == 0) {
		alert("El campo monto no puede quedar en blanco");
		vacios++;
		campo = "monto";
	}
	if (vacios>0) {
		continuar = false;
		nocontinuar = true;
	}
	if (nocontinuar) {
		document.getElementById(campo).focus();
	}
	return continuar;
}

// Enviar la transacción para procesar
function enviar() {
	console.log('enviar');
	// if (localStorage.getItem("pin")!="" && localStorage.getItem("pin")!=undefined) {
		if (validaciones()) {
			// mysocket.send(document.getElementById("tarjeta").value+' monto: '+document.getElementById("monto").value);
			var datos = new FormData();
			datos.append("idproveedor", idproveedor);
			datos.append("moneda", document.getElementById("divisa").value);
			datos.append("monto", document.getElementById("monto").value);
			datos.append("tarjeta", document.getElementById("tarjeta").value);

			console.log(idproveedor);
			console.log(document.getElementById("divisa").value);
			console.log(document.getElementById("monto").value);
			console.log(document.getElementById("tarjeta").value);

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					respuesta = JSON.parse(this.responseText);
					if (respuesta.exito == 'SI') {
						alert(fmensaje(respuesta.mensaje));
						limpiar();
						for (var i = transacciones.length-1; i >= 0; i--) {
							document.getElementById("transaccionespendientes").removeChild(document.getElementById('fila-'+transacciones[i].id));
						}
						transacciones = respuesta.transacciones;
						rellenatransacciones(transacciones);
					} else {
						alert(respuesta.mensaje);
					}
				}
			};
			xmlhttp.open("POST", "https://app.cash-flag.com/php/enviacobro.php", true);
			xmlhttp.send(datos);
		}
	// } else {
	// 	alert("Debe activar el pin pad e introducir una clave de usuario para procesar pagos manualmente.");
	// 	btnpinpad.style.display = 'inline-block';
	// 	btnenviar.style.display = 'none';
	// }
	// localStorage.removeItem("pin");
}

function rellenatransacciones(transacciones) {
	par = true;	
	for (var i = 0; i < transacciones.length; i++) {
		// tarjeta en la columna 1
		txttarjeta = document.createTextNode(transacciones[i].tarjeta);
		cl1 = document.createElement("div");
		cl1.classList.add("columna1");
		cl1.appendChild(txttarjeta);

		// referencia en la columna 2
		txtreferencia = document.createTextNode(transacciones[i].referencia);
		cl2 = document.createElement("div");
		cl2.classList.add("columna2");
		cl2.appendChild(txtreferencia);

		// monto en la columna 3
		txtmonto = document.createTextNode(formatNumber.new(transacciones[i].monto));
		cl3 = document.createElement("div");
		cl3.classList.add("columna3");
		cl3.appendChild(txtmonto);

		// status en la columna 4
		txtstatus = document.createTextNode(transacciones[i].status);
		cl4 = document.createElement("div");
		cl4.id = 'status-'+transacciones[i].id;
		cl4.classList.add("columna4");
		if (transacciones[i].status=='Por confirmar') {
			cl4.classList.add("rojo");
		} else {
			cl4.classList.add("negro");
		}
		cl4.appendChild(txtstatus);

		// Crear fila para la transacción
		fila = document.createElement("div");
		fila.id = 'fila-'+transacciones[i].id;
		fila.classList.add("fila");
		// Agregar la clase para definir el comportamiento del css
		if (par) {
			fila.classList.add("par");
			paroimpar = "par";
			par = false;
		} else {
			fila.classList.add("impar");
			paroimpar = "impar";
			par = true;
		}
		// Agregar las columnas a la fila
		fila.appendChild(cl1);
		fila.appendChild(cl2);
		fila.appendChild(cl3);
		fila.appendChild(cl4);

		if (transacciones[i].status=='Por confirmar') {
			fila.addEventListener("click", function() {
				if (confirm("¿Desea activar el pin pad para la confirmación manual?")) {
					window.open("./pinpad/index.html?id="+this.id.substr(5), "_blank");
				}
			});
		}

		// Agregar la fila a la tabla
		document.getElementById("transaccionespendientes").appendChild(fila);
	}
}

function mostrarQR(){
	if (confirm("Va a mostrar el código QR del comercio en otra ventana, ¿continuar?")) {
		window.open("./qr.html?idp="+idproveedor, "_blank");
	}

	// if (validaciones2()) {


	// 	modal_area.style.display = 'block';
	// 	var xmlhttp = new XMLHttpRequest();
	// 	xmlhttp.onreadystatechange = function() {
	// 		if (this.readyState == 4 && this.status == 200) {
	// 			respuesta = this.responseText;
	// 			mensaje_qr.style.display = 'none';
	// 			codigo_qr.src = 'https://app.cash-flag.com/php/'+respuesta;
	// 			codigo_qr.style.display = 'block';

	// 			document.addEventListener('click', cerrarqr);
	// 		}
	// 	};
	// 	xmlhttp.open("GET", "https://app.cash-flag.com/php/generaTxPDV.php?p="+idproveedor+"&d="+document.getElementById("divisa").value+"&m="+document.getElementById("monto").value, true);
	// 	xmlhttp.send();
	// }
}

function cerrarqr(e) {
	if (e.target.id=='modal_area') {
		modal_area.style.display = 'none';
	}
}

function scanearQR(){
	if (validaciones2()) {
		modal_lector();
		// window.location.replace('../lector/index.html?menu=comercio');
	}
}

function formacobro(opcion) {
	console.log(opcion);
	if (opcion=="qr") {
		div10_1.style.display = 'block';
		div10_2.style.display = 'none';
		btn_enviar.style.display = 'none';
	} else {
		div10_1.style.display = 'none';
		div10_2.style.display = 'flex';
		btn_enviar.style.display = 'block';
	}
}

function modal_lector() {
    beep = '../lector/audio/beep.mp3';
	scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

	scanner.addListener('scan', function (content) {
		respuesta = JSON.parse(content);
		console.log(respuesta);
		if (content) { 
			PlaySound(beep);
		}
		// window.location.replace(content);
		document.getElementById("tarjeta").value = respuesta.c;
		cerrar_lector();
		if (respuesta.m==document.getElementById("monto").value) {
			enviar();
		} else {
			alert("El monto del pago no coincide con el monto cobrado.");
		}
	});

	Instascan.Camera.getCameras().then(function (cameras) {
		back = 0;
		for (i=0; i< cameras.length; i++) {
			if (cameras[i].name.indexOf('back') >= 0) { back = i }
		}
		if (cameras.length > 0) {
			scanner.mirror = false;
			scanner.start(cameras[back]);
		} else {
			console.error('No cameras found.');
		}
	}).catch(function (e) {
		console.error(e);
	});
	cuerpo.style.overflow = "hidden";
	modal_area.style.display = 'block';
}

function PlaySound(sonido) {
	document.getElementById('beep').src = sonido;
	let sound = document.getElementById('beep');
	if (sound) { sound.play(); }
}

function cerrar_lector() {
	scanner.stop();
	cuerpo.style.overflow = "auto";
	modal_area.style.display = 'none';
	console.log('cerrarlector');
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// function cobro(formadecobro) {
// 	console.log(formadecobro);
// 	switch (formadecobro) {
// 		case 'manual':
// 			alert('manual');
// 			break;
// 	}
// }

//
// function exito_validaciones() {
// 	monedayformadepago = moneda+'-'+formadepago
// 	switch (monedayformadepago) {
// 		case 'bs-online':
// 			propiedades="top=20%, left=50%, width=450, height=635, menubar=0, resizable=0, status=0, titlebar=0, toolbar=0";
// 			window.open("https://app.cash-flag.com/php/formapagoenlinea.php?monto="+monto+"&ruta=giftcard&urlback="+sessionStorage.getItem("url_back")+"&hash="+respuesta.hash,"_blank",propiedades);
// 			// De ahi llamar a registro giftcard
// 			// Generar la tarjeta
// 			break;
// 		case 'bs-reporte':
// 			document.getElementById("monedas").style.display = 'none';
// 			document.getElementById("formulario").style.display = 'block';
// 			// De ahi llamar a registro giftcard
// 			// Generar la tarjeta
// 			break;
// 		case 'dolar-online':
// 			alert('entro en dolar online')
// 			// De ahi llamar a registro giftcard
// 			// Generar la tarjeta
// 			break;
// 		case 'dolar-reporte':
// 			alert('entro en dolar reporte')
// 			// De ahi llamar a registro giftcard
// 			// Generar la tarjeta
// 			break;
// 		}
// }
//
// function fallo_validaciones() { console.log('fallo'); }
//
// function botondepago(forma) {
// 	if (validaciones()) {
// 		formadepago = forma;
// 		abremodal2();
// 	}
// }
//
// function abremodal2() {
// 	document.getElementById("datospago").style.display = 'block';
//
// 	document.getElementById("btnescanearqr").style.display = 'inline-block';
// 	document.getElementById("btnpresentarqr").style.display = 'none';
// 	document.getElementById("btnpagmanual").style.display = 'none';
// }
//
// function formapago(frmpg) {
// 	tipo = frmpg;
// 	document.getElementById("origen").value = '';
// 	document.getElementById("referencia").value = '';
// 	switch (frmpg) {
// 		case 'efectivo':
// 			document.getElementById("detalle_pago").style.display = 'none';
// 			break;
// 		case 'tarjeta':
// 			document.getElementById("banco-punto").innerHTML = "Punto de venta";
// 			document.getElementById("detalle_pago").style.display = 'block';
// 			break;
// 		case 'transferencia':
// 			document.getElementById("banco-punto").innerHTML = "Banco de origen";
// 			document.getElementById("detalle_pago").style.display = 'block';
// 			break;
// 	}
// }
