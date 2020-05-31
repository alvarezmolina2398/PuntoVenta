$(function () {
    cargarCompanias();
    mostrarDatos();
    cargarDepartamentos();
    cargarClasificacion();

    $('#mdNew').click(function () {
        limpiar();
    });

    //accion  al momento de acepatar elminar
    $('#bt-eliminar').click(function () {
        $('#bt-eliminar').attr('disabled', true);
        $('#bt-no').attr('disabled', true);
        var id = $('#id').val()
        //consume el ws para obtener los datos
        $.ajax({
            url: 'wsadmin_clientes.asmx/Inhabilitar',
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

    //accion para cargar las regiones al cambiar de agencia
    $('#departamento').change(function () {
        $('#municipio').html('<option value="0">Seleccione Una Opción</option>');

        if ($(this).val() != 0) {
            //consume el ws para obtener los datos
            $.ajax({
                url: 'wscargar_datos.asmx/cargarMunicipiosPorDep',
                data: '{dep: ' + $(this).val() + '}',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (msg) {
                    $.each(msg.d, function () {
                        $('#municipio').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
                    });
                }
            });

        }
    });


    //accion  para guardar o actualizar los datos
    $('#bt-guardar').click(function () {
        $('#bt-guardar').attr('disabled', true);
        $('#bt-cancelar').attr('disabled', true);
        var nit = $('#nit');
        var descripcion = $('#descripcion');
        var telefono = $('#telefono');
        var observacion = $('#observacion');
        var direccion = $('#direccion');
        var id = $('#id').val();
        var departamento = $('#departamento');
        var municipio = $('#municipio');
        var clasificacion = $('#clasificacion');
        var contacto1 = $('#contacto1');
        var contacto2 = $('#contacto2');
        var contacto3 = $('#contacto3');
        var descuento = $('#descuento');
        var limite = $('#limite');
        var dia = $('#dias');
        var correo = $('#correo');
        if (validarForm()) {
            var data1 = '';
            var url1 = ''
            if (id != 0) {
                url1 = 'Actualizar'
                data1 = '{ nit_clt : "' + nit.val() + '",  Nom_clt : "' + descripcion.val() + '",  Tel_Clt : "' + telefono.val() + '",  Dire_Clt : "' + direccion.val() + '",  id_clasif : ' + clasificacion.val() + ',  id_dep : ' + departamento.val() + ',  id_muni : ' + municipio.val() + ',  contacto1 : "' + contacto1.val() + '",  contacto2 : "' + contacto2.val() + '",  contacto3 : "' + contacto3.val() + '",  Descuento_Porc : ' + descuento.val() + ',  Limite_Credito : ' + limite.val() + ',  Dias_Credito : ' + dia.val() + ',  Correo_Clt : "' + correo.val() + '",  Observ_Clt : "' + observacion.val() + '", id: ' + id + ', precio: ' + $('#precio').val() + ' }';
            } else {
                url1 = 'Insertar'
                data1 = '{ nit_clt : "' + nit.val() + '",  Nom_clt : "' + descripcion.val() + '",  Tel_Clt : "' + telefono.val() + '",  Dire_Clt : "' + direccion.val() + '",  id_clasif : ' + clasificacion.val() + ',  id_dep : ' + departamento.val() + ',  id_muni : ' + municipio.val() + ',  contacto1 : "' + contacto1.val() + '",  contacto2 : "' + contacto2.val() + '",  contacto3 : "' + contacto3.val() + '",  Descuento_Porc : ' + descuento.val() + ',  Limite_Credito : ' + limite.val() + ',  Dias_Credito : ' + dia.val() + ',  Correo_Clt : "' + correo.val() + '",  Observ_Clt : "' + observacion.val() + '",precio: ' + $('#precio').val() + '}';
            }

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsadmin_clientes.asmx/' + url1,
                data: data1,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
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
        }
    })

    //accion  para cancelar los datos
    $('#bt-cancelar').click(function () {
        limpiar();
    });


    $('#btn-agregar').click(function () {
        var descripcion = $('#descripcion-doc').val()
        if (descripcion == '') {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: 'ES NECESARIO INGRESAR LA DESCRIPCION',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });

        } else {
            var fileToLoad1 = $('#file')[0].files[0];
            var fileReader1 = new FileReader();
            fileReader1.readAsDataURL(fileToLoad1);
            var doc = '';
            fileReader1.onload = function (fileLoadedEvent1) {
                doc = fileLoadedEvent1.target.result; // <--- data: base64

                $.ajax({
                    url: 'wsadmin_clientes.asmx/GuardarDocumentos',
                    data: '{id : ' + $('#docID').val() + ', descripcion : "' + descripcion + '",  archivo : "' + doc +'"}',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
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
                            MostrarDoc($('#docID').val());

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

                        $('#file').val('');
                        $('#descripcion-doc').val(null);
                    }
                });

            }
        }
    });

});


//funcion para cargar las companias
function cargarCompanias() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_empresas.asmx/ObtenerDatos',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#company').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}


