let respuesta;

// Inicializa la aplicación
function inicio() {
	var paroimpar, idproveedor, xmlhttp = new XMLHttpRequest();
	idproveedor = sessionStorage.getItem("idproveedor");
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			transacciones = respuesta.transacciones;
			console.log(transacciones);
			// Rellena la lista de transacciones
			pintartransacciones();
			limpiar();
		}
	};
	xmlhttp.open("GET", "../https://app.cash-flag.com/php/transac_comercio.php?idproveedor="+idproveedor, true);
	xmlhttp.send();
	document.getElementById("btnvolver").addEventListener('click', function(){
		window.open(sessionStorage.getItem("url_bck2"), "_self") }
	);
}

// limpia el formulario
function limpiar() {
	var acciones = document.getElementsByTagName('input');
	for (var i = 0; i < acciones.length; i++) {
		acciones[i].checked = false;
	}
	if (acciones.length > 0) {
		acciones[0].focus();
	}
}

// Envía los datos del formulario
function accion(id) {
	let arr_accion = id.split ("-");
	let datos = new FormData();
	datos.append("accion",      arr_accion[0]);
	datos.append("tipocard",    arr_accion[1]);
	datos.append("transaccion", arr_accion[2]);

	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			respuesta = JSON.parse(this.responseText);
			if (respuesta.exito == 'SI') {
				alert(respuesta.mensaje);
				for (var i = transacciones.length-1; i >= 0; i--) {
					document.getElementById("tabla").removeChild(document.getElementById('fila-'+transacciones[i].id));
				}
				inicio();
				limpiar();
			}
		}
	};
	xmlhttp.open("POST", "../https://app.cash-flag.com/php/confirma_transaccion_comercio.php", true);
	xmlhttp.send(datos);
}

// Rellena la tabla
function pintartransacciones() {
	par = true;

	for (var i = 0; i < transacciones.length; i++) {
		// tipocard en la columna 1
		textotipo = transacciones[i].tipocard.substr(0,1).toUpperCase()+transacciones[i].tipocard.substr(1,100);
		txttipocard = document.createTextNode(textotipo);
		cl1 = document.createElement("div");
		cl1.classList.add("columna1");
		cl1.appendChild(txttipocard);

		// tipomoneda en la columna 2
		textomoneda = transacciones[i].tipomoneda.substr(0,1).toUpperCase()+transacciones[i].tipomoneda.substr(1,100);
		txttipomoneda = document.createTextNode(textomoneda);
		cl2 = document.createElement("div");
		cl2.classList.add("columna2");
		cl2.appendChild(txttipomoneda);

		// fecha en la columna 3
		fecha = transacciones[i].fecha.substr(8,2)+'/'+transacciones[i].fecha.substr(5,2)+'/'+transacciones[i].fecha.substr(0,4);
		txtfecha = document.createTextNode(fecha);
		cl3 = document.createElement("div");
		cl3.classList.add("columna3");
		cl3.appendChild(txtfecha);

		// monto en la columna 4
		txtmonto = document.createTextNode(formatNumber.new(transacciones[i].montobs+transacciones[i].montodolares));
		cl4 = document.createElement("div");
		cl4.classList.add("columna4");
		cl4.appendChild(txtmonto);

		// referencia en la columna 3
		txtorigen = document.createTextNode(transacciones[i].origen);
		cl5 = document.createElement("div");
		cl5.classList.add("columna5");
		cl5.appendChild(txtorigen);

		// referencia en la columna 3
		txtdocumento = document.createTextNode(transacciones[i].documento);
		cl6 = document.createElement("div");
		cl6.classList.add("columna3");
		cl6.appendChild(txtdocumento);

		// acciones en la columna 7
		// Confirmar
		txtconfirmar = document.createTextNode('Confirmar');
		btnconfirmar = document.createElement("button");
		btnconfirmar.classList.add("btnopciones");
		btnconfirmar.id = 'confirmar-'+transacciones[i].tipocard+'-'+transacciones[i].id;
		// Agregar evento click para cambiar el status
		btnconfirmar.addEventListener('click', function(){ accion(this.id) });
		btnconfirmar.appendChild(txtconfirmar);
		// Rechazar
		txtrechazar = document.createTextNode('Rechazar');
		btnrechazar = document.createElement("button");
		btnrechazar.classList.add("btnopciones");
		btnrechazar.id = 'rechazar-'+transacciones[i].tipocard+'-'+transacciones[i].id;
		// Agregar evento click para cambiar el status
		btnrechazar.addEventListener('click', function(){ accion(this.id) });
		btnrechazar.appendChild(txtrechazar);
		// Agregar objetos a la columna 5
		cl7 = document.createElement("div");
		cl7.classList.add("columna7");
		cl7.appendChild(btnconfirmar);
		cl7.appendChild(btnrechazar);

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
		fila.appendChild(cl5);
		fila.appendChild(cl6);
		fila.appendChild(cl7);

		// Agregar la fila a la tabla
		document.getElementById("tabla").appendChild(fila);
	}
}
