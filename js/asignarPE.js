$(function () {
    $(document).ready(function () {
        listasuc();
    });

    //metodo utilizado para mostrar el listado de roles
    function listasuc() {

        var usr = window.atob(getCookie("usErp"));

        $.ajax({
            type: "POST",
            url: "wsasignarpe.asmx/getSucursales",
            data: '{user : "'+usr+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
            },
            success: function (msg) {
                $.each(msg.d, function () {

                    $('#suc').append('<option value="' + this.id + '">' + this.descripcion + '</option>');

                });
            }
        });
    }

    //metodo utilizado para mostrar el listado de roles
    function listaUsuarios(suc) {
        $.ajax({
            type: "POST",
            url: "wsasignarpe.asmx/getUsers",
            data: '{suc : ' + suc +'}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
            },
            success: function (msg) {
                $.each(msg.d, function () {

                    $('#us').append('<option value="' + this.id + '">' + this.descripcion + '</option>');

                });
            }
        });
    }

    function cargarPrivilegiosAsignados(menu) {
        var i = 0;
        $.ajax({
            type: "POST",
            url: "wsasignarpe.asmx/obtenerAsignados",
            contentType: "application/json; charset=utf-8",
            data: '{user: ' + menu + '}',
            dataType: "json",
            success: function (msg) {
                $('#Pnasignadas').html(null);
                $.each(msg.d, function () {
                    $('#Pnasignadas').append('<div class="col-md-12 checkbox"><input value="' + this.id + '" type="checkbox" name="asignados" id="asig' + i + '"><label for="asig' + i + '"> ' + this.descripcion + ' </label></div> ');
                    i++;
                });
            },
            error: function (msg) {
                // mensajeerrorpermanente(msg.responseText);
            }
        });
    }


    function cargarPrivilegiosNoAsignados(menu) {
        var i = 0;
        $.ajax({
            type: "POST",
            url: "wsasignarpe.asmx/obtenerNoAsignados",
            contentType: "application/json; charset=utf-8",
            data: '{user: ' + menu + '}',
            dataType: "json",
            success: function (msg) {
                $('#Pnnoasignadas').html(null);
                $.each(msg.d, function () {
                    $('#Pnnoasignadas').append('<div class="col-md-12 checkbox"><input value="' + this.id + '" type="checkbox" name="noasignados" id="noasig' + i + '"><label for="noasig' + i + '"> ' + this.descripcion + ' </label></div> ');
                    i++;
                });
            },
            error: function (msg) {
                // mensajeerrorpermanente(msg.responseText);
            }
        });
    }


    $('#btn-Agregar').click(function () {
        var menu = $('#us').val();
        var agregar = [];
        $("input[name='noasignados']").each(function () {
            if ($(this).prop('checked')) {
                agregar.push(parseInt($(this).val()))
            }
        });

        var jsonArray = JSON.stringify(agregar);
        $.ajax({
            type: "POST",
            url: "wsasignarpe.asmx/addPermisos",
            contentType: "application/json; charset=utf-8",
            data: "{permiso: " + jsonArray + ", user : " + menu + " }",
            success: function (msg) {
                llenar();
                $.toast({
                    heading: 'Listo!',
                    text: 'Permisos asignados exitosamente',
                    showHideTransition: 'slide',
                    position: 'mid-center',
                    icon: 'success'
                })
            }
        });

    });

    $('#btn-Quitar').click(function () {
        var rol = $('#us').val();
        var quitar = "";
        $("input[name='asignados']").each(function () {
            if ($(this).prop('checked')) {
                if (quitar == "") {
                    quitar = $(this).val()
                } else {
                    quitar = (quitar + "," + $(this).val()).toString()
                }

            }
        });

        $.ajax({
            type: "POST",
            url: "wsasignarpe.asmx/delPermisos",
            contentType: "application/json; charset=utf-8",
            data: "{permiso: '" + quitar + "', user: " + rol + "}",
            success: function (msg) {

                $.toast({
                    heading: 'Listo!',
                    text: 'los permisos fueron eliminados exitosamente',
                    showHideTransition: 'slide',
                    position: 'mid-center',
                    icon: 'success'
                })
                llenar();
            }
        });

    });

    function llenar() {
        var menu = $('#us').val();
        if (menu != 0) {
            cargarPrivilegiosNoAsignados(menu);
            cargarPrivilegiosAsignados(menu);
        }
    }

    $('#suc').change(function () {
        listaUsuarios($(this).val());
    });

    $('#us').change(function () {
        var menu = $(this).val();

        cargarPrivilegiosNoAsignados(menu);
        cargarPrivilegiosAsignados(menu);
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