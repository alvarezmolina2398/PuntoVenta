//llamada a metodos necesarios para el sistema
$(function () {
    //llamada a los datos para que se ejecuten al cargarse la pagina
    mostrarDatos();
    CargarFacturacionCajaCopia(1);



    //accion  para guardar o actualizar los datos
    $('#form-datos').submit(function () {
        $('#bt-guardar').attr('disabled', true);
        $('#bt-cancelar').attr('disabled', true);
        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmin_cobradores.asmx/Insertar',
            data: '{nombre: "' + $('#nombre').val() + '", dpi: "' + $('#dpi').val() + '",telefono: "' + $('#telefono').val() + '", correo: "' + $('#correo').val() + '", direccion: "' + $('#direccion').val() + '",tipo: "' + $('#tipo').val() + '" ,id: "' + $('#id').val() + '", correlativo: ' + $('#correlativo').val() +'}',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: false,
            beforeSend: function () {
                $('#bt-guardar').removeClass('btn-info');
                $('#bt-guardar').removeClass('btn-success');
                $('#bt-guardar').addClass('btn-warning');
                $('#bt-guardar').html('<i class="material-icons">query_builder</i>Cargando...')
            },
            success: function (msg) {

                var arr = msg.d.split('|');

                if (arr[0] == 'SUCCESS') {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡EXITO!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'success',
                        stack: false
                    });

                    $('#MdNuevo').modal('toggle');

                } else {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }

                limpiar();
                mostrarDatos();
            }
        });

        return false;

    });

    //accion  al momento de acepatar elminar
    $('#bt-eliminar').click(function () {
        $('#bt-eliminar').attr('disabled', true);
        $('#bt-no').attr('disabled', true);


        var id = $('#id').val()
        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmin_cobradores.ascmx/Eliminar',
            data: '{id: ' + id + '}',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {
                $('#bt-eliminar').removeClass('btn-success');
                $('#bt-eliminar').addClass('btn-warning');
                $('#bt-eliminar').html('<i class="material-icons">query_builder</i>Cargando...')
            },
            success: function (msg) {

                var arr = msg.d.split('|');


                if (arr[0] == 'SUCCESS') {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡EXITO!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'success',
                        stack: false
                    });

                    $('#MdDeshabilitar').modal('toggle');

                } else {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: arr[1],
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }

                $('#bt-eliminar').removeAttr('disabled', true);
                $('#bt-no').removeAttr('disabled', true);

                $('#bt-eliminar').removeClass('btn-warning');
                $('#bt-eliminar').addClass('btn-success');
                $('#bt-eliminar').html('<i class="material-icons">done</i>Si')

                limpiar();
                mostrarDatos();

            }
        });

    });

    //accion  para guardar los datos
    $('#bt-cancelar').click(function () {
        limpiar();
    })

});



//metodo para limpiar el formulario
function limpiar() {

    $("#form-datos")[0].reset();

    $('#descripcion').removeClass('is-invalid');
    $('#descripcion').removeClass('is-valid');
    $('#bt-guardar').removeAttr('disabled', true);
    $('#bt-cancelar').removeAttr('disabled', true);
    $('#bt-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#bt-guardar').removeClass('btn-info');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-success');
}


// funcion para cargar datos en el formulario
function cargarenFormulario(id, nombre, direccion, dpi,tipo,correo,telefono,correlativo) {
    limpiar();
    $('#id').val(id);
    $('#nombre').val(nombre);
    $('#dpi').val(dpi);
    $('#direccion').val(direccion);
    $('#tipo').val(tipo);
    $('#telefono').val(telefono);
    $('#correo').val(correo);
    $('#correlativo').val(correlativo);
    $('#MdNuevo').modal('toggle')

    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
}


// funcion para cargar datos en el formulario
function eliminar(id) {
    limpiar();
    $('#id').val(id);
    $('#MdDeshabilitar').modal('toggle');
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
}



//metodo utilizado para mostrar lista de datos 
function mostrarDatos() {
    limpiar();


    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_cobradores.asmx/ObtenerDatos',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            var i = 1;
            var tds = "";
            $('#tbod-datos').html(null);
            $.each(msg.d, function () {
                tds = "<tr class='odd'><td>" + i + "</td><td>" + this.nombre + "</td><td>" + this.DPI + "</td><td>" + this.direccion + "</td><td>" + this.tipotext + "</td><td> " +
                    "<span onclick='cargarenFormulario(" + this.id + ",\"" + this.nombre + "\",\"" + this.direccion + "\",\"" + this.DPI + "\"," + this.tipo + ",\"" + this.correo + "\",\"" + this.telefono + "\","+ this.correlativo +")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' > " +
                    "<i class='material-icons'>edit</i> " +
                    "</span> " +
                    "<span onclick='eliminar(" + this.id + ")' class='btn btn-sm btn-outline-danger' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''> " +
                    "<i class='material-icons'> delete_sweep </i> " +
                    "</span></td></tr>'"
                i++;

                $("#tbod-datos").append(tds);
            });

            $('#tab-datos').dataTable();
            $('[data-toggle="popover"]').popover();
        }
    });

};

//funcion para cargar los tipos de fac
function CargarFacturacionCajaCopia(empresa) {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_correlativos.asmx/ObtenerDatosPorTipoEmpresa',
        data: '{id_empresa: ' + empresa + ', tipo: 9}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#correlativo').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });
}


