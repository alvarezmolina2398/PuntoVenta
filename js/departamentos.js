$(function () {
    $(document).ready(function () {
        listadeptos();
    });

    //metodo utilizado para mostrar el listado de departamentos
    function listadeptos() {
        $.ajax({
            type: "POST",
            url: "wsdepartamentos.asmx/ObtenerDatos",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $('#tbdepartamentos').empty();
                $('#dtDeptos').dataTable().fnDeleteRow();
                $('#dtDeptos').dataTable().fnUpdate();
                $('#dtDeptos').dataTable().fnDestroy();
            },
            success: function (msg) {
                $.each(msg.d, function () {

                    var tds = '<tr class="odd">';
                    tds = tds + '<td>' + this.descripcion + '</td>';
                    tds = tds + '<td class="center">';
                    tds = tds + "<button class='Mdnew btn btn-sm btn-outline-info' onclick='mostrar(" + this.id + ",\"" + this.descripcion +  "\")' data-toggle='tooltip' data-placement='bottom' title='Editar'>";
                    tds = tds + '<i class="material-icons">edit</i> ';
                    tds = tds + '</button>';
                    tds = tds + "<button class='MdDes btn btn-sm btn-outline-danger' onclick='mostrarE(" + this.id + ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>delete</i></button>";
                    tds = tds + '</td>';
                    tds = tds + '</tr>';

                    $("#tbdepartamentos").append(tds);

                });
                $('#dtDeptos').dataTable();
            }
        });
    }

    //cambia la accion de la modal para insertar un departamento
    $('.mdn').click(function () {
        $('#exampleModalLabel').text("Nuevo Departamento");
        $('#opt').val(0);
        document.getElementById('depto').value = '';
        $('#MdNuevo').modal('toggle');

    });

    //funcion utilizada para almacenar un departamento
    function Insertar(nombre) {
        if (nombre == "") {
            $.toast({
                heading: 'Error',
                text: 'debe de ingresar el nombre',
                showHideTransition: 'fade',
                position: 'mid-center',
                icon: 'error'
            })
        }
        else {
            $.ajax({
                type: "POST",
                url: "wsdepartamentos.asmx/GuardarDatos",
                data: '{nombre: "' + nombre + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function () {

                    $('#btnG').text("Cargando...");
                    $('#btnG').attr('disabled', true);
                },
                success: function correcto(msg) {

                    var confirma = msg.d;
                    if (confirma == true) {
                        document.getElementById('depto').value = '';
                        $('#btnG').attr('disabled', false);
                        $('#btnG').text("Aceptar");
                        $('#MdNuevo').modal('toggle');
                        listadeptos();

                        $.toast({
                            heading: 'Listo!',
                            text: 'Se ha creado un nuevo departamento exitosamente',
                            showHideTransition: 'slide',
                            position: 'mid-center',
                            icon: 'success'
                        })
                    }

                }
            });

        }
    }

    //funcion utilizada para actualizar un departamento
    function actualizar(id, nombre) {

        $.ajax({
            type: "POST",
            url: "wsdepartamentos.asmx/ActualizarDatos",
            data: '{nombre: "' + nombre + '", id: ' + id + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#btnG').text("Cargando...");
                $('#btnG').attr('disabled', true);
            },
            success: function correcto(msg) {

                var confirma = msg.d;
                if (confirma == true) {
                    document.getElementById('id').value = '';

                    document.getElementById('depto').value = '';
                    $('#btnG').attr('disabled', false);
                    $('#btnG').text("Aceptar");
                    $('#MdNuevo').modal('toggle');

                    $.toast({
                        heading: 'Listo!',
                        text: 'datos actualizados exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    listadeptos();
                }

            }
        });
    }

    //metodo utilizado para insertar un departamento
    $('#btnG').click(function () {
        var nombre = $('#depto').val();
        var id = $('#id').val();
        var option = $('#opt').val();

        if (option == 0) {
            Insertar(nombre);
        }
        else if (option == 1) {
            actualizar(id, nombre);
        }
        else if (option == 2) {

        }
    });

    $('#btnc').click(function () {
        $.ajax({
            type: "POST",
            url: "wsdepartamentos.asmx/cambiarEstado",
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
                    document.getElementById('id').value = '';

                    document.getElementById('depto').value = '';
                    $('#btnc').attr('disabled', false);
                    $('#btnc').text("si");
                    $('#MdDeshabilitar').modal('toggle');
                    $.toast({
                        heading: 'Listo!',
                        text: 'El departamento fue deshabilitado exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    listadeptos();
                }

            }
        });
    });
});

//metodo utilizado para mostrar la modal para editar
function mostrar(id, departamento) {
    $('#opt').val(1);
    $('#id').val(id);
    $('#MdNuevo').modal('toggle');
    $('#depto').val(departamento);
    $('#exampleModalLabel').text("Editar Departamento");
}

//metodo utilizado para mostrar la modal para editar
function mostrarE(id) {
    $('#ide').val(id);
    $('#MdDeshabilitar').modal('toggle');
}