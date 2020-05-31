$(function () {
    ObtenerDatos();

  
});


//obtener regiones
function ObtenerDatos() {
    $.ajax({
        type: 'POST',
        url: 'wsreporteminimos.asmx/ObtenerMinimos',
        data: '',
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
                tds = tds + '<td>' + this.existencia + '</td>';
                tds = tds + '<td>' + this.consumo_medio + '</td>';
                tds = tds + '<td>' + this.semanas + '</td>';
               // tds = tds + '<td style="text-align: right;">' + this.existencia + '</td>';
               // tds = tds + '<td style="text-align: right;">' + this.facturar + '</td>';
               // tds = tds + '<td style="text-align: right;">' + this.costoUnit + '</td>';
               // tds = tds + '<td style="text-align: right;">' + this.precio + '</td>';
               // tds = tds + '<td style="text-align: right;">' + this.costoTotal + '</td>';
                tds = tds + '</tr>';
            });

            $("#tbod-datos").append(tds);
            $('#tab-datos').dataTable();
        }

    });
}