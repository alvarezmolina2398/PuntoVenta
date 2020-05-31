
var Data = [];
var actual = 0;
$(function () {
    consultar();
    $('#PnAsignar').hide();

    $('#fecha').datepicker({
        dateFormat: "dd/mm/yy"
    });

    $('.MdAsignar').click(function () {
        $('#MdNuevo').modal('toggle')
    });

    $('#btnatras').click(function () {
        $('#PnAsignar').hide();
        $('.PnMostrar').toggle("slow");
    });

    $('#btnGuardar').click(function () {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsautorizarsolicitudart.asmx/actualizarEstadoSolicitud",
            data: '{data: ' + JSON.stringify(Data) +'}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $(this).attr('disabled', true);
                $(this).text("Cargando...");
            },
            success: function (msg) {
                if (msg.d == true) {
                    $.toast({
                        heading: 'Listo!',
                        text: 'Solicitud autorizada exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    $(this).attr('disabled', false);
                    $(this).text("Procesar");
                    $('#obs').val("");
                    mostrarD($('#idsol').val(), $('#idtrab').text(), $('#tecn').text(), $('#trabaj').text(), $('#tipotrab').text());
                }
            }
        });
    });
});

function consultar() {
    var us = window.atob(getCookie("usErp"));
    $.ajax({
        type: "POST",
        url: "wsprivado/wsautorizarsolicitudart.asmx/consultar",
        data: '{us: "'+ us +'"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d == false) {
                $.toast({
                    heading: 'No requiere autorizacion!',
                    text: 'Si existen solicitudes pendientes de autorizacion, realiza el proceso para autorizarlas',
                    showHideTransition: 'slide',
                    position: 'mid-center',
                    icon: 'warning'
                })
            }
            mostrarSolicitudes();
        }
    });
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

//metodo utilizado para mostrar el listado de solicitudes
function mostrarSolicitudes() {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsautorizarsolicitudart.asmx/getSolicitudes",
        data: '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (data) {

            $("#solicitudes").empty();
        },
        success: function (msg) {
            var tds = ""
            var i = 1;
            $.each(msg.d, function () {
                if (i == 1) {
                    tds += '<div class="row">';
                }
                tds += ' <div class="col-12 col-md-6 col-lg-3">';
                tds += ' <div class="card shadow p-3 mb-5 bg-white rounded mb-4">';
                tds += '<div class="card-header ">';
                tds += '<p class="card-tittle">';
                tds += '<i class="material-icons">assignment</i>';
                tds += '<strong>Solicitud No.' + this.id + ' </strong> </p> <p>Trabajo: ' + this.idenc + '-' + this.idtrab + '</p> <hr />';
                tds += '<p class="card-text"><strong> Tipo trabajo:  </strong>' + this.tipo + '</p>';
                tds += '<p class="card-text"><strong> Trabajo:  </strong>' + this.trabajo + '</p></div>';
                tds += '<div class="card-body">';
                tds += '<p class="card-text" style="margin-top:-15px">';
                if (this.t1 != 0 && this.t2 == 0) {
                    tds += '<strong> tecnico:  </strong> ' + this.tec1 + ' </p>';
                }
                else if (this.t2 != 0 && this.t1 == 0) {
                    tds += '<strong> tecnico:  </strong> ' + this.tec2 + ' </p>';
                }
                else {
                    tds += '<strong> tecnicos:  </strong> ' + this.tec1 + '/' + this.tec2 + ' </p>';
                }
                tds += '<p class="card-text" style="margin-top:-5px">';
                tds += "<button class='btn btn-success col MdAsignar' onclick='mostrar(" + this.id + "," + this.idtrab + ",\"" + this.tec1 + "\",\"" + this.trabajo + "\",\"" + this.tipo + "\")'>Ver Detalle <i class='material-icons'>assignment_turned_in</i></button></div></div></div>";
                if (i == 4) {
                    tds += '</div>';
                    i = 0;
                }
                i++;
            });

            $("#solicitudes").append(tds);
        }
    });
}

function mostrar(id, idtrab, tec, trab, tipo) {
    $('#tecn').text(tec);
    $('#tipotrab').text(tipo);
    $('#trabaj').text(trab);
    $('#idtrab').text(idtrab);
    $('#idsol').val(id);
    $.ajax({
        type: "POST",
        url: "wsprivado/wsautorizarsolicitudart.asmx/mostrarSolicitudArt",
        data: '{id:' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

            $('#tborden').empty();
        },
        success: function (msg) {
            var tds = "";
            var count = 0;
            $.each(msg.d, function () {
                count++;
                tds += '<tr>';
                tds += '<td>' + this.codigo + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                tds += '<td>' + this.cantidad + '</td>';
                tds += "<td class='text-center'><input  type='checkbox' id='check" + count + "' name='vehicle3' value='Boat' onclick='comprobar(" + count + ',' + this.id + ',' + this.cantidad + ',' + this.precio + ',' + this.costo + ',' + id + ',' + this.idenc + ")' ></td></tr>"
            });
            $('#tborden').append(tds);
            $('#PnAsignar').toggle('slow');
            $('.PnMostrar').hide();
            $('#ord').val(id); consultarSolicitud();

        }
    });
}


function consultarSolicitud() {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsautorizarsolicitudart.asmx/CambiarEstado",
        data: '{id:' + $('#idsol').val() + '}',
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

function mostrarD(id, idtrab, tec, trab, tipo) {
    $('#tecn').text(tec);
    $('#tipotrab').text(tipo);
    $('#trabaj').text(trab);
    $('#idtrab').text(idtrab);
    $('#idsol').val(id);
    $.ajax({
        type: "POST",
        url: "wsprivado/wsautorizarsolicitudart.asmx/mostrarSolicitudArt",
        data: '{id:' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tborden').empty();
        },
        success: function (msg) {
            var tds = "";
            var count = 0;
            $.each(msg.d, function () {
                count++;
                tds += '<tr>';
                tds += '<td>' + this.codigo + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                tds += '<td>' + this.cantidad + '</td>';
                tds += "<td class='text-center'><input  type='checkbox' id='check" + count + "' name='vehicle3' value='Boat' onclick='comprobar(" + count + ',' + this.id + ")' ></td></tr>"
            });
            $('#tborden').append(tds);
            $('#ord').val(id);
            consultarSolicitud();

        }
    });
}

function comprobar(id, idsol) {
    if ($('#check' + id).is(':checked')) {
        Data.push({ 'id': idsol });
    }
    else {
        eliminar(id);
    }
}




function eliminar(id) {
    data.splice(id, 1);
}
