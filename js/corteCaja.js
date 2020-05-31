

var usuario = window.atob(getCookie("usErp"));


$(function () {
    getfechaCierre();
    //formato para date picker
    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });


    //metodo utilizado para obtener el reporte de orden de compra
    $('#btnConsultar').click(function () {
      
                consultarGeneral();
           
    });

    $('#btnGenerar').click(function () {
        $.ajax({
            type: 'POST',
            url: 'wscortecaja.asmx/generarCierre',
            data: '{fCierre : "' + $('#fechaC').val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#btnGenerar').attr('disabled', true);
                $('#btnGenerar').text('Cargando...');
            },
            success: function (msg) {
                $('#btnGenerar').text('Geerar Cierre');
                $('#btnGenerar').removeAttr('disabled');
                $.toast({
                    heading: 'EXITO!',
                    text: 'El cierre se realizo exitosamente',
                    position: 'bottom-right',
                    showHideTransition: 'plain',
                    icon: 'success',
                    stack: false
                })
                getfechaCierre();
            }

        });
    });

    $('#btndescargar').click(function () {
        var usr = window.atob(getCookie("usErp"));
        $.ajax({
            type: 'POST',
            url: 'wscortecaja.asmx/generarPDF',
            data: '{usr: "' + usr + '", fechaIni: "' + $('#inicio').val() + '",fechaFin: "' + $('#fin').val() + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                //alert(msg.d);
                window.open(msg.d);
            }
        });

    });



});

function consultarGeneral() {
    var usr = window.atob(getCookie("usErp"));
    $.ajax({
        type: 'POST',
        url: 'wscortecaja.asmx/getTitulos',
        data: '{usr: "' + usr + '", fechaIni: "' + $('#inicio').val() + '",fechaFin: "' + $('#fin').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#resumen').empty();
        },
        success: function (msg) {
            var i = 0;
            var tds = "";
            var temp = "";
            var total = 0;
            var totalT = 0;
            $.each(msg.d, function () {
                    tds += '<tr>';
                    tds += '<th>' + this.titulo + '</th>';
                tds += '<th>' + this.valor + '</th></tr>';    
                total = this.total;
            });

            tds = tds + '<th>TOTAL</th>';
            tds = tds + '<th>'+total+'</th>';
            tds = tds + '</tr>';

            $("#resumen").append(tds);
            getData(usr);
        }
    });
}

function getData(usr) {
    $.ajax({
        type: 'POST',
        url: 'wscortecaja.asmx/Consultar',
        data: '{fechaIni: "' + $('#inicio').val() + '",fechaFin: "' + $('#fin').val() + '", usr: "' + usr +'"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbod').empty();
        },
        success: function (msg) {
            var tds = "";
            var total = 0;
            $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>Recibo No.' + this.id + '</td>';
                    tds = tds + '<td>' + this.cliente + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td>' + this.estado + '</td>';                  
                    tds = tds + '<td>' + this.valor + '</td></tr>';                
                total += parseFloat(this.valor);
            });

            tds += '<tr class="odd">';
            tds = tds + '<td>TOTAL</td>';
            tds = tds + '<td></td>';
            tds = tds + '<td></td>';
            tds = tds + '<td></td>';
            tds = tds + '<td>' + total + '</td></tr>';   

            $("#tbod").append(tds);
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



function getDetalle(efectivo, visa, credomatic, cheque, empleado, empresa, orden, cliente, firma) {
    $('#or').text(orden);
    $('#ef').text(efectivo);
    $('#vi').text(visa);
    $('#cr').text(credomatic);
    $('#ch').text(cheque);
    $('#em').text(empleado);
    $('#ea').text(empresa); 
    $('#clt').text(cliente);
    $('#com').text(firma);
    $('#MdNuevo').modal('toggle');
}

function getfechaCierre() {
    $.ajax({
        type: 'POST',
        url: 'wscortecaja.asmx/getFechaCierre',
        data: '{usuario: "'+  usuario +'"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {

        },
        success: function (msg) {
            $('#fechaC').val(msg.d);
            $('#fc').text(msg.d);

        }

    });
}