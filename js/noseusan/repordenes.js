
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
            return element.cliente
        },

        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                var value1 = $("#nombre").getSelectedItemData().id;
                var value2 = $("#nombre").getSelectedItemData().cliente;
                $('#cliente').text(value2).trigger("select");
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

                    $(this).text('Guardar');
                    $('#MdReasigar').modal('toggle');
                }
            }
        });
    });

    //metodo utilizado para obtener los datos de cliente
    function getCliente() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "wsprivado/wscliente.asmx/ObtenerDatos",
            data: '{}',
            dataType: "json",
            success: function (msg) {
                $.each(msg.d, function () {
                    datac.push({ 'id': this.id, 'cliente': this.nombre })
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
            url: "wsprivado/wsrepordenes.asmx/obtenerDatos",
            data: '{fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '" , idclt: "' + $('#id').val() + '", estado: ' + $('#dpestado').val() + '}',
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
                    tds = tds + '<td>' + this.activo + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='getDetalle(" + this.id + ",\"" + this.observacion + "\",\"" + this.nombre + "\",\"" + this.activo + "\")' data-toggle='modal' data-target='.bd-example-modal-xl'><i class='material-icons'>assignment</i></button></button> <button class='MdDes btn btn-sm btn-outline-dark' onclick='generarPDF(" + this.id + ")' data-toggle='modal' data-target='.bd-example-modal-xl'><i class='material-icons'>print</i></button></td>";
                    tds = tds + '</tr>';
                    $("#tborden").append(tds);
                });
                               
                $('#dtordenes').DataTable({
                    "order": [
                        [0, "desc"]
                    ]
                });
            }

        });

    });

    $('#btnCerrarOr').click(function () {
        var id = $('#ord').val();
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'wsprivado/wsrepordenes.asmx/cerrarorden',
            data: '{id:' + id + '}',
            dataType: "json",
            beforeSend: function () {
                $('#btnCerrarOr').attr('disabled', true);
                $('#btnCerrarOr').text("Cargando...");
            },
            success: function (data) {
                if (data.d = true) {
                    $('#btnCerrarOr').text("Cerrar Orden");
                    $('#btnCerrarOr').attr('disabled', false);
                    $.toast({
                        heading: 'Listo!',
                        text: 'Se ha cerrado la orden exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    });
                    $('#MdNuevo').modal('toggle');
                    mostrar();
                }
            }
        });
    });

});

function mostrar() {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsrepordenes.asmx/obtenerDatos",
        data: '{fechaInicio: "' + $('#f1').val() + '", fechaFinal: "' + $('#f2').val() + '" , idclt: "' + $('#id').val() + '", estado: ' + $('#dpestado').val() + '}',
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
                tds = tds + '<td> ORDEN NO.' + this.id + '</td>';
                tds = tds + '<td>' + this.nombre + '</td>';
                tds = tds + '<td>' + this.activo + '</td>';
                tds = tds + '<td>' + this.fecha + '</td>';
                tds = tds + "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='getDetalle(" + this.id + ",\"" + this.observacion + "\",\"" + this.nombre + "\",\"" + this.activo + "\")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment</i></button></td>";
                tds = tds + '</tr>';
                $("#tborden").append(tds);
            });

            $('#dtordenes').DataTable();
        }

    });
}

function generarPDF(id) {
    var usr = window.atob(getCookie("usErp"));
    $.ajax({
        type: "POST",
        url: "wsprivado/wspdforden.asmx/generarPDF",
        data: '{id:' + id + ', us : "'+ usr +'"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            window.open(msg.d);
        }
    });
}

function getDetalle(id, obs, nombre, activo) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsrepordenes.asmx/getDetalle",
        data: '{idenc:' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbtrabajos').empty();
        },
        success: function (msg) {
            var tds = "";
            var bool = false;
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';

                if (this.t1 != 0 && this.t2 == 0) {
                    tds += '<td>' + this.tec1 + '</td>';
                }
                else if (this.t2 != 0 && this.t1 == 0) {
                    tds += '<td>' + this.tec2 + '</td>';
                }
                else {
                    tds += '<td>' + this.tec1 + '-' + this.tec2 + '</td>';
                }

                tds += '<td>' + this.status + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                if (this.estado == 5) {
                    tds += '<td class="text-success text-center"><i class="material-icons">done</i> SOUCIONADO</td>';
                }
                else if (this.estado == 4) {
                    tds += '<td class="text-danger text-center"><i class="material-icons">clear</i> NO SOUCIONADO</td>';
                }
                else if (this.estado == 2) {
                    tds += '<td class="text-warning text-center"><i class="material-icons">schedule</i> PENDIENTE <br><br> <button class="MdDes btn btn-sm btn-block btn-outline-dark" onclick="Reasignar(' + this.id + ',0, \'' + this.nombre + '\',\'' + this.tipo + '\',\'' + this.trabajo + '\',\'' + this.observacion + '\',\'' + this.tec1 + '\')" data-toggle="tooltip" data-placement="bottom" title="Activo"><i class="material-icons">assignment_turned_in</i> REASIGNAR</button><br><br> <button class="MdDes btn btn-sm btn-block btn-outline-info" onclick="Reasignar(' + this.id + ',1, \'' + this.nombre + '\',\'' + this.tipo + '\',\'' + this.trabajo + '\',\'' + this.observacion + '\',\'' + this.tec1 + '\')" data-toggle="tooltip" data-placement="bottom" title="Activo"><i class="material-icons">assignment_turned_in</i> CAMBIAR FECHA</button></td>';
                    bool = true;
                }
                $('#btnCerrarOr').attr('disabled', bool);
            });
            if ($('#dpestado').val() == 3) {
                $('#btnCerrarOr').hide();
            }
            else {

                $('#btnCerrarOr').show();
            }
            $('#tbtrabajos').append(tds);
            $('#nomc').text(nombre);
            $('#obser').text(obs);
            $('#noma').text(activo);
            $('#ord').val(id);
            $('#titulo').text(id);
            $('#MdNuevo').modal('toggle');
        }
    });
}


function Reasignar(id, r, nombre, tipo, trabajo,obs, tec) {
    $('#MdReasigar').modal('toggle');
    $('#MdNuevo').modal('toggle');

    $('#idor').val(id);
    $('#des').text(nombre);
    $('#tip').text(tipo);
    $('#trab').text(trabajo);
    $('#tecn').text(tec);

    if (r == 1) {
        $('.tecnicos').attr('hidden', true);
        $('.visitas').attr('hidden', false);
    }
    else {

        $('.visitas').attr('hidden', true);
        $('.tecnicos').attr('hidden', false);
    }

}


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