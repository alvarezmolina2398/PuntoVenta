﻿
var usuario = window.atob(getCookie("usErp"));

//llamada a metodos necesarios para el sistema
$(function () {
    //llamada a los datos para que se ejecuten al cargarse la pagina
    mostrarDatos();
    cargarCompanias();
    cargarSeries();
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    $('input[name="fecha"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        minYear: 1901
    }, function (start, end, label) { });

    "use strict"
    $(document).ready(function () {
        $('#dataTables-example').DataTable({
            "order": [
                [1, "desc"]
            ]
        });
    });

    $('.Mdnew').click(function () {
        $('#MdNuevo').modal('toggle')
    });


    $('#mdNew').click(function () {
        limpiar();
    });

    $('.MdDes').click(function () {
        $('#MdDeshabilitar').modal('toggle')
    });



    //accion  para guardar o actualizar los datos
    $('#bt-guardar').click(function () {
        $('#bt-guardar').attr('disabled', true);
        $('#bt-cancelar').attr('disabled', true);
        var company = $('#company');
        var serie = $('#serie');
        var establecimiento = $('#establecimiento');
        var inicio = $('#inicio');
        var final = $('#final');
        var actual = $('#actual');
        var autorizacion = $('#autorizacion');
        var fecha = $('#fecha');
        var fechavencimiento = $('#fechavencimiento');
        var caja = $('#caja');
        var doc = $('#doc');
        var id = $('#id').val();


        if (parseInt(inicio.val()) >= parseInt(final.val())) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "EL RANGO FINAL DE FACTURAS DEBE SER MAYOR AL INICIAL",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
            $('#bt-guardar').attr   ('disabled', false);
            $('#bt-cancelar').attr('disabled', false);
            final.val(null);
            final.focus();
            
        } 
        else if (parseInt(actual.val()) < parseInt(inicio.val())                                                                                                                                                                                                                                                           -1) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "EL RANGO FINAL DE FACTURAS DEBE SER MAYOR AL INICIAL",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
            $('#bt-guardar').attr('disabled', false);
            $('#bt-cancelar').attr('disabled', false);
            actual.val(null);
            actual.focus();

        }
        else if (!validarResolucion(autorizacion.val(),id)) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "YA EXCISTE ESTE NUMERO DE RESOLUCION",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
            $('#bt-guardar').attr('disabled', false);
            $('#bt-cancelar').attr('disabled', false);
            autorizacion.val(null);
            autorizacion.focus();
        }
        else if (!validarSerie(autorizacion.val(), id, company.val(), inicio.val(), final.val())) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "YA EXCISTE ESTA UNA SERIE CON ESTA RESOLUCION",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
            $('#bt-guardar').attr('disabled', false);
            $('#bt-cancelar').attr('disabled', false);
            serie.val(null);
            serie.focus();
        }
        else if (validarForm())
        {
            var data1 = '';
            var url1 = ''
            if (id != 0) {
                url1 = 'Actualizar'
                data1 = '{ serie : "' + serie.val() + '",  autorizacion : "' + autorizacion.val() + '",  empresa :  "' + company.val() + '",  inicio : ' + inicio.val() + ',  final : ' + final.val() + ',  fecha : "' + fecha.val() + '",fechavencimiento : "' + fechavencimiento.val() + '",  actual : ' + actual.val() + ',  doc : ' + doc.val() + ',  establecimiento: ' + establecimiento.val() + ', caja : ' + caja.val() + ', id: ' + id + ', user : "' + usuario +'", series: "'+ $('#serie option:selected').text() +'"}';
            } else {
                url1 = 'Insertar'
                data1 = '{ serie : "' + serie.val() + '",  autorizacion : "' + autorizacion.val() + '",  empresa :  "' + company.val() + '",  inicio : ' + inicio.val() + ',  final : ' + final.val() + ',  fecha : "' + fecha.val() + '",fechavencimiento : "' + fechavencimiento.val() + '",  actual : ' + actual.val() + ',  doc : ' + doc.val() + ',  establecimiento: ' + establecimiento.val() + ', caja : ' + caja.val() + ', user : "' + usuario + '", series: "' + $('#serie option:selected').text() +'"}';
            }

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsadmin_correlativos.asmx/' + url1,
                data: data1,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function () {
                    $('#bt-guardar').removeClass('btn-info');
                    $('#bt-guardar').removeClass('btn-success');
                    $('#bt-guardar').addClass('btn-warning');
                    $('#bt-guardar').html('<i class="material-icons">query_builder</i>Cargando...')
                },
                success: function (msg) {

                    var arr = msg.d.split('|');


                    if (arr[0] == 'SUCCESS') {
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡EXITO!',
                            text: arr[1],
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'success',
                            stack: false
                        });

                        $('#MdNuevo').modal('toggle');

                    } else {
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡ERROR!',
                            text: arr[1],
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'error',
                            stack: false
                        });
                    }

                    limpiar();
                    mostrarDatos();
                }
            });
        }
    })

    //obtiene el codigo actual
    $('#serie').change(function () {
        if ($('#id').val() == 0 || $('#id').val() == null || $('#id').val() == "") {
            $.ajax({
                url: 'wsadmin_correlativos.asmx/ObtenerSiguiente',
                data: '{correlativo : ' + $(this).val() + '}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $('#inicio').val(msg.d);
                    $('#actual').val(parseInt(msg.d)-1);
                }
            });
        }
       
    });


    //accion  al momento de acepatar elminar
    $('#bt-eliminar').click(function () {
        $('#bt-eliminar').attr('disabled', true);
        $('#bt-no').attr('disabled', true);


        var id = $('#id').val()
        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmin_correlativos.asmx/Inhabilitar',
            data: '{id : ' + id + ', usuario : "'+ usuario +'"}',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {
                $('#bt-eliminar').removeClass('btn-success');
                $('#bt-eliminar').addClass('btn-warning');
                $('#bt-eliminar').html('<i class="material-icons">query_builder</i>Cargando...')
            },
            success: function (msg) {

                var arr = msg.d.split('|');


                if (arr[0] == 'SUCCESS') {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡EXITO!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'success',
                        stack: false
                    });

                    $('#MdDeshabilitar').modal('toggle');

                } else {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }

                $('#bt-eliminar').removeAttr('disabled', true);
                $('#bt-no').removeAttr('disabled', true);

                $('#bt-eliminar').removeClass('btn-warning');
                $('#bt-eliminar').addClass('btn-success');
                $('#bt-eliminar').html('<i class="material-icons">done</i>Si')

                limpiar();
                mostrarDatos();

            }
        });

    });



    //accion  para guardar los datos
    $('#bt-cancelar').click(function () {
        limpiar();
    })


});


