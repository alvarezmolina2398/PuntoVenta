
var pagos = [];
var facturas = [];
var autocompletecliente = [];
var existefecctivo = false;
var totalpago = 0;
var totalfactura = 0;
var totalelectronico = 0;
var totalelectronicoext = 0;


$(window).on('load', function () {



    $('input[name="fecha"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        minYear: 1901
    }, function (start, end, label) { });

});



$.ajax({
    url: 'wsadmin_clientes.asmx/ObtenerDatos',
    data: '',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    success: function (msg) {
        $.each(msg.d, function () {
            var dat = { 'nit': this.nit, 'nombre': this.nombre, 'id': this.id, 'dias': this.dias, 'descuento': this.descuento }
            autocompletecliente.push(dat);
        });
    }
});


var totefectivo = 0;

var options_cliente = {
    data: autocompletecliente,

    getValue: function (element) {
        return element.nit
    },
    template: {
        type: "description",
        fields: {
            description: "nombre"
        }
    },
    list: {
        match: {
            enabled: true
        },
        onSelectItemEvent: function () {
            var value = $("#nit").getSelectedItemData().id;
            var value2 = $('#nit').getSelectedItemData().nombre;
            $("#idcliente").val(value).trigger("change");
            $("#nombre").val(value2).trigger("change");
            cargarFacturas(value);
        }
    },
}

var options_cliente2 = {
    data: autocompletecliente,

    getValue: function (element) {
        return element.nombre
    },
    template: {
        type: "description",
        fields: {
            description: "nit"
        }
    },
    list: {
        match: {
            enabled: true
        },
        onSelectItemEvent: function () {
            var value = $("#nombre").getSelectedItemData().id;
            var value2 = $('#nombre').getSelectedItemData().nit;
            $("#idcliente").val(value).trigger("change");
            $("#nit").val(value2).trigger("change");
            cargarFacturas(value);
        }
    },
}

$("#nit").easyAutocomplete(options_cliente);
$("#nombre").easyAutocomplete(options_cliente2);


$('.pn-pagos').hide();



function agregarFormulario(factura, saldo, descripcion, valor) {
    var linea = { 'id_fac': factura, 'saldo': saldo, 'valor': valor, 'descripcion': descripcion }
    facturas.push(linea)
    var total_FAC = 0;

    $('#tbody-fac2').html(null);
    for (var i = 0; i < facturas.length; i++) {
        total_FAC += parseFloat(facturas[i].saldo);
        var tds = '<tr><td>' + facturas[i].descripcion + '</td><td>' + parseFloat(facturas[i].valor).toFixed(2) + '</td><td style="text-align: right">' + parseFloat(facturas[i].saldo).toFixed(2) + '</td><td onclick="eliminarFac(' + i + ')"><center><button class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></center></td></tr>'

        $('#tbody-fac2').append(tds);
    };

    if (total_FAC > 0) {
        var td = '<tr><td> <b>SALDO TOTAL</b> </td><th> ------ </th><td style="text-align: right"><b>' + parseFloat(total_FAC).toFixed(2) + '</b></td></tr>'
        $('#tbody-fac2').append(td);

    }

    $('#lb-fac').text(parseFloat(total_FAC).toFixed(2));



}

function eliminarFac(i) {
    facturas.splice(i, 1);

    var total_FAC = 0;

    $('#tbody-fac2').html(null);
    for (var i = 0; i < facturas.length; i++) {
        total_FAC += parseFloat(facturas[i].saldo);
        var tds = '<tr><td>' + facturas[i].descripcion + '</td><td>' + parseFloat(facturas[i].valor).toFixed(2) + '</td><td style="text-align: right">' + parseFloat(facturas[i].saldo).toFixed(2) + '</td><td onclick="eliminarFac(' + i + ')"><center><button class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></center></td></tr>'

        $('#tbody-fac2').append(tds);
    };

    if (total_FAC > 0) {
        var td = '<tr><td> <b>SALDO TOTAL</b> </td><th> ------ </th><td style="text-align: right"><b>' + parseFloat(total_FAC).toFixed(2) + '</b></td></tr>'
        $('#tbody-fac2').append(td);

    }

    $('#lb-fac').text(parseFloat(total_FAC).toFixed(2));

}



function cargarFacturas(idcliente) {
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscobrar_Recibos.asmx/ObtenerFacturas',
        data: '{idcliente: ' + idcliente +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $('#tbody-Fac').html(null);
            $.each(msg.d, function () {

                var dts = "<tr class='odd'><td>" + this.serie + "-" + this.firma + "</td><td>" + this.valor + "</td><td>" + this.saldo + "</td><td>" +
                    "<span data-dismiss='modal' onclick='agregarFormulario(" + this.id_fac + "," + this.saldo +",\"" + this.serie+ "-"+ this.firma + "\","+ this.valor+")' class='btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='AGREGAR AL CARRITO DE COMPRAS' data-original-title='' title ='' > " +
                    "<i class='material-icons'>add</i> " +
                    "</span></td></tr>"

                $('#tbody-Fac').append(dts);

            });
            $('#tab-datos').dataTable();
        }
    });
}

