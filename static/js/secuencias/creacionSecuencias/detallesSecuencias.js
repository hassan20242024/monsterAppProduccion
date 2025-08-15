// Función principal
function attachDetalleEvents() {
  document.querySelectorAll('.btn-detalles').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');

      try {
        const endpoint = button.getAttribute('data-endpoint') || '/crear_secuencias_en_curso/listado_secuencias_registradas';
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Error al obtener datos');

        const data = await res.json();
        const item = data.find(seq => seq.id === parseInt(id));
        if (!item) throw new Error('Secuencia no encontrada');

        currentEditingId = item.id;

        // Datos generales
        document.getElementById('modalNombre').textContent = item.nombre || '';

        const modalStatusSpan = document.getElementById('modalStatus');
        modalStatusSpan.textContent = item.status || '';
        modalStatusSpan.className = 'estado-dinamico badge rounded-pill ' + getBadgeClass(item.status || '');
        modalStatusSpan.dataset.id = item.id;
        modalStatusSpan.dataset.status = item.status || '';
        if (item.status === 'Auditada') modalStatusSpan.textContent += ' 🔒';

        document.getElementById('modalSistema').textContent = item.sistema || '';

        // Mostrar campos si tienen valor
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

        // Limpieza de valores "None"
        function limpiarNone(valor, reemplazo = 'No definido') {
          return (valor && valor !== 'None') ? valor : reemplazo;
        }

        document.getElementById('modalProtocolo').textContent = limpiarNone(item.protocolo);
        document.getElementById('modalMetodo').textContent = limpiarNone(item.metodo);
        document.getElementById('modalParametro').textContent = limpiarNone(item.parametro, 'No aplica');
        document.getElementById('modalProceso').textContent = limpiarNone(item.protocolo_proceso);

        // Sección responsables
        const responsablesSection = document.getElementById('responsablesSection');
        const validadaItem = document.getElementById('validadaItem');
        const impresaItem = document.getElementById('impresaItem');
        const reportadaItem = document.getElementById('reportadaItem');
        const auditadaItem = document.getElementById('auditadaItem');

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

        if (mostrarValidada || mostrarImpresa || mostrarReportada || mostrarAuditada) {
          responsablesSection.classList.remove('d-none');
        } else {
          responsablesSection.classList.add('d-none');
        }

        // Descripción dinámica
        const descripcionContenedor = document.getElementById('modalDescripcion');
        descripcionContenedor.innerHTML = '';

        const tieneProtocolo = item.protocolo && item.protocolo !== 'None';
        const tieneMetodoOProceso = (item.metodo && item.metodo !== 'None') || (item.protocolo_proceso && item.protocolo_proceso !== 'None');

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
        } else if (tieneMetodoOProceso && item.muestra_proceso) {
          const m = item.muestra_proceso;
          descripcionContenedor.innerHTML = `
            <div>
              <strong>${m.nombre || ''}</strong><br>
              Lote: ${m.lote || ''}<br>
              Código: ${m.codigo_producto || ''}<br>
              Etapa: ${m.etapa || ''}
            </div>
          `;
        } else {
          descripcionContenedor.innerHTML = '<span class="text-muted">No disponible</span>';
        }

        // Observaciones
        const observacionesTextarea = document.getElementById('modalObservaciones');
        observacionesTextarea.value = item.observaciones || '';

        // Mostrar modal
        const detalleModal = new bootstrap.Modal(document.getElementById('detalleModal'));
        detalleModal.show();

        // Evento para cambiar estado

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

// Helpers
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}

function getBadgeClass(status) {
  switch (status) {
    case 'Revisada': return 'bg-danger text-white';
    case 'Impresa': return 'bg-warning text-dark';
    case 'Reportada': return 'bg-success text-white';
    case 'Auditada': return 'bg-primary text-white';
    case 'Ensayo': return 'bg-info text-dark';
    case 'Registrada':
    case 'Invalida':
    default:
      return 'bg-secondary text-white';
  }
}

function buildEstadoSpan(item) {
  const locked = item.status === 'Auditada';
  const lockIcon = locked ? ' 🔒' : '';
  return `
    <span class="estado-dinamico badge rounded-pill ${getBadgeClass(item.status)}"
          data-id="${item.id}" data-status="${item.status}">
      ${item.status}${lockIcon}
    </span>`;
}