function validarForm() {
    var company = $('#company');
    var serie = $('#serie');
    var establecimiento = $('#establecimiento');
    var inicio = $('#inicio');
    var final = $('#final');
    var actual = $('#actual');
    var autorizacion = $('#autorizacion');
    var fecha = $('#fecha');
    var fechavencimiento = $('#fechavencimiento');
    var caja = $('#caja'); 
    var doc = $('#doc');
    company.removeClass('is-invalid');
    company.removeClass('is-valid');

    serie.removeClass('is-invalid');
    serie.removeClass('is-valid');

    fecha.removeClass('is-invalid');
    fecha.removeClass('is-valid');

    fechavencimiento.removeClass('is-invalid');
    fechavencimiento.removeClass('is-valid');

    establecimiento.removeClass('is-invalid');
    establecimiento.removeClass('is-valid');

    inicio.removeClass('is-invalid');
    inicio.removeClass('is-valid');

    final.removeClass('is-invalid');
    final.removeClass('is-valid');

    actual.removeClass('is-invalid');
    actual.removeClass('is-valid');

    autorizacion.removeClass('is-invalid');
    autorizacion.removeClass('is-valid');

    fecha.removeClass('is-invalid');
    fecha.removeClass('is-valid');

    caja.removeClass('is-invalid');
    caja.removeClass('is-valid');

    doc.removeClass('is-invalid');
    doc.removeClass('is-valid');

    var result = true

    if (establecimiento.val() == "") {
        establecimiento.addClass('is-invalid');
        establecimiento.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        establecimiento.addClass('is-valid');
    }

    if (inicio.val() == "") {
        inicio.addClass('is-invalid');
        inicio.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        inicio.addClass('is-valid');
    }

    if (final.val() == "") {
        final.addClass('is-invalid');
        final.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        final.addClass('is-valid');
    }

    if (actual.val() == "") {
        actual.addClass('is-invalid');
        actual.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        actual.addClass('is-valid');
    }

    if (autorizacion.val() == "") {
        autorizacion.addClass('is-invalid');
        autorizacion.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        autorizacion.addClass('is-valid');
    }

    if (fecha.val() == "") {
        fecha.addClass('is-invalid');
        fecha.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        fecha.addClass('is-valid');
    }


    if (fechavencimiento.val() == "") {
        fechavencimiento.addClass('is-invalid');
        fechavencimiento.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        fechavencimiento.addClass('is-valid');
    }

    if (caja.val() == "") {
        caja.addClass('is-invalid');
        caja.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        caja.addClass('is-valid');
    }

    if (doc.val() == 0) {
        doc.addClass('is-invalid');
        doc.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        doc.addClass('is-valid');
    }


    if (company.val() == 0) {
        company.addClass('is-invalid');
        company.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });


        result = false;
    } else {
        company.addClass('is-valid');
    }

    if (serie.val() == 0) {
        serie.addClass('is-invalid');
        serie.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });

        result = false;
    } else {
        serie.addClass('is-valid');
    }

    return result;

}

