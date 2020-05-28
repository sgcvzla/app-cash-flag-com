let idproveedor="";
// , ficha='';
let datos = new FormData();
let beep = '../lector/audio/beep.mp3';
let scanner = "";
// const mysocket = new WebSocket("ws://demos.kaazing.com/echo");

idproveedor = (idproveedor==undefined) ? 2 : idproveedor;

// valida la entrada en los campos
function validaciones2() {
	let continuar = true, nocontinuar = false, vacios = 0, campo = "";
	if (document.getElementById("monto").value=="" || document.getElementById("divisa").value==undefined) {
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
	// mysocket.send(document.getElementById("tarjeta").value+' monto: '+document.getElementById("monto").value);
	datos.append("idproveedor", idproveedor);
	datos.append("monto", document.getElementById("monto").value);
	datos.append("tarjeta", tarjeta);

	console.log(idproveedor);
	console.log(document.getElementById("monto").value);
	console.log(tarjeta);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			if (respuesta.exito == 'SI') {
				alert(fmensaje(respuesta.mensaje));
				limpiar();
			} else {
				alert(respuesta.mensaje);
			}
		}
	};
	xmlhttp.open("POST", "https://app.cash-flag.com/php/enviacobrocard.php", true);
	xmlhttp.send(datos);
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
		idproveedor = respuesta.idp;
		cerrar_lector();
		enviar();
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
	modal_area2.style.display = 'block';
}

function PlaySound(sonido) {
	document.getElementById('beep').src = sonido;
	let sound = document.getElementById('beep');
	if (sound) { sound.play(); }
}

function cerrar_lector() {
	scanner.stop();
	cuerpo.style.overflow = "auto";
	modal_area2.style.display = 'none';
	console.log('cerrarlector');
}
