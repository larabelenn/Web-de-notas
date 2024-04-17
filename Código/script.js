let notas = [];

function crearNota() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const categoria = document.getElementById('categoria').value || null;  // Asignar null si no se selecciona una categoría

    const nota = {
        id: Date.now(),
        titulo,
        descripcion,
        categoria,
        archivada: false
    };

    notas.unshift(nota);  // Agregar nota al inicio del array para que las más recientes aparezcan primero
    mostrarNotas();

    // Limpiar campos de título y descripción
    document.getElementById('titulo').value = '';
    document.getElementById('descripcion').value = '';
}

function mostrarNotas() {
    const notasActivasDiv = document.getElementById('notasActivas');
    const notasArchivadasDiv = document.getElementById('notasArchivadas');
    const filtroCategoria = document.getElementById('filtroCategoria').value;

    notasActivasDiv.innerHTML = '';
    notasArchivadasDiv.innerHTML = '';

    let notasFiltradasActivas;
    let notasFiltradasArchivadas;

    if (filtroCategoria === 'sin-categoria') {
        notasFiltradasActivas = notas.filter(nota => !nota.archivada && !nota.categoria);
        notasFiltradasArchivadas = notas.filter(nota => nota.archivada && !nota.categoria);
    } else {
        notasFiltradasActivas = notas.filter(nota => !nota.archivada && (filtroCategoria === 'todas' || nota.categoria === filtroCategoria || !filtroCategoria && !nota.categoria));
        notasFiltradasArchivadas = notas.filter(nota => nota.archivada && (filtroCategoria === 'todas' || nota.categoria === filtroCategoria || !filtroCategoria && !nota.categoria));
    }

    if (notasFiltradasActivas.length === 0) {
        notasActivasDiv.innerHTML = filtroCategoria === 'todas' ? '<p>¡Agrega una nota!</p>' : '<p>No existen notas con esa categoría.</p>';
    }

    if (notasFiltradasArchivadas.length === 0) {
        notasArchivadasDiv.style.display = 'none';  // Ocultar sección de notas archivadas si no hay notas
    } else {
        notasArchivadasDiv.style.display = 'block';  // Mostrar sección de notas archivadas si hay notas
    }

    notasFiltradasActivas.forEach((nota, index) => {
        const notaDiv = crearNotaDiv(nota, notasFiltradasActivas.length - index, 'activa');
        notasActivasDiv.appendChild(notaDiv);
    });

    notasFiltradasArchivadas.forEach((nota, index) => {
        const notaDiv = crearNotaDiv(nota, notasFiltradasArchivadas.length - index, 'archivada');
        notasArchivadasDiv.appendChild(notaDiv);
    });

    habilitarArrastrarYsoltar();
}

function crearNotaDiv(nota, index, tipo) {
    const notaDiv = document.createElement('div');
    notaDiv.className = 'note';
    notaDiv.setAttribute('data-id', nota.id);
    notaDiv.setAttribute('draggable', true);  // Hacer la nota arrastrable
    notaDiv.innerHTML = `
        <h3>${nota.titulo}</h3>
        <p>${nota.descripcion}</p>
        ${nota.categoria ? `<p>Categoría: ${nota.categoria}</p>` : ''}
        <button onclick="editarNota(${nota.id})" class="edit-btn">Editar</button>
        <button onclick="${nota.archivada ? 'desarchivarNota' : 'archivarNota'}(${nota.id})">${nota.archivada ? 'Desarchivar' : 'Archivar'}</button>
        <button onclick="eliminarNota(${nota.id})">Eliminar</button>
    `;

    const numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    numberDiv.textContent = index;

    notaDiv.appendChild(numberDiv);  // Añadir la numeración al final de la nota

    if (tipo === 'archivada') {
        numberDiv.classList.add('archived-number');
    }

    return notaDiv;
}

function habilitarArrastrarYsoltar() {
    const notasDivs = document.querySelectorAll('.note');

    notasDivs.forEach(notaDiv => {
        notaDiv.addEventListener('dragstart', dragStart);
        notaDiv.addEventListener('dragover', dragOver);
        notaDiv.addEventListener('drop', dragDrop);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(e) {
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.querySelector(`.note[data-id="${draggedId}"]`);
    const droppedElement = e.target.closest('.note');

    if (draggedElement && droppedElement) {
        const draggedIndex = notas.findIndex(n => n.id.toString() === draggedId);
        const droppedIndex = notas.findIndex(n => n.id.toString() === droppedElement.getAttribute('data-id'));

        // Reordenar el array de notas
        const [removed] = notas.splice(draggedIndex, 1);
        notas.splice(droppedIndex, 0, removed);

        mostrarNotas();
    }
}

function editarNota(id) {
    const nota = notas.find(n => n.id === id);
    document.getElementById('titulo').value = nota.titulo;
    document.getElementById('descripcion').value = nota.descripcion;

    eliminarNota(id);
}

function archivarNota(id) {
    const nota = notas.find(n => n.id === id);
    nota.archivada = true;

    const notaDiv = document.querySelector(`.note[data-id="${id}"]`);
    notaDiv.style.opacity = '0';
    setTimeout(() => {
        mostrarNotas();
    }, 300);
}


function desarchivarNota(id) {
    const nota = notas.find(n => n.id === id);
    nota.archivada = false;

    const notaDiv = document.querySelector(`.note[data-id="${id}"]`);
    notaDiv.style.opacity = '0';
    setTimeout(() => {
        mostrarNotas();
    }, 300);
}

function eliminarNota(id) {
    const notaDiv = document.querySelector(`.note[data-id="${id}"]`);
    notaDiv.style.opacity = '0';
    setTimeout(() => {
        notas = notas.filter(n => n.id !== id);
        mostrarNotas();
    }, 300);
}

function toggleArchivadas() {
    const notasArchivadasDiv = document.getElementById('notasArchivadas');
    const botonToggle = document.getElementById('toggleArchivadas');

    if (notasArchivadasDiv.style.display === 'none') {
        notasArchivadasDiv.style.display = 'block';
        botonToggle.textContent = 'Ocultar Archivadas';
    } else {
        notasArchivadasDiv.style.display = 'none';
        botonToggle.textContent = 'Mostrar Archivadas';
    }
}

function filtrarNotas() {
    mostrarNotas();
}

mostrarNotas();