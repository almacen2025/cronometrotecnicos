console.log("✅ Script cargado correctamente");

let inicio, intervalo;
let datos = [];
let cronometroActivo = false;
let segundosTotales = 0;

// Cargar datos guardados al iniciar
window.onload = function () {
  console.log("🔄 Cargando datos desde localStorage...");
  const guardados = localStorage.getItem("registros");
  if (guardados) {
    datos = JSON.parse(guardados);
    datos.forEach(registro => agregarFila(registro));
    console.log("✅ Datos cargados:", datos);
  }
};

function iniciar() {
  console.log("🟢 Botón 'Iniciar' presionado");

  if (cronometroActivo) {
    alert("El cronómetro ya está en marcha.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) {
    alert("Por favor selecciona un nombre.");
    return;
  }

  segundosTotales = 0;
  document.getElementById("cronometro").textContent = "00:00:00";
  inicio = new Date();
  cronometroActivo = true;
  intervalo = setInterval(actualizarCronometro, 1000);
  console.log("⏱️ Cronómetro iniciado");
}

function actualizarCronometro() {
  segundosTotales++;
  console.log("⏳ Tiempo transcurrido (segundos):", segundosTotales);

  const horas = Math.floor(segundosTotales / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;

  const formato = 
    String(horas).padStart(2, '0') + ':' +
    String(minutos).padStart(2, '0') + ':' +
    String(segundos).padStart(2, '0');

  const cronometro = document.getElementById('cronometro');
  cronometro.textContent = formato;

  if (segundosTotales >= 480) {
    cronometro.style.color = 'red';
  } else {
    cronometro.style.color = 'green';
  }
}

function detener() {
  console.log("🔴 Botón 'Detener' presionado");

  if (!cronometroActivo) {
    console.log("⚠️ El cronómetro no estaba activo");
    return;
  }

  clearInterval(intervalo);
  cronometroActivo = false;

  const select = document.getElementById("nombre");
  const nombre = select.value;
  const texto = select.options[select.selectedIndex].text;
  const legajo = texto.match(/\((.*?)\)/)?.[1] || "";

  const tiempo = document.getElementById("cronometro").textContent;
  const fecha = new Date().toLocaleString();
  const registro = { nombre, legajo, tiempo, fecha };

  datos.push(registro);
  localStorage.setItem("registros", JSON.stringify(datos));
  agregarFila(registro);
  enviarAGoogleSheets(registro);

  document.getElementById("cronometro").textContent = "00:00:00";
  select.selectedIndex = 0;
  console.log("✅ Registro guardado:", registro);
}


function agregarFila({ nombre, legajo, tiempo, fecha }) {
  const fila = document.createElement("tr");
  fila.innerHTML = `<td>${nombre}</td><td>${legajo}</td><td>${tiempo}</td><td>${fecha}</td>`;
  document.querySelector("#tabla tbody").appendChild(fila);
}

function descargarExcel() {
  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Registros");
  XLSX.writeFile(libro, "registros.xlsx");
}

function borrarDatos() {
  const confirmar = window.confirm("¿Estás seguro de que querés borrar todos los datos? Esta acción no se puede deshacer.");

  if (!confirmar) {
    return; // Si el usuario cancela, no se hace nada
  }

  // Limpiar la tabla
  const tabla = document.getElementById("tabla").getElementsByTagName("tbody")[0];
  tabla.innerHTML = "";

  // Reiniciar el cronómetro
  document.getElementById("cronometro").textContent = "00:00:00";
  document.getElementById("cronometro").style.color = "black";

  // Limpiar el array de datos
  datos = [];

  // Eliminar los datos del almacenamiento local
  localStorage.removeItem("registros");

  // Reiniciar el selector de nombre
  document.getElementById("nombre").selectedIndex = 0;

  // Detener el cronómetro si está activo
  if (cronometroActivo) {
    clearInterval(intervalo);
    cronometroActivo = false;
 }
} //   

function enviarAGoogleSheets(registro) {
  fetch("https://script.google.com/macros/s/AKfycbwStiGHasf2sS14Awwc8FwIzEt22l0ip3LWCb2Vj9c/exec", {
    method: "POST",
    body: JSON.stringify(registro),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (response.ok) {
      console.log("✅ Datos enviados correctamente");
      mostrarMensajeExito();
    } else {
      console.error("❌ Error en la respuesta del servidor");
      mostrarMensajeError();
    }
  })
  .catch(error => {
    console.error("❌ Error al enviar los datos:", error);
    mostrarMensajeError();
  });
}

    }
  })
  .then(response => {
    if (response.ok) {
      console.log("✅ Datos enviados correctamente");
      mostrarMensajeExito();
    } else {
      console.error("❌ Error en la respuesta del servidor");
      mostrarMensajeError();
    }
  })
  .catch(error => {
    console.error("❌ Error al enviar los datos:", error);
    mostrarMensajeError();
  });
}

function mostrarMensajeExito() {
  const mensaje = document.getElementById("mensaje-exito");
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000); // Oculta el mensaje después de 3 segundos
}
function mostrarMensajeError() {
  const mensaje = document.getElementById("mensaje-error");
  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 4000); // Oculta el mensaje después de 4 segundos
}


