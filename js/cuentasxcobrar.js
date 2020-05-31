﻿$(function () {
    consultar();

    //metodo utilizado para obtener el reporte de existencias
    function consultar() {
        $.ajax({
            type: 'POST',
            url: 'wsrepcuentasxcobrar.asmx/consultar',
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#datos').html('<center><h3>Cargando...</h3></center>');
            },
            success: function (msg) {
                $('#datos').empty();
                var tds = "";

                var tottreinta = 0;
                var totsesenta = 0;
                var totnoventa = 0;
                var totnoventamas = 0;
                var total = 0;

                $.each(msg.d, function () {

                    tottreinta += parseFloat(this.treinta);
                    totsesenta += parseFloat(this.sesenta);
                    totnoventa += parseFloat(this.noventa);
                    totnoventamas += parseFloat(this.noventamas);
                    total += (parseFloat(this.treinta) + parseFloat(this.sesenta) + parseFloat(this.noventa) + parseFloat(this.noventamas));

                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.sucursal + '</td>';
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.idsuc + ",1,\"" + this.sucursal + "\")'>" + this.treinta + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.idsuc + ",2,\"" + this.sucursal + "\")'>" + this.sesenta + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.idsuc + ",3,\"" + this.sucursal + "\")'>" + this.noventa + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.idsuc + ",4,\"" + this.sucursal + "\")'>" + this.noventamas + "</td>";
                    tds = tds + "<td style='text-align: right;' >" + (parseFloat(this.treinta) + parseFloat(this.sesenta) + parseFloat(this.noventa) + parseFloat(this.noventamas)).toFixed(2) + "</td>";
                    tds = tds + '</tr>';
                });

                tds += '<tr class="odd thead-light">';
                tds = tds + '<td>TOTAL</td>';
                tds = tds + "<td style='text-align: right;'>" + tottreinta.toFixed(2) + "</td>";
                tds = tds + "<td style='text-align: right;'>" + totsesenta.toFixed(2) + "</td>";
                tds = tds + "<td style='text-align: right;'>" + totnoventa.toFixed(2) + "</td>";
                tds = tds + "<td style='text-align: right;'>" + totnoventamas.toFixed(2) + "</td>";
                tds = tds + "<td style='text-align: right;' >" + total.toFixed(2) + "</td>";
                tds = tds + '</tr>';


                $("#datos").append(tds);

               


            }

        });
    }

});


function getDetalle(idsucursal, dias, sucursal) {
    if (dias == 1) {
        $('#d').text('0 A 30 dias');
    }
    else if (dias == 2) {
        $('#d').text('31 A 60 dias');
    }
    else if (dias == 3) {
        $('#d').text('61 A 90 dias');
    }
    else if (dias == 4) {
        $('#d').text('90 dias en adelante');
    }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "wsrepcuentasxcobrar.asmx/getDetalle",
        data: '{sucursal: ' + idsucursal + ', dias: ' + dias + '}',
        dataType: "json",
        success: function (data) {
            var table = document.getElementById('data');
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                var row = table.rows[i];
                table.deleteRow(i);
                rowCount--;
                i--;
            }
            var suma = 0
            $.each(data.d, function () {
                suma = this.total;
                var texto = '<tr><td style="text-align: center;">' + this.factura + '</td><td>' + this.cliente + '</td><td style="text-align: center;">' + this.fecha + '</td><td style="text-align: right;">' + this.saldo + '</td><td style="text-align: center;">' + this.dias + '</td></tr>'
                $('#data').append(texto)
            });
            var texto = '<tr><td></td><td></td><td style="text-align: right;">Total:</td><td style="text-align: right;">' + suma + '</td></tr>'
            $('#data').append(texto)
            $('#MdNuevo').modal('toggle');
            $('#com').text(sucursal);

        },
        error: function (result) {

        }
    });

}