eventListeners();
// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');
var listaTareas = document.querySelector('.listado-pendientes ul');

function eventListeners() {
    // Document Ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    });

    // botón para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // botón para borrar proyecto
    document.querySelector('.btnEliminarProyecto').addEventListener('click', borrarProyectoBD);

    // botón para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

// Crear un nuevo Proyecto
function nuevoProyecto(e) {
    e.preventDefault;
    
    // crea un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el ID con nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar enter crear el proyecto

    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;

        if(tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

// Guardar el proyecto en la base de datos
function guardarProyectoDB(nombreProyecto) {
    // Crear llamado AJAX
    var xhr = new XMLHttpRequest;

    // Enviar datos por FormData
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga
    xhr.onload = function() {
        if(this.status === 200) {
            // Obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText)
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;
            
            // Comprobar la inserción
            if(resultado === 'correcto') {
                // fue exitoso
                if(tipo === 'crear') {
                    // Se creó un nuevo proyecto
                    // Inyectar HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    // Agregar al HTML
                    listaProyectos.appendChild(nuevoProyecto);

                    // Enviar alerta
                    swal({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamente'
                    })
                    .then(resultado => {
                        // Redireccionar a la nueva URL
                        window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                    });

                    
                } else {
                    // Se actualizó o eliminó
                }
            } else {
                // hubo un error
                Swal.fire({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error'
                });
            }
        }
    };

    // Enviar el request
    xhr.send(datos);

    // Cerrar la conexión

}

// Borrar Proyecto de la BD
function borrarProyectoBD(e) {
    e.preventDefault();

    // Crear llamado AJAX
    var xhr = new XMLHttpRequest;

    // Enviar datos por FormData
    var datos = new FormData();
    var idProyecto = document.querySelector('.tituloProyecto').id;
    var nombreProyecto = document.querySelector('.tituloProyecto').textContent;
    datos.append('accion', 'eliminar');
    datos.append('id_proyecto', idProyecto);
    datos.append('nombre_proyecto_eliminar', nombreProyecto);

    // Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga
    xhr.onload = function() {
        if(this.status === 200) {
            // Obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var resultado = respuesta.respuesta;
            var proyecto = respuesta.nombre_proyecto_eliminar;
            
            // Comprobar la inserción
            if(resultado === 'correcto') {
                // Enviar alerta
                swal({
                    type: 'success',
                    title: 'Proyecto Eliminado',
                    text: 'El proyecto ' + proyecto + ' se eliminó correctamente'
                })
                .then(resultado => {
                    // Redireccionar a la nueva URL
                    window.location.href = 'index.php';
                });
            }
        }
    };

    // Enviar el request
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // validar que el campo tenga algo escrito
    if(nombreTarea === "") {
        swal({
           title: "Error",
           text: "Una tarea no puede ir vacía",
           type: "error" 
        });
    } else {
        // la tarea tiene algo, insertar en PHP
        // Crear llamado AJAX
        xhr = new XMLHttpRequest();

        // Crear FormData
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // Ejecutarlo y respuesta
        xhr.onload = function() {
            if(this.status === 200) {
                //todo correcto
                var respuesta = JSON.parse(xhr.responseText)
                
                //asignar valores
                var resultado = respuesta.respuesta,
                    id_tarea = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    tarea = respuesta.tarea;

                if(resultado === "correcto") {
                    // fue exitoso
                    if(tipo === "crear") {
                        swal({
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'Tarea: ' + tarea + ' creada con éxito'
                        });

                        // Construir el Template
                        var nuevaTarea = document.createElement('li');

                        // Agregamos el ID
                        nuevaTarea.id = 'tarea:' + id_tarea;

                        // Agregar la clase Tarea
                        nuevaTarea.classList.add('tarea');

                        // Insertar en el HTML
                        nuevaTarea.innerHTML = `
                            <p>
                                ${tarea}
                            </p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // Agregar al HTML
                        listaTareas.appendChild(nuevaTarea);

                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        // Borrar "no hay tareas" del DOM
                        var parrafoNoHayTareas = document.querySelectorAll('.listado-pendientes ul h3');
                        
                        if(parrafoNoHayTareas.length > 0) {
                            document.querySelector('.listado-pendientes ul h3').remove();
                        }

                        // Actualiza progreso de la barra
                        actualizarProgreso();
                    }
                }
                else {
                //hubo un error
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    });
                }
            }
        }
        // Enviar la consulta
        xhr.send(datos);
    }    
}

// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();
    
    if(e.target.classList.contains('fa-check-circle')) {
        if(e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    if(e.target.classList.contains('fa-trash')) {
        swal({
            title: '¿Estás seguro que deseas eliminarlo?',
            text: 'No será posible revertir el cambio',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085D6',
            cancelButtonColor: '#D33',
            confirmButtonText: 'Si, elimínalo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if(result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                
                // Borrar de la base de datos
                eliminarTareaBD(tareaEliminar);

                // Borrar del HTML
                tareaEliminar.remove();                

                swal(
                    'Listo!',
                    'Tu tarea ha sido eliminada.',
                    'success'
                );
            }
        });
    }
}

// Completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    
    // Crear llamado a AJAX
    var xhr = new XMLHttpRequest();

    // informacion
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    
    // Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // On load
    xhr.onload = function() {
        if(this.status === 200) {
            JSON.parse(xhr.responseText);
            // Actualiza progreso de la barra
            actualizarProgreso();
        }
    }

    // Enviar la peticion
    xhr.send(datos);
}

// Eliminar tarea de Base de Datos
function eliminarTareaBD(tarea) {
    var idTareaEliminar = tarea.id.split(':');

    // Crear llamado a AJAX
    var xhr = new XMLHttpRequest();

    // informacion
    var datos = new FormData();
    datos.append('id', idTareaEliminar[1]);
    datos.append('accion', 'eliminar');

    // Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // On load
    xhr.onload = function() {
        if(this.status === 200) {
            JSON.parse(xhr.responseText);

            // Comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');

            if(listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<h3>No hay tareas en este proyecto</h3>";
                document.querySelector('#porcentaje').style.width = 0;
            }

            // Actualiza progreso de la barra
            actualizarProgreso();
        }
    }

    // Enviar la peticion
    xhr.send(datos);
}

// Actualiza el avance del proyecto
function actualizarProgreso() {
    // Obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    // Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // Determinar el Avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    // Asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + "%";
}