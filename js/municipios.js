$(function () {
    $(document).ready(function () {
        deptolistado();
        listamunicipios();
    });

    $('.mdn').click(function () {
        $('#exampleModalLabel').text("Nuevo Municipio");
        $('#opt').val(0);

        document.getElementById('municipio').value = '';
        document.getElementById('depto').value = 0;
        $('#MdNuevo').modal('toggle');

    });

    //metodo utilizado para obtener la lista de departamentos
    function deptolistado() {
        $.ajax({
            type: "POST",
            url: "wsmunicipios.asmx/busca_depto",
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

    $('#btnG').click(function () {

        var nombre = $('#municipio').val();
        var departamento = $('#depto').val();
        var id = $('#idm').val();
        var option = $('#opt').val();

        if (option == 0) {
            Insertar(nombre, departamento);
        }
        else if (option == 1) {
            actualizar(id, nombre, departamento);
        }
    });

    $('#btnc').click(function () {
        $.ajax({
            type: "POST",
            url: "wsmunicipios.asmx/cambiarEstado",
            data: '{id: ' + $('#ide').val() + ', depto: '+ $('#iddep').val() +'}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {

                $('#btnc').text("Cargando...");
                $('#btnc').attr('disabled', true);
            },
            success: function correcto(msg) {

                var confirma = msg.d;
                if (confirma == true) {
                    document.getElementById('municipio').value = '';
                    document.getElementById('depto').value = '';
                    $('#btnc').attr('disabled', false);
                    $('#btnc').text("Aceptar");
                    $('#MdDeshabilitar').modal('toggle');
                    $.toast({
                        heading: 'Listo!',
                        text: 'Se ha eliminado el municipio exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    listamunicipios();
                }

            }
        });

        $('#depto').text("");
        deptolistado();
    });

    function Insertar(nombre, departamento) {
        if (departamento == 0) {
            $.toast({
                heading: 'Error',
                text: 'debe de ingresar el departamento',
                showHideTransition: 'fade',
                position: 'mid-center',
                icon: 'error'
            })
        }
        else if (nombre == "") {
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
                url: "wsmunicipios.asmx/GuardarDatos",
                data: '{nombre: "' + nombre + '", departamento: "' + departamento + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function () {

                    $('#btnG').text("Cargando...");
                    $('#btnG').attr('disabled', true);
                },
                success: function correcto(msg) {

                    var confirma = msg.d;
                    if (confirma == true) {
                        document.getElementById('municipio').value = '';
                        document.getElementById('depto').value = '';
                        $('#btnG').attr('disabled', false);
                        $('#btnG').text("Aceptar");
                        $('#depto').text("");
                        deptolistado();
                        $('#MdNuevo').modal('toggle');
                        listamunicipios();
                        $.toast({
                            heading: 'Listo!',
                            text: 'Se ha creado un nuevo municipio exitosamente',
                            showHideTransition: 'slide',
                            position: 'mid-center',
                            icon: 'success'
                        })
                    }

                }
            });

        }

    }

    function actualizar(id, nombre, departamento) {

        $.ajax({
            type: "POST",
            url: "wsmunicipios.asmx/ActualizarDatos",
            data: '{id:"' + id + '", nombre: "' + nombre + '", departamento: "' + departamento + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#btnG').text("Cargando...");
                $('#btnG').attr('disabled', true);
            },
            success: function correcto(msg) {

                var confirma = msg.d;
                if (confirma == true) {
                    document.getElementById('idm').value = '';
                    document.getElementById('municipio').value = '';
                    $('#btnG').attr('disabled', false);
                    $('#btnG').text("Aceptar");
                    $('#depto').text("");
                    $.toast({
                        heading: 'Listo!',
                        text: 'datos actualizados exitosamente',
                        showHideTransition: 'slide',
                        position: 'mid-center',
                        icon: 'success'
                    })
                    $('#MdNuevo').modal('toggle');
                    deptolistado();
                    listamunicipios();
                }

            }
        });
    }


    //metodo utilizado para obtener la lista de municipios
    function listamunicipios() {

        $.ajax({
            type: 'POST',
            url: 'wsmunicipios.asmx/ObtenerDatos',
            data: {},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
                $('#dataTables-example').dataTable().fnDeleteRow();
                $('#dataTables-example').dataTable().fnUpdate();
                $('#dataTables-example').dataTable().fnDestroy();
                $('#tbmunicipios').empty();
            },
            success: correcto
        });
        function correcto(msg) {

            var tds = "";
            $.each(msg.d, function () {
                tds = '<tr class="odd">';
                tds = tds + '<td>' + this.descripcion + '</td>';
                tds = tds + '<td>' + this.departamento + '</td>';
                tds = tds + '<td class="center">';
                tds = tds + "<button class='Mdnew btn btn-sm btn-outline-info' onclick='mostrar(" + this.id +","+this.iddepartamento+ ",\"" + this.descripcion  + "\")' data-toggle='tooltip' data-placement='bottom' title='Editar'>";
                tds = tds + '<i class="material-icons">edit</i> ';
                tds = tds + '</button>';
                tds = tds + "<button class='MdDes btn btn-sm btn-outline-danger' onclick='mostrarE(" + this.id + "," + this.iddepartamento +  ")' data-toggle='tooltip' data-placement='bottom' title='Activo'><i class='material-icons'>delete</i></button>";
                tds = tds + '</td>';
                tds = tds + '</tr>';
                $('#tbmunicipios').append(tds);
            });
            $('#dataTables-example').dataTable();
        }
    }
});

function mostrar(id, departamento, nombre) {
    $('#opt').val(1);
    $('#idm').val(id);
    $('#MdNuevo').modal('toggle');
    $('#municipio').val(nombre);
    $('#depto').val(departamento);
    $('#exampleModalLabel').text("Editar Municipio");
}

function mostrarE(id, dept) {
    $('#MdDeshabilitar').modal('toggle');
    $('#ide').val(id);
    $('#iddep').val(dept);
}
