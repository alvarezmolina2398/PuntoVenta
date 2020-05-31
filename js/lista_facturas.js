'use strict'
$(window).on('load', function () {
    $('.fecha').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        minYear: 1901
    }, function (start, end, label) { });
});

var usuario = window.atob(getCookie("usErp"));
var datos = [];
$(function () {
    mostrarDatos();
   
    //accion  al momento de acepatar elminar
    $('#bt-eliminar').click(function () {
        $('#bt-eliminar').attr('disabled', true);
        $('#bt-no').attr('disabled', true);
        var id = $('#id').val()
        //consume el ws para obtener los datos
        $.ajax({
            url: 'wscotizacion.asmx/Inhabilitar',
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
                mostrarDatos();

            }
        });
    });


    $('#bt-consultar').click(function () {
        mostrarDatos();
    });


    //anula la factura
    $('#bt-anular').click(function () {

        var observacion = $('#observaciones_anular').val();

        if (observacion != "") {
            $.ajax({
                url: 'wslista_facturas.asmx/AnularFactura',
                data: '{id : ' + $('#id').val() + ', observacion: "' + observacion + '", usuario: "' + usuario + '"}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {

                    var arr = msg.d.split('|');


                    if (arr[0] == 'SUCCESS') {

                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡INFORMACION!',
                            text: arr[1],
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'info',
                            stack: false
                        });

                        $('#MdAnularFac').modal('toggle');
                        $('#observaciones_anular').val(null);
                        mostrarDatos();
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
        } else {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "DEBE INGRESAR LAS OBSERVACIONES",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
            $('#observaciones_anular').focus();
        }
        
    });

    //nota de credito
    $('#bt-notacredito').click(function () {

        var observacion = $('#observaciones_nota').val();


        if (observacion != "") {
            $.ajax({
                url: 'wslista_facturas.asmx/RealizarNotaCredito',
                data: '{id : ' + $('#id-nota').val() + ', observacion: "' + observacion + '", usuario: "' + usuario + '", listproductos: ' + JSON.stringify(datos) +',tipo: '+ $('#tipoNota').val() +', esabono: '+ $('#esabono').val() +'}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {

                    var arr = msg.d.split('|');


                    if (arr[0] == 'SUCCESS') {

                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡INFORMACION!',
                            text: arr[1],
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'info',
                            stack: false
                        });

                        $('#MdNotaCredito').modal('toggle');
                        $('#observaciones_nota').val(null);
                        mostrarDatos();

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
                        $('#observaciones_nota').focus();
                    }
                }
            });
        } else {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "DEBE INGRESAR LAS OBSERVACIONES",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }

    });


    //nota de credito
    $('#bt-nota-debito').click(function () {

        var observacion = $('#observaciones_nota_debito').val();


        if (observacion != "" || $('#valorDebito').val() == '') {
            $.ajax({
                url: 'wslista_facturas.asmx/NotaDebito',
                data: '{id : ' + $('#id-nota-debito').val() + ', observacion: "' + observacion + '", usuario: "' + usuario + '",tipo: ' + $('#tipoNotaDebito').val() + ',valor: ' + $('#valorDebito').val() +'}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {

                    var arr = msg.d.split('|');


                    if (arr[0] == 'SUCCESS') {

                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡INFORMACION!',
                            text: arr[1],
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'info',
                            stack: false
                        });

                        $('#MdNotaDebito').modal('toggle');
                        $('#observaciones_nota_debito').val(null);
                        $('#tipoNotaDebito').val(1);
                        $('#valorDebito').val(null);
                        mostrarDatos();

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
                        $('#observaciones_nota_debito').focus();
                    }
                }
            });
        } else {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "DEBE INGRESAR LAS OBSERVACIONES",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }

    });


    $('#tipoNota').change(function () {
        $('#tb-detallep').html(null);
        datos = [];
        var tipo = $(this).val();
        if ( tipo != 0) {
            $.ajax({
                url: 'wslista_facturas.asmx/obtenerDetalle',
                type: 'POST',
                data: '{id: ' + $('#id-nota').val() + '}',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    var i = 0;
                    $('#tb-detallep').html(null);
                    datos = [];
                    var result = false;
                    $.each(msg.d, function () {
                        if (this.cantidad > 0) {
                            if (tipo == 2) {
                                var linea = { 'cantidad': this.cantidad, 'codigo': this.codigo, 'descripcion': this.descripcion, 'id': this.id, 'precio': this.precio, 'bodega': this.bodega, 'bo': this.bo, 'iddetalle': this.iddetalle, 'descuento': 0 };
                                datos.push(linea);
                                var tot = parseFloat(this.precio) * parseFloat(this.cantidad);
                                var tds = '<tr><td>' + this.codigo + '</td><td>' + this.descripcion + '</td><td>' + this.bo + '</td><td>' + this.precio + '</td><td><input type="text" class="form-control" value="' + this.cantidad + '" onblur="cargarcantidadDesc($(this).val(),' + this.cantidad + ',' + i + ')"/></td><td>' + tot.toFixed(2) + '</td><td>N/A</td><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
                                $('#tb-detallep').append(tds);
                            } else if (tipo == 1) {
                                var linea = { 'cantidad': this.cantidad, 'codigo': this.codigo, 'descripcion': this.descripcion, 'id': this.id, 'precio': this.precio, 'bodega': this.bodega, 'bo': this.bo, 'iddetalle': this.iddetalle, 'descuento': 0, 'descuentotot': this.descuentotot };
                                datos.push(linea);
                                var tot = (parseFloat(this.precio) * parseFloat(this.cantidad)) - parseFloat(this.descuentotot);
                                var tds = '<tr><td>' + this.codigo + '</td><td>' + this.descripcion + '</td><td>' + this.bo + '</td><td>' + this.precio + '</td><td>' + this.cantidad + '</td><td>' + tot.toFixed(2) + '</td><td><input type="text" class="form-control" value="' + 0 + '" onblur="cargarPrecioDesc($(this).val(),' + this.precio + ',' + i + ',' + parseFloat(this.descuentotot) + ')"/></td><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
                                $('#tb-detallep').append(tds);
                            } else if (tipo == 3) {
                                var linea = { 'cantidad': this.cantidad, 'codigo': this.codigo, 'descripcion': this.descripcion, 'id': this.id, 'precio': this.precio, 'bodega': this.bodega, 'bo': this.bo, 'iddetalle': this.iddetalle, 'descuento': 0 };
                                datos.push(linea);
                                var tot = parseFloat(this.precio) * parseFloat(this.cantidad);
                                var tds = '<tr><td>' + this.codigo + '</td><td>' + this.descripcion + '</td><td>' + this.bo + '</td><td>' + this.precio + '</td><td>' + this.cantidad + '</td><td>' + tot.toFixed(2) + '</td><td>N/A</td><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
                                $('#tb-detallep').append(tds);
                            }

                             result = true;

                            i++;
                        }


                        if (result) {
                            $('#bt-notacredito').show();
                        } else {
                            $('#bt-notacredito').hide();
                        }
                        
                    });
                }
            });
        }
    });

});


