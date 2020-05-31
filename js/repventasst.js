$(function () {
    getSucursales();
    getRegiones();
    getCliente();

    var data = [];
    var options = {
        data: data,

        getValue: function (element) {
            return element.descripcion
        },



        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                var value = $("#cliente").getSelectedItemData().id;
                $("#idclt").val(value).trigger("change");
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
                    data.push({ 'descripcion': this.descripcion, 'id': this.id });
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
            url: 'wsrepvetnasst.asmx/Consultar',
            data: '{fechaIni: "' +fecha1 + '",fechaFin: "' + fecha2 + '", region : "' + $('#region').val() + '",  suc: "' + $('#sucursal').val() + '"}',
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

                var factura = 0;
                var nota = 0;
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.documento + '</td>';
                    tds = tds + '<td>' + this.correlativo + '</td>';
                    tds = tds + '<td>' + this.serie + '</td>';
                    tds = tds + '<td>' + this.usuario + '</td>';
                    tds = tds + '<td>' + this.monto + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td>' + this.estado + '</td>';
                    tds = tds + '</tr>';

                    if (this.documento == 'FACTURA') {



                        factura += parseFloat(String(this.monto).replace(/,/g, ""))
                    } else if (this.documento == 'NOTA DE CREDITO') {
                        nota += parseFloat(String(this.monto).replace(/,/g, ""))
                    }


                });

                $("#tbod-datos").append(tds);
                $('#tab-datos').dataTable();


                $("#tbod-datos2").html(null);

                var td = '<tr>' +
                    '<td>TOTAL FACTURADO</td>' + 
                    '<td style="text-align: right">'+ factura.toFixed(2) +'</td>' + 
                    '</tr>'  
                $("#tbod-datos2").append(td);

                td = '<tr>' +
                    '<td>TOTAL NOTA DE CREDITO</td>' +
                    '<td style="text-align: right">' + nota.toFixed(2) + '</td>' +
                    '</tr>'
                $("#tbod-datos2").append(td);


                td = '<tr>' +
                    '<td>DIFERENCIA</td>' +
                    '<td style="text-align: right"><b>' + (factura - nota).toFixed(2) + '</b></td>' +
                    '</tr>'
                $("#tbod-datos2").append(td);


                $('#btndescargar').attr('hidden', false);
            }

        });
    });


    $('#btndescargar').click(function () {


        var fecha1 = $('#inicio').val();
        var fecha2 = $('#fin').val();

        var fechax = fecha1.split("/");
        fecha1 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        fechax = fecha2.split("/");
        fecha2 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]

        $.ajax({
            type: 'POST',
            url: 'wsrepvetnasst.asmx/GenerarPdf',
            data: '{fechaIni: "' + fecha1 + '",fechaFin: "' + fecha2 + '", region : "' + $('#region').val() + '",  suc: "' + $('#sucursal').val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
            },
            success: function (msg) {
                //alert(msg.d);
                window.open(msg.d);
            }

        });
    });
});



//obtener regiones
function getSucursales() {
    var empresa = 1;
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepcompras.asmx/getsuc",
        data: '{id : 1}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';
            });

            $('#sucursal').append(tds);
        }
    });
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


