var usuario = window.atob(getCookie("us"));


var datos = [];
var total_cobro = 0;
var descuento_cobro = 0;
$(function () {

    $('input[name="datepicker"]').daterangepicker({
        timePicker: false,
        singleDatePicker: true,
        startDate: moment(),
        endDate: moment(),
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

    cargarBodegas();
    cargarFrecuencia();
    mostrarDatos();
    var ultimaBusqueda = '';
    $("#cliente").chosen();
    $("#producto").chosen();


    $("#cliente_chosen .chosen-search-input").autocomplete({

        minLength: 3,
        source: function (request, response) {
            if (ultimaBusqueda != request.term) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "wsadmin_clientes.asmx/ObtenerDatosBusqueda",
                    data: '{busqueda : "' + $("#cliente_chosen .chosen-search-input").val() + '"}',
                    dataType: "json",
                    success: function (data) {
                        var dataAnterior = $("#cliente_chosen .chosen-search-input").val()
                        var texto1 = '<option value="0"></option>';
                        $('#cliente').html(texto1);
                        $.each(data.d, function () {
                            var texto = '<option value="' + this.id + '">' + this.nit + ' (' + this.nombre + ')</option>';
                            $('#cliente').append(texto);

                        });
                        $("#cliente").trigger('chosen:updated');
                        $("#cliente_chosen .chosen-search-input").val(dataAnterior)
                        ultimaBusqueda = dataAnterior
                    },
                    error: function (result) {
                        alert("Error");
                    }
                });
            }
        }
    });

    $("#producto_chosen .chosen-search-input").autocomplete({
        minLength: 3,
        source: function (request, response) {
            if (ultimaBusqueda != request.term) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "wstraslados.asmx/ObtenerExistenciasSinBodegaServicio",
                    data: '{busqueda : "' + $("#producto_chosen .chosen-search-input").val() + '"}',
                    dataType: "json",
                    success: function (data) {
                        var dataAnterior = $("#producto_chosen .chosen-search-input").val()
                        var texto1 = '<option value="0"></option>';
                        $('#producto').html(texto1);
                        $.each(data.d, function () {
                            var texto = '<option value="' + this.codigo + '">' + this.codigo + '-' + this.descripcion + '</option>';
                            $('#producto').append(texto);
                        });
                        $("#producto").trigger('chosen:updated');
                        $("#producto_chosen .chosen-search-input").val(dataAnterior)
                        ultimaBusqueda = dataAnterior
                    },
                    error: function (result) {
                        alert("Error");
                    }
                });
            }
        },
        change: function (event, ui) {

        }
    });

    $("#producto").change(function () {
        $.ajax({
            url: 'wstraslados.asmx/ObtenerProductoSinBodegaServicio',
            data: '{codigoproducto: "' + $('#producto').val() + '"}',
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
                    $('#idproducto').val(msg.d[0].id);
                    $('#codigoproducto').val(msg.d[0].codigo);
                    $('#nombreproducto').val(msg.d[0].descripcion);
                    $('#precio').val(msg.d[0].precio);
                }
            }
        });
    });

    $('#bt-agregar').click(function () {
        var cantidad = $('#cantidad').val();
        var id = $('#idproducto').val();
        var codigo = $('#codigoproducto').val();
        var nombreproducto = $('#nombreproducto').val();


        if (cantidad == "" || id == "" || codigoproducto == "" || nombreproducto == "") {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: "EXISTEN DATOS AUN POR LLENAR",
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }  else {
           
            var existe = false;
            var posicion = 0;



            for (var i = 0; i < datos.length; i++) {


               if (datos[i].codigo == codigo) {

                    cantidadTotal = parseInt(datos[i].cantidad) + parseInt($('#cantidad').val());
                    posicion = i;
                    existe = true;
               }

            }


            if (!existe) {
                var linea = { 'cantidad': $('#cantidad').val(), 'codigo': codigo, 'descripcion': nombreproducto, 'id': id, 'precio': $('#precio').val()};
               datos.push(linea);


            } else {
                datos[posicion].cantidad = cantidadTotal;
            }

        }

        


        llenarTablas();
        var texto1 = '<option value="0"></option>';
        $('#producto').html(texto1);
        $("#producto").trigger('chosen:updated');
        $('#cantidad').val(null);
        $('#idproducto').val(null);
        $('#codigoproducto').val(null);
        $('#nombreproducto').val(null);
        $('#existencia').val(null);
        $('#tipoArt').val(null);
        $('#precio').val(0);
    });

    $('#bt-guardar').click(function () {

        var urlx = '';
        var datax = '';

        var id = $('#id').val();


        if (id > 0) {
            urlx = 'Actualizar';
            datax = '{idcliente  :   "' + $('#cliente').val() + '", fecha  :   "' + $('#fecha_inicio').val() + '", frecuencia  :  ' + $('#frecuencia').val() + ',  total  :   ' + total_cobro + ', tipo  :  ' + $('#tipo').val() + ', listproductos  :  ' + JSON.stringify(datos) + ', usuario  :   "' + usuario + '",  cantidad  :  ' + $('#cantidad_frecuente').val() + ', ultimodia  :  ' + $('#ultimodia').val() + ',  descuento  :  ' + descuento_cobro + ', id: '+ id +'}'
        } else {
            urlx = 'Insertar';
            datax = '{idcliente  :   "' + $('#cliente').val() + '", fecha  :   "' + $('#fecha_inicio').val() + '", frecuencia  :  ' + $('#frecuencia').val() + ',  total  :   ' + total_cobro + ', tipo  :  ' + $('#tipo').val() + ', listproductos  :  ' + JSON.stringify(datos) + ', usuario  :   "' + usuario + '",  cantidad  :  ' + $('#cantidad_frecuente').val() + ', ultimodia  :  ' + $('#ultimodia').val() + ',  descuento  :  ' + descuento_cobro + '}'
        }


        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmincobrosrecurentes.asmx/' + urlx,
            data: datax,
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

                $('#MdNuevo').modal('hide');
                if (arr[0] == 'SUCCESS') {

                        $('#id').val(0);
                       
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡EXITO!',
                            text: arr[1],
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'success',
                            stack: false
                        });
                    mostrarDatos();
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

    $('#bt-eliminar').click(function () {


        var id = $('#iddel').val();


        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmincobrosrecurentes.asmx/Eliminar',
            data: '{id: '+ id +'}',
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

                $('#MdNuevo').modal('hide');
                if (arr[0] == 'SUCCESS') {

                    $('#id').val(0);

                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡EXITO!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'success',
                        stack: false
                    });

                    limpiar();
                    mostrarDatos();

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

}

function llenarTablas() {
    var total = 0;
    $('#tbody').html(null);

    for (var i = 0; i < datos.length; i++) {
        total += parseFloat(datos[i].cantidad) * parseFloat(datos[i].precio);
       
        var tds = '<tr><td>' + datos[i].codigo + '</td><td>' + datos[i].descripcion + '</td><td>' + datos[i].cantidad + '</td><td style="text-align: right">' + parseFloat(datos[i].precio).toFixed(2) + '</td><td style="text-align: right">' + (parseFloat(datos[i].cantidad) * parseFloat(datos[i].precio)).toFixed(2) + '</td><td onclick="eliminar(' + i + ')"><center><button class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i></button></center></td></tr>'

        $('#tbody').append(tds);
    };

    var totaldescuento = 0;
    if (parseFloat(total) > 0) {
        td = `<tr>
                <td><center>---</center></td>
                <td><b>DESCUENTO</b></td>
                <td><center>---</center></td>
                <td  style="text-align: right">${totaldescuento.toFixed(2)}</td>
                <td  style="text-align: right">${totaldescuento.toFixed(2)}</td>
                <td></td>
              </tr>`;
        console.log('llego')
       
        $('#tbody').append(td);
    }

    if (total > 0) {
        console.log('llego')
        td = `<tr>
                <td><center>---</center></td>
                <td><b>TOTAL</b></td>
                <td><center>---</center></td>
                <td  style="text-align: right">${total.toFixed(2)}</td>
                <td  style="text-align: right">${total.toFixed(2)}</td>
                <td></td>
              </tr>`
        $('#tbody').append(td);
    }

    console.log(total)
    descuento_cobro = totaldescuento;
    total_cobro = total;
}


function cargarFrecuencia() {
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmincobrosrecurentes.asmx/ObtenerFrecuencia',
        data: '{usuario: "' + usuario + '"}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                $('#frecuencia').append('<option value="' + this.id + '">' + this.descripcion + '</option>')

            });
        }
    });
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