function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}


function detalle(id, descuento) {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscotizacion.asmx/obtenerListProductos',
        data: '{cotizacion: ' + id + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {

        },
        success: function (msg) {
            var tds = "";
            var total = 0;
            $('#tbod-datos-detalle').html(null);
            $.each(msg.d, function () {
                total += this.precio * this.cantidad;
                tds = "<tr class='odd'><td>" + this.cantidad + "</td><td>" + this.codigo + "</td>><td>" + this.descripcion + "</td><td>" + this.bo + "</td><td>" + (this.precio).toFixed(2) + "</td><td>" + (this.precio * this.cantidad).toFixed(2) + "</td></tr>'"
                $("#tbod-datos-detalle").append(tds);
            });


            tds = "<tr class='odd'><td>--</td><td>--</td>><td><center><b>DESCUENTO</b></center></td><td>--</td><td>--</td><td><b>" + descuento.toFixed(2) + "</b></td></tr>'" +
                "<tr class='odd'><td>--</td><td>--</td>><td><center><b>TOTAL</b></center></td><td>--</td><td>--</td><td><b>" + (total - descuento).toFixed(2) + "</b></td></tr>'"
            $("#tbod-datos-detalle").append(tds);
        }
    });

    $('#Mddetalle').modal('toggle');
}

