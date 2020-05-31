var usuario = window.atob(getCookie("usErp"));

$(function () {
    $('#codigo').val("");
    $('#nompro').val("");
    getProductos();
    getRegiones();
    //arreglo utilizado para almacenar los productos 
    var data = [];

    var options = {
        data: data,

        getValue: function (element) {
            return element.descripcion
        },

        

        list: {
            match: {
                enabled: true
            },
            onSelectItemEvent: function () {
                var value = $("#nompro").getSelectedItemData().id;
                $("#codigo").val(value).trigger("change");
            }
        },
       
    }

    $("#nompro").easyAutocomplete(options);

    $('input[name="datepicker"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end, label) { });

    
    //metodo utilizado para obtener el listado de productos
    function getProductos() {
        var tds = "";
        $.ajax({
            type: "POST",
            url: "wsrepventaproducto.asmx/getProductos",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                $.each(msg.d, function () {
                    data.push({ 'descripcion': this.descripcion, 'codigo' : this.codigo, 'id': this.id});
                });
            }
        });
    }

  
    //obtener sucursales
    $('#region').change(function () {
        var tds = "";
        $.ajax({
            type: "POST",
            url: "wsrepexist.asmx/sucursales",
            data: '{empresa : 1, region: ' + $(this).val() + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                tds += '<option selected value="0">Selecione una opcion</option>';
                $.each(msg.d, function () {
                    tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';

                });

                $('#sucursal').html(tds);
            }
        });
    });


    //obtener bodegas
    $('#sucursal').change(function () {
        var tds = "";
        $.ajax({
            type: "POST",
            url: "wsrepexist.asmx/bodegas",
            data: '{sucursal: ' + $(this).val() + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                tds += '<option selected value="0">Selecione una opcion</option>';
                $.each(msg.d, function () {
                    tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';

                });

                $('#bod').html(tds);
            }
        });
    });

    //metodo utilizado para obtener el reporte de existencias
    $('#btnConsultar').click(function () {

        var fecha1 = $('#inicio').val();
        var fecha2 = $('#finf').val();

        var fechax = fecha1.split("/");
        fecha1 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]


        fechax = fecha2.split("/");
        fecha2 = fechax[2] + "-" + fechax[1] + "-" + fechax[0]



        $.ajax({
            type: 'POST',
            url: 'wsrepkardex.asmx/consultar',
            data: '{fechaIni: "' + fecha1 + '", fechaFin: "' +fecha2 + '", prod : ' + $('#codigo').val() + ', bod: '+$('#bod').val()+'}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
                $('#datos').empty();
            },
            success: function (msg) {
                var tds = "";
                $.each(msg.d, function () {
                    tds += '<tr class="odd">';
                    tds = tds + '<td>' + this.articulo + '</td>';
                    tds = tds + '<td>' + this.documento + '</td>';
                    tds = tds + '<td>' + this.fecha + '</td>';
                    tds = tds + '<td>' + this.bodega + '</td>';
                    tds = tds + '<td>' + this.cini + '</td>';
                    tds = tds + '<td>' + this.cmov + '</td>';
                    tds = tds + '<td>' + this.cfin + '</td>';
                    tds = tds + '<td>' + this.usuario + '</td>';
                    tds = tds + '</tr>';
                });
                $("#datos").append(tds);
            }

        });
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

//obtener regiones
function getRegiones() {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wsrepexist.asmx/regiones",
        data: '{empresa : 1}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            tds += '<option selected value="0">Selecione una opcion</option>';
            $.each(msg.d, function () {
                tds += '<option  value="' + this.id + '">' + this.descripcion + '</option>';

            });

            $('#region').append(tds);
        }
    });
}




