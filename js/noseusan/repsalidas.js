
$(function () {
    $('#f1').datepicker({
        dateFormat: "dd/mm/yy"
    });

    $('#f2').datepicker({
        dateFormat: "dd/mm/yy"
    });

    //metodo utilizado para generar el reporte de solicitudes 
    $('#btnconsultar').click(function () {
        var valor = 0;

        if ($('#Norden').val() == "") {
            valor = 0;
        }
        else {
            valor = $('#Norden').val();
        }

        $.ajax({
            type: "POST",
            url: "wsprivado/wsrepsalidas.asmx/obtenerDatos",
            data: '{fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '" , orden:' + valor +'}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#dtordenes').dataTable().fnDeleteRow();
                $('#dtordenes').dataTable().fnUpdate();
                $('#dtordenes').dataTable().fnDestroy();
                $('#tborden').empty();
            },
            success: function (msg) {
                $.each(msg.d, function () {
                    var tds = '<tr>';
                    tds = tds + '<td class="text-center">' + this.noorden +'-'+this.notrabajo +'</td>';
                    tds = tds + '<td>' + this.tipo + '</td>';
                    tds = tds + '<td>' + this.trabajo + '</td>';
                    tds = tds + '<td>' + this.descripcion + '</td>';
                    tds = tds + "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='getDetalle(" + this.notrabajo + "," + this.noorden + ","+ this.salida +")' data-toggle='modal' data-target='.bd-example-modal-xl'><i class='material-icons'>assignment</i></button></td>";
                    tds = tds + '</tr>';
                    $("#tborden").append(tds);
                });
            }

        });

    });
});


function getDetalle(id, orden, sal) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsrepsalidas.asmx/getSalidas",
        data: '{id:' + sal + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbtrabajos').empty();
        },
        success: function (msg) {
            var tds = "";
            var totp = 0;
            var totc = 0;
                
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.cantidad + '</td>';
                tds += '<td>' + this.descripcion + '</td>';
                tds += '<td class="text-right">' + this.costo + '</td>';
                tds += '<td class="text-right">' + this.precio + '</td></tr>';
                totc = this.totalC;
                totp = this.totalP;
            });

            $('#tbtrabajos').append(tds);
            $('#titulo').text(orden+" - "+id);
            $('#totalc').text(totc);
            $('#totalp').text(totp);

            $('#MdNuevo').modal('toggle');
        }
    });
}