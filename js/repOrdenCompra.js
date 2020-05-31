$(function () {
    //formato para date picker
    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });

    
    //metodo utilizado para obtener el reporte de orden de compra
    $('#btnConsultar').click(function () {

        var fecha1 = $('#inicio').val();
        var fecha2 = $('#fin').val();

        var fechax = fecha1.split("/");
        fecha1 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        fechax = fecha2.split("/");
        fecha2 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        $.ajax({
            type: 'POST',
            url: 'wsrepordencompra.asmx/consultar',
            data: '{fechaIni: "' + fecha1 + '",fechaFin: "' +fecha2 + '", estatus: '+$('#estatus').val()+' }',
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
                var total = 0;
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.noorden + '</td>';
                    tds = tds + '<td>' + this.proveedor + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td style="text-align: right;">' + this.valor + '</td>';
                    tds = tds + '<td>' + this.observacion + '</td>';
                    tds = tds + '<td>' + this.estatus + '</td>';
                    tds = tds + '</tr>';
                    total += parseFloat(this.valor);
                });

                $('#tot').text(total.toFixed(2))

                $("#tbod-datos").append(tds);
                $('#tab-datos').dataTable();
            }

        });
    });

});