//metodo utilizado para mostrar lista de datos 
function mostrarDatos() {
    limpiar();
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmincobrosrecurentes.asmx/ObtenerDatos',
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
                tds = "<tr class='odd'><td>" + i + "</td><td>" + this.cliente + "</td><td>" + this.proximafecha + "</td><td>" + this.frecuencia + "</td><td>" + this.tipo + "</td><td> " +
                    `<span onclick='cargarenFormulario(${this.id},${this.idfrecuencia},${this.cantidad},${this.ultimo},"${this.fecha}","${this.cliente}",${this.idcliente},"${this.Nit}")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' >    ` +
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

function cargarenFormulario(id,frecuencia,cantidad,ultimo,fecha,cliente,idcliente,nit) {
    $('#MdNuevo').modal('show');
    $('#id').val(id);
    $('#frecuencia').val(frecuencia);
    $('#cantidad_frecuente').val(cantidad);
    $('#ultimodia').val(ultimo);
    $('#fecha_inicio').val(fecha);
    $('#cliente').append('<option selected value="' + idcliente + '">' + nit + ' (' + cliente +')</option>');
    $("#cliente").trigger('chosen:updated');


    $.ajax({
        url: 'wsadmincobrosrecurentes.asmx/ObtenerDetalle',
        data: '{id:'+ id +'}' ,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
           
        },
        success: function (msg) {
           
            $.each(msg.d, function () {
                datos = msg.d;
                
            });
            llenarTablas();
           
        }
    });

}


function eliminar(id) {
    $('#MdDeshabilitar').modal('show')
    $('#iddel').val(id);
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