$(function () {
    var usuario = window.atob(getCookie("usErp"));
    cargarMetodosdePago();
    cargarTiposTarjeta();



    $('#tipo').val(1);
    $('#serie').hide();
    $('#fecha-1').hide();
    $('#no').hide();


 
    $('#serie-fac').val(null);
    $('#fecha-fac').val(null);
    $('#no-fac').val(null);



    $('#tipo').change(function () {
        if ($(this).val() == 1) {
            $('#serie').hide();
            $('#no').hide();
            $('#fecha-1').hide();
        } else {
            $('#serie').show();
            $('#no').show();
            $('#fecha-1').show();
        }

    });

    //evento enter en producto
    $('.enter').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == 13) {
            $('#bt-agregar-pago').click();
        }
    });

    //levanta modal de facturas
    $('#btn-add-fac').click(function () {
        $('#MdFac').modal('toggle');
    });

    //acciones para las tabs
    $('#tab2-btn').click(function () {
        $('#tabhome223-tab').click();
    });


    $('#tab3-btn').click(function () {
        $('#tabhome133').click();
    });

    $('#tab1-atras-btn').click(function () {
        $('#tabhome123-tab').click();
    });

    $('#tab2-atras-btn').click(function () {
        $('#tabhome223-tab').click();
    });


    //accion al cambiar el tipo de pago
    $('#tipopago').change(function () {
        $('.pn-pagos').hide();


        if ($(this).val() != 0) {
            if ($(this).val() == 1) {
                $('#pn-efectivo').show();
                $('#efectivo').focus();
            } else if ($(this).val() == 2) {
                $('#pn-cheque').show();
                $('#nocheque').focus();
            } else if ($(this).val() == 3) {
                $('#pn-tarjeta').show();
                $('#tipotarjeta').focus();
            } else if ($(this).val() == 6) {
                $('#pn-credito').show();
                $('#credito').focus();
            } else if ($(this).val() == 7) {
                $('#pn-excension').show();
                $('#formulario').focus();
            } else if ($(this).val() == 8) {
                $('#pn-regalo').show();
                $('#regaloinfo').focus();
            } else if ($(this).val() == 9) {
                $('#pn-pago-local').show();
                $('#banco').focus();
            }
            else if ($(this).val() == 10) {
                $('#pn-pago-extrangero').show();
                $('#bancoext').focus();
            }
        }

        $('#efectivo').val(null);
        $('#nocheque').val(null);
        $('#cheque').val(null);
        $('#tipotarjeta').val(0);
        $('#autorizacion').val(null);
        $('#codigo').val(null);
        $('#tarjeta').val(null);
        $('#credito').val(null);
        $('#formulario').val(null);
        $('#valorexcersion').val(null);
        $('#regaloinfo').val(null);
        $('#regalo').val(null);
    });


    //accion para guardar los datos
    $('#btn-guardar').click(function () {
        var fecha = $('#fecha').val();
        var serie = $('#serie-fac').val();
        var no = $('#no-fac').val();


        if (pagos.length == 0) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ES NECESARIO INGRESAR LOS METODOS DE PAGO",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else if (facturas.length == 0) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ES NECESARIO INGRESAR LAS FACTURAS",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else if (serie == '' && $('#tipo').val() == 2) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ES NECESARIO INGRESAR LA  SERIE",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });

            $('#serie-fac').focus();
        }
        else if (no == '' && $('#tipo').val() == 2) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ES NECESARIO INGRESAR LA  NUMERO DE RECIBO",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });

            $('#no-fac').focus();
        }
        else if (fecha == '' && $('#tipo').val() == 2) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ES NECESARIO INGRESAR LA  FECHA DEL RECIBO",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });

            $('#serie-fac').focus();
        }
        else {

            var validacion = true;

            if ($('#tipo').val() == 2) {
                var fechax = fecha.split('/');
                fecha = fechax[2] + '-' + fechax[1] + '-' + fechax[0];
                validacion = validarSerie(serie, no)
            } else {
                fecha = "";
            }


            //consume el ws para obtener los datos
             $.ajax({
                url: 'wscobrar_Recibos.asmx/Pagar',
                 data: '{ usuario : "' + usuario + '",  total_abonar : ' + totalpago + ', idcliente : ' + $('#idcliente').val() + ', listfac : ' + JSON.stringify(facturas) + ', listpagos : ' + JSON.stringify(pagos) + ', serie: "' + serie + '", numero: "' + no + '", fecha: "' + fecha + '"}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function () {
                    $('#btn-guardar').removeClass('btn-info');
                    $('#btn-guardar').removeClass('btn-success');
                    $('#btn-guardar').addClass('btn-warning');
                    $('#btn-guardar').html('<i class="material-icons">query_builder</i>Cargando...')
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
                        $('#MdPago').modal('toggle');
                        limpiar();

                    } else {
                        $('#btn-guardar').removeAttr('disabled', true);
                        $('#btn-cancelar').removeAttr('disabled', true);
                        $('#btn-guardar').html('<i class="material-icons">add</i>Guardar');
                        $('#btn-guardar').removeClass('btn-info');
                        $('#btn-guardar').removeClass('btn-warning');
                        $('#btn-guardar').addClass('btn-success');


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


    $('#bt-agregar-pago').click(function () {
        var tipoPago = $('#tipopago').val();


        if (tipoPago != 0) {
            if (tipoPago == 1) {
                var efectivo = $('#efectivo').val();

                if (efectivo == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR EL VALOR EN EFECTIVO",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                } else {
                    var info = "";
                    totefectivo = totefectivo + parseFloat(efectivo);
                    info = info = "PAGO DE: " + parseFloat(totefectivo).toFixed(2);
                    if (existefecctivo) {
                        for (var i = 0; i < pagos.length; i++) {

                            if (pagos[i].tipo == 1) {
                                pagos[i].informacion = info;
                                pagos[i].valor = totefectivo;
                                existefecctivo = true;
                            }
                        }
                    } else {
                        existefecctivo = true;
                        var linea = { 'tipo': tipoPago, 'valor': totefectivo, 'informacion': info, 'tipoPagoText': $('#tipopago option:selected').text() };
                        pagos.push(linea);
                    }


                    $('#tipopago').val(0);
                }


                $('#efectivo').val(null);


            }
            else if (tipoPago == 2) {

                var nocheque = $('#nocheque').val();
                var cheque = $('#cheque').val();


                if (cheque == "" || nocheque == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR EL VALOR Y LA DESCRIPCION",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                } else {
                    var linea = { 'tipo': tipoPago, 'valor': cheque, 'informacion': 'CHEQUE:' + nocheque, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }

                $('#nocheque').val(null);
                $('#cheque').val(null);



            }
            else if (tipoPago == 3) {
                var tipo = $('#tipotarjeta').val();
                var autorizacion = $('#autorizacion').val();
                var codigo = $('#codigo').val();
                var tarjeta = $('#tarjeta').val();


                if (tipo == 0 || autorizacion == "" || tarjeta == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR EL TIPO TARJETA, AUTORIZACION Y TARJETA",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    var informacion = "TIPO DE TARJETA: " + $('#tipotarjeta option:selected').text() + ", AUTORIZACION: " + autorizacion + ", NUMERO DE TARJETA :  " + codigo
                    var linea = { 'tipo': tipoPago, 'valor': tarjeta, 'informacion': informacion, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }




                $('#tipotarjeta').val(0);
                $('#autorizacion').val(null);
                $('#codigo').val(null);
                $('#tarjeta').val(null);


            }
            else if (tipoPago == 7) {

                var formulario = $('#formulario').val();
                var valorexcersion = $('#valorexcersion').val();


                if (formulario == "" || valorexcersion == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR EL VALOR Y LA DESCRIPCION DEL FORMULARIO",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    var linea = { 'tipo': tipoPago, 'valor': valorexcersion, 'informacion': formulario, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }

                $('#formulario').val(null);
                $('#valorexcersion').val(null);

            }
            else if (tipoPago == 8) {

                var regaloinfo = $('#regaloinfo').val();
                var regalo = $('#regalo').val();


                if (regaloinfo == "" || regalo == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR EL VALOR DEL REGALO Y LA DESCRIPCION",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    var linea = { 'tipo': tipoPago, 'valor': regalo, 'informacion': 'FORMULARIO: ' + regaloinfo, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }


                $('#regaloinfo').val(null);
                $('#regalo').val(null);

            }
            else if (tipoPago == 9) {


                var banco = $('#banco').val();
                var cuenta = $('#cuenta').val();
                var boleta = $('#boletapago').val();
                var fecha = $('#fechadep').val();
                var valorpago = $('#valorpago').val();

                if (banco == 0 || cuenta == 0 || boleta == "" || fecha == "" || valorpago == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR TODOS LOS DATOS DEL FORMULARIO",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    var informacion = boleta;
                    var fechax = fecha.split("/");
                    fecha = fechax[2] + fechax[1] + fechax[0]
                    var linea = {
                        'tipo': tipoPago, 'valor': valorpago, 'informacion': informacion, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0,
                        'banco': banco, 'cuenta': cuenta, 'fecha': fecha
                    };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }



                $('#banco').val(0);
                $('#bancoext').val(0);
                $('#cuenta').html('<option value="0">Seleccione Una Opcion</option>');
                $('#cuentaext').html('<option value="0">Seleccione Una Opcion</option>');
                $('#fechadep').val(null);
                $('#boletapago').val(null);
                $('#valorpago').val(null);
                $('#fechadepext').val(null);
                $('#boletapagoext').val(null);
                $('#valorpagoext').val(null);


            }
            else if (tipoPago == 10) {


                var banco = $('#bancoext').val();
                var cuenta = $('#cuentaext').val();
                var boleta = $('#boletapagoext').val();
                var fecha = $('#fechadepext').val();
                var valorpago = $('#valorpagoext').val();

                if (banco == 0 || cuenta == 0 || boleta == "" || fecha == "" || valorpago == "") {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR TODOS LOS DATOS DEL FORMULARIO",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else { 
                    var informacion = boleta;
                    var fechax = fecha.split("/");
                    fecha = fechax[2] + fechax[1] + fechax[0]
                    var linea = {
                        'tipo': tipoPago, 'valor': valorpago, 'informacion': informacion, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0,
                        'banco': banco, 'cuenta': cuenta, 'fecha': fecha
                    };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }



                $('#banco').val(0);
                $('#bancoext').val(0);
                $('#cuenta').html('<option value="0">Seleccione Una Opcion</option>');
                $('#cuentaext').html('<option value="0">Seleccione Una Opcion</option>');
                $('#fechadep').val(null);
                $('#boletapago').val(null);
                $('#valorpago').val(null);
                $('#fechadepext').val(null);
                $('#boletapagoext').val(null);
                $('#valorpagoext').val(null);


            }


            var total_pago = 0;

            $('#tbody-pago').html(null);
            for (var i = 0; i < pagos.length; i++) {
                total_pago += parseFloat(pagos[i].valor);
                var tds = '<tr><td>' + pagos[i].tipoPagoText + '</td><td>' + pagos[i].informacion + '</td><td style="text-align: right">' + parseFloat(pagos[i].valor).toFixed(2) + '</td><td onclick="eliminarPago(' + i + ')"><center><button class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></center></td></tr>'

                $('#tbody-pago').append(tds);
            };


            if (total_pago > 0) {
                td = '<tr><td> -- </td><th> <b>TOTAL</b> </th><td style="text-align: right"><b>' + parseFloat(total_pago).toFixed(2) + '</b></td></tr>'
                $('#tbody-pago').append(td);

            }
            totalpago = total_pago

            $('#lb-pagos').text(parseFloat(totalpago).toFixed(2));

           
            $('#tipopago').val(0);
            $('.pn-pagos').hide();

        } else {

            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ES NECESARIO SELECCIONAR UN METODO DE PAGO",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }


    });


});


function limpiar() {
    $('#nombre').val(null);
    $('#nit').val(null);
    $('#idcliente').val(null);
    $('#nit').focus();

    $('#tipo').val(1);
    $('#serie').hide();
    $('#fecha-1').hide();
    $('#no').hide();

    pagos = [];
    facturas = [];
    totalpago = 0;
    totalfactura = 0;
    existefecctivo = false;
    totefectivo = 0;
    $('#serie-fac').val(null);
    $('#fecha-fac').val(null);
    $('#no-fac').val(null);

    $('#tbody-pago').html(null);
    $('#tbody-Fac').html(null);
    $('#tbody-fac2').html(null);
    $('#lb-pagos').text('0.00');
    $('#lb-fac').text('0.00');
    $('#tabhome123-tab').click();
    $("html, body").animate({ scrollTop: 0 }, 600);

    $('#btn-guardar').removeAttr('disabled', true);
    $('#btn-cancelar').removeAttr('disabled', true);
    $('#btn-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#btn-guardar').removeClass('btn-info');
    $('#btn-guardar').removeClass('btn-warning');
    $('#btn-guardar').addClass('btn-success');

}


function cargarMetodosdePago() {
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarTiposPago',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                if (this.id != 6) {
                    $('#tipopago').append('<option value="' + this.id + '">' + this.descripcion + '</option>');
                }
            });
        }
    });
}

function cargarTiposTarjeta() {
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarTiposTarjetas',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                
                $('#tipotarjeta').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
                
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



function validarSerie(serie, numero) {
    var result = false;
    $.ajax({
        url: 'wsvalidaciones.asmx/validarSerieNumeroRecibo',
        data: '{serie : "' + serie + '", numero: "' + numero + '"}',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            result = msg.d;
        }
    });

    return result
}