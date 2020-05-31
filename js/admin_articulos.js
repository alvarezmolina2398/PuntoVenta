﻿$(function () {
    $('#miselaneo').prop('checked', false);
    $('#costo').attr('disabled', false);
    var user = window.atob(getCookie("usErp"));
    mostrarDatos();
    cargarMarcas();
    cargarClasificacion();
    cargarColores();
    cargarTipo();

    $('#mdNew').click(function () {
        limpiar();
        $('#requiereProduccion').attr('disabled', false);
        $('#costo').attr('disabled', false);
    });

    //accion  al momento de acepatar elminar
    $('#bt-eliminar').click(function () {
        $('#bt-eliminar').attr('disabled', true);
        $('#bt-no').attr('disabled', true);
        var id = $('#id').val()
        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmin_articulos.asmx/Inhabilitar',
            data: '{id: ' + id + '}',
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

    //accion para cargar las regiones al cambiar de agencia
    $('#marca').change(function () {
        $('#submarca').html('<option value="0">Seleccione Una Opción</option>');

        if ($(this).val() != 0) {

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wscargar_datos.asmx/cargarSubMarcasporMarc',
                data: '{marca: ' + $(this).val() + '}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $.each(msg.d, function () {
                        $('#submarca').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
                    });
                }
            });

        }
    });

    //accion para cargar las sucursales al cambiar de region
    $('#clasificacion').change(function () {
        $('#sub-clasificacion').html('<option value="0">Seleccione Una Opción</option>');

        if ($(this).val() != 0) {
            //consume el ws para obtener los datos
            $.ajax({
                url: 'wscargar_datos.asmx/cargarSubClasificacionAtr',
                data: '{art: ' + $(this).val() + '}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $.each(msg.d, function () {
                        $('#sub-clasificacion').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
                    });
                }
            });

        }


    });


    //accion  para guardar o actualizar los datos
    $('#bt-guardar').click(function () {
        $('#bt-guardar').attr('disabled', true);
        $('#bt-cancelar').attr('disabled', true);
        var codigo = $('#codigo');
        var descripcion = $('#descripcion');
        var tipo = $('#tipo');
        var codigo1 = $('#codigo1');
        var codigo2 = $('#codigo2');
        var marca = $('#marca');
        var submarca = $('#submarca');
        var clasificacion = $('#clasificacion');
        var subclasificacion = $('#sub-clasificacion');
        var color = $('#color');
        var preciogt = $('#preciogt');
        var precioes = 0
        var precio3 = 0;
        var costo = $('#costo');
        var requiereProduccion = 0;
        var codigobarras = 0;
        var miselaneo = 0;
        if ($('#descargarCodigo').prop('checked')) {
            codigobarras = 1;
        }

        if ($('#requiereProduccion').prop('checked')) {
            requiereProduccion = 1;
        }

        if ($('#miselaneo').prop('checked')) {
            miselaneo = 1;
        }

        var id = $('#id').val();

        if ($('#precioes').val() != 0) {
            precioes = $('#precioes').val();
        }

        if ($('#precio3').val() != 0) {
            precio3 = $('#precio3').val();
        }

        if (validarForm()) {
            var data1 = '';
            var url1 = ''
            if (id != 0) {
                url1 = 'Actualizar'
                data1 = '{ descripcion : "' + descripcion.val() + '",  codigo : "' + codigo.val() + '",  tipo : ' + tipo.val() + ',  cod_pro1 : "' + codigo1.val() + '",  cod_pro2 : "' + codigo2.val() + '",  marca : ' + marca.val() + ', idsubmarca : ' + 1 + ',  id_clasi : ' + 1 + ',  id_subclasi : ' + 1 + ',  idcolor : ' + 1 + ',  preciogt : "' + preciogt.val() + '",  precioEs : ' + 0 + ', costo : ' + costo.val() + ',  usuario : "' + user + '", id : ' + id + ', precio3: ' + 0 + ', requiereProduccion : ' + requiereProduccion + ', codigobarras: ' + codigobarras + ', miselaneo: ' + miselaneo + '}';
            } else {
                url1 = 'Insertar'
                data1 = '{ descripcion : "' + descripcion.val() + '",  codigo : "' + codigo.val() + '",  tipo : ' + tipo.val() + ',  cod_pro1 : "' + codigo1.val() + '",  cod_pro2 : "' + codigo2.val() + '",  marca : ' + marca.val() + ', idsubmarca : ' + 1 + ',  id_clasi : ' + 1 + ',  id_subclasi : ' + 1 + ',  idcolor : ' + 1 + ',  preciogt : "' + preciogt.val() + '",  precioEs : ' + 0 + ', costo : ' + costo.val() + ',  usuario : "' + user + '", precio3: ' + 0 + ', requiereProduccion : ' + requiereProduccion + ', codigobarras: ' + codigobarras + ', miselaneo: ' + miselaneo + '}';
            }

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsadmin_articulos.asmx/' + url1,
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

                        if (codigobarras == 1) {
                            if (UrlExists(arr[2])) {
                                window.open(arr[2], '_blank');
                            } else {
                                $('.jq-toast-wrap').remove();
                                $.toast({
                                    heading: '¡ERROR!',
                                    text: 'ERROR AL GENERAR EL CODIGO DE BARRAS',
                                    position: 'bottom-right',
                                    showHideTransition: 'plain',
                                    icon: 'error',
                                    stack: false
                                });
                            }
                        }

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


    //accion  para cancelar los datos
    $('#bt-cancelar').click(function () {
        limpiar();
    });

    $('#btn-agregar').click(function () {
        var principal = 0;

        if ($('#imgPrincipal').prop('checked')) {
            principal = 1;
        }

        var img = '';


        var fileToLoad1 = $('#file')[0].files[0];
        var fileReader1 = new FileReader();
        fileReader1.readAsDataURL(fileToLoad1);
        fileReader1.onload = function (fileLoadedEvent1) {
        img = fileLoadedEvent1.target.result; // <--- data: base64


            $.ajax({
                url: 'wsadmin_articulos.asmx/AgregarImagen',
                data: '{img: "' + img + '", principal: ' + principal + ', id_art: ' + $('#imgID').val() + '}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
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

                        $('#file').val('');
                        $('#imgPrincipal').prop('checked', false);
                        MostrarCatalogo($('#imgID').val());

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

                    
                }
            });
           
        }

    });

});