function validarResolucion(resolucion, id) {
    var result = false;
    $.ajax({
        url: 'wsvalidaciones.asmx/validarResolucion',
        data: '{resolucion: "' + resolucion + '", id: '+ id +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (msg) {
            result = msg.d
        }
    });

    return result
}

function validarSerie(resolucion, id,company,del,al) {
    var result = false;
    $.ajax({
        url: 'wsvalidaciones.asmx/validarResolucion',
        data: '{resolucion: "' + resolucion + '", id: ' + id + ', company: '+ company +', del: '+ del +', al: '+ al +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (msg) {
            result = msg.d
        }
    });

    return result
}


//metodo para limpiar el formulario
function limpiar() {

    $('#company').val(0);
    $('#serie').val(0);
    $('#id').val(0);
    $('#establecimiento').val(null);
    $('#inicio').val(null);
    $('#final').val(null);
    $('#actual').val(null);
    $('#autorizacion').val(null);
    $('#serie').attr('disabled', false);
    $("#fecha").val(null);
    $("#fechavencimiento").val(null);
    $('#caja').val(null); 
    $('#doc').val(0);
    $('#company').removeClass('is-invalid');
    $('#company').removeClass('is-valid');


    $('#establecimiento').removeClass('is-invalid is-valid');
    $('#inicio').removeClass('is-invalid is-valid');
    $('#final').removeClass('is-invalid is-valid');
    $('#actual').removeClass('is-invalid is-valid');
    $('#autorizacion').removeClass('is-invalid is-valid');
    $('#fecha').removeClass('is-invalid is-valid');
    $('#fechavencimiento').removeClass('is-invalid is-valid');
    $('#caja').removeClass('is-invalid is-valid');
    $('#doc').removeClass('is-invalid is-valid');


    $('#serie').removeClass('is-invalid');
    $('#serie').removeClass('is-valid');
    $('#bt-guardar').removeAttr('disabled', true);
    $('#bt-cancelar').removeAttr('disabled', true);
    $('#bt-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#bt-guardar').removeClass('btn-info');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-success');
}


// funcion para cargar datos en el formulario
function cargarenFormulario(id, serie, company, inicio, final, Autorizacion, fecha, establecimiento, Doc, caja, actual, fechavencimiento) {
    limpiar();
    $('#id').val(id);
    $('#serie').val(serie);
    $('#company').val(company);
    $('#inicio').val(inicio);
    $('#final').val(final);
    $('#autorizacion').val(Autorizacion);
    $('#fecha').val(fecha);
    $('#establecimiento').val(establecimiento);
    $('#doc').val(Doc);
    $('#caja').val(caja);
    $('#actual').val(actual);

    if (parseInt(actual) == parseInt(final)) {
        $('#final').attr('disabled', true);
    } else {
        $('#final').attr('disabled', false);
    }

    $.ajax({
        url: 'wsvalidaciones.asmx/validarSerieExisteCorrelativo',
        data: '{serie: ' + serie +', final: '+final+'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (msg) {
            result = msg.d

            $('#final').attr('disabled', result);
        }
    });


    $('#fechavencimiento').val(fechavencimiento);
    $('#MdNuevo').modal('toggle')
    $('#serie').attr('disabled', true);
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
}


// funcion para cargar datos en el formulario
function eliminar(id) {
    limpiar();
    $('#id').val(id);
    $('#MdDeshabilitar').modal('toggle');
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
}



//metodo utilizado para mostrar lista de datos 
function mostrarDatos() {
    limpiar();


    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_correlativos.asmx/ObtenerDatos',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            var i = 1;
            var tds = "";
            $('#tbod-datos').html(null);
            $.each(msg.d, function () {
                tds = "<tr class='odd'><td>" + i + "</td><td>" + this.empresa + "</td><td>" + this.descripcion + "</td><td>" + this.inicio + "</td><td>" + this.final + "</td><td>" + this.Doc_desc + "</td><td> " + 
                    "<span onclick='cargarenFormulario(" + this.id + "," + this.id_serie + "," + this.idempresa + "," + this.inicio + "," + this.final + ", \"" + this.Autorizacion + "\",\"" + this.fecha + "\"," + this.establecimiento + "," + this.Doc + "," + this.caja + ", " + this.actual + ",\"" + this.fechavencimiento + "\")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' > " +
                    "<i class='material-icons'>edit</i> " +
                    "</span> " +
                    "<span onclick='eliminar(" + this.id + ")' class='btn btn-sm btn-outline-danger' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''> " +
                    "<i class='material-icons'> delete_sweep </i> " +
                    "</span></td></tr>'"
                i++;

                $("#tbod-datos").append(tds);
            });

            $('#tab-datos').dataTable();
            $('[data-toggle="popover"]').popover();
        }
    });

};

//funcion para cargar las companias
function cargarCompanias() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_empresas.asmx/ObtenerDatos',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#company').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

function cargarSeries() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarSeries',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#serie').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}


//metodo para obtener la sesion
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



