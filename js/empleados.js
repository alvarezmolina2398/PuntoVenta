﻿$(function () {
    getempresa();
    //llamada a metodos necesarios para el sistema
    $(function () {
        mostrarColores();

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
            $('#MdNuevo').modal('toggle');
            document.getElementById('nombre').value = '';
            document.getElementById('correo').value = '';
            document.getElementById('depto').value = 0;
            document.getElementById('emp').value = 0;
        });


        $('.MdDes').click(function () {
        });

        $('#emp').change(function () {
            getdepto($(this).val());
        });

        //accion  para guardar los datos
        $('#bt-guardar').click(function () {
            var nombre = $('#nombre');
            var marca = $('#correo');
            var depto = $('#depto');
            var emp = $('#emp');
            var id = $('#id').val();

            if (nombre.val() != "" && marca.val() != 0 && depto.val() != 0 && emp.val() != 0) {

                if (id == 0) {
                    insertar(nombre.val(), marca.val(), depto.val(), emp.val());
                }
                else {
                    actualizar(nombre.val(), marca.val(), depto.val(), emp.val(), id);
                }

                $('#nombre').removeClass('is-invalid');
                $('#nombre').removeClass('is-valid');
                $('#correo').removeClass('is-invalid');
                $('#correo').removeClass('is-valid');
                $('#depto').removeClass('is-invalid');
                $('#depto').removeClass('is-valid');
                $('#emp').removeClass('is-invalid');
                $('#emp').removeClass('is-valid');

            }
            else {
                if (nombre.val() == "") {
                    nombre.addClass('is-invalid');
                    nombre.focus();
                }
                else {
                    alert(nombre.val());
                    nombre.addClass('is-valid');
                }

                if (marca.val() == 0) {

                    marca.addClass('is-invalid');
                    marca.focus();
                }
                else {

                    marca.addClass('is-valid');
                }
                if (depto.val() == 0) {

                    depto.addClass('is-invalid');
                    depto.focus();
                }
                else {

                    depto.addClass('is-valid');
                }

                if (emp.val() == 0) {

                    emp.addClass('is-invalid');
                    emp.focus();
                }
                else {

                    emp.addClass('is-valid');
                }
            }
            /* -- METODOS DE INSERTAR -- */
        })



        //accion  para guardar los datos
        $('#bt-cancelar').click(function () {
            $('#nombre').val("");
            $('#correo').val("");

            $('#nombre').removeClass('is-invalid');
            $('#nombre').removeClass('is-valid');

            $('#correo').removeClass('is-invalid');
            $('#correo').removeClass('is-valid');

            $('#depto').removeClass('is-invalid');
            $('#depto').removeClass('is-valid');

            $('#emp').removeClass('is-invalid');
            $('#emp').removeClass('is-valid');

        })


    });


    $('#btnDes').click(function () {
        var id = $('#ide').val();
        eliminar(id);
    });



});



// funcion para cargar datos en el formulario
function Editar(id, depto, empresa, nombre, correo) {
    $('#id').val(id);
    $('#nombre').val(nombre);
    $('#correo').val(correo);
    $('#depto').val(depto);
    $('#emp').val(empresa);
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

//metodo utilizado para insertar un vendedor
function insertar(nombre, marca, depto, emp) {
    $.ajax({
        type: 'POST',
        url: 'wsempleado.asmx/GuardarDatos',
        data: '{nombre:"' + nombre + '", correo : "' + marca + '", depto: ' + depto + ',  emp : ' + emp +'}',
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
                document.getElementById('correo').value = '';
                document.getElementById('depto').value = 0;
                document.getElementById('emp').value = 0;
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
                mostrarColores();
            }

        }
    });
}



//metodo utilizado para insertar un vendedor
function actualizar(nombre, marca, depto, emp, id) {
    $.ajax({
        type: 'POST',
        url: 'wsempleado.asmx/ActualizarDatos',
        data: '{nombre: "' + nombre + '", correo : "' + marca + '", depto: '+depto+', emp : '+ emp+', id: ' + id + ' }',
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
                document.getElementById('correo').value = '';
                document.getElementById('depto').value = 0;
                document.getElementById('emp').value = 0;
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
                mostrarColores();
            }

        }
    });
}

//metodo utilizado para insertar un vendedor
function eliminar(id) {
    $.ajax({
        type: 'POST',
        url: 'wsempleado.asmx/Eliminar',
        data: '{id: ' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#btnDes').removeClass('btn-success');
            $('#btnDes').addClass('btn-warning');
            $('#btnDes').html('<i class="material-icons">query_builder</i>Cargando...');
        },
        success: function correcto(msg) {

            var confirma = msg.d;
            if (confirma == true) {
                document.getElementById('id').value = '';
                $('#btnDes').attr('disabled', false);
                $('#MdDeshabilitar').modal('toggle');
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
                mostrarColores();
            }

        }
    });
}

//metodo utilizado para mostrar lista de datos 
function mostrarColores() {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsempleado.asmx/ObtenerDatos",
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
                tds = tds + '<td>' + this.correo + '</td>';
                tds = tds + '<td>' + this.emp + '</td>';
                tds = tds + '<td>' + this.depto + '</td>';
                tds = tds + '<td class="center">';
                tds = tds + "<button class='btn btn-sm btn-outline-info' onclick='Editar(" + this.id +","+this.iddepto+","+this.idempresa+",\"" + this.nombre + "\",\""  + this.correo + "\")' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' >";
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


//metodo utilizado para obtener el listado de marcas
function getdepto(id) {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsempleado.asmx/getDepto",
        data: '{emp : '+id +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.depto + '</option>';

            });

            $('#depto').append(tds);
        }
    });

} 


//metodo utilizado para obtener el listado de marcas
function getempresa() {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsempleado.asmx/getempresa",
        data: '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.depto + '</option>';

            });

            $('#emp').append(tds);
        }
    });

} 