//funcion para cargar las de
function cargarMarcas() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarMarcas',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#marca').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

//funcion para cargar las de
function cargarClasificacion() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarClasificacion',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#clasificacion').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}


//funcion para cargar las de
function cargarColores() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarColores',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#color').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

//funcion para cargar las de
function cargarTipo() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarTipo',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#tipo').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}




function validarForm() {
    var codigo = $('#codigo');
    var descripcion = $('#descripcion');
    var tipo = $('#tipo');
    var marca = $('#marca');
    var submarca = $('#submarca');
    var clasificacion = $('#clasificacion');
    var sub_clasificacion = $('#sub-clasificacion');
    var color = $('#color');
    var preciogt = $('#preciogt');
    var costo = $('#costo');


    codigo.removeClass('is-invalid');
    codigo.removeClass('is-valid');

    descripcion.removeClass('is-invalid');
    descripcion.removeClass('is-valid');


    tipo.removeClass('is-invalid');
    tipo.removeClass('is-valid');

    marca.removeClass('is-invalid');
    marca.removeClass('is-valid');

    submarca.removeClass('is-invalid');
    submarca.removeClass('is-valid');

    clasificacion.removeClass('is-invalid');
    clasificacion.removeClass('is-valid');

    sub_clasificacion.removeClass('is-invalid');
    sub_clasificacion.removeClass('is-valid');

    color.removeClass('is-invalid');
    color.removeClass('is-valid');

    preciogt.removeClass('is-invalid');
    preciogt.removeClass('is-valid');


    costo.removeClass('is-invalid');
    costo.removeClass('is-valid');

    var result = true
    if (codigo.val() == "") {
        codigo.addClass('is-invalid');
        codigo.focus();
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
        codigo.addClass('is-valid');
    }


    if (descripcion.val() == "") {
        descripcion.addClass('is-invalid');
        descripcion.focus();
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
        descripcion.addClass('is-valid');
    }

    if (tipo.val() == 0 || !tipo.val()) {
        tipo.addClass('is-invalid');
        tipo.focus();
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
        tipo.addClass('is-valid');
    }


    if (marca.val() == 0 || !marca.val()) {
        marca.addClass('is-invalid');
        marca.focus();
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
        marca.addClass('is-valid');
    }


    //if (submarca.val() == 0 || !submarca.val()) {
    //    submarca.addClass('is-invalid');
    //    submarca.focus();
    //    $('#bt-guardar').removeAttr('disabled', true);
    //    $('#bt-cancelar').removeAttr('disabled', true);
    //    $('.jq-toast-wrap').remove();
    //    $.toast({
    //        heading: 'ADVERTENCIA',
    //        text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
    //        position: 'bottom-right',
    //        showHideTransition: 'plain',
    //        icon: 'warning',
    //        stack: false
    //    });


    //    result = false;
    //} else {
    //    submarca.addClass('is-valid');
    //}


    //if (clasificacion.val() == 0 || !clasificacion.val()) {
    //    clasificacion.addClass('is-invalid');
    //    clasificacion.focus();
    //    $('#bt-guardar').removeAttr('disabled', true);
    //    $('#bt-cancelar').removeAttr('disabled', true);
    //    $('.jq-toast-wrap').remove();
    //    $.toast({
    //        heading: 'ADVERTENCIA',
    //        text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
    //        position: 'bottom-right',
    //        showHideTransition: 'plain',
    //        icon: 'warning',
    //        stack: false
    //    });


    //    result = false;
    //} else {
    //    clasificacion.addClass('is-valid');
    //}



    //if (sub_clasificacion.val() == 0 || !sub_clasificacion.val()) {
    //    sub_clasificacion.addClass('is-invalid');
    //    sub_clasificacion.focus();
    //    $('#bt-guardar').removeAttr('disabled', true);
    //    $('#bt-cancelar').removeAttr('disabled', true);
    //    $('.jq-toast-wrap').remove();
    //    $.toast({
    //        heading: 'ADVERTENCIA',
    //        text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
    //        position: 'bottom-right',
    //        showHideTransition: 'plain',
    //        icon: 'warning',
    //        stack: false
    //    });


    //    result = false;
    //} else {
    //    sub_clasificacion.addClass('is-valid');
    //}

    //if (color.val() == 0 || !color.val()) {
    //    color.addClass('is-invalid');
    //    color.focus();
    //    $('#bt-guardar').removeAttr('disabled', true);
    //    $('#bt-cancelar').removeAttr('disabled', true);
    //    $('.jq-toast-wrap').remove();
    //    $.toast({
    //        heading: 'ADVERTENCIA',
    //        text: 'Existen Datos que debe ingresar para poder realizar la acción solicitada',
    //        position: 'bottom-right',
    //        showHideTransition: 'plain',
    //        icon: 'warning',
    //        stack: false
    //    });


    //    result = false;
    //} else {
    //    color.addClass('is-valid');
    //}

   

    if (preciogt.val() == "") {
        preciogt.addClass('is-invalid');
        preciogt.focus();
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
        preciogt.addClass('is-valid');
    }

    if (costo.val() == "") {
        costo.addClass('is-invalid');
        costo.focus();
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
        costo.addClass('is-valid');
    }

    
    return result;

}

