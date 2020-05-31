var ordenes = [];

$(function () {
    getCliente();
    $('#f1').datepicker({
        dateFormat: "dd/mm/yy"
    });

    $('#f2').datepicker({
        dateFormat: "dd/mm/yy"
    });

    $('#fecha').datepicker({
        dateFormat: "dd/mm/yy"
    });
     
    obtenertecnicos();


    //metodo utilizado para mostrar la lista de tecnicos
    function obtenertecnicos() {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsasignarsolicitud.asmx/ObtenerTecnicos",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $('.tec').empty();
            },
            success: function (msg) {
                var tds = "<option value='0'>Elegir...</option>"
                $.each(msg.d, function () {
                    tds += "<option value='" + this.id + "'>" + this.nombre + "</option>";
                });

                $(".tec").append(tds);
            }
        });
    }

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

    //metodo utilizado para asignar la solicitud
    $('#btnreasignar').click(function () {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsasignarorden.asmx/Asignar",
            data: '{tec1:' + $("#tec1").val() + ', tec2: ' + $("#tec2").val() + ', id: ' + $('#idor').val() + ',  fecha: "' + $('#fecha').val() + '", tipo: "' + $('#tipo').val() +'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $(this).attr('disabled', true);

                $(this).text('Cargando...');
            },
            success: function (msg) {
                if (msg.d == true) {
                    $("#tec1").val(0);
                    $("#tec2").val(0);
                    $.toast({
                        heading: 'Listo!',
                        text: 'Se ha reasignado el trabajo exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    $(this).attr('disabled', false);
                    mostrar();
                    $(this).text('Guardar');
                    $('#MdReasigar').modal('toggle');
                }
            }
        });
    });


    $('#btnreasignarAll').click(function () {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsasignarorden.asmx/reasignarAll",
            data: '{tec1:' + $("#tec4").val() + ', tec2: ' + $("#tec5").val() + ', ordenes: ' + JSON.stringify(ordenes) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $(this).attr('disabled', true);

                $(this).text('Cargando...');
            },
            success: function (msg) {
                if (msg.d == true) {
                    $("#tec4").val(0);
                    $("#tec5").val(0);
                    $.toast({
                        heading: 'Listo!',
                        text: 'Se reasignaron los trabajos exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    $(this).attr('disabled', false);
                    mostrar();
                    $(this).text('Reasignar Todo');
                    $('#MdReasignarAll').modal('toggle');
                }
            }
        });
    });


    //metodo utilizado para obtener los datos de cliente
    function getCliente() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "wsprivado/wstecnicos.asmx/ObtenerDatos",
            data: '{}',
            dataType: "json",
            success: function (msg) {
                $.each(msg.d, function () {
                    datac.push({ 'id': this.id, 'nombre': this.descripcion })
                });
            },
            error: function (result) {
                alert("Error");
            }
        });
    }



    //metodo utilizado para generar el reporte de solicitudes 
    $('#btnconsultar').click(function () {

        $.ajax({
            type: "POST",
            url: "wsprivado/wsrepordentec.asmx/getDataTec",
            data: '{fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '" , id: "' + $('#id').val() + '", estado: ' + $('#dpestado').val() + '}',
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
                    var tds = '<tr>';
                    tds = tds + '<td>'+ this.id + '</td>';
                    tds = tds + '<td>' + this.nombre + '</td>';
                    tds = tds + '<td>' + this.cantidad + '</td>';
                    tds = tds + "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='getDetalle(" + this.id +",\""+ this.nombre +"\")' data-toggle='modal' data-target='.bd-example-modal-xl'><i class='material-icons'>assignment</i></button></td>";
                    tds = tds + '</tr>';
                    $("#tborden").append(tds);
                });

                $('#dtordenes').DataTable();
            }

        });

    });

    $('#btnRall').click(function () {
        $('#MdReasignarAll').modal('toggle');
        $('#MdNuevo').modal('toggle');

        $('.tecn').text($('#titulo').text());
    });

});

function Reasignar(id, r, nombre, tipo, trabajo, obs, tec) {
    $('#MdReasigar').modal('toggle');
    $('#MdNuevo').modal('toggle');

    $('#idor').val(id);
    $('#des').text(nombre);
    $('#tip').text(tipo);
    $('#trab').text(trabajo);
    $('.tecn').text(tec);

    if (r == 1) {
        $('.tecnicos').attr('hidden', true);
        $('.visitas').attr('hidden', false);
    }
    else {

        $('.visitas').attr('hidden', true);
        $('.tecnicos').attr('hidden', false);
    }
}

function getDetalle(id, tecnico) {
    if ($('#dpestado').val() == 3) {
        $('#btnRall').hide();
    }
    else {
        $('#btnRall').show();
    }


    $.ajax({
        type: "POST",
        url: "wsprivado/wsrepordentec.asmx/getDetalle",
        data: '{id:' + id + ', estado: '+$('#dpestado').val()+' }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbtrabajos').empty();
        },
        success: function (msg) {
            var bool = false;
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';
                tds += '<td>' + this.status + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                if (this.estado == 5) {
                    tds += '<td class="text-success text-center"><i class="material-icons">done</i> SOUCIONADO</td>';
                }
                else if (this.estado == 4) {
                    tds += '<td class="text-danger text-center"><i class="material-icons">clear</i> NO SOUCIONADO</td>';
                }
                else if (this.estado == 2) {
                    tds += '<td class="text-warning text-center"><i class="material-icons">schedule</i> PENDIENTE <br><br><button class="MdDes btn btn-sm btn-block btn-outline-dark" onclick="Reasignar(' + this.id + ',0, \'' + this.nombre + '\',\'' + this.tipo + '\',\'' + this.trabajo + '\',\'' + this.observacion + '\',\'' + tecnico + '\')" data-toggle="tooltip" data-placement="bottom" title="Activo"><i class="material-icons">assignment_turned_in</i> REASIGNAR</button><br> <button class="MdDes btn btn-sm btn-block btn-outline-info" onclick="Reasignar(' + this.id + ',1, \'' + this.nombre + '\',\'' + this.tipo + '\',\'' + this.trabajo + '\',\'' + this.observacion + '\',\'' + tecnico + '\')" data-toggle="tooltip" data-placement="bottom" title="Activo"><i class="material-icons">assignment_turned_in</i> CAMBIAR FECHA</button></td></td>';
                    bool = true
                    ordenes.push({ id : this.id });
                }
                $('#btnCerrarOr').attr('disabled', bool);
            });

            $('#tbtrabajos').append(tds);
            $('#titulo').text(tecnico);         
            $('#MdNuevo').modal('toggle');
        }
    });
}


function mostrar() {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsrepordentec.asmx/getDataTec",
        data: '{fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '" , id: "' + $('#id').val() + '", estado: ' + $('#dpestado').val() + '}',
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
                var tds = '<tr>';
                tds = tds + '<td>' + this.id + '</td>';
                tds = tds + '<td>' + this.nombre + '</td>';
                tds = tds + '<td>' + this.cantidad + '</td>';
                tds = tds + "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='getDetalle(" + this.id + ",\"" + this.nombre + "\")' data-toggle='modal' data-target='.bd-example-modal-xl'><i class='material-icons'>assignment</i></button></td>";
                tds = tds + '</tr>';
                $("#tborden").append(tds);
            });

            $('#dtordenes').DataTable();
        }

    });

}
