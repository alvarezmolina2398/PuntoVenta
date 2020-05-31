$(function () {
    mostrarSolicitudes();
    obtenertecnicos();
    $('#PnAsignar').hide();

    $('#fecha').datepicker({
        dateFormat: "dd/mm/yy"
    });
    

    $('.MdAsignar').click(function () {
        $('#MdNuevo').modal('toggle')
    });

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

    //metodo utilizado para asignar la solicitud
    $('#btnGuardar').click(function () {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsasignarorden.asmx/Asignar",
            data: '{tec1:' + $("#tec1").val() + ', tec2: ' + $("#tec2").val() + ', id: ' + $('#idor').val() + ', fecha: "'+ $('#fecha').val() +'", tipo: "'+ $('#tipo').val() +'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $(this).attr('disabled', true);

                $(this).text('Cargando...');
            },
            success: function (msg) {
                if (msg.d == true) {
                    mostrarSolicitudes();
                    most($('#ord').val(), $('#obser').text(), $('#nomc').text(), $('#noma').text())
                    obtenertecnicos(); $('#fecha').val(""); $('#tipo').val("");
                    $.toast({
                        heading: 'Listo!',
                        text: 'Se ha asignado la orden exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    $(this).attr('disabled', false);

                    $(this).text('Guardar');
                    $('#MdNuevo').modal('toggle');
                }
            }
        });
    });

    $('#btnatras').click(function () {
        $('#PnAsignar').hide();
        $('.PnMostrar').toggle("slow");
    });

});


function mostrar(id, obs, nombre, activo) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsasignarorden.asmx/getDetalle",
        data: '{id:' + id +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

            $('#tborden').empty();
        },
        success: function (msg) {
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                tds += "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='Asignar(" + this.id + ",\"" + this.nombre + "\",\"" + this.tipo + "\",\"" + this.trabajo + "\",\"" + this.observacion + "\")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment_turned_in</i></button></td></tr>"
            });
            $('#tborden').append(tds);
            $('#PnAsignar').toggle('slow');
            $('.PnMostrar').hide();
            $('#nomc').text(nombre);
            $('#obser').text(obs);
            $('#noma').text(activo);
            $('#ord').val(id);
        }
    });

}


function consultarOrden(id) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsasignarorden.asmx/CambiarEstado",
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


function most(id, obs, nombre, activo) {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsasignarorden.asmx/getDetalle",
        data: '{id:' + id + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

            $('#tborden').empty();
        },
        success: function (msg) {
            var tds = "";
            $.each(msg.d, function () {
                tds += '<tr>';
                tds += '<td class="text-center">' + this.id + '</td>';
                tds += '<td>' + this.tipo + '</td>';
                tds += '<td>' + this.trabajo + '</td>';
                tds += '<td>' + this.nombre + '</td>';
                tds += "<td class='text-center'><button class='MdDes btn btn-sm btn-outline-info' onclick='Asignar(" + this.id + ",\"" + this.nombre + "\",\"" + this.tipo + "\",\"" + this.trabajo +"\")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>assignment_turned_in</i></button></td></tr>"
            });
            $('#tborden').append(tds);
            $('#nomc').text(nombre);
            $('#noma').text(activo);
            $('#obser').text(obs);
            $('#ord').val(id);

            consultarOrden(id);
        }
    });
}

function Asignar(id, nombre, tipo, trabajo) {
    $('#MdNuevo').modal('toggle');
    $('#idor').val(id);
    $('#des').text(nombre);
    $('#tip').text(tipo);
    $('#trab').text(trabajo);
}

//metodo utilizado para mostrar el listado de solicitudes
function mostrarSolicitudes() {
    $.ajax({
        type: "POST",
        url: "wsprivado/wsasignarorden.asmx/ObtenerDatos",
        data: '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function (data) {

            $("#ordent").empty();
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
                tds += '<strong>Orden No.' + this.id + ' </strong> </p><hr /></div>';
                tds += '<div class="card-body">';
                tds += '<p class="card-text" style="margin-top:-15px">';
                tds += '<strong> Cliente:  </strong> ' + this.nombre + ' </p>';
                tds += '<p class="card-text"><strong> Acivo:  </strong>' + this.activo + '</p>';
                tds += '<p class="card-text" style="margin-top:-5px">';
                tds += "<button class='btn btn-success col MdAsignar' onclick='mostrar(" + this.id + ",\"" + this.observacion + "\",\"" + this.nombre + "\",\"" + this.activo + "\")'>Ver Detalle <i class='material-icons'>assignment_turned_in</i></button></div></div></div>";
                if (i == 4) {
                    tds += '</div>';
                    i = 0;
                }
                i++;
            });

            $("#ordent").append(tds);
        }
    });
}