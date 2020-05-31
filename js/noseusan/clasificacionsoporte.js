$(function () {
    $(document).ready(function () {
        listasoporte();
        cargarEmpresas();
        cargarpts();
    });

    $('.mdn').click(function () {
        $('#opempresas').val(0);
        $('#exampleModalLabel').text("Nuevo Sistema ");
        document.getElementById('nombre').value = '';
        document.getElementById('observacion').value = '';
        document.getElementById('id').value = '0';
        $('#MdNuevo').modal('toggle');
    });


    function cargarpts() {
        var e = 0;
        var texto = '<option value="' + 0 + '" selected>Seleccionar...</option>';
        for (var i = 0; i < 25; i++) {
            e++;
            texto += '<option value="' + e + '">' + e + '</option>';
        };
        $('#puntos').append(texto);
    }

    $('#btnG').click(function () {
        var nombre = $('#nombre').val();
        var observacion = $('#observacion').val();
        var empresa = $('#opempresas').val();
        var id = $('#id').val();
        var option = $('#opt').val();
        var usr = window.atob(getCookie("usErp"));

        if (option == 0) {
            Insertar(nombre, observacion, empresa, usr);
        }
        else if (option == 1) {
            actualizar(id, nombre, observacion, empresa);
        }
        else if (option == 2) {

        }

    });

    function Insertar(nombre, descripcion, empresa, usr) {
        if (nombre == "") {
            $.toast({
                heading: 'Error',
                text: 'debe de ingresar el nombre',
                showHideTransition: 'fade',
                position: 'mid-center',
                icon: 'error'
            });
        }
        else if (empresa == 0) {
            $.toast({
                heading: 'Error',
                text: 'debe de seleccionar una empresa',
                showHideTransition: 'fade',
                position: 'mid-center',
                icon: 'error'
            });
        }
        else if (descripcion == "") {
            $.toast({
                heading: 'Error',
                text: 'debe de ingresar la descripcion',
                showHideTransition: 'fade',
                position: 'mid-center',
                icon: 'error'
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: "wsprivado/wsclasificacionsoporte.asmx/GuardarDatos",
                data: '{ nombre:"' + nombre + '", observaciones:"' + descripcion + '", idempresa:' + empresa + ', sessionUsuario:"' + usr + '", puntos: '+ $('#puntos').val() +' }',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function () {

                    $('#btnG').text("Cargando...");
                    $('#btnG').attr('disabled', true);
                },
                success: function correcto(msg) {

                    var confirma = msg.d;
                    if (confirma == true) {
                        document.getElementById('nombre').value = '';
                        document.getElementById('observacion').value = '';
                        document.getElementById('id').value = '';
                        $('#btnG').attr('disabled', false);
                        $('#btnG').text("Aceptar");
                        $('#opempresas').val(0); $('#puntos').val(0);
                        $('#MdNuevo').modal('toggle');
                        $.toast({
                            heading: 'Listo!',
                            text: 'Soporte Creado exitosamente',
                            showHideTransition: 'slide',
                            position: 'mid-center',
                            icon: 'success'
                        })
                        listasoporte();
                    }

                }
            });
        }
    }

    function actualizar(id, nombre, descripcion, empresa) {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsclasificacionsoporte.asmx/ActualizarDatos",
            data: '{nombre: "' + nombre + '", observaciones: "' + descripcion + '", idempresa: ' + empresa + ', id: ' + id + ',  puntos: ' + $('#puntos').val() +' }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#btnG').text("Cargando...");
                $('#btnG').attr('disabled', true);
            },
            success: function correcto(msg) {

                var confirma = msg.d;
                if (confirma == true) {
                    document.getElementById('id').value = '0';
                    document.getElementById('nombre').value = '';
                    document.getElementById('observacion').value = '';
                    $('#btnG').attr('disabled', false);
                    $('#btnG').text("Aceptar");
                    $('#opempresas').val(0); $('#puntos').val(0);
                    $('#MdNuevo').modal('toggle');
                    $.toast({
                        heading: 'Listo!',
                        text: 'Datos actualizados exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    listasoporte();
                }

            }
        });
    }

    //metodo utilizado para obtener la lista de soportes
    function listasoporte() {
        $.ajax({
            type: 'POST',
            url: 'wsprivado/wsclasificacionsoporte.asmx/ObtenerDatos',
            data: {},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $('#tbsoporte').empty();
                $('#dtsoporte').dataTable().fnDeleteRow();
                $('#dtsoporte').dataTable().fnUpdate();
            },
            success: correcto
        });
        function correcto(msg) {
            $('#dtsoporte').dataTable().fnDestroy();
            var tds = "";
            $.each(msg.d, function () {
                tds = '<tr class="odd">';
                tds = tds + '<td>' + this.nombre + '</td>';
                tds = tds + '<td>' + this.empresa + '</td>';
                tds = tds + '<td class="center">';
                tds = tds + "<button class='Mdnew btn btn-sm btn-outline-info' onclick='mostrar(" + this.id + "," + this.idempresa + ",\"" + this.nombre + "\",\"" + this.descripcion + "\",\""+ this.puntos + "\")' data-toggle='tooltip' data-placement='bottom' title='Editar'>";
                tds = tds + '<i class="material-icons">edit</i> ';
                tds = tds + '</button>';
                tds = tds + "<button class='MdDes btn btn-sm btn-outline-danger' onclick='mostrarE(" + this.id + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>delete</i></button>";
                tds = tds + '</td>';
                tds = tds + '</tr>';
                $('#tbsoporte').append(tds);
            });
            $('#dtsoporte').dataTable();
        }
    }

    //metodo utilizado para obtener la lista de empresas
    function cargarEmpresas() {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsempresa.asmx/ObtenerDatos",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function correcto(msg) {
                var texto = '<option value="0" selected>Seleccionar...</option>';
                $.each(msg.d, function () {
                    texto += '<option value="' + this.id + '">' + this.nombre + '</option>';
                });
                $('#opempresas').append(texto);
            }
        });
    }

    //
    $('#btnc').click(function () {
        $.ajax({
            type: "POST",
            url: "wsprivado/wsclasificacionsoporte.asmx/cambiarEstado",
            data: '{ id: ' + $('#ide').val() + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#btnc').text("Cargando...");
                $('#btnc').attr('disabled', true);
            },
            success: function correcto(msg) {

                var confirma = msg.d;
                if (confirma == true) {
                    $('#btnc').attr('disabled', false);
                    $('#btnc').text("si");
                    $('#MdDeshabilitar').modal('toggle');
                    $('#opempresas').empty();
                    cargarEmpresas();
                    listasoporte();

                    $.toast({
                        heading: 'Listo!',
                        text: 'Soporte eliminado exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                }

            }
        });
    });


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
});