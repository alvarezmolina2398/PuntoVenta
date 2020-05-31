$(function () {
    consultar();

    //metodo utilizado para obtener el reporte de existencias
    function consultar() {
        $.ajax({
            type: 'POST',
            url: 'wscuentasPorPagar.asmx/consultar',
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#datos').html('<center><h3>Cargando...</h3></center>');
            },
            success: function (msg) {
                $('#datos').empty();
                var tds = "";
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.proveedor + '</td>';
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.id + ",0,\"" + this.proveedor + "\")'>" + this.atrasados + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.id + ",1,\"" + this.proveedor + "\")'>" + this.treinta + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.id + ",2,\"" + this.proveedor + "\")'>" + this.sesenta + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.id + ",3,\"" + this.proveedor + "\")'>" + this.noventa + "</td>";
                    tds = tds + "<td style='text-align: right;' onclick='getDetalle(" + this.id + ",4,\"" + this.proveedor + "\")'>" + this.noventamas + "</td>";
                    tds = tds + '</tr>';
                });
                $("#datos").append(tds);
            }

        });
    }

});


function getDetalle(id, dias, sucursal) {
    if (dias == 0) {
        $('#d').text('Pagos Atrasados');
    }
    else if (dias == 1) {
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
        url: "wscuentasPorPagar.asmx/GetDetalle",
        data: '{id: ' + id + ', dias: ' + dias + '}',
        dataType: "json",
        success: function (data) {
            var table = document.getElementById('data');
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                var n
                row = table.rows[i];
                table.deleteRow(i);
                rowCount--;
                i--;
            }
            var suma = 0
            $.each(data.d, function () {
                suma += this.valord; 
                var texto = '<tr><td>' + this.factura + '</td><td style="text-align: center;">' + this.fecha + '</td><td>' + this.fecha_limite + '</td><td style="text-align: center;">' + this.dias + '</td><td style="text-align: right;">' + this.valor + '</td></tr>'
                $('#data').append(texto)
            });
            var texto = '<tr><td></td><td></td><td></td><td style="text-align: right;">Total:</td><td style="text-align: right;">' + suma.toFixed(2) + '</td></tr>'
            $('#data').append(texto)
            $('#MdNuevo').modal('toggle');
            $('#com').text(sucursal);

        },
        error: function (result) {

        }
    });

}