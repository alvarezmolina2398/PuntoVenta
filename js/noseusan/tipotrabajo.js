$(function () {

    $(function () {
        $(document).ready(function () {
            cargarSoportes();
            listatrabajos(); cargarpts();
        });

        $('.mdn').click(function () {
            $('#exampleModalLabel').text("Nuevo tipo de trabajo");
            $('#opt').val(0);
            $('#nombre').val("");
            $('#tiposoporte').val(0);
            $('#descripcion').val("");

        });

        //metodo utilizado para obtener la lista de departamentos
        function deptolistado() {
            $.ajax({
                type: "POST",
                url: "wsprivado/wsmunicipios.asmx/busca_depto",
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: correcto
            });
            function correcto(msg) {

                var texto = '<option value="' + 0 + '" selected>Seleccionar...</option>';
                $.each(msg.d, function () {
                    texto += '<option value="' + this.valor + '">' + this.texto + '</option>';

                });

                $('#depto').append(texto);
            }
        }

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
            var tipo = $('#tiposoporte').val();
            var descripcion = $('#descripcion').val();
            var id = $('#id').val();

            var option = $('#opt').val();

            if (option == 0) {
                Insertar(nombre, descripcion, tipo);
            }
            else if (option == 1) {
                actualizar(id, nombre, descripcion, tipo);
            }
            else if (option == 2) {

            }

        });

        function Insertar(nombre, vdescripcion, tipo) {
            if (tipo == 0) {
                $.toast({
                    heading: 'Error',
                    text: 'debe de seleccionar un tipo de soporte',
                    showHideTransition: 'fade',
                    position: 'mid-center',
                    icon: 'error'
                });
            }
            else if (nombre == "") {
                $.toast({
                    heading: 'Error',
                    text: 'debe ingresar un nombre',
                    showHideTransition: 'fade',
                    position: 'mid-center',
                    icon: 'error'
                });
            }
            else if (vdescripcion == "") {
                $.toast({
                    heading: 'Error',
                    text: 'debe ingresar una observacion',
                    showHideTransition: 'fade',
                    position: 'mid-center',
                    icon: 'error'
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "wsprivado/wstipotrabajo.asmx/nuevo_estado",
                    data: '{vestado: "' + nombre + '", vdescripcion: "' + vdescripcion + '", tipo: ' + tipo + ', puntos : ' + $('#puntos').val() +'}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: function () {

                        $('#btnG').text("Cargando...");
                        $('#btnG').attr('disabled', true);
                    },
                    success: function correcto(msg) {

                        var confirma = msg.d;
                        if (confirma == true) {
                            $('#MdNuevo').modal('toggle');
                            document.getElementById('descripcion').value = '';
                            document.getElementById('nombre').value = '';
                            $('#btnG').attr('disabled', false);
                            $('#btnG').text("Aceptar");
                            $('#puntos').val(0);
                            $('#tiposoporte').text("");
                            $.toast({
                                heading: 'Listo!',
                                text: 'Se ha creado un tipo de trabajo exitosamente',
                                showHideTransition: 'slide',
                                position: 'mid-center',
                                icon: 'success'
                            })
                            cargarSoportes();
                            listatrabajos();
                        }

                    }
                });
            }
        }

        function actualizar(codigoActualiza, nombre, descripcion, tipo) {
            $.ajax({
                type: "POST",
                url: "wsprivado/wstipotrabajo.asmx/actualizaEstado",
                data: '{idActualiza: "' + codigoActualiza + '", nombre: "' + nombre + '", descripcion: "' + descripcion + '", tsistema: "' + tipo + '",  puntos : ' + $('#puntos').val() +'}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function () {
                    $('#btnG').text("Cargando...");
                    $('#btnG').attr('disabled', true);
                },
                success: function correcto(msg) {

                    var confirma = msg.d;
                    if (confirma == true) {
                        $('#MdNuevo').modal('toggle');
                        document.getElementById('descripcion').value = '';
                        document.getElementById('nombre').value = '';
                        $('#btnG').attr('disabled', false);
                        $('#btnG').text("Aceptar");
                        $('#tiposoporte').text("");
                        $('#puntos').val(0);
                        $.toast({
                            heading: 'Listo!',
                            text: 'Datos actualizados exitosamente',
                            showHideTransition: 'slide',
                            position: 'mid-center',
                            icon: 'success'
                        })
                        cargarSoportes();
                        listatrabajos();
                    }

                }
            });
        }

        //metodo utilizado para cargar la lista de soportes
        function cargarSoportes() {
            $.ajax({
                type: 'POST',
                url: 'wsprivado/wsclasificacionsoporte.asmx/ObtenerDatos',
                data: {},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: correcto
            });
            function correcto(msg) {
                var texto = '<option value="' + 0 + '" selected>Seleccionar...</option>';
                $.each(msg.d, function () {
                    texto += '<option value="' + this.id + '">' + this.nombre + '</option>';
                });
                $('#tiposoporte').append(texto);
            }
        }



        $('#btnc').click(function () {
            $.ajax({
                type: "POST",
                url: "wsprivado/wstipotrabajo.asmx/cambiaEstado",
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
                        $.toast({
                            heading: 'Listo!',
                            text: 'Se han eliminado los datos exitosamente',
                            showHideTransition: 'slide',
                            position: 'mid-center',
                            icon: 'success'
                        })
                        listatrabajos();
                    }

                }
            });
        });

        //metodo utilizado para obtener la lista de los sub tipos de soporte
        function listatrabajos() {
            $.ajax({
                type: 'POST',
                url: 'wsprivado/wstipotrabajo.asmx/busca_estad',
                data: {},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function (data) {
                    $('#tbtipotrabajo').empty();
                    $('#dttrabajo').dataTable().fnDeleteRow();
                    $('#dttrabajo').dataTable().fnUpdate();
                    $('#dttrabajo').dataTable().fnDestroy();
                },
                success: correcto
            });
            function correcto(msg) {

                var tds = "";
                var i = 1;
                $.each(msg.d, function () {
                    tds = '<tr class="odd">';
                    tds = tds + '<td>' + this.id_estado + '</td>';
                    tds = tds + '<td>' + this.id_nombre + '</td>';
                    tds = tds + '<td>' + this.id_descripcion + '</td>';
                    tds = tds + '<td class="center">';
                    tds = tds + "<button class='Mdnew btn btn-sm btn-outline-info' onclick='mostrar(" + this.id_estado + ",\"" + this.id_nombre + "\",\"" + this.id_descripcion + "\",\""+ this.puntos + "\")' data-toggle='tooltip' data-placement='bottom' title='Editar'>";
                    tds = tds + '<i class="material-icons">edit</i> ';
                    tds = tds + '</button>';
                    tds = tds + "<button class='MdDes btn btn-sm btn-outline-danger' onclick='mostrarE(" + this.id_estado + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>delete</i></button>";
                    tds = tds + '</td>';
                    tds = tds + '</tr>';
                    i++;
                    $('#tbtipotrabajo').append(tds);
                });
                $('#dttrabajo').dataTable();
            }
        }
    });

});