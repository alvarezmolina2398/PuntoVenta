
var producto = [];

$(function () {
    $('#dtorden').DataTable();
    $('#PnAsignar').hide();
    $('.sol').hide();
    $('.solin').hide();
    $('.malo').hide();
    $('.solicitar').hide();
    $('.checkeo').hide();

    getArticulo();

    $('#dpestado').change(function () {
        var estado = $(this).val();
        listaOrdenes(estado);
    });

    $('#btnatras').click(function () {
        $('#PnAsignar').hide();
        $('.PnMostrar').toggle("slow");
    });

    //arreglo utilizado para mostrar los clientes 
    var datac = [];

    var options = {
        data: datac,

        getValue: function (element) {
            return element.descripcion
        },

        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                var value1 = $("#articulo").getSelectedItemData().id;
                var value2 = $("#articulo").getSelectedItemData().descripcion;
                $('#art').text(value2).trigger("select");
                $("#idart").val(value1).trigger("change");
            }
        },

    }
    $("#articulo").easyAutocomplete(options);

    //metodo utilizado para obtener los datos de cliente
    function getArticulo() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "wsprivado/wslistadoordenes.asmx/getArticulos",
            data: '{}',
            dataType: "json",
            success: function (msg) {
                $.each(msg.d, function () {
                    datac.push({ 'id': this.id, 'descripcion': this.nombre })
                });
            },
            error: function (result) {
                alert("Error");
            }
        });
    }  


    $('#btnagregarart').click(function () {
        var art = $('#art').text();
        var idart = $('#idart').val();
        var cantidad = $('#cantidad').val();
        producto.push({ 'id': idart, 'articulo': art, 'cantidad': cantidad });
        $('#art').text("");
        $('#idart').val("");
        $('#cantidad').val("");
        $('#articulo').val("");
        mostrarArt();
    });


    $('#btnsolicitarpro').click(function () {
        generarsalida(); 
    });

    $('#btnproceso').click(function () {
        cambiarestado(2, 1, $('#idor').val(), 1);
        $('#MdNuevo').modal('toggle');
    });

    $('#btnno').click(function () {
        $('.checkeo').hide();
        $('.sol').show();
        $('.malo').hide();
        $('.proceso').hide();
    });

    $('#btncancelarsol').click(function () {
        $('#mdsize').removeClass('modal-lg');
        $('#btnsi').hide();
        $('#btnno').hide();
        $('.solin').hide();
        $('.solit').show();
        $('.solicitar').hide();
        $('#MdNuevo').modal('toggle');
    });

    $('#btnsi').click(function () {
        $('#mdsize').addClass('modal-lg');
        $('.solicitar').show();
        $('.solit').hide();
        $('.proceso').hide();
        $('.malo').hide();
    });

    $('.btnsolicitar').click(function () {
        $('#mdsize').addClass('modal-lg');
        $('.solicitar').show();
        $('.solit').hide();
        $('.proceso').hide();
        $('.checkeo').hide();
    });

    $('#btncerrar').click(function () {
        $('#mdsize').removeClass('modal-lg');
        $('#btnsi').hide();
        $('#btnno').hide();
        $('.proceso').hide();
        $('.malo').hide();
        $('.solicitar').hide();
        $('.checkeo').hide();
    });

    $('#btnmalo').click(function () {
        cambiarestado(3, 5, $('#idor').val(), 2);
        $('#MdNuevo').modal('toggle');
    });

    $('#btnbueno').click(function () {
        cambiarestado(4, 1, $('#idor').val(), 2);
    });

    $('#btnnosolucionado').click(function () {
        cambiarestado(0, 4, $('#idor').val(), 2);
        $('#MdNuevo').modal('toggle');
    });

    $('#btnsolucionado').click(function () {
        cambiarestado(0, 5, $('#idor').val(), 2);
        $('#MdNuevo').modal('toggle');
    });
});

