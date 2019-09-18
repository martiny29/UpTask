<?php

    if(isset($_POST['accion'])) {
        $accion = $_POST['accion'];
    } else {
        $accion = "default";
    }

    if(isset($_POST['proyecto'])) {
        $proyecto = $_POST['proyecto'];
    } else {
        $proyecto = "default";
    }

    if(isset($_POST['id_proyecto'])) {
        $id_proyecto = $_POST['id_proyecto'];
    } else {
        $id_proyecto = 'default';
    }

    if(isset($_POST['nombre_proyecto_eliminar'])) {
        $nombre_proyecto_eliminar = $_POST['nombre_proyecto_eliminar'];
    } else {
        $nombre_proyecto_eliminar = 'default';
    }

    if($accion === 'crear') {
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
            $stmt->bind_param('s', $proyecto);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'nombre_proyecto' => $proyecto
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
                'error' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);

    }

    if($accion === 'eliminar') {
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //realizar la consulta a la base de datos
            $stmt = $conn->prepare("DELETE FROM proyectos WHERE id = ? ");
            $stmt->bind_param('i', $id_proyecto);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre_proyecto_eliminar' => $nombre_proyecto_eliminar
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
                'error' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }