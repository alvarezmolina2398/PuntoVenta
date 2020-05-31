var usuario = window.atob(getCookie("usErp"));
var estandar = 1;
var datos = [];
var pagos = [];
var totalfac = 0;
var totaldescuento = 0;
var simples = [];
var datos2 = [];
var precioinicial = 0;
var totalpagoextra = 0;
var autocompletecliente = [];
var existefecctivo = false;
$('.pn-pagos').hide();

$.ajax({
    url: 'wsadmin_clientes.asmx/ObtenerDatos',
    data: '',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    success: function (msg) {
        $.each(msg.d, function () {
            if (this.nit != 'C/F') {
                var dat = { 'nit': this.nit, 'nombre': this.nombre, 'id': this.id, 'dias': this.dias, 'descuento': this.descuento, 'precio': this.precio }
                autocompletecliente.push(dat);
            }
            
        });
    }
});

$(function () {
    $('#cantidad').val(1);
    $('#nit').focus();
    $('#miselaneoadd').prop('checked', false);
    $('#pn-descadional').hide();



    $('#DescripcionAdicional').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == 13) {


            $('#precio').focus()
        }

    });


    $('#precio').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == 13) {
            if ($(this).val() != '') {
                $('#bt-agregar').click();
            }

        }

    });

    $('#tab-datos').dataTable();
    var fecha = new Date();
    $('#fechaactual').text(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear());
    cargarBodegas();
    cargarMetodosdePago();
    cargarTiposTarjeta();


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
                var value3 = $('#nit').getSelectedItemData().dias;
                var value4 = $('#nit').getSelectedItemData().descuento;
                var value5 = $('#nit').getSelectedItemData().precio;
                $("#idcliente").val(value).trigger("change");
                $("#nombre").val(value2).trigger("change");
                $("#descuento").val(value4).trigger("change");
                $("#diascredito").val(value3).trigger("change");

                $.ajax({
                    url: 'wsadmin_clientes.asmx/ObtenerPrecio',
                    data: '{idcliente: ' + value + '}',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    success: function (msg) {
                        $('#precioutilizar').val(msg.d);
                    }
                }); 
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
                var value =  $("#nombre").getSelectedItemData().id;
                var value2 = $('#nombre').getSelectedItemData().nit;
                var value3 = $('#nombre').getSelectedItemData().dias;
                var value4 = $('#nombre').getSelectedItemData().descuento;
                var value5 = $('#nombre').getSelectedItemData().precio;
                $("#idcliente").val(value).trigger("change");
                $("#nit").val(value2).trigger("change");
                $("#descuento").val(value4).trigger("change");
                $("#diascredito").val(value3).trigger("change");

                $.ajax({
                    url: 'wsadmin_clientes.asmx/ObtenerPrecio',
                    data: '{idcliente: ' + value + '}',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    success: function (msg) {
                        $('#precioutilizar').val(msg.d);
                    }
                });
            }
        },
    }

    $("#nit").easyAutocomplete(options_cliente);
    $("#nombre").easyAutocomplete(options_cliente2);

    $('#bt-CrearCliente').click(function () {
        $('#MdCrearCliente').modal('toggle')
    });

    //accion para crear los clientes
    $('#btn-Cliente').click(function () {
        var nit = $('#nitnew').val();
        var descripcion = $('#nombrenew').val();
        var direccion = $('#direccion').val();


        if (nit == "" && descripcion == "" && direccion == "") {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "LOS CAMPOS DE NIT, NOMBRE Y DIRECCION SON NECESARIOS",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        } else {
            var telefono = ' -- ';
            var observacion = 'CLIENTE CREADO DESDE FACTURACION';
            var departamento = 1;
            var municipio = 1;
            var clasificacion = 2;
            var contacto1 = 'SIN DATO';
            var contacto2 = 'SIN DATO';
            var contacto3 = 'SIN DATO';
            var descuento = 0;
            var limite = 0
            var dia = 0;
            $('#precioutilizar').val(1);
            var correo = 'SIN DATO';

            data1 = '{ nit_clt : "' + nit + '",  Nom_clt : "' + descripcion +
                '",  Tel_Clt : "' + telefono + '",  Dire_Clt : "' + direccion + '",  id_clasif : ' + clasificacion +
                ',  id_dep : ' + departamento + ',  id_muni : ' + municipio + ',  contacto1 : "' + contacto1
                + '",  contacto2 : "' + contacto2 + '",  contacto3 : "' + contacto3 + '",  Descuento_Porc : ' + descuento +
                ',  Limite_Credito : ' + limite + ',  Dias_Credito : ' + dia + ',  Correo_Clt : "' + correo + '",  Observ_Clt : "' + observacion + '", precio : 1}';


            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsadmin_clientes.asmx/InsertarRetornaID',
                data: data1,
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
                        autocompletecliente = []
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




                        options_cliente = {
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
                                    var value3 = $('#nit').getSelectedItemData().dias;
                                    var value4 = $('#nit').getSelectedItemData().descuento;
                                    $("#idcliente").val(value).trigger("change");
                                    $("#nombre").val(value2).trigger("change");
                                    $("#descuento").val(value4).trigger("change");
                                    $("#diascredito").val(value3).trigger("change");


                                    $.ajax({
                                        url: 'wsadmin_clientes.asmx/ObtenerPrecio',
                                        data: '{idcliente: ' + value + '}',
                                        type: 'POST',
                                        contentType: 'application/json; charset=utf-8',
                                        success: function (msg) {
                                            $('#precioutilizar').val(msg.d);
                                        }
                                    }); 
                                }
                            },
                        }

                        $("#nit").easyAutocomplete(options_cliente);


                        $('#nit').val(nit);
                        $('#nombre').val(descripcion);
                        $('#idcliente').val(arr[2]);
                        $('#nitnew').val(null);
                        $('#nombrenew').val(null);
                        $('#direccion').val(null);
                        $('#descuento').val(0);
                        $('#diascredito').val(0);
                        $('#MdCrearCliente').modal('toggle');

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
        $('#btn-guardar').attr('disabled', true);
        $('#btn-cancelar').attr('disabled', true);

        if (validarForm()) {

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsventasinrecibo.asmx/Vender',
                data: '{ usuario : "' + usuario + '",  total : ' + totalfac + ',  descuento : ' + totaldescuento + ',  idcliente : ' + $('#idcliente').val() + ',  diascredito : ' + $('#diascredito').val() + ',  listproductos : ' + JSON.stringify(datos) + '}',
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

                       // window.open(arr[2], '_blank');
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

    $('#bt-buscar').click(function () {
        $('#busqueda').val(null);
        $('#busqueda').focus();
        $('#tbod-datos').html(null);
        $('#tab-datos').dataTable();
    });

    $('#busqueda').keyup(function () {
        var texto = $('#busqueda').val();
        if ($('#bodega').val() > 0 && texto.length > 2) {
            //consume el ws para obtener los datos
            $.ajax({
                url: 'wstraslados.asmx/BuscarExistenciasPorBodega',
                data: '{bodega: ' + $('#bodega').val() + ', nombre: "' + texto + '",precio: ' + $('#precioutilizar').val() + ' }',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $('#tbod-datos').html(null);
                    $.each(msg.d, function () {
                        var tds = "<tr class='odd'><td>" + this.codigo + "</td><td>" + this.descripcion + "</td><td>" + this.cantidad + "</td>" +
                            "<td><span onclick='cerrarModal();cargarProducto(" + this.id + ",\"" + this.codigo + "\",\"" + this.descripcion + "\",\"" + this.cantidad + "\"," + this.precio + "," + this.tipo + "," + this.tipoArt + ",-1)' class='btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='AGREGAR AL CARRITO DE COMPRAS' data-original-title='' title ='' > " +
                            "<i class='material-icons'>shopping_cart</i> " +
                            "</span></td></tr>"

                        $('#tbod-datos').append(tds);

                    });


                    $('#tab-datos').dataTable();
                    $('[data-toggle="popover"]').popover();

                }
            });

        } else {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable();
        }
    });

    //accion para cargar la tabla
    $('#bt-agregar').click(function () {

        if ($('#bodega').val() == 0) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "DEBE SELECCIONAR LA BODEGA",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        } else {
            //consume el ws para obtener los datos
            $.ajax({
                url: 'wstraslados.asmx/ObtenerExistenciasPorCodigo',
                data: '{bodega: ' + $('#bodega').val() + ', codigoproducto: "' + $('#producto').val() + '", precio: ' + $('#precioutilizar').val() + ' }',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    if (msg.d.length == 0) {
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡ERROR!',
                            text: "EL PRODUCTO NO ESTA REGISTRADO EN LA BASE DE DATOS",
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'error',
                            stack: false
                        });
                    } else {
                        var desc = $('#DescripcionAdicional').val();
                        var precio = 0;
                        if ($('#miselaneoadd').prop('checked')) {
                            precio = $('#precio').val();
                        } else {
                            precio = msg.d[0].precio;
                        }

                        cargarProducto(msg.d[0].id, msg.d[0].codigo, desc, msg.d[0].cantidad, precio, msg.d[0].tipo, msg.d[0].tipoArt, -1);
                        $('#cantidad').attr('disabled', false);
                    }
                }
            });

        }

    });

    //accion  al momento de acepatar elminar
    $('#bt-eliminar').click(function () {
        $('#bt-eliminar').attr('disabled', true);
        $('#bt-no').attr('disabled', true);

    });

    $('#departamento').change(function () {
        if ($(this).val() > 0) {
            //consume el ws para obtener los datos
            $.ajax({
                url: 'wscargar_datos.asmx/CargarSolicitante',
                data: '{cia: ' + $(this).val() + '}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $.each(msg.d, function () {
                        $('#solicitante').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
                    });
                }
            });
        }
    });

    //accion  para cancelar los datos
    $('#btn-cancelar').click(function () {
        limpiar();
    });

    //evento enter en producto
    $('#bt-agregar-prod').click(function () {
        if ($('#miselaneo').prop('checked')) {
            var descripcion = $('#productoprod').val();
            var cod = 'MIS-' + descripcion.substr(11, 15);


            if ($('#cantidadprod').val() == "" || $('#precioprod').val() == "" || $('#productoprod').val() == "MISELANEO: ") {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: "FALTAN DATOS POR LLENAR",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            } else {

                cargarProductoAProducir(0, cod, descripcion, $('#cantidadprod'), $('#precioprod').val(), 2, 1, 1);
                $('#miselaneo').prop('checked', false);
                $('#cantidadprod').val(1);
                $('#productoprod').val(null);
                $('#precioprod').val(null);
            }

        } else {
            if ($('#bodega').val() == 0) {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: "DEBE SELECCIONAR LA BODEGA",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            } else {
                //consume el ws para obtener los datos
                $.ajax({
                    url: 'wstraslados.asmx/ObtenerExistenciasPorCodigo',
                    data: '{bodega: ' + $('#bodega').val() + ', codigoproducto: "' + $('#codigoproductoprod').val() + '",precio: ' + $('#precioutilizar').val() + '  }',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    success: function (msg) {
                        // alert('asdsad' + msg.d[0].id);
                        cargarProductoAProducir(msg.d[0].id, msg.d[0].codigo, msg.d[0].descripcion, msg.d[0].cantidad, msg.d[0].precio, msg.d[0].tipo, msg.d[0].tipoArt, 0);
                    }
                });
            }
        }




    });

    //evento enter en producto
    $('#bt-agregar-prod2').click(function () {

        if ($('#bodega').val() == 0) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "DEBE SELECCIONAR LA BODEGA",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        } else {
            //consume el ws para obtener los datos
            $.ajax({
                url: 'wstraslados.asmx/ObtenerExistenciasPorCodigo',
                data: '{bodega: ' + $('#bodega').val() + ', codigoproducto: "' + $('#codigoproductoprod').val() + '",precio: ' + $('#precioutilizar').val() + '  }',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    // alert('asdsad' + msg.d[0].id);
                    cargarProductoAProducirInicial(msg.d[0].id, msg.d[0].codigo, msg.d[0].descripcion, msg.d[0].cantidad, msg.d[0].precio, msg.d[0].tipo, msg.d[0].tipoArt);
                }
            });
        }

    });

    //evento enter en producto
    $('#producto').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);

        if ($('#bodega').val() == 0) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "DEBE SELECCIONAR LA BODEGA",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        } else {
            if (keycode == 13) {
                //consume el ws para obtener los datos
                $.ajax({
                    url: 'wstraslados.asmx/ObtenerExistenciasPorCodigo',
                    data: '{bodega: ' + $('#bodega').val() + ', codigoproducto: "' + $('#producto').val() + '",precio: ' + $('#precioutilizar').val() + '  }',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    success: function (msg) {
                        if (msg.d.length == 0) {
                            $('.jq-toast-wrap').remove();
                            $.toast({
                                heading: '¡ERROR!',
                                text: "EL PRODUCTO NO ESTA REGISTRADO EN LA BASE DE DATOS",
                                position: 'bottom-right',
                                showHideTransition: 'plain',
                                icon: 'error',
                                stack: false
                            });
                        } else {
                            cargarProducto(msg.d[0].id, msg.d[0].codigo, msg.d[0].descripcion, msg.d[0].cantidad, msg.d[0].precio, msg.d[0].tipo, msg.d[0].tipoArt, -1);
                        }
                    }
                });
            }
        }

    });

    //acciion para producir
    $('#btn-producir').click(function () {
        var codigo = $('#tx-codproducir').text();
        var id = $('#tx-idproducir').text();

        var linea = { 'cantidad': $('#tx-canproducir').text(), 'codigo': codigo, 'descripcion': $('#tx-descproducir').text(), 'id': id, 'precio': $('#nuevo-precio').text(), 'bodega': $('#bodega').val(), 'bo': $('#bodega option:selected').text(), 'tipoArt': 1, 'produccion': datos2, 'estandar': estandar };
        datos.push(linea);


        estandar = 1;
        datos2 = [];

        $('#MdProducir').modal('hide');
        llenarTabla();
    });

    $('#miselaneos').keyup(function () {
        llenarTabla2();
    });

    $('#miselaneoadd').change(function () {

        if ($('#miselaneoadd').prop('checked')) {
            $('#producto').attr('disabled', true);
      
            $.ajax({
                url: 'wsadmin_articulos.asmx/ObtenerCodigoMiselaneo',
                data: '',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $('#producto').val(msg.d);
                }
            });


            $('#pn-descadional').show();
            $('#precio').attr('disabled', false);
            $('#DescripcionAdicional').val(null);
            $('#cantidad').val(1);
            $('#cantidad').attr('disabled', true);
            $('#DescripcionAdicional').focus();
        } else {
            $('#producto').attr('disabled', false);
            $('#pn-descadional').hide();
            $('#producto').val(null);
            $('#precio').val(null);
            $('#precio').attr('disabled', true);
            $('#DescripcionAdicional').val(null);
            $('#cantidad').val(1);
            $('#cantidad').attr('disabled', false);
        }
    });

});

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
function cargarTipoPedido() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarTipoPedido',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#tipoorden').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

function validarForm() {


    var result = true

    var mensaje = 'Existen Datos que debe ingresar para poder realizar la acción solicitada';

    if ($('#idcliente').val() == "" || $('#nit').val() == "") {
        $('#nit').focus();
    }

    if (datos.length == 0) {
        result = false
        mensaje = 'Debe Ingresar al menos un producto a la orden';
        $('#btn-guardar').removeAttr('disabled', true);
        $('#btn-cancelar').removeAttr('disabled', true);

    }


    if ((totalfac - totaldescuento) > parseFloat($('#pago').text())) {
        result = false
        mensaje = 'EL PAGO NO ES SUFICIENTE PARA REALIZAR LA VENTA ';
        $('#btn-guardar').removeAttr('disabled', true);
        $('#btn-cancelar').removeAttr('disabled', true);
    }


    if (!result) {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: mensaje,
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });
    }




    $.ajax({
        url: 'wsvalidaciones.asmx/validarLimiteCredito',
        data: '{usuario: "' + usuario + '", cliente: ' + $('#idcliente').val() + ',valor: 0  }',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (msg) {
            if(!msg.d){
                result = false;
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: 'ADVERTENCIA',
                    text: "LIMITE DE CREDITO ALCANZADO",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'warning',
                    stack: false
                });
            }

        }
    });

    $.ajax({
        url: 'wsvalidaciones.asmx/validarDocumentosCredito',
        data: '{usuario: "' + usuario + '", cliente: ' + $('#idcliente').val() + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (msg) {
            if (!msg.d) {
                result = false;
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: 'ADVERTENCIA',
                    text: "EXISTEN DOCUMENTOS QUE EL CLIENTE DEBE PAGAR PARA PODER REALIZAR ESTE TIPO DE PAGO",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'warning',
                    stack: false
                });
            }
        }
    });


    return result;
}

//metodo para limpiar el formulario
function limpiar() {
    $('#tbody').html(null);
    $('#descuento').val(null);
    $('#diascredito').val(null);
    $('#nombre').val(null);
    $('#nit').val(null);
    $('#idcliente').val(null);


    $('#tbod-datos').html(null);
    $('#tab-datos').dataTable();

    datos = [];
    pagos = [];

    totalfac = 0;
    totaldescuento = 0;
    totefectivo = 0;

    totefectivo = 0;
    totalpagoextra = 0;

    totalcheque = 0;
    totaltarjeta = 0;
    totalregalo = 0;
    totalcredito = 0;
    totalexcersion = 0;



    $('#btn-guardar').removeAttr('disabled', true);
    $('#btn-cancelar').removeAttr('disabled', true);
    $('#btn-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#btn-guardar').removeClass('btn-info');
    $('#btn-guardar').removeClass('btn-warning');
    $('#btn-guardar').addClass('btn-success');
}

// funcion para cargar datos en el formulario
function eliminar(id) {
    datos.splice(id, 1)
    $('.jq-toast-wrap').remove();
    $.toast({
        heading: '¡Informacion!',
        text: "SE HA REMOVIDO UN PRODUCTO DE LA TABLA",
        position: 'bottom-right',
        showHideTransition: 'plain',
        icon: 'info',
        stack: false
    });

    llenarTabla();


}

function eliminarprod(id) {
    datos2.splice(id, 1)
    $('.jq-toast-wrap').remove();
    $.toast({
        heading: '¡Informacion!',
        text: "SE HA REMOVIDO UN PRODUCTO DE LA TABLA DE PRODUCCION",
        position: 'bottom-right',
        showHideTransition: 'plain',
        icon: 'info',
        stack: false
    });



    $('#tbodyprod').html(null);
    for (var i = 0; i < datos2.length; i++) {
        var tds = '<tr><td>' + datos2[i].codigo + '</td><td>' + datos2[i].descripcion + '</td><td>' + datos2[i].bo + '</td><td>' + datos2[i].cantidad + '</td><td onclick="eliminarprod(' + i + ')"><center><button class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></center></td></tr>'

        $('#tbodyprod').append(tds);
    };

    $('#codigoproductoprod').val(null);
    $('#productoprod').val(null);
    $('#idproductoprod').val(null);
    $('#precioprod').val(null);
    $('#cantidadprod').val(1);
    $('#productoprod').focus();
}

function cargarBodegas() {
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_bodegas.asmx/ObtenerDatosPorSucursal',
        data: '{usuario: "' + usuario + '"}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {

                if (this.prioridad == 1) {
                    $('#bodega').append('<option value="' + this.id + '" selected>' + this.descripcion + '</option>');
                    $('#bodega').attr('disabled', true);
                } else {
                    $('#bodega').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
                }

            });
        }
    });
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


