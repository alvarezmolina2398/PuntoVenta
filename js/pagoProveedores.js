var ultimaBusqueda = "";
var fac = [];

var pagos = [];
var totoal_deuda = 0;
var total_pagar = 0;
var totaldescuento = 0;

var total = 0;
var totefectivo = 0;
var totalcheque = 0;
var totaltarjeta = 0;
var totalregalo = 0;
var totalcredito = 0;
var totalexcersion = 0;

var totalpagoextra = 0;


$(function () {
    cargarMetodosdePago();
    var usuario = window.atob(getCookie("usErp"));

    //evento enter en producto
    $('.enter').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == 13) {
            $('#bt-agregar-pago').click();
        }
    });

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

    $('#btn-Pagar').click(function () {

        $('#sub-total').text((parseFloat(totoal_deuda) + parseFloat(totaldescuento)).toFixed(2));
        $('#descuentotxt').text(parseFloat(totaldescuento).toFixed(2));
        $('#total').text(parseFloat(totoal_deuda).toFixed(2));
        $('#cambio').text('0.00');
        $('#pago').text('0.00');





        $('#lb-pago').removeClass('text-success');
        $('#lb-cambio').removeClass('text-success');
        $('#lb-pago').removeClass('text-danger');
        $('#lb-cambio').removeClass('text-danger');

        pagos = [];
        totefectivo = 0;
        totalpagoextra = 0;

        totalcheque = 0;
        totaltarjeta = 0;
        totalregalo = 0;
        totalcredito = 0;
        totalexcersion = 0;


        $('.pn-pagos').hide();
        $('#tipopago').val(1);
        $('#pn-efectivo').show();
        $('#efectivo').focus();

        $('#tbody-pago').html(null);
        $("#tabla-pagos").footable({
            "paging": {
                "enabled": true,
                "position": "center"
            }
        });

        $('#MdPago').modal('toggle')
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
                    var camb = 0;
                    totefectivo = totefectivo + parseFloat(efectivo);
                    if (pagos.length == 0) {
                        camb = parseFloat(parseFloat(parseFloat(totefectivo) - (totoal_deuda)));

                        if (camb < 0) {
                            info = info = "PAGO DE: " + efectivo;
                            camb = 0;

                        } else {
                            info = "PAGO DE: " + efectivo + " CAMBIO " + camb;
                        }

                        existefecctivo = false;

                    } else {
                        camb = parseFloat((parseFloat(efectivo) + parseFloat($('#pago').text())) - ((totoal_deuda)));
                        info = "DINERO EN EFECTIVO: " + totefectivo + " CAMBIO " + camb;
                    }

                    if (existefecctivo) {
                        for (var i = 0; i < pagos.length; i++) {

                            if (pagos[i].tipo == 1) {
                                pagos[i].informacion = info;
                                pagos[i].cambio = camb;
                                pagos[i].valor = totefectivo;
                                existefecctivo = true;
                            }
                        }
                    } else {
                        existefecctivo = true;
                        var linea = { 'tipo': tipoPago, 'valor': totefectivo, 'informacion': info, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': camb };
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
                }
                else if (parseFloat(cheque) + totalpagoextra + totefectivo > (totoal_deuda)) {

                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES VALOR DEL CHEQUE SOBREPASA LA CANTIDAD A PAGAR",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                } else {
                    totalpagoextra += parseFloat(cheque);
                    totalcheque += parseFloat(cheque);
                    var linea = { 'tipo': tipoPago, 'valor': cheque, 'informacion': 'CHEQUE:' + nocheque, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }

                $('#nocheque').val(null);
                $('#cheque').val(null);



            } else if (tipoPago == 3) {

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
                } else if (parseFloat(tarjeta) + totalpagoextra + totefectivo > totoal_deuda) {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES VALOR DEL PAGO EN TARJETA SOBREPASA LA CANTIDAD A PAGAR ",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    totalpagoextra += parseFloat(tarjeta);
                    totaltarjeta += parseFloat(tarjeta);
                    var informacion = "TIPO DE TARJETA: " + $('#tipotarjeta option:selected').text() + ", AUTORIZACION: " + autorizacion + ", NUMERO DE TARJETA :  " + codigo
                    var linea = { 'tipo': tipoPago, 'valor': tarjeta, 'informacion': informacion, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }




                $('#tipotarjeta').val(0);
                $('#autorizacion').val(null);
                $('#codigo').val(null);
                $('#tarjeta').val(null);


            } else if (tipoPago == 6) {

                var credito = $('#credito').val();



                if (credito == 0) {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES NECESARIO INGRESAR EL VALOR DEL CREDITO",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                } else if (parseFloat(credito) + totalpagoextra + totefectivo > totoal_deuda) {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES VALOR DEL CREDITO EN TARJETA SOBREPASA LA CANTIDAD A PAGAR ",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                } else {
                    totalpagoextra += parseFloat(credito);
                    totalcredito += parseFloat(credito);
                    var linea = { 'tipo': tipoPago, 'valor': credito, 'informacion': '---', 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }

                $('#credito').val(null);


            } else if (tipoPago == 7) {

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
                else if (parseFloat(valorexcersion) + totalpagoextra + totefectivo > totoal_deuda) {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "ES VALOR DEL LA EXCERSION DE CREDITO SOBREPASA LA CANTIDAD A PAGAR ",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    totalpagoextra += ParseFloat(valorexcersion);
                    totalexcersion += ParseFloat(valorexcersion);
                    var linea = { 'tipo': tipoPago, 'valor': valorexcersion, 'informacion': formulario, 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': 0 };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }

                $('#formulario').val(null);
                $('#valorexcersion').val(null);

            } else if (tipoPago == 8) {

                var regaloinfo = $('#regaloinfo').val();
                var regalo = $('#regalo').val();
                var extra = $('#idregalo').val();
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
                } else if (totefectivo + totalpagoextra >= totoal_deuda) {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: "YA ES SUFICIENTE DINERO PARA PAGAR ",
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                else {
                    totalpagoextra += parseFloat(regalo);
                    totalregalo += parseFloat(regalo);


                    var camb = parseFloat((parseFloat(regalo) + parseFloat($('#pago').text())) - (totoal_deuda));
                    var pago = 0;
                    if (camb < 0) {
                        camb = 0;
                    }

                    var linea = { 'tipo': tipoPago, 'valor': regalo, 'informacion': 'FORMULARIO: ' + regaloinfo + " PROXIMO SALDO A FAVOR " + parseFloat(camb).toFixed(2), 'tipoPagoText': $('#tipopago option:selected').text(), 'cambio': camb, 'extra': extra };
                    pagos.push(linea);
                    $('#tipopago').val(0);
                }


                $('#regaloinfo').val(null);
                $('#regalo').val(null);

            }


            var total_pago = 0;

            $('#tbody-pago').html(null);
            for (var i = 0; i < pagos.length; i++) {
                total_pago += parseFloat(pagos[i].valor);
                var tds = '<tr><td>' + pagos[i].tipoPagoText + '</td><td>' + pagos[i].informacion + '</td><td style="text-align: right">' + parseFloat(pagos[i].valor).toFixed(2) + '</td><td onclick="eliminarPago(' + i + ',' + pagos[i].tipo + ',' + pagos[i].valor + ')"><center><button class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></center></td></tr>'

                $('#tbody-pago').append(tds);
            };


            if (total_pago > 0) {
                td = '<tr><td> -- </td><th> <b>TOTAL</b> </th><td style="text-align: right"><b>' + parseFloat(total_pago).toFixed(2) + '</b></td></tr>'
                $('#tbody-pago').append(td);


                $('#pago').text(parseFloat(total_pago).toFixed(2));

                if (parseFloat(total_pago) >= parseFloat(totoal_deuda)) {
                    $('#lb-pago').addClass('text-success');
                    $('#lb-cambio').addClass('text-success');
                    $('#lb-pago').removeClass('text-danger');
                    $('#lb-cambio').removeClass('text-danger');
                    $('#cambio').text(parseFloat(total_pago - (totoal_deuda)).toFixed(2));
                } else {
                    $('#lb-pago').removeClass('text-success');
                    $('#lb-cambio').removeClass('text-success');
                    $('#lb-pago').addClass('text-danger');
                    $('#lb-cambio').addClass('text-danger');
                    $('#cambio').text('INSUFICIENTE');
                }


            }


            $("#tabla-pagos").footable({
                "paging": {
                    "enabled": true,
                    "position": "center"
                }
            });
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

    $("#proveedor").chosen();

    $("#proveedor_chosen .chosen-search-input").autocomplete({

        minLength: 3,
        source: function (request, response) {
            if (ultimaBusqueda != request.term) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "wsProgramacionPagos.asmx/ObtenerProveedores",
                    data: '{busqueda : "' + $("#proveedor_chosen .chosen-search-input").val() + '"}',
                    dataType: "json",
                    success: function (data) {
                        var dataAnterior = $("#proveedor_chosen .chosen-search-input").val()
                        var texto1 = '<option value="0"></option>';
                        $('#proveedor').html(texto1);
                        $.each(data.d, function () {
                            var texto = '<option value="' + this.id + '">' + this.descripcion +'</option>';
                            $('#proveedor').append(texto);

                        });
                        $("#proveedor").trigger('chosen:updated');
                        $("#proveedor .chosen-search-input").val(dataAnterior)
                        ultimaBusqueda = dataAnterior
                    },
                    error: function (result) {
                        alert("Error");
                    }
                });
            }
        }
    });

    $('#Btn-show-Fac').click(function () {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "wsProgramacionPagos.asmx/obtenerFacturas",
            data: '{idproveedor: '+ $('#proveedor').val() +'}',
            dataType: "json",
            success: function (data) {  
                $('#tbod-datos-fac').html(null);
                $.each(data.d, function () {

                    var tr = '<tr><td>' + this.usuario + '</td><td>' + this.fecha + '</td><td>' + this.fecha_limite + '</td><td>' + this.valor + '</td><td><span class="btn btn-success" onclick="addTable(\'' + this.usuario + '\',\'' + this.fecha + '\',\'' + this.fecha_limite + '\',\'' + this.valor + '\','+ this.id +')"><i class="material-icons">add</i></span></td></tr>';

                    $('#tbod-datos-fac').append(tr);

                });
            },
            error: function (result) {
                alert("Error");
            }
        });


        $('#MdCompras').modal('show');
    });

    //accion  para guardar o actualizar los datos
    $('#btn-guardar').click(function () {
        $('#btn-guardar').attr('disabled', true);
        $('#btn-cancelar').attr('disabled', true);

        $.ajax({
            url: 'wsProgramacionPagos.asmx/Pagar',
            data: '{ usuario : "' + usuario + '",  idproveedor : ' + $('#proveedor').val() + ',  total: ' + $('#pago').text() + ',  listpagos: ' + JSON.stringify(pagos) + ',  listcompras : ' + JSON.stringify(fac) +' }',
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
        
    });
});


function limpiar() {
    $('#proveedores').html('<option value="0"></option>');
     ultimaBusqueda = "";
     fac = [];

     pagos = [];
     totoal_deuda = 0;
     total_pagar = 0;
     totaldescuento = 0;

     total = 0;
     totefectivo = 0;
     totalcheque = 0;
     totaltarjeta = 0;
     totalregalo = 0;
     totalcredito = 0;
     totalexcersion = 0;

    totalpagoextra = 0;
    $('#tbod-datos-fac').html(null);
    $('#tbody').html(null);
    $('#tbody-pago').html(null);
    var texto1 = '<option value="0"></option>';
    $('#proveedor').html(texto1);
    $("#proveedor").trigger('chosen:updated');
    $('#proveedor').val(0);


    $('#btn-guardar').removeAttr('disabled', true);
    $('#btn-cancelar').removeAttr('disabled', true);
    $('#btn-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#btn-guardar').removeClass('btn-info');
    $('#btn-guardar').removeClass('btn-warning');
    $('#btn-guardar').addClass('btn-success');
}

function addTable(usuario, fecha, fecha_limite, valor, id) {
    var existe = false;


    for (var i = 0; i < fac.length; i++) {
        if (fac[i].id == id) {
            existe = true;
            $('.jq-toast-wrap').remove();
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "ESTA COMPRA YA FUE AGREGADA",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
    }



    

    if (!existe) {
        $('#MdCompras').modal('hide');
        fac.push({ 'usuario': usuario, 'fecha': fecha, 'fecha_limite': fecha_limite, 'valor': valor, 'id': id });
    }
    

    $('#tbody').html(null);
    var total = 0;

    for (var i = 0; i < fac.length; i++) {
        total += parseFloat(fac[i].valor);
        var tr = '<tr><td>' + fac[i].usuario + '</td><td>' + fac[i].fecha + '</td><td>' + fac[i].fecha_limite + '</td><td>' + fac[i].valor + '</td><td><span class="btn btn-danger" onclick="eliminar(' + i +')"><i class="material-icons">delete_forever</i></span></td></tr>';

        $('#tbody').append(tr);
    }

    totoal_deuda = total;
    var tds = '<tr><td>  --- </td><td> --- </td><td> --- </td><td> '+ total.toFixed(2) +' </td><td></td></tr>';
    $('#tbody').append(tds);

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



function eliminar(id) {
    fac.splice(id, 1)
    $('.jq-toast-wrap').remove();
    $.toast({
        heading: '¡Informacion!',
        text: "SE HA REMOVIDO UN PRODUCTO DE LA TABLA",
        position: 'bottom-right',
        showHideTransition: 'plain',
        icon: 'info',
        stack: false
    });

    $('#tbody').html(null);
    var total = 0;

    for (var i = 0; i < fac.length; i++) {
        total += parseFloat(fac[i].valor);
        var tr = '<tr><td>' + fac[i].usuario + '</td><td>' + fac[i].fecha + '</td><td>' + fac[i].fecha_limite + '</td><td>' + fac[i].valor + '</td><td><span class="btn btn-danger" onclick="eliminar(' + i + ')"><i class="material-icons">delete_forever</i></span></td></tr>';

        $('#tbody').append(tr);
    }
    var tds = '<tr><td>  --- </td><td> --- </td><td> --- </td><td> ' + total.toFixed(2) + ' </td><td></td></tr>';
    $('#tbody').append(tds);
    
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
                $('#tipopago').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });
}