﻿$(function () {
    getRegiones();
    $('#left-menu').click();
    var usuario = window.atob(getCookie("usErp"));
    //obtener sucursales
    $('#region').change(function () {
        var tds = "";
        $.ajax({
            type: "POST",
            url: "wsrepexist.asmx/sucursales",
            data: '{empresa : 1, region: ' + $(this).val() + '}',
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
    });

    //obtener bodegas
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

    //obtener bodegas
    $('#btn-descargar').click(function () {
        var region = $('#region').val();
        var sucursal = $('#sucursal').val();
        var bodega = $('#bodega').val();
        $.ajax({
            type: "POST",
            url: "wsrepexist.asmx/consultarPDF",
            data: '{region : '+ region +', sucursal : '+ sucursal +', bodega : '+ bodega +', usr : "'+ usuario +'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                window.open(msg.d);
            }
        });
    });

    //metodo utilizado para obtener el reporte de existencias
    $('#btnConsultar').click(function () {
        var region = 0;
        var sucursal = 0;
        var bodega = 0;
        

        if ($('#region').val() == null) {
            region = 0;
        }
        else{            
           region = $('#region').val();
        }

        if ($('#sucursal').val() == null) {
            sucursal = 0;
        }
        else {
            sucursal = $('#sucursal').val();
        }

        if ($('#bodega').val() == null) {
            bodega = 0;
        }
        else {
            bodega = $('#bodega').val();
        }

        $.ajax({
            type: 'POST',
            url: 'wsrepexist.asmx/consultar',
            data: '{region: ' + region + ',sucursal: ' + sucursal + ',bodega: ' + bodega + '}',
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
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.codigo + '</td>';
                    tds = tds + '<td>' + this.descripcion + '</td>';
                    tds = tds + '<td>' + this.marcas + '</td>';
                    tds = tds + '<td>' + this.color + '</td>';
                    tds = tds + '<td>' + this.bodega + '</td>';
                    tds = tds + '<td style="text-align: right;">' + this.existencia + '</td>';
                    tds = tds + '<td style="text-align: right;">' + this.facturar + '</td>';
                    tds = tds + '<td style="text-align: right;">' + this.costoUnit + '</td>';
                    tds = tds + '<td style="text-align: right;">' + this.precio + '</td>';
                    tds = tds + '<td style="text-align: right;">' + this.costoTotal + '</td>';
                    tds = tds + '</tr>';
                });

                $("#tbod-datos").append(tds);
                $('#tab-datos').dataTable();
            }

        });
    });
});


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