//funcion para cargar las Departamentos
function cargarDepartamentos() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarDepartamentos',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#departamento').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

//funcion para cargar las Departamentos
function cargarClasificacion() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarClasificacionCliente',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#clasificacion').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}


function validarForm() {
    var descripcion = $('#descripcion');
    var nit = $('#nit');
    var direccion = $('#direccion');
    var departamento = $('#departamento');
    var municipio = $('#municipio');

    descripcion.removeClass('is-invalid');
    descripcion.removeClass('is-valid');

    nit.removeClass('is-invalid');
    nit.removeClass('is-valid');

    direccion.removeClass('is-invalid');
    direccion.removeClass('is-valid');

    departamento.removeClass('is-invalid');
    departamento.removeClass('is-valid');

    municipio.removeClass('is-invalid');
    municipio.removeClass('is-valid');

    var descuento = $('#descuento');
    var limite = $('#limite');
    var dias = $('#dias');

    if (descuento.val() == "") {
        descuento.val(0);
    }

    if (limite.val() == "") {
        limite.val(0);
    }

    if (dias.val() == "") {
        dias.val(0);
    }

    var result = true
    if (descripcion.val() == "") {
        descripcion.addClass('is-invalid');
        descripcion.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Debe Ingresar el nombre del Cliente',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });
        result = false
    } else {
        descripcion.addClass('is-valid');
    }

     if (nit.val() == "") {
        nit.addClass('is-invalid');
        nit.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Debe Ingresar el Nit del Cliente',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });
         result = false
     } else {
         nit.addClass('is-valid');
     }
    if (direccion.val() == "") {
        direccion.addClass('is-invalid');
        direccion.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Debe Ingresar la Direccion del Cliente',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });
        result = false
    } else {
        direccion.addClass('is-valid');
    }


    if (departamento.val() == 0) {
        departamento.addClass('is-invalid');
        departamento.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Debe seleccionar el departamento del Cliente',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });
        result = false
    } else {
        departamento.addClass('is-valid');
    }

    if (municipio.val() == 0 || municipio.val() == "" || municipio.val()== null) {
        municipio.addClass('is-invalid');
        municipio.focus();
        $('#bt-guardar').removeAttr('disabled', true);
        $('#bt-cancelar').removeAttr('disabled', true);
        $('.jq-toast-wrap').remove();
        $.toast({
            heading: 'ADVERTENCIA',
            text: 'Debe seleccionar el municipio del Cliente',
            position: 'bottom-right',
            showHideTransition: 'plain',
            icon: 'warning',
            stack: false
        });
         result = false
     } else {
         municipio.addClass('is-valid');
     }

    return result;

}

