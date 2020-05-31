$(function () {
    getSucursales();
    getCliente();
    getRegiones();

    var data = [];
    var options = {
        data: data,

        getValue: function (element) {
            return element.descripcion
        },

        

        list: {
            match: {
                enabled: true
            }
        },
    }
    $("#cliente").easyAutocomplete(options);

    
    function getCliente() {
        $.ajax({
            url: "wsrepventa.asmx/getClientes",
            data: '{}',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (msg) {
                $.each(msg.d, function () {
                    data.push({ 'descripcion': this.descripcion, 'id' : this.id });
                });
            }
        });
    }

    //formato para date picker
    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });

    
    //obtener sucursales
    $('#sucursal').change(function () {
        var tds = "";
        $.ajax({
            type: "POST",
            url: "wsrepexist.asmx/bodegas",
            data: '{sucursal: ' + $(this).val() + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                tds += '<option selected value="0">Selecione una opcion</option>';
                $.each(msg.d, function () {
                    tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';

                });

                $('#bodega').append(tds);
            }
        });
    });


    $('#region').change(function () {
        getSucursales();
    });

    //metodo utilizado para obtener el reporte de existencias
    $('#btnConsultar').click(function () {

        var fecha1 = $('#inicio').val();
        var fecha2 = $('#fin').val();

        var fechax = fecha1.split("/");
        fecha1 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        fechax = fecha2.split("/");
        fecha2 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]



        $.ajax({
            type: 'POST',
            url: 'wsrepventa.asmx/Consultar',
            data: '{fechaIni: "' + fecha1 + '",fechaFin: "' +fecha2 + '", region : "'+ $('#region').val() +'",  suc: "'+ $('#sucursal').val() +'", cliente: "'+ $('#cliente').val() +'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#tbod-datos').empty();
                $('#tab-datos').dataTable().fnDeleteRow();
                $('#tab-datos').dataTable().fnUpdate();
                $('#tab-datos').dataTable().fnDestroy();
            },
            success: function (msg) {
                var tds = "";
                var totvalor = 0;
                var totsaldo = 0;
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.factura + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td>' + this.cliente + '</td>';
                    tds = tds + '<td>' + this.valor + '</td>';
                    tds = tds + '<td>' + this.estado + '</td>';
                    tds = tds + '<td>' + this.saldo + '</td>';
                    tds = tds + "<td><button  class='btn btn-outline-dark' onclick='getDetalle(" + this.id + ",\"" + this.cliente + "\",\"" + this.factura +"\")'><i class='material-icons'>assignment</i></button></td>";
                    tds = tds + '</tr>';


                    totsaldo += parseFloat(this.saldo);
                    totvalor += parseFloat(this.valor);

                });

                $('#totsaldo').text(totsaldo);
                $('#totvalor').text(totvalor);

                $("#tbod-datos").append(tds);
                $('#tab-datos').dataTable();
            }

        });
    });

    $('#btndescargar').click(function () {
        var usr = window.atob(getCookie("usErp"));

        var fecha1 = $('#inicio').val();
        var fecha2 = $('#fin').val();

        var fechax = fecha1.split("/");
        fecha1 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        fechax = fecha2.split("/");
        fecha2 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        $.ajax({
            type: 'POST',
            url: 'wsrepventa.asmx/generarPDF',
            data: '{usr: "' + usr + '",fechaIni: "' + fecha1 + '",fechaFin: "' + fecha2 + '", region : "' + $('#region').val() + '",  suc: "' + $('#sucursal').val() + '", cliente: "' + $('#cliente').val() +'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                //alert(msg.d);
                window.open(msg.d);
            }
        });

    });
});



//obtener regiones
function getSucursales() {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepcompras.asmx/getsuc",
        data: '{id : '+ $('#region').val() +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';
            });

            $('#sucursal').html(tds);
        }
    });
}


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



//obtener regiones
function getRegiones() {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepexist.asmx/regiones",
        data: '{empresa : 1}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';

            });

            $('#region').append(tds);
        }
    });
}

function getDetalle(compra, prov,factura) {
    $.ajax({
        type: 'POST',
        url: 'wsrepventa.asmx/consultarDet',
        data: '{id: ' + compra + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

            $("#datos").empty();
        },
        success: function (msg) {
            var tot = parseFloat(0);
            $('#com').text(factura);
            $('#prov').text(prov);
            $('#MdNuevo').modal('toggle');
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.bodega + '</td>';
                tds = tds + '<td>' + this.codigo + '</td>';
                tds = tds + '<td>' + this.descripcion + '</td>';
                tds = tds + '<td style="text-align: right;">' + this.cantidad + '</td>';
                tds = tds + '<td style="text-align: right;">' + this.precio + '</td>';
                tds = tds + '<td style="text-align: right;">' + this.total + '</td>';
                tot = this.tot;
                tds = tds + '</tr>';

            });
            $('#totalf').html(tot);
            $("#datos").append(tds);

        }

    });    
}
 