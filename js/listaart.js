$(document).ready(function () {
    $('#dataTables-example').DataTable({
        "order": [
            [1, "desc"]
        ]
    });
    $('#estado').change(function () {
        cambiarEstados($(this).val());
    });

    $('#btndescargar').click(function (event) {
        var usr = window.atob(getCookie("usErp"));
        console.log(getCookie("usErp"))
        console.log(usr)
        event.stopPropagation();
        $.ajax({
            type: 'POST',
            url: 'wslistadoart.asmx/generarPDF',
            data: '{usr: "' + usr + '", estado : ' + $('#estado').val() + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                //alert(msg.d);
                window.open(msg.d);
            }
        });

    });
});



//metodo utilizado para mostrar lista de datos 
function cambiarEstados(estado) {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wslistadoart.asmx/consultar",
        data: '{estado : '+estado +'}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $('#tbod-datos').html(null);
            $('#tab-datos').dataTable().fnDeleteRow();
            $('#tab-datos').dataTable().fnUpdate();
            $('#tab-datos').dataTable().fnDestroy();
        },
        success: function (msg) {
            $.each(msg.d, function () {
                tds += '<tr class="odd">';
                tds = tds + '<td>' + this.codigo + '</td>';
                tds = tds + '<td>' + this.descripcion + '</td>';
                tds = tds + '<td>' + this.marcas + '</td>';
                tds = tds + '<td>' + this.clasificacion + '</td>';
                tds = tds + '<td>' + this.tipo + '</td>';         
                tds = tds + '</tr>';
            });


            $('[data-toggle="popover"]').popover();
            $('[data-toggle="tooltip"]').tooltip();
            $("#tbod-datos").append(tds);
            $('#tab-datos').dataTable();
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