//metodo para limpiar el formulario
function limpiar() {
    $('#company').val(0);
    $('#descripcion').val(null);
    $('#sucursal').html('<option value="0">Seleccione Una Opción</option>');
    $('#observacion').val(null);
    $('#region').html('<option value="0">Seleccione Una Opción</option>');
    $('#id').val(0);

    $('#requiereProduccion').prop("checked",false);  
    $('#descargarCodigo').prop('checked', false);     
    $('#codigo').val(null);
    $('#descripcion').val(null);
    $('#tipo').val(0);
    $('#codigo1').val(null);
    $('#codigo2').val(null);
    $('#marca').val(0);
    $('#submarca').val('<option value="0">Seleccione Una Opción</option>');
    $('#clasificacion').val(0);
    $('#sub-clasificacion').val('<option value="0">Seleccione Una Opción</option>');
    $('#color').val(0);
    $('#preciogt').val(0);
    $('#precioes').val(0);
    $('#precio3').val(0);
    $('#costo').val(null);

    $('#miselaneo').prop('checked', false);
    var codigo = $('#codigo');
    var descripcion = $('#descripcion');
    var tipo = $('#tipo');
    var marca = $('#marca');
    var submarca = $('#submarca');
    var clasificacion = $('#clasificacion');
    var sub_clasificacion = $('#sub-clasificacion');
    var color = $('#color');
    var preciogt = $('#preciogt');
    var costo = $('#costo');


    codigo.removeClass('is-invalid');
    codigo.removeClass('is-valid');

    descripcion.removeClass('is-invalid');
    descripcion.removeClass('is-valid');


    tipo.removeClass('is-invalid');
    tipo.removeClass('is-valid');

    marca.removeClass('is-invalid');
    marca.removeClass('is-valid');

    submarca.removeClass('is-invalid');
    submarca.removeClass('is-valid');

    clasificacion.removeClass('is-invalid');
    clasificacion.removeClass('is-valid');

    sub_clasificacion.removeClass('is-invalid');
    sub_clasificacion.removeClass('is-valid');

    color.removeClass('is-invalid');
    color.removeClass('is-valid');

    preciogt.removeClass('is-invalid');
    preciogt.removeClass('is-valid');


    costo.removeClass('is-invalid');
    costo.removeClass('is-valid');

    $('#bt-guardar').removeAttr('disabled', true);
    $('#bt-cancelar').removeAttr('disabled', true);
    $('#bt-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#bt-guardar').removeClass('btn-info');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-success');
}

