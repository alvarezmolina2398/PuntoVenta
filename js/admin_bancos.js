
var usuario = window.atob(getCookie("usErp"));

$(function () {
    mostrarDatos();
    cargarBancos();
    //accion  para guardar los datos
    $('#bt-cancelar').click(function () {
        limpiar();
    }) 


    $('#mdNew').click(function () {
        limpiar();
    });

    //accion para guardar
    $('#bt-guardar').click(function () {
        $('#bt-guardar').attr('disabled', true);
        $('#bt-cancelar').attr('disabled', true);
        var descripcion = $('#descripcion');
        var id = $('#id').val();

        if (descripcion.val() == '') {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: 'ES NECESARIO DIGITAR EL CAMPO DESCRIPCION',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else  {
            var data1 = '';
            var url1 = ''
            if (id != 0) {
                url1 = 'Actualizar'
                data1 = '{descripcion: "' + descripcion.val() + '", id: ' + id + '}';
            } else {
                url1 = 'Insertar'
                data1 = '{descripcion: "' + descripcion.val() + '"}';
            }

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsadmin_bancos.asmx/' + url1,
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

                    if (msg.d) {
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡EXITO!',
                            text: 'ACCION REALIZADA EXITOSAMENTE',
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
                            text: 'HA SUCEDIDO UN ERROR AL MOMENTO DE INTENTAR REALIZAR LA TRANSACCION',
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
    });

    //accion para guardar la cuenta
    $('#guardar-cta').click(function () {
        
        var nombre = $('#nom_cuenta');
        var numero = $('#num_cuenta');
        var moneda = $('#moneda');
        var observacion = $('#observacion');
        var idbanco = $('#idbanco');

        var id = $('#idcuenta').val();

        if (nombre.val() == '') {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: 'ES NECESARIO DIGITAR EL CAMPO NOMBRE DE LA CUENTA',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else if (numero.val() == '') {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: 'ES NECESARIO DIGITAR EL CAMPO NUMERO DE LA CUENTA',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else if (moneda.val() == 0) {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: 'ES NECESARIO DIGITAR EL CAMPO MONEDA DE LA CUENTA',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else if (observacion.val() == '') {
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: '¡ERROR!',
                text: 'ES NECESARIO DIGITAR EL CAMPO OBSERVACION DE LA CUENTA',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false
            });
        }
        else {
            var data1 = '';
            var url1 = ''
            if (id != 0) {
                url1 = 'ActualizarCta'
                data1 = '{  numero : "' + numero.val() + '",   nombre : "' + nombre.val() + '",   banco : ' + idbanco.val() + ',   observacion : "' + observacion.val() + '",   moneda : ' + moneda.val() + ',   usuario : "' + usuario + '", id: '+ id +'}';
            } else {
                url1 = 'InsertarCta'
                data1 = '{  numero : "' + numero.val() + '",   nombre : "' + nombre.val() + '",   banco : ' + idbanco.val()  +',   observacion : "'+  observacion.val() +'",   moneda : '+ moneda.val() +',   usuario : "'+ usuario +'"}';
            }

            //consume el ws para obtener los datos
            $.ajax({
                url: 'wsadmin_bancos.asmx/' + url1,
                data: data1,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function () {
                    $('.btn-accion').attr('disabled', true);
                    $('#guardar-cta').removeClass('btn-info');
                    $('#guardar-cta').removeClass('btn-success');
                    $('#guardar-cta').addClass('btn-warning');
                    $('#guardar-cta').html('<i class="material-icons">query_builder</i>Cargando...')
                },
                success: function (msg) {

                    if (msg.d) {
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡EXITO!',
                            text: 'ACCION REALIZADA EXITOSAMENTE',
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'success',
                            stack: false
                        });


                    } else {
                        $('.jq-toast-wrap').remove();
                        $.toast({
                            heading: '¡ERROR!',
                            text: 'HA SUCEDIDO UN ERROR AL MOMENTO DE INTENTAR REALIZAR LA TRANSACCION',
                            position: 'bottom-right',
                            showHideTransition: 'plain',
                            icon: 'error',
                            stack: false
                        });
                    }
                    agregarCuentas(idbanco.val());
                    limpiarcta();
                    
                }
            });
        }
    });


    $('#bt-eliminar').click(function () {
        $.ajax({
            url: 'wsadmin_bancos.asmx/Eliminar',
            data: '{id: ' + $('#id').val() + '}',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            beforeSend: function () {

            },
            success: function (msg) {

                if (msg.d) {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡EXITO!',
                        text: 'ACCION REALIZADA EXITOSAMENTE',
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'success',
                        stack: false
                    });


                } else {
                    $('.jq-toast-wrap').remove();
                    $.toast({
                        heading: '¡ERROR!',
                        text: 'HA SUCEDIDO UN ERROR AL MOMENTO DE INTENTAR REALIZAR LA TRANSACCION',
                        position: 'bottom-right',
                        showHideTransition: 'plain',
                        icon: 'error',
                        stack: false
                    });
                }
                mostrarDatos();
                limpiar();
                $('#MdDeshabilitar').modal('toggle');

            }
        });

    });



});

