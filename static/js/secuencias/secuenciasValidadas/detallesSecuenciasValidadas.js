function attachDetalleEvents() {

  document.querySelectorAll('.btn-detalles').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      try {
        const res = await fetch('./listado_secuencias_validadas');
        if (!res.ok) throw new Error('Error al obtener datos');
        const data = await res.json();
        const item = data.find(seq => seq.id === parseInt(id));
        if (!item) throw new Error('Secuencia no encontrada');

        currentEditingId = item.id;

        document.getElementById('modalNombreInput').value = item.nombre || '';
        const modalStatusSpan = document.getElementById('modalStatus');
        modalStatusSpan.textContent = item.status || '';
        modalStatusSpan.className = 'estado-dinamico badge rounded-pill ' + getBadgeClass(item.status || '');
        modalStatusSpan.dataset.id = item.id;
        modalStatusSpan.dataset.status = item.status || '';
        if(item.status === 'Auditada') modalStatusSpan.textContent += ' 🔒';

await cargarOpcionesSistema(item.sistema); // usa el nombre directamente

function mostrarCampo(valor, idGrupo, idSpan) {
  const grupo = document.getElementById(idGrupo);
  const span = document.getElementById(idSpan);
  if (valor && valor !== 'None') {
    span.textContent = valor;
    grupo.style.display = '';
  } else {
    grupo.style.display = 'none';
  }
}
mostrarCampo(item.protocolo, 'grupoProtocolo', 'modalProtocolo');
mostrarCampo(item.metodo, 'grupoMetodo', 'modalMetodo');
mostrarCampo(item.parametro, 'grupoParametro', 'modalParametro');
mostrarCampo(item.protocolo_proceso, 'grupoProceso', 'modalProceso');

        
document.getElementById('modalProtocolo').textContent =
  item.protocolo && item.protocolo !== 'None' ? item.protocolo : 'No definido';

document.getElementById('modalMetodo').textContent =
  item.metodo && item.metodo !== 'None' ? item.metodo : 'No definido';

document.getElementById('modalParametro').textContent =
  item.parametro && item.parametro !== 'None' ? item.parametro : 'No aplica';

  document.getElementById('modalProceso').textContent =
  item.protocolo_proceso && item.protocolo_proceso !== 'None'
    ? item.protocolo_proceso
    : 'No definido';


    function limpiarNone(valor, reemplazo = 'No definido') {
  return (valor && valor !== 'None') ? valor : reemplazo;
}
document.getElementById('modalProtocolo').textContent = limpiarNone(item.protocolo);
document.getElementById('modalMetodo').textContent = limpiarNone(item.metodo);
document.getElementById('modalParametro').textContent = limpiarNone(item.parametro, 'No aplica');
document.getElementById('modalProceso').textContent = limpiarNone(item.protocolo_proceso);



// Mostrar sección de responsables solo si alguno tiene valor válido
const responsablesSection = document.getElementById('responsablesSection');

// Obtener referencias a cada fila
const validadaItem = document.getElementById('validadaItem');
const impresaItem = document.getElementById('impresaItem');
const reportadaItem = document.getElementById('reportadaItem');
const auditadaItem = document.getElementById('auditadaItem');

// Asignar valores si existen y mostrar/ocultar cada ítem
function setResponsable(usuarioKey, fechaKey, el, labelId) {
  const usuario = item[usuarioKey];
  const fecha = item[fechaKey];

  if (usuario && usuario !== 'None') {
    let fechaFormateada = '';
    if (fecha && fecha !== 'None') {
      const fechaObj = new Date(fecha);
      const dia = String(fechaObj.getDate()).padStart(2, '0');
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const anio = fechaObj.getFullYear();
      const hora = String(fechaObj.getHours()).padStart(2, '0');
      const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
      
      // Formato: Año/Mes/Día
      fechaFormateada = ` el ${anio}/${mes}/${dia} ${hora}:${minutos}`;
    }

    document.getElementById(labelId).textContent = `${usuario}${fechaFormateada}`;
    el.style.display = 'list-item';
    return true;
  } else {
    el.style.display = 'none';
    return false;
  }
}

const mostrarValidada = setResponsable('validada_por', 'fecha_validacion', validadaItem, 'modalValidadaPor');
const mostrarImpresa = setResponsable('impresa_por', 'fecha_impresion', impresaItem, 'modalImpresaPor');
const mostrarReportada = setResponsable('reportada_por', 'fecha_reporte', reportadaItem, 'modalReportadaPor');
const mostrarAuditada = setResponsable('auditada_por', 'fecha_auditoria', auditadaItem, 'modalAuditadaPor');

// Mostrar u ocultar toda la sección
if (mostrarValidada || mostrarImpresa || mostrarReportada || mostrarAuditada) {
  responsablesSection.classList.remove('d-none');
} else {
  responsablesSection.classList.add('d-none');
}


const descripcionContenedor = document.getElementById('modalDescripcion');
descripcionContenedor.innerHTML = '';

const tieneProtocolo = item.protocolo && item.protocolo !== 'None';
const tieneMetodoOProceso = (item.metodo && item.metodo !== 'None') || (item.protocolo_proceso && item.protocolo_proceso !== 'None');

// Caso 1: Mostrar descripción si hay protocolo
if (tieneProtocolo && Array.isArray(item.descripcion)) {
  const html = item.descripcion.map(d => `
    <div class="mb-2 border-bottom pb-1">
      <strong>${d[0]}</strong><br>
      Lote: ${d[1]}<br>
      Código: ${d[2]}<br>
      Etiqueta: ${d[3]}
    </div>
  `).join('');
  descripcionContenedor.innerHTML = html;
}
// Caso 2: Mostrar muestra_proceso si hay metodo o protocolo_proceso
else if (tieneMetodoOProceso && item.muestra_proceso) {
  const m = item.muestra_proceso;
  descripcionContenedor.innerHTML = `
    <div>
      <strong>${m.nombre || ''}</strong><br>
      Lote: ${m.lote || ''}<br>
      Código: ${m.codigo_producto || ''}<br>
      Etapa: ${m.etapa || ''}
    </div>
  `;
}
// Valor por defecto
else {
  descripcionContenedor.innerHTML = '<span class="text-muted">No disponible</span>';
}

        const observacionesTextarea = document.getElementById('modalObservaciones');
        observacionesTextarea.value = item.observaciones || '';

        const btnGuardar = document.getElementById('btnGuardarCambios');

        // Aquí la condición para hacer readonly y ocultar botón si está Auditada
const nombreInput = document.getElementById('modalNombreInput');
const sistemaInput = document.getElementById('modalSistemaInput');

if (item.status === 'Auditada') {
  observacionesTextarea.setAttribute('readonly', true);
  nombreInput.setAttribute('readonly', true);
  sistemaInput.disabled = true;  // ✅ solución correcta
  btnGuardar.style.display = 'none';
} else {
  observacionesTextarea.removeAttribute('readonly');
  nombreInput.removeAttribute('readonly');
  sistemaInput.disabled = false;  // ✅ solución correcta
  btnGuardar.style.display = 'inline-block';
}


//Fiuncion Api Listado Sietmas
async function cargarOpcionesSistema(nombreSistema = null) {
  const select = document.getElementById('modalSistemaInput');
  select.innerHTML = '<option value="">Seleccione un sistema</option>';

  try {
    const res = await fetch('/listado_sistemas');
    const data = await res.json();
    const sistemas = data.sistemas;

    sistemas.forEach(sistema => {
      const option = document.createElement('option');
      option.value = sistema.id;
      option.textContent = sistema.nombre;

      // Preseleccionar si el nombre coincide
      if (nombreSistema && sistema.nombre === nombreSistema) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando sistemas:', error);
  }
}
        // Mostrar modal
        const detalleModal = new bootstrap.Modal(document.getElementById('detalleModal'));
        detalleModal.show();

        // Evento para cambiar status dentro del modal sin alerta
        modalStatusSpan.addEventListener('click', function modalStatusClickHandler(e) {
          e.stopPropagation();

          const status = this.dataset.status;
          if (['Revisada', 'Impresa', 'Reportada'].includes(status)) {
            const nuevoStatus = 'Ensayo';
            this.textContent = nuevoStatus;
            this.className = 'estado-dinamico badge rounded-pill ' + getBadgeClass(nuevoStatus);
            this.dataset.status = nuevoStatus;
            this.removeEventListener('click', modalStatusClickHandler);
          }
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error cargando detalles',
          text: error.message,
        });
      }
    });
  });
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}