//metodo utilizado para mostrar lista de datos 
function mostrarDatos() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wslista_facturas.asmx/ObtenerFacturas',
        data: '{fechainicio : "' + $('#fechainicio').val() + '", fechafin : "' + $('#fechafin').val() + '"}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            var tds = "";
            $('#tbod-datos').html(null);
            $.each(msg.d, function () {
                tds = "<tr class='odd'><td>" + this.nit + "</td><td>" + this.cliete + "</td><td>" + this.factura + "</td><td>" + this.fecha + "</td><td>" + this.usuario + "</td><td>" + this.total + "</td><td> " +
                    "<span onclick='reimpimir(" + this.id + ")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder reimprimir la factura.' data-original-title='' title ='' ><i class='material-icons'>print</i></span> " +
                    "<span style='margin-left: 5px' onclick='eliminar(" + this.id + ",\"" + this.fecha + "\",\"" + this.nit + "\")'  class='btn btn-sm btn-outline-danger' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cancelar una factura' data-original-title='' title=''> <i class='material-icons'> delete_sweep </i></span>" +
                    "<span style='margin-left: 5px' onclick='notacredito(" + this.id + ",\"" + this.fecha + "\",\"" + this.nit + "\")'  class='btn btn-sm btn-outline-warning' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para Realizar Una Nota de Credito o una Nota de Abono' data-original-title='' title=''> <i class='material-icons'>remove_circle_outline</i></span>" +
                    "<span style='margin-left: 5px' onclick='notadebito(" + this.id + ")'  class='btn btn-sm btn-outline-success' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para Generar Una Nota de Debito' data-original-title='' title=''> <i class='material-icons'>receipt</i></span>" +
                    "</td></tr>'"


                $("#tbod-datos").append(tds);
            });

            $('#tab-datos').dataTable({
                "columns": [
                    { "width": "5%" },
                    { "width": "25%" },
                    { "width": "20%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "20%" }
                ]
            });
            $('[data-toggle="popover"]').popover();
        }
    });

};

function cargarcantidad(nuevacantidad, cantidadinicial, inicial) {
    if (parseInt(nuevacantidad) > cantidadinicial) {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'LA CANTIDAD DIGITADA ES MAYOR A LA CANTIDAD DE LA FACTURA',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'info',
            stack: false
        });

        nuevacantidad = cantidadinicial;
    } else if (parseInt(nuevacantidad) <= 0) {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'LA CANTIDAD DIGITADA DEBE SER  MAYOR A 0',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'info',
            stack: false
        });
        nuevacantidad = cantidadinicial;
    }

    $('#tb-detallep').html(null);
    for (var i = 0; i < datos.length; i++) {

        if (inicial == i) {
            datos[i].cantidad = parseInt(nuevacantidad);
            var tot = parseFloat(datos[i].precio) * parseFloat(datos[i].cantidad);
            var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].precio + '</td><td><input type="number" class="form-control" value="' + datos[i].cantidad + '" onblur="cargarcantidad($(this).val(),' + cantidadinicial + ')"/></td><td>' + tot.toFixed(2) + '</td><td>N/A</td><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
            $('#tb-detallep').append(tds);
        } else {
            var tot = parseFloat(datos[i].precio) * parseFloat(datos[i].cantidad);
            var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].precio + '</td><td><input type="number" class="form-control" value="' + datos[i].cantidad + '" onblur="cargarcantidad($(this).val(),' + datos[i].cantidad + ')"/></td><td>' + tot.toFixed(2) + '</td><td>N/A</td><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
            $('#tb-detallep').append(tds);
        }
    }

}


//function cargarcantidadDesc(nuevacantidad, cantidadinicial, inicial) {
//    if (parseInt(nuevacantidad) > cantidadinicial) {
//        $('.jq-toast-wrap').remove();
//        $.toast({
//            heading: 'ADVERTENCIA',
//            text: 'LA CANTIDAD DIGITADA ES MAYOR A LA CANTIDAD DE LA FACTURA',
//            position: 'bottom-right',
//            showHideTransition: 'plain',
//            icon: 'info',
//            stack: false
//        });

//        nuevacantidad = cantidadinicial;
//    } else if (parseInt(nuevacantidad) <= 0) {
//        $('.jq-toast-wrap').remove();
//        $.toast({
//            heading: 'ADVERTENCIA',
//            text: 'LA CANTIDAD DIGITADA DEBE SER  MAYOR A 0',
//            position: 'bottom-right',
//            showHideTransition: 'plain',
//            icon: 'info',
//            stack: false
//        });
//        nuevacantidad = cantidadinicial;
//    }

//    $('#tb-detallep').html(null);
//    for (var i = 0; i < datos.length; i++) {