function getDetalle(id, obs, nombre, activo) {
    var usr = window.atob(getCookie("usErp"));
    var estado = 0;

    if ($('#dpestado').val() == 2) {
        estado = 2;
    }
    else if ($('#dpestado').val() == 3) {
        estado = 3;
    }
    else if ($('#dpestado').val() == 4) {
        estado = 4;
    }
    $.ajax({
        type: "POST",
        url: "wsprivado/wslistadoordenes.asmx/getDetalle",
        data: '{usuario: "' + usr + '", idenc:' + id + ', estado : ' + estado +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbtrabajos').empty();
        },
        success: function (msg) {
            var tds = "";
            var count = 0;
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';
                tds += '<td>' + this.status + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                if (this.estado == 5) {
                    tds += '<td class="text-success"><i class="material-icons">done</i> SOUCIONADO</td></tr>';
                }
                else if (this.estado == 4) {
                    tds += '<td class="text-danger"><i class="material-icons">clear</i> NO SOUCIONADO</td></tr>';
                }
                else if (this.estado == 2) {
                    tds += "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='check(" + this.id + ",\"" + this.nombre + "\",\"" + this.tipo + "\",\"" + this.trabajo + "\",\"" + this.observacion + "\"," + this.st + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment_turned_in</i></button><button class='MdDes btn btn-sm btn-outline-dark' onclick='solicitud(" + this.id + ",\"" + this.nombre + "\",\"" + this.tipo + "\",\"" + this.trabajo + "\",\"" + this.observacion + "\"," + this.st + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment</i></button></td></tr>";

                }
                count++;
            });

            if (count == 0) {
                $('#PnAsignar').hide();
                $('.PnMostrar').toggle('slow');
                var estado = $('#dpestado').val();
                listaOrdenes(estado);

            }
            else {
                $('#tbtrabajos').append(tds);
                $('#PnAsignar').toggle('slow');
                $('.PnMostrar').hide();
                $('#nomc').text(nombre);
                $('#obser').text(obs);
                $('#noma').text(activo);
                $('#ord').val(id);
                $('#titulo').text(id);
            }
        }
    });


    $('#btnimprimir').click(function () {
        var id = $('#titulo').text();
        $.ajax({
            type: "POST",
            url: "wsprivado/wspdforden.asmx/generarPDFCOT",
            data: '{id:' + id + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                window.open(msg.d);
            }
        });
    });
}

function generarsalida() {
    var usr = window.atob(getCookie("usErp"));
    $.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        url: 'wsprivado/wslistadoordenes.asmx/generarSalida',
        data: '{productos: ' + JSON.stringify(producto) + ', us : "' + usr + '", iddet : '+ $('#idor').val() +'}',
        dataType: "json",
        beforeSend: function () {
            $('#btnsolicitarpro').attr('disabled', true);
        },
        success: function (data) {
            if (data.d = true) {
                $('#btnsolicitarpro').text("Solicitar");
                $('#btnsolicitarpro').attr('disabled', false);
                $.toast({
                    heading: 'Listo!',
                    text: 'Se ha generado la solicitud de producto',
                    showHideTransition: 'slide',
                    position: 'mid-center',
                    icon: 'success'
                });
                producto = [];
                mostrarArt();

                $('.solicitar').hide();
                $('#MdNuevo').modal('toggle');
                $('#mdsize').removeClass('modal-lg');
            }
        }
    });
}

function cambiarestado(status, estado, id, st) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wslistadoordenes.asmx/Cambiarestado",
        data: '{status: ' + status + ',  estado: ' + estado + ', id: '+ id +', st: '+ st +', obs: "'+ $('#obs').val() +'"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            var confirma = msg.d;
            if (confirma == true) {
                getDet($('#ord').val());
                $('#obs').val("");
                $.toast({
                    heading: 'Listo!',
                    text: 'Trabajo procesado exitosamente',
                    showHideTransition: 'slide',
                    position: 'bottom-right',
                    icon: 'success'
                })
                if (status == 4) {
                    $('.checkeo').hide();
                    $('.malo').hide();
                    $('.sol').show();
                    $('.proceso').hide();
                }
            }            

        }
    });
}


function getDet(id) {
    var usr = window.atob(getCookie("usErp"));
    var estado = 0;

    if ($('#dpestado').val() == 2) {
        estado = 2;
    }
    else if ($('#dpestado').val() == 3) {
        estado = 3;
    }

    $.ajax({
        type: "POST",
        url: "wsprivado/wslistadoordenes.asmx/getDetalle",
        data: '{usuario: "' + usr + '", idenc:' + id + ', estado : ' + estado + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbtrabajos').empty();
        },
        success: function (msg) {
            var tds = "";
            var count = 0;
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';
                tds += '<td>' + this.status + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                if (this.estado == 5) {
                    tds += '<td class="text-success"><i class="material-icons">done</i> SOUCIONADO</td></tr>';
                }
                else if (this.estado == 4) {
                    tds += '<td class="text-danger"><i class="material-icons">clear</i> NO SOUCIONADO</td></tr>';
                }
                else if (this.estado == 2) {
                    tds += "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='check(" + this.id + ",\"" + this.nombre + "\",\"" + this.tipo + "\",\"" + this.trabajo + "\",\"" + this.observacion + "\"," + this.st + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment_turned_in</i></button><button class='MdDes btn btn-sm btn-outline-dark' onclick='solicitud(" + this.id + ",\"" + this.nombre + "\",\"" + this.tipo + "\",\"" + this.trabajo + "\",\"" + this.observacion + "\"," + this.st + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment</i></button></td></tr>";

                }
                count++;
            });
            $('#tbtrabajos').append(tds);


            if (count == 0) {
                $('#PnAsignar').hide();
                $('.PnMostrar').toggle('slow');

                var estado = $('#dpestado').val();
                listaOrdenes(estado);
            }
        }
    });
}