function cargarProducto(id, codigo, descripcion, cantidad, precio, tipo, tipoArt) {
    var cantidadTotal = 0;
    var existe = false;
    var posicion = 0;

    $('#precio').val(precio);


    for (var i = 0; i < datos.length; i++) {
        if (datos[i].codigo == codigo && datos[i].bodega == $('#bodega').val() && datos[i].precio == precio) {
            cantidadTotal = parseInt(datos[i].cantidad) + parseInt($('#cantidad').val());
            posicion = i;
            existe = true;
        }
    };


    if ($('#cantidad').val() == "") {
        $('.jq-toast-wrap').remove();
        $('#cantidad').val(1);
    }

    if (tipo == 1) {
        $('#miselaneo').prop('checked', false);
        $('#tx-idproducir').text(id);
        $('#tx-canproducir').text($('#cantidad').val());
        $('#tx-codproducir').text(codigo);
        $('#tx-descproducir').text(descripcion);
        $('#tx-precioproducir').text(precio);
        $('#btn-md-producir').click();



        $('#miselaneos').val(0);

        datos2 = [];
        simples = [];
        newPrecio = 0;
        precioInicial = precio;
        $('#nuevo-precio').text(parseFloat(precio).toFixed(2));

        $.ajax({
            url: 'wstraslados.asmx/ObtenerExistenciasPorBodegaSimple',
            data: '{bodega : ' + $('#bodega').val() + '}',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (msg) {
                $.each(msg.d, function () {
                    var dat = { 'data': this.codigo + " - " + this.descripcion, 'codigo': this.codigo, 'nombre': this.descripcion, 'id': this.id }
                    simples.push(dat);
                });
            }
        });

        var options1 = {
            data: simples,

            getValue: function (element) {
                return element.data
            },
            list: {
                match: {
                    enabled: true
                },
                onSelectItemEvent: function () {
                    var value = $("#productoprod").getSelectedItemData().codigo;
                    var value2 = $('#productoprod').getSelectedItemData().nombre;
                    var value3 = $('#productoprod').getSelectedItemData().id;

                    $("#codigoproductoprod").val(value).trigger("change");
                    $("#nomproductoprod").val(value2).trigger("change");
                    $("#idproductoprod").val(value3).trigger("change");
                }
            },
        }

        $("#productoprod").easyAutocomplete(options1);

        $.ajax({
            url: 'wscombos.asmx/obtenerDetalleAnterior',
            data: '{idcombo : ' + id + '}',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (msg) {
                $.each(msg.d, function () {

                    $('#cantidadprod').val(this.cantidad);
                    $('#idproductoprod').val(this.id);
                    $('#codigoproductoprod').val(this.codigo);
                    $('#nomproductoprod').val(this.descripcion);
                    $('#precioprod').val(this.precio);
                    $('#bt-agregar-prod2').click();
                });

            }
        });


    }
    else {
        if (!existe) {


            if (validarCantidad(id, $('#cantidad').val(), $('#bodega').val())) {
                var linea = { 'cantidad': $('#cantidad').val(), 'codigo': codigo, 'descripcion': descripcion, 'id': id, 'precio': $('#precio').val(), 'bodega': $('#bodega').val(), 'bo': $('#bodega option:selected').text(), 'tipoArt': tipoArt, 'produccion': datos2, 'estandar': 1 };
                datos2 = [];
                datos.push(linea);
                $('#cantidad').val(1);
            } else {
                $.toast({
                    heading: '¡ERROR!',
                    text: "EL PRODUCTO NO POSEE LA SUFICIENTE EXISTENCIA",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }



        } else {
            var cantidadTot = parseInt(datos[posicion].cantidad) + parseInt($('#cantidad').val());
            if (validarCantidad(id, cantidadTot, $('#bodega').val())) {
                datos[posicion].cantidad = cantidadTot;

            } else {
                $.toast({
                    heading: '¡ERROR!',
                    text: "EL PRODUCTO NO POSEE LA SUFICIENTE EXISTENCIA",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }




        }
    }
    llenarTabla();
    $('#codigoproducto').val(null);
    $('#producto').val(null);
    $('#idproducto').val(null);
    $('#precio').val(null);
    $('#cantidad').val(1);
    $('#producto').focus();


    $('#producto').attr('disabled', false);
    $('#pn-descadional').hide();
    $('#producto').val(null);
    $('#precio').val(null);
    $('#precio').attr('disabled', true);
    $('#miselaneoadd').prop('checked', false);
    $('#pn-descadional').hide();
    $('#DescripcionAdicional').val(null);
}

function cargarProductoAProducirInicial(id, codigo, descripcion, cantidad, precio, tipo, tipoArt) {
    var cantidadTotal = 0;
    var existe = false;
    var posicion = 0;


    for (var i = 0; i < datos2.length; i++) {


        if (datos2[i].codigo == codigo && datos2[i].bodega == $('#bodega').val()) {

            cantidadTotal = parseInt(datos2[i].cantidad) + parseInt($('#cantidadprod').val());
            posicion = i;
            existe = true;
        }

    };

    if ($('#cantidadprod').val() == "") {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: '¡ERROR!',
            text: "INGRESE LA CANTIDAD DE PRODUCTOS A VENDER",
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'error',
            stack: false
        });

    }
    else {


        if (!existe) {

            if (validarCantidad(id, $('#cantidad').val(), $('#bodega').val())) {
                var linea = { 'cantidad': $('#cantidadprod').val(), 'codigo': codigo, 'descripcion': descripcion, 'id': id, 'precio': precio, 'bodega': $('#bodega').val(), 'bo': $('#bodega option:selected').text(), 'tipoArt': tipoArt, 'aumento': 0 };
                datos2.push(linea);

            } else {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: "NO EXISTE SUFICIENTE CANTIDAD DE ESTE PRODUCTO",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }



        } else {

            if (validarCantidad(id, $('#cantidad').val(), $('#bodega').val())) {
                datos2[posicion].cantidad = cantidadTotal;
            } else {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: "NO EXISTE SUFICIENTE CANTIDAD DE ESTE PRODUCTO",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }


        }



        llenarTabla2();
        $('#codigoproductoprod').val(null);
        precioInicial = parseFloat($('#nuevo-precio').text());
        $('#codigoproductoprod').val(null);
        $('#productoprod').val(null);
        $('#idproductoprod').val(null);
        $('#precioprod').val(null);
        $('#cantidadprod').val(1);
        $('#productoprod').focus();

    }
}

function cargarProductoAProducir(id, codigo, descripcion, cantidad, precio, tipo, tipoArt, miselaneo) {
    var cantidadTotal = 0;
    var existe = false;
    var posicion = 0;

    estandar = 0;

    for (var i = 0; i < datos2.length; i++) {


        if (datos2[i].codigo == codigo && datos2[i].bodega == $('#bodega').val()) {

            cantidadTotal = parseInt(datos2[i].cantidad) + parseInt($('#cantidadprod').val());
            posicion = i;
            existe = true;
        }

    };

    if ($('#cantidadprod').val() == "") {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: '¡ERROR!',
            text: "INGRESE LA CANTIDAD DE PRODUCTOS A VENDER",
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'error',
            stack: false
        });

    }
    else {


        if (!existe) {
            if (validarCantidad(id, $('#cantidad').val(), $('#bodega').val())) {
                var linea = { 'cantidad': $('#cantidadprod').val(), 'codigo': codigo, 'descripcion': descripcion, 'id': id, 'precio': precio, 'bodega': $('#bodega').val(), 'bo': $('#bodega option:selected').text(), 'tipoArt': tipoArt, 'aumento': precio, 'miselaneo': miselaneo };
                datos2.push(linea);
            } else {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: "NO EXISTE SUFICIENTE CANTIDAD DE ESTE PRODUCTO",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }
        } else {
            if (validarCantidad(id, $('#cantidad').val(), $('#bodega').val())) {
                datos2[posicion].cantidad = cantidadTotal;
                var aumento = parseFloat(datos2[posicion].aumento) + parseFloat(precio);
                datos2[posicion].aumento = aumento;
            } else {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: "NO EXISTE SUFICIENTE CANTIDAD DE ESTE PRODUCTO",
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }


        }

        llenarTabla2();
        $('#codigoproductoprod').val(null);

        $('#codigoproductoprod').val(null);
        $('#productoprod').val(null);
        $('#idproductoprod').val(null);
        $('#precioprod').val(null);
        $('#cantidadprod').val(1);
        $('#productoprod').focus();

    }
}

