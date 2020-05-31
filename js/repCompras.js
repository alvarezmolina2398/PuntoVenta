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
                    data.push({ 'descripcion': this.descripcion, 'id' : this.id });
                });
            }
        });
    }


    getSucursales();
    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });


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
            url: 'wsrepcompras.asmx/consultar',
            data: '{fechaIn: "' + fecha1 + '",FechaFin: "' + fecha2 + '", proveedor:  "'+ $('#prov').val() +'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#tbod-datos').empty();
                $('#tab-datos').dataTable().fnDeleteRow();
                $('#tab-datos').dataTable().fnUpdate();
                $('#tab-datos').dataTable().fnDestroy();
                $('#tot').text(null);
            },
            success: function (msg) {
                var tds = "";
                var total = 0;
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.noCompra + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td>' + this.usuario + '</td>';
                    tds = tds + '<td>' + this.proveedor + '</td>';
                    tds = tds + '<td>' + this.observaciones + '</td>';
                    tds = tds + '<td>' + this.valor + '</td>';
                    tds = tds + "<td><button  class='btn btn-outline-dark' onclick='getDetalle(" + this.noCompra + ",\"" + this.proveedor + "\")'><i class='material-icons'>assignment</i></button></td>";
                    tds = tds + '</tr>';

                    total += parseFloat(this.valor);

                });

                $('#tot').text(total.toFixed(2));

                $("#tbod-datos").append(tds);
                $('#tab-datos').dataTable();
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

function getDetalle(compra, prov) {
    $.ajax({
        type: 'POST',
        url: 'wsrepcompras.asmx/consultarDet',
        data: '{nocompra: ' + compra + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

            $("#datos").empty();
        },
        success: function (msg) {
            var tot = 0;
            $('#MdNuevo').modal('toggle');
            $('#com').text(compra);
            $('#nomprov').text(prov);
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.codigo + '</td>';
                tds = tds + '<td>' + this.descripcion + '</td>';
                tds = tds + '<td>' + this.cantidad + '</td>';
                tds = tds + '<td>' + this.precio + '</td>';
                tds = tds + '<td>' + this.total + '</td>';
                tot += parseFloat(this.total);
                tds = tds + '</tr>';

                $('#serieprov').text(this.facturas);
                $('#numprov').text(this.facturan);
                $('#nitprov').text(this.nitproveedor);
            });
            $('#total-detalle').text(tot);
            $("#datos").append(tds);

        }

    });    
}
 