function solicitud(id, nombre, tipo, trabajo) {
    $('.des').text(nombre);
    $('.tip').text(tipo);
    $('.trab').text(trabajo);
    getsolicitudpro(id);
    $('#MdSol').modal('toggle');
    
}

function getsolicitudpro(id) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wslistadoordenes.asmx/mostrarSolicitudArt",
        data: '{ id:' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#dtproducto').empty();
        },
        success: function (msg) {
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td>' + this.codigo + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                tds += '<td>' + this.cantidad + '</td>';
                tds += '<td>' + this.recibido + '</td>';
                if (this.estado == 2) {
                    tds += '<td class="text-success"><i class="material-icons">done</i> Entregado</td></tr>';
                }
                else if (this.estado == 1) {
                    tds += '<td class="text-warning"><i class="material-icons">schedule</i> Pendiente</td></tr>';
                }

            });
            $('#dtproducto').append(tds);
        }
    });
}

function check(id, nombre, tipo, trabajo,obs, status) {
    $('#idor').val(id);
    $('.des').text(nombre);
    $('.tip').text(tipo);
    $('.trab').text(trabajo);
    if (status == 1) {
        $('.proceso').show();
        $('.sol').hide();
        $('.malo').hide();
        $('.checkeo').hide();
    }
    else if (status == 2) {
        $('.checkeo').show();
        $('.sol').hide();
        $('.malo').hide();
        $('.proceso').hide();
    }
    else if (status == 3) {
        $('.checkeo').hide();
        $('.malo').show();
        $('.sol').hide();
        $('.proceso').hide();
        $('#btnsi').show();
        $('#btnno').show();
    }
    else if (status == 4) {
        $('.checkeo').hide();
        $('.malo').hide();
        $('.sol').show();
        $('.proceso').hide();
    }
    $('#MdNuevo').modal('toggle');
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


function mostrarArt() {
    $('#dtsolicitar').empty();
    $('#art').text("");
    $('#idart').val("");
    $('#cantidad').val("");
    $('#articulo').val("");
    var i = 0;
    var texto = " ";
    for (d in producto) {
        texto += "<tr>";
        texto += "<td>" + producto[d].cantidad + "</td>";
        texto += "<td>" + producto[d].articulo + "</td>";
        texto += "<td><button class='MdDes btn btn-sm btn-outline-danger' onclick='eliminar(" + i + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>delete</i></button></td>";
        texto += "</tr>";
        i++;
    }
    $('#dtsolicitar').append(texto);
}


function eliminar(id) {
    producto.splice(id, 1);
    mostrarArt();
}



function consultarOrden(id) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wslistadoordenes.asmx/CambiarEstado",
        data: '{id:' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d == true) {
                mostrarSolicitudes();
                $('#PnAsignar').hide();
                $('.PnMostrar').toggle("fast");
            }
        }
    });
}


function listaOrdenes(estado) {
    var usr = window.atob(getCookie("usErp"));
    $.ajax({
        type: "POST",
        url: "wsprivado/wslistadoordenes.asmx/obtenerDatos",
        data: '{usuario: "' + usr + '", estado : ' + estado + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tborden').empty();
            $('#dtorden').dataTable().fnDeleteRow();
            $('#dtorden').dataTable().fnUpdate();
            $('#dtorden').dataTable().fnDestroy();
        },
        success: function (msg) {
            $.each(msg.d, function () {
                var tds = '<tr>';
                tds = tds + '<td>' + this.id + '</td>';
                tds = tds + '<td>' + this.nombre + '</td>';
                tds = tds + '<td>' + this.activo + '</td>';
                tds = tds + '<td>' + this.fecha + '</td>';
                tds = tds + "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='getDetalle(" + this.id + ",\"" + this.observacion + "\",\"" + this.nombre + "\",\"" + this.activo + "\")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment</i></button></td>";
                tds = tds + '</tr>';
                $("#tborden").append(tds);
            });

            $('#dtorden').DataTable({
                "order": [
                    [0, "desc"]
                ]
            });
        }
    });
}