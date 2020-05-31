

$(function () {
    $('#f1').datepicker({
        dateFormat: "dd/mm/yy"
    });

    $('#f2').datepicker({
        dateFormat: "dd/mm/yy"
    });

    obtenertecnicos();


    

    //arreglo utilizado para mostrar los clientes 
    var datac = [];

    var options = {
        data: datac,

        getValue: function (element) {
            return element.nombre
        },

        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                var value1 = $("#nombre").getSelectedItemData().id;
                $("#id").val(value1).trigger("change");
            }
        },

    }
    $("#nombre").easyAutocomplete(options);

    //metodo utilizado para mostrar la lista de tecnicos
    function obtenertecnicos() {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsasignarsolicitud.asmx/ObtenerTecnicos",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var tds = "<option value='0'>Elegir...</option>"
                $.each(msg.d, function () {
                    datac.push({'id': this.id, 'nombre': this.nombre});
                });
            }
        });
    }       

    //metodo utilizado para generar el reporte de solicitudes 
    $('#btnconsultar').click(function () {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsreptrabajos.asmx/getDataTec",
            data: '{fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '" , id: "' + $('#id').val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#dtordenes').dataTable().fnDeleteRow();
                $('#dtordenes').dataTable().fnUpdate();
                $('#dtordenes').dataTable().fnDestroy();
                $('#tbordenes').empty();
            },
            success: function (msg) {
                $.each(msg.d, function () {
                    var total = parseFloat(this.asignados) + parseFloat(this.resueltos)
                    var tds = '<tr>';
                    tds = tds + '<td>' + this.id + '</td>';
                    tds = tds + '<td>' + this.nombre + '</td>';
                    tds = tds + '<td class="text-right" >' + total + '</td>';
                    tds = tds + '<td class="text-right" onclick=" getDetalle(' + this.id + ',2,\''+ this.nombre + '\') ">' + this.asignados + '</td>';
                    tds = tds + '<td class="text-right" onclick=" getDetalle(' + this.id + ',5,\'' + this.nombre +  '\') ">' + this.resueltos + '</td>';
                    if (this.porcentaje < 60) {
                        tds = tds + '<td class="text-right text-danger"><strong>' + this.porcentaje + '%</strong></td>';
                    }
                    else if (this.porcentaje >= 60 && this.porcentaje <= 70) {

                        tds = tds + '<td class="text-right text-warning"><strong>' + this.porcentaje + '%</strong></td>';
                    }
                    else if (this.porcentaje >= 70 && this.porcentaje <= 80) {

                        tds = tds + '<td class="text-right text-info"><strong>' + this.porcentaje + '%</strong></td>';
                    }
                    else if (this.porcentaje > 80) {

                        tds = tds + '<td class="text-right text-success"><strong>' + this.porcentaje + '%</strong></td>';
                    }
                    tds = tds + '</tr>';
                    $("#tborden").append(tds);
                });

                $('#dtordenes').DataTable();
            }

        });
    });

});

function getDetalle(id, r, tec) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsreptrabajos.asmx/getDetalle",
        data: '{id:' + id + ' , r:' + r + ', fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbtrabajos').empty();
        },
        success: function (msg) {
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';
                tds += '<td>' + this.nombre + '</td>';
            });
            $('#tbtrabajos').append(tds);
            $('#titulo').text(tec);

            $('#MdNuevo').modal('toggle');
        }
    });
}