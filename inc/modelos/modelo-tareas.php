<?php

    if(isset($_POST['accion'])) {
        $accion = $_POST['accion'];
    } else {
        $accion = "default";
    }

    if(isset($_POST['tarea'])) {
        $tarea = $_POST['tarea'];
    } else {
        $tarea = "default";
    }

    if(isset($_POST['id_proyecto'])) {
        $id_proyecto = (int) $_POST['id_proyecto'];
    } else {
        $id_proyecto = "default";
    }

    if(isset($_POST['estado'])) {
        $estado = (int) $_POST['estado'];
    } else {
        $estado = "default";
    }

    if(isset($_POST['id'])) {
        $id_tarea = (int) $_POST['id'];
    } else {
        $id_tarea = "default";
    }

    
    if($accion === 'crear') {
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //realizar la consulta a la base de datos
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
            $stmt->bind_param('si', $tarea, $id_proyecto);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion,
                    'tarea' => $tarea
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

    if($accion === 'actualizar') {
        //importar la conexion
        include '../funciones/conexion.php';

        try {
            //realizar la consulta a la base de datos
            $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ? ");
            $stmt->bind_param('ii', $estado, $id_tarea);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto'
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
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
            $stmt->bind_param('i', $id_tarea);
            $stmt->execute();
            if($stmt->affected_rows > 0){
                $respuesta = array(
                    'respuesta' => 'correcto'
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

    