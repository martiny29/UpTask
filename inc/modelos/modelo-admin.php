<?php
    $accion = $_POST['accion'];
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    if($accion === 'crear') {
        //código para crear los administradores

        //hashear passwords
        $opciones = array(
            'cost' => 12
        );
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
            $stmt->bind_param('ss', $usuario, $hash_password);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (\Exception $e) {
            //En caso de un error tomar la excepcion
            $respuesta = array(
                'pass' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);

    }

    if($accion === 'login') {
        //código para loguear a los admin
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //Seleccionar el administrador de la base de datos
            $stmt = $conn->prepare("SELECT id, usuario, password FROM usuarios WHERE usuario = ? ");
            $stmt->bind_param("s", $usuario);
            $stmt->execute();
            //Loguear el usuario
            $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
            $stmt->fetch();
            if($nombre_usuario) {
                //El usuario existe, verificar el password
                if(password_verify($password, $pass_usuario)) {
                    //iniciar la sesión
                    session_start();
                    $_SESSION['nombre'] = $nombre_usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    //Login correcto
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                    );
                } else {
                    //Login incorrecto, cartel de error
                    $respuesta = array(
                        'resultado' => 'Password incorrecto'
                    );
                }
            } else {
                $respuesta = array(
                    'error' => 'Usuario no existe'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (\Exception $e) {
            //En caso de un error tomar la excepcion
            $respuesta = array(
                'pass' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }
?>