

$(function () {
    $('#FrmLogin').submit(function () {
        var user = $('#user').val();
        var pass = $('#pass').val();

        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            url: 'vista/wsvalidar.asmx/verificacion',
            data: '{cadena: "' + base64(user + '|' + pass) + '"}',
            dataType: "json",
            async:false,
            success: function (data) {
                if (data.d != "e") {
                    var d = new Date();
                    var sesionTimeOut = 7;
                    var minutes = d.getMinutes();
                    d.setMinutes(minutes + sesionTimeOut);


                    var pathname = "/solucionesun/softpos";  


                    if (document.location.hostname == 'localhost') {
                        pathname = ""
                    }



                    document.cookie = "usErp=" + base64(user) + ";expires=" + d.toUTCString() + ";path=" + pathname[1] + "/vista";
                    location.href = 'vista/principal.html';
                }
                else {
                    $('#user').val("");
                    $('#pass').val("");
                    alert('usuario o contrasena incorrectos');
                }
            }
        });
        return false;
    });

    function base64(cadena) {
        return window.btoa(unescape(encodeURIComponent(cadena)));
    }
});