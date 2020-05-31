﻿$(function () {

    //llamada a metodos necesarios para el sistema
    $(function () {
        mostrarMarcas();

        "use strict"
        $(document).ready(function () {
            $('#dataTables-example').DataTable({
                "order": [
                [1, "desc"]
            ]
            });
        });

        $('.Mdnew').click(function () {
            $('#id').val(0);
            $('#tipo').val(0);  
            $('#MdNuevo').modal('toggle');
            document.getElementById('nombre').value = '';
        });

        $('.MdDes').click(function () {
        });

        //accion  para guardar los datos
        $('#bt-guardar').click(function () {
            var nombre = $('#nombre');
            var id = $('#id').val();
            var tipo = $('#tipo');

            if (nombre.val() != "") {
                nombre.addClass('is-valid');

                if (id == 0) {
                    insertar(nombre.val(), tipo.val());
                }
                else {
                    actualizar(nombre.val(), id, tipo.val());
                }

                $('#nombre').removeClass('is-invalid');
                $('#nombre').removeClass('is-valid');
                $('#tipo').removeClass('is-invalid');
                $('#tipo').removeClass('is-valid');

            }
            else {
                nombre.addClass('is-invalid');
                nombre.focus();
            }
            /* -- METODOS DE INSERTAR -- */

        })
               
        //accion  para guardar los datos
        $('#bt-cancelar').click(function () {
            $('#nombre').val("");
            $('#nombre').removeClass('is-invalid');
            $('#nombre').removeClass('is-valid');

            $('#tipo').removeClass('is-invalid');
            $('#tipo').removeClass('is-valid');
        })
    });


    $('#btnDes').click(function () {
        var id = $('#ide').val();
        eliminar(id);
    });
});

// funcion para cargar datos en el formulario
function Editar(id, tipo, nombre) {
    $('#id').val(id);
    $('#nombre').val(nombre);
    $('#tipo').val(tipo);
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
    $('#MdNuevo').modal('toggle');
}

function des(id) {
    $('#ide').val(id);
    $('#MdDeshabilitar').modal('toggle')
}

//metodo utilizado para insertar un tipo de articulo
function insertar(nombre, tipo) {
    $.ajax({
        type: 'POST',
        url: 'wstipoarticulo.asmx/GuardarDatos',
        data: '{ nombre : "' + nombre + '", tipo :'+ tipo +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#bt-guardar').removeClass('btn-info');
            $('#bt-guardar').removeClass('btn-success');
            $('#bt-guardar').addClass('btn-warning');
            $('#bt-guardar').html('<i class="material-icons">query_builder</i>Cargando...')
        },
        success: function correcto(msg) {

            var confirma = msg.d;
            if (confirma == true) {
                document.getElementById('nombre').value = '';
                $('#tipo').val(0);
                $('#bt-guardar').attr('disabled', false);
                $('#MdNuevo').modal('toggle');
                $('#bt-guardar').removeClass('btn-warning');
                $('#bt-guardar').addClass('btn-success');
                $('#bt-guardar').html('<i class="material-icons">add</i> Guardar');
                $('#MdNuevo').modal('toggle');
                $.toast({
                    heading: 'EXITO!',
                    text: 'Datos ingresados exitosamente',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'success',
                    stack: false
                })
                mostrarMarcas();
            }

        }
    });
}

//metodo utilizado para actualizar un tipo de articulo
function actualizar(nombre, id, tipo) {
    $.ajax({
        type: 'POST',
        url: 'wstipoarticulo.asmx/ActualizarDatos',
        data: '{ nombre : "' + nombre + '", id: ' + id + ', tipo : '+tipo+' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#bt-guardar').removeClass('btn-info');
            $('#bt-guardar').removeClass('btn-success');
            $('#bt-guardar').addClass('btn-warning');
            $('#bt-guardar').html('<i class="material-icons">query_builder</i>Cargando...')
        },
        success: function correcto(msg) {
            var confirma = msg.d;
            if (confirma == true) {
                document.getElementById('nombre').value = '';
                $('#tipo').val(0);
                $('#bt-guardar').attr('disabled', false);
                $('#bt-cancelar').attr('disabled', false);
                $('#bt-guardar').removeClass('btn-warning');
                $('#bt-guardar').addClass('btn-success');
                $('#bt-guardar').html('<i class="material-icons">add</i> Guardar');
                $('#MdNuevo').modal('toggle');
                $.toast({
                    heading: 'Exito!',
                    text: 'Datos actualizados exitosamente',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'success',
                    stack: false
                })
                mostrarMarcas();
            }
        }
    });
}

//metodo utilizado para eliminar un tipo de articulo
function eliminar(id) {
    $.ajax({
        type: 'POST',
        url: 'wstipoarticulo.asmx/Eliminar',
        data: '{id: ' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#btnDes').removeClass('btn-success');
            $('#btnDes').addClass('btn-warning');
            $('#btnDes').html('<i class="material-icons">query_builder</i>Cargando...')
        },
        success: function correcto(msg) {

            var confirma = msg.d;
            if (confirma == true) {
                document.getElementById('id').value = '';
                $('#btnDes').attr('disabled', false);
                $('#btnDes').removeClass('btn-warning');
                $('#btnDes').addClass('btn-success');
                $('#btnDes').text("Si");
                $('#MdDeshabilitar').modal('toggle');
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: 'Listo!',
                    text: 'Datos Eliminados exitosamente',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'success',
                    stack: false
                })
                mostrarMarcas();
            }

        }
    });
}

//metodo utilizado para mostrar el listado de tipos de articulo 
function mostrarMarcas() {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wstipoarticulo.asmx/ObtenerDatos",
        data: '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.id + '</td>';
                tds = tds + '<td>' + this.nombre + '</td>';
                tds = tds + '<td class="center">';
                tds = tds + "<button class='btn btn-sm btn-outline-info' onclick='Editar(" + this.id +","+this.tipo+ ",\"" + this.nombre + "\")' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' >";
                tds = tds + '<i class="material-icons">edit</i> ';
                tds = tds + '</button>';
                tds = tds + "<button class='MdDes btn btn-sm btn-outline-danger' onclick='des(" + this.id + ")' data-toggle='tooltip' data-placement='bottom' title='Activo' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''><i class='material-icons'>delete_sweep</i></button>";
                tds = tds + '</td>';
                tds = tds + '</tr>';
            });


            $('[data-toggle="popover"]').popover();
            $('[data-toggle="tooltip"]').tooltip();
            $("#tbod-datos").append(tds);
            $('#tab-datos').dataTable();
        }

    });

}