function Restar(posicion) {
    if (datos[posicion].cantidad <= 1) {
        eliminar(posicion);
    } else {
        datos[posicion].cantidad = parseInt(datos[posicion].cantidad) - 1;

        llenarTabla();
    }

}

function Restarprod(posicion) {
    estandar = 0;
    if (datos2[posicion].cantidad <= 1) {
        eliminarprod(posicion);
    } else {
        var newaumento = parseFloat(datos2[posicion].aumento) - parseFloat(datos2[posicion].precio);

        if (newaumento < 0) {
            datos2[posicion].aumento = 0;
        } else {
            datos2[posicion].aumento = newaumento;
        }

        datos2[posicion].cantidad = parseInt(datos2[posicion].cantidad) - 1;
        llenarTabla2();
    }

}

function Sumar(posicion) {


    var id = datos[posicion].id;
    var cantidad = parseInt(datos[posicion].cantidad) + 1;
    var bodega = datos[posicion].bodega;

    if (validarCantidad(id, cantidad, bodega)) {
        datos[posicion].cantidad = parseInt(datos[posicion].cantidad) + 1;
        llenarTabla();
    } else {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: '¡ERROR!',
            text: "NO EXISTE SUFICIENTE CANTIDAD DE ESTE PRODUCTO",
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'error',
            stack: false
        });
    }
}

