$(function () {

    //llamada a metodos necesarios para el sistema
    $(function () {
        bodegas();

        "use strict"
        $(document).ready(function () {
            $('#dataTables-example').DataTable({
                "order": [
                    [1, "desc"]
                ]
            });
        });

        $('#sucursal').change(function () {
            mostrarColores($(this).val());
        });


    });

    //metodo utilizado para obtener el reporte de traslados
    $('#btnConsultar').click(function () {
        var fechaIn = $('#inicio').val();
        var fechaFin = $('#fin').val();
        var bodega = $('#bodega').val();

        mostrarColores(fechaIn, fechaFin, bodega);
    });


    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });

});


function bodegas() {
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_bodegas.asmx/ObtenerDatos',
        data: '{}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                $('#bodega').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });
}


//metodo utilizado para mostrar lista de datos 
function mostrarColores(fecha1, fecha2, bodega) {
    var fechax = fecha1.split("/");
    fecha1 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


    fechax = fecha2.split("/");
    fecha2 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepajustes.asmx/getData",
        data: '{fechaIn : "' + fecha1 + '", fechaFin : "' + fecha2 + '", bodega: ' + bodega + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.num + '</td>';
                tds = tds + '<td>' + this.fecha + '</td>';
                tds = tds + '<td>' + this.user + '</td>';
                tds = tds + "<td><button  class='btn btn-outline-dark' onclick='getDetalle(" + this.num + ")'><i class='material-icons'>assignment</i></button></td>"; tds = tds + '</tr>';
            });


            $('[data-toggle="popover"]').popover();
            $('[data-toggle="tooltip"]').tooltip();
            $("#tbod-datos").append(tds);
            $('#tab-datos').dataTable();
        }

    });
}


function getDetalle(num) {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepajustes.asmx/getDetalle",
        data: '{num : ' + num + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#datos').html(null);
        },
        success: function (msg) {
            var bod = "";
            $('#com').text(num);
            $('#MdNuevo').modal('toggle');
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.bod + '</td>';
                tds = tds + '<td>' + this.codigo + '</td>';
                tds = tds + '<td>' + this.desc + '</td>';
                tds = tds + '<td>' + this.obs + '</td>';
                tds = tds + '<td>' + this.tipo + '</td>';
                tds = tds + '<td>' + this.cantidad + '</td>';
                tds = tds + '</tr>';
               // bod = this.bod
            });

           // $('#bod').text(bod);
            $("#datos").append(tds);
        }
    });
}
