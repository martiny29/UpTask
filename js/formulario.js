eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    const usuario = document.querySelector('#usuario').value,
          password = document.querySelector('#password').value,
          tipo = document.querySelector('#tipo').value;

    if(usuario === "" || password === "") {
        //la validación falló
        Swal.fire({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios'
        });
    } else {
        //ambos campos son correctos, llamar a ajax

        //datos que se envian al servidor
        const datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //crear el llamado a Ajax
        const xhr = new XMLHttpRequest();

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        //retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {
                const respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                
                
                //si la respuesta es correcta
                if(respuesta.respuesta === 'correcto') {
                    //si es un nuevo usuario
                    if(respuesta.tipo === 'crear'){
                        Swal.fire({
                            type: 'success',
                            title: 'Usuario Creado',
                            text: 'El usuario se creó correctamente'
                        })
                        .then(resultado => {
                            if(resultado.value) {
                                window.location.href = 'login.php';
                            }
                        })
                    } else if(respuesta.tipo === 'login') {
                        Swal.fire({
                            type: 'success',
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard'
                        })
                        .then(resultado => {
                            if(resultado.value) {
                                window.location.href = 'index.php';
                            }
                        })
                    }
                } else {
                    //hubo un error
                    Swal.fire({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        //enviar los datos
        xhr.send(datos);
    }
}