function Sumarprod(posicion) {

    var id = datos2[posicion].id;
    var cantidad = parseInt(datos2[posicion].cantidad) + 1;
    var bodega = datos2[posicion].bodega;


    if (validarCantidad(id, cantidad, bodega)) {
        estandar = 0;
        datos2[posicion].cantidad = parseInt(datos2[posicion].cantidad) + 1;
        var aumento = parseFloat(datos2[posicion].aumento) + parseFloat(datos2[posicion].precio);
        datos2[posicion].aumento = aumento;
        llenarTabla2();
    } else {
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: '¡ERROR!',
            text: "NO EXISTE SUFICIENTE CANTIDAD DE ESTE PRODUCTO",
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'error',
            stack: false
        });
    }
}

function llenarTabla() {
    var total = 0;
    $('#tbody').html(null);
    for (var i = 0; i < datos.length; i++) {
        total += parseFloat(datos[i].cantidad) * parseFloat(datos[i].precio);
        var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].bo + '</td><td>' + datos[i].cantidad + '</td><td style="text-align: right">' + parseFloat(datos[i].precio).toFixed(2) + '</td><td style="text-align: right">' + (parseFloat(datos[i].cantidad) * parseFloat(datos[i].precio)).toFixed(2) + '</td>' +
            '<td><center><button class="btn btn-warning btn-sm" onclick="Restar(' + i + ')"><i class="material-icons" style="color:white">remove</i></button>' +
            '<button style="margin-left:5px" class="btn btn-success btn-sm" onclick="Sumar(' + i + ')"><i class="material-icons">add</i></button>' +
            '<button style="margin-left:5px" class="btn btn-danger btn-sm" onclick="eliminar(' + i + ')"><i class="material-icons">delete_forever</i></button></center>' +
            '</td></tr>'

        $('#tbody').append(tds);
    };



    var descuento = 0;



    if ($('#descuento').val() != "") {
        descuento = parseFloat($('#descuento').val()) / 100;
    }

    totaldescuento = parseFloat(total * descuento).toFixed(2);


    if (total > 0) {
        td = '<tr><td> -- </td><th> <b>DESCUENTO</b> </th><td><center> --- </center></td><td><center> --- </center><td><center> --- </center></td><td style="text-align: right"><b> - ' + totaldescuento + '</b></td><td></td></tr>'
        $('#tbody').append(td);
    }


    if (total > 0) {
        td = '<tr><td> -- </td><th> <b>TOTAL</b> </th><td><center> --- </center></td><td><center> --- </center><td><center> --- </center></td><td style="text-align: right"><b>' + parseFloat(total - totaldescuento).toFixed(2) + '</b></td><td></td></tr>'
        $('#tbody').append(td);
    }

    totalfac = total;


}