//metodo para limpiar el formulario
function limpiar() {

    $('#nit').val(null);
    $('#descripcion').val(null);
    $('#telefono').val(null);
    $('#observacion').val(null);
    $('#direccion').val(null);
    $('#id').val(0);
    $('#departamento').val(0);
    $('#municipio').html('<option value="0">Seleccione Una Opción</option>');
    $('#clasificacion').val(0);
    $('#contacto1').val(null);
    $('#contacto2').val(null);
    $('#contacto3').val(null);
    $('#descuento').val(0);
    $('#limite').val(0);
    $('#dias').val(0);
    $('#correo').val(null);
    $('#precio').val(1);

    var descripcion = $('#descripcion');
    var nit = $('#nit');
    var direccion = $('#direccion');
    var departamento = $('#departamento');
    var municipio = $('#municipio');

    descripcion.removeClass('is-invalid');
    descripcion.removeClass('is-valid');

    nit.removeClass('is-invalid');
    nit.removeClass('is-valid');

    direccion.removeClass('is-invalid');
    direccion.removeClass('is-valid');

    departamento.removeClass('is-invalid');
    departamento.removeClass('is-valid');

    municipio.removeClass('is-invalid');
    municipio.removeClass('is-valid');


    $('#bt-guardar').removeAttr('disabled', true);
    $('#bt-cancelar').removeAttr('disabled', true);
    $('#bt-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#bt-guardar').removeClass('btn-info');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-success');
}

// funcion para cargar datos en el formulario
function cargarenFormulario(id, descripcion, observacion, nit, telefono, direccion, departamento, municipio, clasificacion, contacto1, contacto2, contacto3,descuento,limite,dias,correo,precio) {
    limpiar();


    $('#nit').val(nit);
    $('#descripcion').val(descripcion);
    $('#telefono').val(telefono);
    $('#observacion').val(observacion);
    $('#direccion').val(direccion);
    $('#id').val(id);
    $('#departamento').val(departamento);
    $('#municipio').html('<option value="0">Seleccione Una Opción</option>');
    $('#clasificacion').val(clasificacion);
    $('#contacto1').val(contacto1);
    $('#contacto2').val(contacto2);
    $('#contacto3').val(contacto3);
    $('#descuento').val(descuento);
    $('#limite').val(limite);
    $('#dias').val(dias);
    $('#correo').val(correo);
    $('#precio').val(precio);


    //consume el ws para obtener los datos
    $.ajax({
        url: 'wscargar_datos.asmx/cargarMunicipiosPorDep',
        data: '{dep: ' + departamento + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                $('#municipio').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });

            $('#municipio').val(municipio)
        }
    });




    $('#MdNuevo').modal('toggle')

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
        url: 'wsadmin_clientes.asmx/ObtenerDatos',
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
                tds = "<tr class='odd'><td>" + i + "</td><td>" + this.nit + "</td><td>" + this.nombre + "</td><td>" + this.Telefono + "</td><td>" + this.contacto1 + "</td><td> " +
                    "<span onclick='cargarenFormulario(" + this.id + ",\"" + this.nombre + "\",\"" + this.observaciones + "\",\"" + this.nit + "\",\"" + this.Telefono + "\",\"" + this.Direccion + "\"," + this.id_dep + "," + this.id_mun + "," + this.id_clasificacion + ",\"" + this.contacto1 + "\",\"" + this.contacto2 + "\",\"" + this.contacto3 + "\"," + this.descuento + "," + this.limite + "," + this.dias + ",\"" + this.correo + "\","+ this.precio +")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' > " +
                    "<i class='material-icons'>edit</i> " +
                    "</span> " +
                    "<span onclick='DocumentosAdd(" + this.id + ")' class='btn btn-sm btn-outline-success' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''> " +
                    "<i class='material-icons'> description </i> " +
                    "</span>" +
                    "<span onclick='Sugeridos(" + this.id + ")'  style='margin-left: 5px' class='btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''> " +
                    "<i class='material-icons'> next_week </i> " +
                    "</span>" +
                    "<span onclick='eliminar(" + this.id + ")' style='margin-left: 5px' class='btn btn-sm btn-outline-danger' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder Inhabilitar el dato seleccionado, Esto hara que dicho dato no aparesca en ninguna acción, menu o formulario del sistema.' data-original-title='' title=''> " +
                    "<i class='material-icons'> delete_sweep </i> " +
                    "</span>" +
                    "</td></tr>'"
                i++;

                $("#tbod-datos").append(tds);
            });

            $('#tab-datos').dataTable({
                "columns": [
                    { "width": "5%" },
                    { "width": "15%" },
                    { "width": "30%" },
                    { "width": "15%" },
                    { "width": "15%" },
                    { "width": "20%" }
                ],
                responsive: true
            });
            $('[data-toggle="popover"]').popover();
        }
    });

};