//        if (inicial == i) {
//            datos[i].cantidad = parseInt(nuevacantidad);
//            var tot = parseFloat(datos[i].precio) * parseFloat(datos[i].cantidad);
//            var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].precio + '</td><td><input type="text" class="form-control" value="' + datos[i].cantidad + '" onblur="cargarcantidadDesc($(this).val(),' + cantidadinicial + ',' + i + ')"/></td><td>' + tot.toFixed(2) + '</td><td><input type="text" class="form-control" value="' + datos[i].descuento + '" onblur="cargarPrecioDesc($(this).val(),' + datos[i].descuento + ',' + i + ')"/><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
//            $('#tb-detallep').append(tds);
//        } else {
//            var tot = parseFloat(datos[i].precio) * parseFloat(datos[i].cantidad);
//            var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].precio + '</td><td><input type="text" class="form-control" value="' + nuevacantidad + '" onblur="cargarcantidadDesc($(this).val(),' + cantidadinicial + ',' + i + ')"/></td><td>' + tot.toFixed(2) + '</td><td><input type="text" class="form-control" value="' + datos[i].descuento + '" onblur="cargarPrecioDesc($(this).val(),' + datos[i].descuento + ',' + i + ')"/><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
//            $('#tb-detallep').append(tds);
//        }
//    }

//}



function cargarPrecioDesc(precionuevo, precioinicial, inicial, descuentotot) {
    if (parseFloat(precionuevo) > (precioinicial - descuentotot)) {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'LA CANTIDAD DIGITADA ES MAYOR A LA CANTIDAD DE LA FACTURA',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'info',
            stack: false
        });

        precionuevo = 0;
    } else if (parseFloat(precionuevo) <= 0) {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'LA CANTIDAD DIGITADA DEBE SER  MAYOR A 0',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'info',
            stack: false
        });
        precionuevo = 0;
    }

    $('#tb-detallep').html(null);
    for (var i = 0; i < datos.length; i++) {

        if (inicial == i) {
            datos[i].descuento = parseFloat(precionuevo);
            var tot = ((parseFloat(datos[i].precio) * parseFloat(datos[i].cantidad)) - parseFloat(descuentotot)) - parseFloat(datos[i].descuento);
            var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].precio + '</td><td>' + datos[i].cantidad + '</td><td>' + tot.toFixed(2) + '</td><td><input type="text" class="form-control" value="' + precionuevo + '" onblur="cargarPrecioDesc($(this).val(),' + precioinicial + ',' + i + ', ' + descuentotot +')"/><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
            $('#tb-detallep').append(tds);
        } else {
            var tot = parseFloat(datos[i].precio) * parseFloat(datos[i].cantidad);
            var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].precio + '</td><td>' + datos[i].cantidad + '</td><td>' + tot.toFixed(2) + '</td><td><input type="text" class="form-control" value="' + datos[i].descuento + '" onblur="cargarPrecioDesc($(this).val(),' + datos[i].precio + ',' + i + ',' + datos[i].descuentotot +')"/><td><button onclick(eliminarfat(' + i + ')) class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></td></tr>'
            $('#tb-detallep').append(tds);
        }
    }

}



function notacredito(id, fecha, nit) {
    $('#observaciones_nota').val(null);
    $('#MdNotaCredito').modal('toggle');
    $('#id-nota').val(id);
    $('#tipoNota').val(null);
    $('#bt-notacredito').hide();
    $('#tb-detallep').html(null);
    datos = [];
}


function eliminar(id, fecha, nit) {
    //var fech = fecha.split('/');


    //var f = new Date();
    //var mesactual = f.getMonth() + 1;

    //var mesfac = fech[1];

    //var diferencia  = mesactual-mesfac;


    //if (diferencia >= 2) {
    //    $('#observaciones_nota').val(null);
    //    $('#MdNotaCredito').modal('toggle');
    //    
    //} else {
    //    $('#observaciones_anular').val(null);
    //    $('#MdAnularFac').modal('toggle');
    //}

    $('#observaciones_anular').val(null);
    $('#MdAnularFac').modal('toggle');

    $('#id').val(id);
    
}

function reimpimir(id) {
    $.ajax({
        url: 'wsfacturacion.asmx/Reimprimir',
        data: '{id : ' + id + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {

            if (UrlExists(msg.d)) {
                window.open(msg.d, '_blank');
            }else {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: 'Error de Reimpresion de Factura',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }
        }
    });
}


function limpiar() {
    //  mostrarDatos();
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


function notadebito(id) {
    $('#observaciones_nota_debito').val(null);
    $('#MdNotaDebito').modal('toggle');
    $('#id-nota-debito').val(id);
    $('#observaciones_nota_debito').val(null);
    $('#tipoNotaDebito').val(1);
    $('#valorDebito').val(null);
}