function llenarTabla2() {
    var newPrecio = 0;

    $('#tbodyprod').html(null);
    for (var i = 0; i < datos2.length; i++) {
        newPrecio += parseFloat(datos2[i].aumento);
        var tds = '<tr><td>' + datos2[i].codigo + '</td><td>' + datos2[i].descripcion + '</td><td>' + datos2[i].bo + '</td><td>' + datos2[i].cantidad + '</td>' +
            '<td><center>' +
            '<button  class="btn btn-warning btn-sm" onclick="Restarprod(' + i + ')"><i class="material-icons" style="color:white">remove</i></button>' +
            '<button style="margin-left:5px" class="btn btn-success btn-sm" onclick="Sumarprod(' + i + ')"><i class="material-icons">add</i></button>' +
            '<button style="margin-left:5px" class="btn btn-danger btn-sm" onclick="eliminarprod(' + i + ')"><i class="material-icons">delete_forever</i></button>' +
            '</center></td></tr>'


        $('#tbodyprod').append(tds);
    };

    var precioactual = parseFloat(precioInicial);
    $('#tx-precioproducir').text(precioactual + parseFloat(newPrecio));
    $('#nuevo-precio').text(precioactual + parseFloat(newPrecio));
}

function cerrarModal() {
    $("#Mdbuscar").modal().hide();//ocultamos el modal
    $('#Mdbuscar').removeData();
    $('#Mdbuscar').data('modal', null);
    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
    $('.modal-backdrop').remove();



}

function eliminarPago(id, tipo, valor) {
    pagos.splice(id, 1)

    if (tipo == 1) {
        totefectivo = 0;

    } else {
        var info = "";
        for (var i = 0; i < pagos.length; i++) {
            if (pagos[i].tipo = 1) {

                var camb = 0;
                if (parseFloat($('#cambio').text()) >= parseFloat(valor)) {
                    var resta = parseFloat($('#cambio').text()) - parseFloat(valor);
                    camb = parseFloat(pagos[i].valor) - resta;
                } else {
                    camb = 0;
                }

                if (camb < 0) {
                    info = "DINERO EN EFECTIVO: " + pagos[i].valor
                    pagos[i].cambio = 0;
                } else {
                    info = "DINERO EN EFECTIVO: " + pagos[i].valor + " CAMBIO " + camb;
                    pagos[i].cambio = camb;
                }
                pagos[i].informacion = info;
            }
        }


        totalpagoextra = totalpagoextra - valor
    }


    $('.jq-toast-wrap').remove();
    $.toast({
        heading: '¡Informacion!',
        text: "SE HA REMOVIDO UN TIPO DE PAGO DE LA TABLA",
        position: 'bottom-right',
        showHideTransition: 'plain',
        icon: 'info',
        stack: false
    });



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

        if (parseFloat(total_pago) >= parseFloat(totalfac - totaldescuento)) {
            $('#lb-pago').addClass('text-success');
            $('#lb-cambio').addClass('text-success');
            $('#lb-pago').removeClass('text-danger');
            $('#lb-cambio').removeClass('text-danger');
            $('#cambio').text(parseFloat(total_pago - (totalfac - totaldescuento)).toFixed(2));
        } else {
            $('#lb-pago').removeClass('text-success');
            $('#lb-cambio').removeClass('text-success');
            $('#lb-pago').addClass('text-danger');
            $('#lb-cambio').addClass('text-danger');
            $('#cambio').text('INSUFICIENTE');
        }


    } else {
        $('#cambio').text('0.00');
        $('#pago').text('0.00');
    }


   
    $('#tipopago').val(0);
    $('.pn-pagos').hide();
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


function validarCantidad(id, cantidad, bodega) {
    var result = false;
    $.ajax({
        url: 'wsvalidaciones.asmx/validarexistencia',
        data: '{idart : ' + id + ', cantidad: ' + cantidad + ', bodega: ' + bodega + ', usuario: "' + usuario + '"}',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            result = msg.d;
        }
    });

    return result
}