// funcion para cargar datos en el formulario
function eliminar(id) {
    limpiar();
    $('#id').val(id);
    //muestra la modal de confirmacion
    $('#MdDeshabilitar').modal('toggle');

    //cambia los botones
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
}


function DocumentosAdd(id) {
    $('#file').val('');
    $('#descripcion-doc').val(null);
    $('#MdDocuemntos').modal('show');
    $('#docID').val(id);
    MostrarDoc(id);
}

function MostrarDoc(id) {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_clientes.asmx/MostrarDocumentos',
        data: '{id: ' + id + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            var i = 1;
            $('#list-doc').html(null);
            $.each(msg.d, function () {
              

                var icon = 'data:image/png;base64,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hw4d8MEHH+C///2v0NFfSEgIL7gnAgPotA4cOICJEydavDmnn58fUlNTcfLkSaEbeer1erzzzjtwdeWnH0QMoBNavXo1ZsyYgatXr7a5LigoCJ999hkaGxuxbt06oW2PHTsWAwYMkGJMonaPhwFOxGQyYc6cOdi9e7fFtYMHD8bChQthMBjw6quvCj3YJyAgoMUnvBFpFY8AncT169cxY8YMofg98MADWL58OTw9PbFixQqcPXtWaB9vvvkmPDw87B2VSDV4BOgE6urqMGPGDKFn1d577714//334erqipycHGzYsEFoHyNGjLjtVk1EWscAKqy2thbTp09v9eHYvxYdHY2FCxfC1dUV165dw7x584Su+PDw8MBbb70lxbhEqsK3wApqbGzErFmzhOIXERGBpUuXokOHDgCA+fPn45dffhHaz2uvvYaAgAC7ZiVSIwZQQampqRav7ACA3r1745NPPmn+/G7Tpk3Yvn270D5+//vf46mnnrJrTiK1YgAVcuDAAaxatcriuq5duyIpKQm+vr4AgOPHjyMxMVFoH8HBwZg7d65dcxKpGQOogNLSUsyZM8fi53edO3dGUlISunbtCuDmba5mzZqF+vp6i/vw8PDA4sWL+XxZojYwgA5mMpkwa9YsoYdsz507F7179wZw8/PChIQEoed76HQ6/O1vf+O1vkQWMIAOtnDhwttuYNqS8ePH4/7772/+5+XLl+PIkSNC+3jhhRcQFxdn84xEWsEAOlBaWhq++uori+siIyPx+uuvN//zzp07hS91GzZsGKZOnWrzjERawgA6SFVVFZYsWWJxnZeXF/7+978336xg7969wl9kGI1GfPjhh3y4NpEg/qY4yGeffWbx5gY6nQ7z5s1Dt27dAACZmZl4++23hW9wumjRIj5om8gKDKADXLhwAV988YXFdY8++ijuu+8+AMD+/fsxa9YsNDQ0CO0jISEBERERds1JpDUMoANs2bLF4vN53d3d8fLLLwO4+VhL0dNdAGDcuHF45JFH7J6TSGt4LbAD7Nmzx+Ka559/Hn5+fli3bp3FO0D/2oABAzBz5kx7RyTSJAZQZmfPnsWPP/7Y5pquXbvivvvuw4svvohjx44JbzsoKAiLFy/m3Z2JbMTfHJmJ3KsvICAAL7zwgsW3yb8WEhKC5ORkPtOXyA4MoMxEvsQ4fvy4VdsMCwu75fpgIrINAygz0W9xRYWHhyM5ORne3t6SbpdIi/gtsMwiIyPh4uIiybbi4uKwcuVKxo9IIgygzAIDA616YHlL3NzcEB8fj8TERHh6eko0GRHxLbADzJo1CyaTCd98843VrzUajZg/fz769esnw2RE2sYAOoCHhwfmz5+PH374AampqcjMzLT4Gn9/fzz33HN48skn0bFjRwdMSaQ9DKAD3XnnnViyZAkKCwvx5ZdfIj09HTU1Nc0/d3d3R0hICP7whz/gj3/8IwwGg4LTEqkfA6iAvn374t1338Xs2bNx7tw5XLhwAYGBgejWrRt0Op3S4xFpBgOoIFdXV/Ts2RM9e/ZUehQiTeK3wESkWQwgEWkWA0hEmsUAEpFmMYBEpFkMIBFpFgNIRJrFABKRZjGARKRZDCARaRYDSESaxQASkWYxgESkWQwgEWkWA0hEmsUAEpFm8YaorcjNzcXYsWOVHoPIbuXl5UqP4LQYwFZcu3YNZ86cUXoMIpIR3wITkWYxgESkWaoLoE6na1B6BiI1UuPvluoC6Orq+pPSMxCpkRp/t3Rms1npGSQ3bNgwc319vdJjEKmGm5sbsrKyVPfQatUdAQJAYGDgdaVnIFITtf5OqTKAISEheUrPQKQmav2dUmUAAwMD1yg9A5GaqPV3SpWfAQLAhAkTKk+ePOml9BxE7V1ERETV559/7q30HHJQ5REgAMTExLyl9AxEaqDm3yXVHgECwMyZM49kZGQMUnoOovYqLi7u+8TExLuVnkMuqj0CBIDw8PDfRUZGVig9B1F7FBkZWREeHv47peeQk6pvhjBlyhRTY2Njf71en3fs2DF/pechai8GDBhwYfDgwVFTpkwxKT2LnFT9FrhJamqqa1FR0XcZGRmDtfDvS2QrnU6HuLi47PDw8N9NnjxZdZe+/ZYmAthk6dKl4/Ly8lYcP36cR4NEv9G/f/8LUVFRr0yfPn2j0rM4iqYC2GTZsmUPXrhw4aWSkpJ7L1++7FVZWWmorq5W3WU+RK3x9PQ0e3t7m3x9fat69OhxwN/fP3natGm7lJ7L0TQZQCIiQOXfAhMRtYUBJCLNYgCJSLMYQCLSLAaQiDSLASQizWIAiUizGEAi0iwGkIg0iwEkIs1iAIlIsxhAItIsBpCINIsBJCLNYgCJSLMYQCLSLAaQiDSLASQizWIAiUizGEAi0iwGkIg0iwEkIs1iAIlIsxhAItIsBpCINIsBJCLNYgCJSLMYQCLSLAaQiDSLASQizWIAiUizGEAi0iwGkIg0iwEkIs36/8KijfeyuHPUAAAAAElFTkSuQmCC'


                var card = '<div class="col-12 col-md-6 col-lg-4">' +
                    '<div class="card mb-4  border border-danger no-shadow" >' +
                        '<div class="card-body">' + 
                            '<div class="media text-center flex-column">' +
                                '<div class="media-body w-100">' +
                                     '<img src="' + icon +'" alt="" class="mx-auto my-2" class="img-fluid" style="height: 100px">' +
                                        '<p class="mb-0">'+ this.descripcion +'</p>' +
                                    '</div> ' +
                                    '<div class="row"><div class="col-md-4">' +
                                    '<center>' +
                                    '<a href="' + this.direccion +'"  target="_blank" class="icon-rounded btn btn-success mx-auto mt-3">'+
                                        '<i class="material-icons text-white">cloud_download</i> VER '+
                                    '</a>' +
                            '</center></div>' +
                            '<div class="col-md-8"><center>' +
                                    '<button type="button" onclick="eliminardoc('+ this.id +')"  class="icon-rounded btn btn-danger mx-auto mt-3">' +
                                    '<i class="material-icons text-white">delete_forever</i>  ELIMINAR' +
                                    '</button>' +
                                    '</center></div> ' +
                                '</div > '+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                    '</div >';



                $('#list-doc').append(card);
                i++;
            });


        }
    });
}


function eliminardoc(id) {
    $.ajax({
        url: 'wsadmin_clientes.asmx/EliminarDocumentos',
        data: '{id : ' + id + '}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
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
                MostrarDoc($('#docID').val());

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

            $('#file').val('');
            $('#descripcion-doc').val(null);
        }
    });
}