// funcion para cargar datos en el formulario
function cargarenFormulario(id, descripcion, codigo, codigo1, codigo2, idcolor, idmarca, tipo, idclasificacion, preciogt, precioes, costo, idsubclasificacion, idsubmarca, precio3, producir, miselaneo) {
    limpiar();
    $('#id').val(id);
    $('#descripcion').val(descripcion);

    $('#region').html('<option value="0">Seleccione Una Opción</option>');
    $('#sucursal').html('<option value="0">Seleccione Una Opción</option>');

    $('#codigo').val(codigo);
    $('#descripcion').val(descripcion);
    $('#tipo').val(tipo);
    $('#codigo1').val(codigo1);
    $('#codigo2').val(codigo2);
    $('#marca').val(idmarca);
    $('#submarca').html('<option value="0">Seleccione Una Opción</option>');
    $('#clasificacion').val(idclasificacion);
    $('#sub-clasificacion').html('<option value="0">Seleccione Una Opción</option>');
    $('#color').val(idcolor);
    $('#preciogt').val(preciogt);
    $('#precioes').val(precioes);
    $('#precio3').val(precio3);
    $('#costo').val(costo);
    $('#costo').attr('disabled', true);
    $('#requiereProduccion').attr('disabled', true);
    $('#requiereProduccion').prop("checked", false);  

    if (producir == 1) {
        $('#requiereProduccion').prop("checked", true);  
    } else {
        $('#requiereProduccion').prop("checked", false);  
    }


    if (miselaneo == 1) {
        $('#miselaneo').prop("checked", true);
    } else {
        $('#miselaneo').prop("checked", false);  
    }

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarSubClasificacionAtr',
        data: '{art: ' + idclasificacion + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                $('#sub-clasificacion').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
            $('#sub-clasificacion').val(idsubclasificacion);
        }
    });

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarSubMarcasporMarc',
        data: '{marca: ' + idmarca + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                $('#submarca').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
            $('#submarca').val(idsubmarca);
        }
    });




    $('#MdNuevo').modal('toggle')

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
        url: 'wsadmin_articulos.asmx/ObtenerDatos',
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
                tds = "<tr class='odd'><td>" + i + "</td><td>" + this.codigo + "</td><td>" + this.descripcion + "</td><td>" + this.color + "</td><td>" + this.precioGt + "</td><td> " +
                    "<span onclick='cargarenFormulario(" + this.id + ",\"" + this.descripcion + "\",\"" + this.codigo + "\",\"" + this.codigo1 + "\",\"" + this.codigo2 + "\"," + this.idcolor + "," + this.idmarca + "," + this.tipo + "," + this.idclasificacion + ", " + this.precioGt + ", " + this.precioEs + "," + this.costo + ", " + this.id_Subclasificacion + "," + this.idsubmarca + "," + this.precio3 + "," + this.producir +","+this.miselaneo+")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' > " +
                    "<i class='material-icons'>edit</i> " +
                    "</span> " +
                    "<span onclick='ImgAdm(" + this.id + ")' class='btn btn-sm btn-outline-success' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar una imagen al articulo.' data-original-title='' title=''> " +
                    "<i class='material-icons'> collections </i> " +
                    "</span> " +
                    "<span onclick='eliminar(" + this.id + ")' class='btn btn-sm btn-outline-danger' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''> " +
                    "<i class='material-icons'> delete_sweep </i> " +
                    "</span>" +
                    "</td></tr>'"
                i++;

                $("#tbod-datos").append(tds);
            });

            $('#tab-datos').dataTable();
            $('[data-toggle="popover"]').popover();
        }
    });

};



