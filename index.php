<?php
    include 'inc/funciones/sesiones.php';
    include 'inc/funciones/funciones.php';
    include 'inc/templates/header.php';
    include 'inc/templates/barra.php';

    //Obtener ID de la URL
    $id_proyecto = '';
    if(isset($_GET['id_proyecto'])) {
        $id_proyecto = $_GET['id_proyecto'];
    }
?>

<div class="contenedor">
    <?php 
        include 'inc/templates/sidebar.php';
    ?>

    <main class="contenido-principal">
        <?php 
            $proyecto = obtenerNombreProyecto($id_proyecto);

            if($proyecto) {
        ?>
                <h1 id="<?php echo $id_proyecto; ?>" class="tituloProyecto">
                    <?php
                        foreach($proyecto as $nombre) { ?>
                            <span><?php echo $nombre['nombre'];?></span>
                    <?php } //endforeach ?>
                </h1>

                <form action="#" class="agregar-tarea">
                    <div class="campo">
                        <label for="tarea">Tarea:</label>
                        <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                    </div>
                    <div class="campo enviar">
                        <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                        <input type="submit" class="boton nueva-tarea" value="Agregar">
                    </div>
                </form>

                <div class="avance">
                    <h2>Avance del proyecto: </h2>
                    <div id="barra-avance" class="barra-avance">
                        <div id="porcentaje" class="porcentaje">
                            
                        </div>
                    </div>
                </div>

                <h2 id="listadoDeTareasTitulo">Listado de tareas:</h2>
        <?php 
            } else {
                echo "<h2 id='tituloPantallaInicial'>Selecciona un proyecto a la izquierda</h2>";
            } // endif $proyecto
        ?>
        
        <?php if($proyecto) { ?>
            <div class="listado-pendientes">
                <ul>
                    <?php
                        $tareas = '';
                        if(isset($_GET['id_proyecto'])) {
                            $tareas = obtenerTareas($_GET['id_proyecto']);
                        }
                        if($tareas) {
                            if($tareas->num_rows > 0) {
                                foreach($tareas as $tarea) { ?>
                                    <li id="tarea:<?php echo $tarea['id']; ?>" class="tarea">
                                        <p><?php echo $tarea['nombre'];?></p>
                                        <div class="acciones">
                                            <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : ''); ?>"></i>
                                            <i class="fas fa-trash"></i>
                                        </div>
                                    </li> 
                                <?php } 
                            } else {
                                echo "<h3>No hay tareas en este proyecto</h3>";
                            }
                        }
                    ?>
                </ul>
            </div>

        
            <button type="submit" class="btnEliminarProyecto">Eliminar proyecto</button>
        <?php } ?>

        
    </main>
</div><!--.contenedor-->

<?php
    include 'inc/templates/footer.php';
?>
