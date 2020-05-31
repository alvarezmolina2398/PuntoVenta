$(function () {
    $('#left-menu').click();
    getSucursales();

    //formato para date picker
    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD'
        }
    }, function (start, end, label) { });


    //metodo utilizado para obtener el reporte de orden de compra
    $('#btnConsultar').click(function () {

        consultarGeneral();

    });



});

function getSucursales() {
    var usr = window.atob(getCookie("usErp"));
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wslistarecibos.asmx/sucursales",
        data: '{usr: "'+usr+'"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';

            });

            $('#sucursal').append(tds);
        }
    });
}

function consultarGeneral() {
    var usr = window.atob(getCookie("usErp"));
    $.ajax({
        type: 'POST',
        url: 'wslistarecibos.asmx/getTitulos',
        data: '{usr: "' + usr + '", fechaIni: "' + $('#inicio').val() + '",fechaFin: "' + $('#fin').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#titulos').empty();
        },
        success: function (msg) {
            var i = 0;
            var tds = "";
            var temp = "";
            var total = 0;
            var totalT = 0;
            tds += '<tr>';
            tds += '<th>RECIBO</th><th>CLIENTE</th><th>FECHA</th><th>TIPO</th>';
            $.each(msg.d, function () {
                i++;
                tds += '<th>' + this.titulo + '</th>';
            });

            tds = tds + '<th>TOTAL</th></tr>';

            $("#titulos").append(tds);
            getData(usr, i);
        }
    });
}

function getData(usr, i) {
    $.ajax({
        type: 'POST',
        url: 'wslistarecibos.asmx/Consultar',
        data: '{fechaIni: "' + $('#inicio').val() + '",fechaFin: "' + $('#fin').val() + '", suc: "' + $('#sucursal').val()+'", usr: "' + usr + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbod').empty();
        },
        success: function (msg) {
            var dataOrdenarTxt = eval(msg.d);
            var table = $.ConstruirTabla(dataOrdenarTxt);
            console.log(table)
            //var data = JSON.parse(msg.d);

            //var tds = "";
            //for (var e = 1; e < data.length; e++) {
            //    tds += "<tr><td> RECIBO" + data[e].recibo + "</td>";
            //    tds += "<td>" + data[e].cliente + "</td>";
            //    tds += "<td>" + data[e].fecha + "</td>";
            //    console.log(data[e].COLUMN1)
            //    for (var a = 1; a <= i; a++) {
            //        tds += "<td>" + data[e].COLUMN1 + "</td>";                  
            //    }
            //    tds += "<td>" + data[e].total+ "</td></tr>";
            //}
            $("#tbod").append(table);
        }
    });
}


$.ConstruirTabla = function (dataOrdenar) {
    var retorno = ''
    $.each(dataOrdenar, function (index, value) {
        var fila = "<tr>";
        $.each(value, function (key, val) {
            fila += "<td>" + val + "</td>";
        });
        fila += "</tr>";
        retorno += fila
    });
    return retorno;
};


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
        data: '{}',
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