function ImgAdm(id) {
    $('#file').val(''); 
    $('#MdImage').modal('show');
    $('#imgPrincipal').prop('checked', false);
    $('#imgID').val(id);
    MostrarCatalogo(id);
}





// funcion para cargar datos en el formulario
function eliminar(id) {
    limpiar();
    $('#id').val(id);
    //muestra la modal de confirmacion
    $('#MdDeshabilitar').modal('toggle');

    //cambia los botones
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
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

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
} 


function MostrarCatalogo(id) {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_articulos.asmx/MostrarCatalogo',
        data: '{id: '+ id +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            var i = 1;
            $('#list-img').html(null);
            $.each(msg.d, function () {
                var img2 = '';
                if (this.img == '') {
                    img2 = ' data:image/png;base64,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'
                } else {
                    img2 = this.img;
                }
                var principal = '<p>&nbsp;</p>';
                var btnPrincipal = '';
                if (this.principal == 1) {
                    principal = '<p class="text-right badge badge-primary text-wrap">img Principal</p>';
                    btnPrincipal = '';
                } else {
                    btnPrincipal = '<button type="button" class="btn btn-outline-success" onclick="volvprincipal(' + this.id + ')">PRINCIPAL</button> |';
                    principal = '<p>&nbsp;</p>';
                }





                var card = '<div class="col-4 col-md-4 col-lg-4">' +
                                '<div class="card mb-4" >' +
                                    ' <div class="blog-header-img">' +
                                    ' <img  class="" src="'+ img2 +'" alt="IMAGEN NO ENCONTRADA">' +
                                    ' </div> ' +
                                ' <div class="card-body">' +
                                    principal +
                                '  </div>' +
                                '<div class="card-footer border-top no-gutters content-color-secondary small"><center>' +
                    btnPrincipal + '  <button type="button" class="btn btn-outline-danger" onclick="eliminarImg(' + this.id +')">ELIMINAR</button></center>' +
                               '  </div> ' +
                            '  </div>' +
                        ' </div >';



                $('#list-img').append(card);
                i++;
            });

            
        }
    });
}

function volvprincipal(id) {
    $.ajax({
        url: 'wsadmin_articulos.asmx/ActualizarPrincipal',
        data: '{id_img : ' + id + ', id_art: ' + $('#imgID').val() +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
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
                MostrarCatalogo($('#imgID').val());

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
        }
    });
}

function eliminarImg(id) {
    $.ajax({
        url: 'wsadmin_articulos.asmx/EliminarImagen',
        data: '{id_img : ' + id + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
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
                MostrarCatalogo($('#imgID').val());

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
        }
    });
}