$(function () {


    //formato para date picker
    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD'
        }
    }, function (start, end, label) { });



    //metodo utilizado para obtener el reporte de existencias
    $('#btnConsultar').click(function () {

        $.ajax({
            type: 'POST',
            url: 'wsreporteCertificadosIva.asmx/consultar',
            data: '{fecha_inicial: "' + $('#inicio').val() + '",fecha_final: "' + $('#fin').val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#tab-datos').dataTable().fnDeleteRow();
                $('#tab-datos').dataTable().fnUpdate();
                $('#tab-datos').dataTable().fnDestroy();
            },
            success: function (msg) {
                $('#tbod-datos').empty();
                var tds = "";
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.fac + '</td>';
                    tds = tds + '<td>' + this.recibo + '</td>';
                    tds = tds + '<td>' + this.usuario + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td>' + this.valor + '</td>';
                    tds = tds + '</tr>';
                });

                $("#tbod-datos").append(tds);
                $('#tab-datos').dataTable();
            }

        });
    });

  //  $('#btndescargar').click(function () {
    //    var usr = window.atob(getCookie("usErp"));
    //    $.ajax({
    //        type: 'POST',
    //        url: 'wsrepventa.asmx/generarPDF',
    //        data: '{usr: "' + usr + '",fechaIni: "' + $('#inicio').val() + '",fechaFin: "' + $('#fin').val() + '", region : "' + $('#region').val() + '",  suc: "' + $('#sucursal').val() + '", cliente: "' + $('#cliente').val() + '"}',
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (msg) {
    //            //alert(msg.d);
    //            window.open(msg.d);
    //        }
    //    });

    //});
});




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


