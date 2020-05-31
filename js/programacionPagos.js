$(function () {
    cargarDatos();
});




function cargarDatos() {
    $.ajax({
        url: 'wscuentasPorPagar.asmx/ProgramacionPagos',
        type: 'POST',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (function (msg) {
            var i = 1;
            $('#tbody').html(null);
            $.each(msg.d, function () {
                var td = '<tr><th><b>SEMANA #' + this.semana + '</b></th><td onclick="cargardetalle('+ this.semana +')">' + parseFloat(this.valor).toFixed(2)+'</td></tr>';

                $('#tbody').append(td);
                i++;
            });
        })
    });
}

function cargardetalle(semana) {
    $('#MdDetalle').modal('show');
    $('#numsem').text(semana);

    $.ajax({
        url: 'wscuentasPorPagar.asmx/DetalleProgramacion',
        type: 'POST',
        data: '{sem: ' + semana +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (function (msg) {
            var i = 1;
            $('#data').html(null);
            var total = 0;
            $.each(msg.d, function () {
                total += parseFloat(this.valord);
                var td = '<tr><td>' + this.proveedor + '</td><td>' + this.factura + '</td><td>' + this.fecha + '</td><td>' + this.fecha_limite + '</td><td>' + this.dias + '</td><td>' + this.valor +'</td></tr>';

                $('#data').append(td);
                i++;
            });

            var tds = '<tr><td><b>TOTAL</b> </td><td>----</td><td>----</td><td>-----</td><td>-----</td><td><b>' + total.toFixed(2) + '</b></td></tr>';
            $('#data').append(tds);

        })
    });

}