//accion para cargar la modal de eliminar banco
function eliminar(id) {
    limpiar();
    $('#id').val(id);
    $('#MdDeshabilitar').modal('toggle');
    $('#bt-guardar').html('<i class="material-icons">cached</i>Actualizar');
    $('#bt-guardar').removeClass('btn-success');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-info');
}


//accion para eliminar la cuenta
function eliminarcta(id,banco) {
    
    $.ajax({
        url: 'wsadmin_bancos.asmx/EliminarCta',
        data: '{id: '+ id +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
          
        },
        success: function (msg) {

            if (msg.d) {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡EXITO!',
                    text: 'ACCION REALIZADA EXITOSAMENTE',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'success',
                    stack: false
                });


            } else {
                $('.jq-toast-wrap').remove();
                $.toast({
                    heading: '¡ERROR!',
                    text: 'HA SUCEDIDO UN ERROR AL MOMENTO DE INTENTAR REALIZAR LA TRANSACCION',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'error',
                    stack: false
                });
            }
            agregarCuentas(banco);
            limpiarcta();

        }
    });

}


//accion para cargar los datos
function mostrarDatos() {
    limpiar();
    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_bancos.asmx/ObtenerDatos',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            var i = 1;
            var tds = "";
            $('#tbod-datos').html(null);
            $.each(msg.d, function () {
                tds = "<tr class='odd'><td>" + i + "</td><td>" + this.descripcion + "</td><td> " +
                    "<span onclick='cargarenFormulario(" + this.id + ",\"" + this.descripcion + "\")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder cargar los datos en el formulario, para poder actualizar.' data-original-title='' title ='' > " +
                    "<i class='material-icons'>edit</i> " +
                    "</span> " +
                    "<span onclick='agregarCuentas(" + this.id + ")' class='Mdnew btn btn-sm btn-outline-info' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='bottom' data-content='Click para poder agregar o modificar cuentas' data-original-title='' title ='' > " +
                    "<i class='material-icons'>receipt</i> " +
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

}

//accion para agregar los datos al formulario
function cargarenFormulario(id, descripcion) {
    $('#id').val(id);
    $('#descripcion').val(descripcion);
    $('#MdNuevo').modal('toggle')
}


//limpia el formulario
function limpiar() {
    $('#id').val(0);
    $('#descripcion').val(null);

    $('#descripcion').removeClass('is-invalid');
    $('#descripcion').removeClass('is-valid');
    $('#bt-guardar').removeAttr('disabled', true);
    $('#bt-cancelar').removeAttr('disabled', true);
    $('#bt-guardar').html('<i class="material-icons">add</i>Guardar');
    $('#bt-guardar').removeClass('btn-info');
    $('#bt-guardar').removeClass('btn-warning');
    $('#bt-guardar').addClass('btn-success');

}

//limpia el formulario cta
function limpiarcta() { 
    $('#idcuenta').val(0);
    $('#num_cuenta').val(null);
    $('#nom_cuenta').val(null);
    $('#moneda').val(0);
    $('#observacion').val(null);
    $('.btn-accion').attr('disabled', false);


    $('#guardar-cta').removeAttr('disabled', true);
    $('#guardar-cta').removeAttr('disabled', true);
    $('#guardar-cta').html('<i class="material-icons">add</i>Guardar');
    $('#guardar-cta').removeClass('btn-info');
    $('#guardar-cta').removeClass('btn-warning');
    $('#guardar-cta').addClass('btn-success');

}

//carga las modales
function agregarCuentas(id) {
    $('#idbanco').val(id);
    $.ajax({
        url: 'wsadmin_bancos.asmx/ObtenerCuentas',
        data: '{banco : '+ id +'}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $('#tbod-cta').html(null);

            $.each(msg.d, function () {
                var tr = `<tr><td>${this.numero}</td><td>${this.nombre}</td><td><span onclick='editcta(${this.id},"${this.numero}","${this.nombre}",${this.id_banco},${this.id_moneda},"${this.observaciones}")' class='btn btn-info btn-sm'><i class='material-icons'>edit</i></span>
                    <span onclick='eliminarcta(${this.id},${this.id_banco})' style='margin-left:5px' class='btn btn-danger btn-sm'><i class='material-icons'>delete</i></span></td></tr>`;

                $('#tbod-cta').append(tr);
            });


        }
    })
    limpiarcta();
    $('#MdCuentas').modal('show');
}

//funcion para cargar las companias
function cargarBancos() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_bancos.asmx/cargarMonedas',
        data: '',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
        },
        success: function (msg) {
            $.each(msg.d, function () {
                $('#moneda').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

//accion para cargar datos de la cuenta
function editcta(id, numero, nombre, banco, moneda, observacion) {
    $('#idcuenta').val(id);
    $('#num_cuenta').val(numero);
    $('#nom_cuenta').val(nombre);
    $('#idbanco').val(banco);
    $('#moneda').val(moneda);
    $('#observacion').val(observacion);
    $('.btn-accion').attr('disabled', false);
}


//metodo para obtener la sesion
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
