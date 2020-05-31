$(function () {

    var data = [];
    getProveedores();

    var options = {
        data: data,

        getValue: function (element) {
            $('#idprov').val(element.id);
            return element.descripcion
        },



        list: {
            match: {
                enabled: true
            }
        },
    }
    $("#prov").easyAutocomplete(options);


    function getProveedores() {
        $.ajax({
            url: "wsrepcompras.asmx/getprov",
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

    //metodo utilizado para obtener el reporte de traslados
    $('#btnConsultar').click(function () {
        var fechaIn = $('#inicio').val();
        var fechaFin = $('#fin').val();
        var bodega = $('#idprov').val();

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



//metodo utilizado para mostrar lista de datos 
function mostrarColores(fecha1, fecha2, bodega) {
    var fechax = fecha1.split("/");
    fecha1 = fechax[2] + "/" + fechax[1] + "/" + fechax[0];

    var fechax = fecha2.split("/");
    fecha2 = fechax[2] + "/" + fechax[1] + "/" + fechax[0];


    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepdevpro.asmx/getData",
        data: '{fechaIn : "' + fecha1 + '", fechaFin : "' + fecha2 + '", pro: ' + bodega + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            var total = 0;

            $('#tot').text(total.toFixed(2));
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td> No.' + this.num + '</td>';
                tds = tds + '<td> FACTURA' + this.factura + '</td>';
                tds = tds + '<td>' + this.fecha + '</td>';
                tds = tds + '<td>' + this.user + '</td>';
                tds = tds + '<td>' + this.prov + '</td>';
                tds = tds + '<td>' + this.total + '</td>';
                tds = tds + "<td><button  class='btn btn-outline-dark' onclick='getDetalle(" + this.num + ")'><i class='material-icons'>assignment</i></button></td>"; tds = tds + '</tr>';
                total += parseFloat(this.total)
            });
            $('#tot').text(total.toFixed(2));

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
        url: "wsrepdevpro.asmx/getDetalle",
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
            var total = 0;
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.codigo + '</td>';
                tds = tds + '<td>' + this.desc + '</td>';
                tds = tds + '<td>' + this.cantidad + '</td>';
                tds = tds + '<td>' + this.valor_unitario + '</td>';

                var tot = parseFloat(this.valor_unitario) * parseInt(this.cantidad);
                total += tot;
                tds = tds + '<td>' + tot.toFixed(2) + '</td>';
                tds = tds + '</tr>';
                bod = this.prov
            });

            tds += '<tr class="odd">';
            tds = tds + '<td>TOTAL</td>';
            tds = tds + '<td></td>';
            tds = tds + '<td></td>';
            tds = tds + '<td></td>';
            tds = tds + '<td>' + total.toFixed(2) + '</td>';
            tds = tds + '</tr>';


            $('#bod').text(bod);
            $("#datos").append(tds);
        }
    });
}
