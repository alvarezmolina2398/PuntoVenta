$(document).ready(function () {
    $('#dataTables-example').DataTable({
        "order": [
            [1, "desc"]
        ]
    });
    $('#estado').change(function () {
        mostrarColores($(this).val());
    });
    $('#btndescargar').click(function () {
        var usr = window.atob(getCookie("usErp"));
        $.ajax({
            type: 'POST',
            url: 'wslistaclientes.asmx/generarPDF',
            data: '{usr: "' + usr + '",est : ' + $('#estado').val() + '}',
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
function mostrarColores(estado) {
    var tds = "";
    $.ajax({
        type: "POST",
        url: "wslistaclientes.asmx/getData",
        data: '{est : ' + estado + '}',
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
                tds = tds + '<td>' + this.nom + '</td>';
                tds = tds + '<td>' + this.dir + '</td>';
                tds = tds + '<td>' + this.tel + '</td>';
                tds = tds + '<td>' + this.cor + '</td>';
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


