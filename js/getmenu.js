$(function () {


        var d = new Date();
        var sesionTimeOut = 5;
        var minutes = d.getMinutes();
        d.setMinutes(minutes + sesionTimeOut);

        var usr = window.atob(getCookie("usErp"));
        document.cookie = "usErp=" + base64(usr) + ";expires=" + d.toUTCString();

        $('button').click(function () {
            var d = new Date();
            var sesionTimeOut = 5;
            var minutes = d.getMinutes();
            d.setMinutes(minutes + sesionTimeOut);
         
            var usr = window.atob(getCookie("usErp"));
            document.cookie = "usErp=" + base64(usr) + ";expires=" + d.toUTCString();
        });

        var cookie = getCookie("usErp");
        //alert(cookie);
        if (cookie != '') {
            listaPermisos();

            var usr = window.atob(getCookie("usErp"));

            $.ajax({
                type: "POST",
                url: "wsvalidaciones.asmx/obtenerEmpresa",
                data: '{usuario: "' + usr + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                beforeSend: function (data) {
                },
                success: function (msg) {
                    document.title = 'ERP-' + msg.d;
                }
            });


            $.ajax({
                type: "POST",
                url: "wsvalidaciones.asmx/obtenerNombreEmpresa",
                data: '{usuario: "' + usr + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                beforeSend: function (data) {
                },
                success: function (msg) {
                    var data = msg.d.split("|");

                    $('.logo').html('<span class="text-hide-xs"><b> ' + data[0] + ' </b>' + data[1] +'</span>');
                }
            });

            var url = window.location.pathname.split("/");
            $.ajax({
                type: "POST",
                url: "wsvalidaciones.asmx/PermisoPagina",
                data: '{usuario: "' + usr + '", direccion: "' + url[url.length - 1] +'"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                beforeSend: function (data) {
                },
                success: function (msg) {
                    if (!msg.d) {
                        alert("NO POSEES PERMISO PARA VISITAR ESTE FORMULARIO");
                        location.href = 'principal.html';
                    }
                   
                }
            });


            
        }
        else {
            alert("vuelve a iniciar sesion");
            location.href = '../Login.html';
        }
  


    $('#btnCerrar').click(function () {
        eliminarCookie("usErp");
        location.href = '../Login.html';
    });



    var eliminarCookie = function (key) {
        return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function listaPermisos() {
        var usr = window.atob(getCookie("usErp"));


        $.ajax({
            type: "POST",
            url: "wspermisos.asmx/obtenerPermisos",
            data: '{us: "' + usr + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function (data) {
            },
            success: function (msg) {
                var html = "";
                var men = "";
                var dir = ""
                var cambio = 0;
                $.each(msg.d, function () {

                    if (men != this.menu && cambio == 1) {
                        html += '</ul>';
                        html += '</li>';
                        cambio = 0;
                        men = this.menu;
                    }

                    if (cambio == 0) {
                        html += '<li class="nav-item">';
                        html += '<a href="javascript:void(0);"  class="' + this.id + ' nav-link dropdwown-toggle" onclick="mostrarm(' + this.id + ')" ><i class="material-icons icon">'+this.icon+'</i> <span>' + this.menu + '</span><i class="material-icons icon arrow">expand_more</i></a>';
                        html += '<ul class="nav flex-column">';
                        cambio = 1;
                        men = this.menu;
                    }

                    if (cambio == 1) {
                        html += '<li class="nav-item">';
                        html += '<a href="' + this.direccion + '" class="nav-link blue-darken-active"><i class="material-icons icon"></i> <span>' + this.descripcion + '</span></a>';
                        html += '</li>';
                    }


                });
                $('#allMenu').append(html);

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
});

/* left sidebar accordion menu */
/* url  navigation active */
var url = window.location;

function menuitems() {
    var element = $('.sidebar .nav .nav-item a').filter(function () {
        return this.href == url;
        console.log(url)
    }).addClass('active').parent("li").addClass('active').closest('.nav').slideDown().addClass('in').prev().addClass('active').parent().addClass('show').closest('.nav').slideDown().addClass('in').parent().addClass('show');
}
menuitems();

function mostrarm(id) {
    if ($('.' + id).hasClass('active') != true) {
        $('.sidebar .nav .nav-item .dropdwown-toggle').removeClass('active').next().slideUp();
        $('.' + id).addClass('active').next().slideDown();
    } else {
        $('.' + id).removeClass('active').next().slideUp();
    }
};

function base64(cadena) {
        return window.btoa(unescape(encodeURIComponent(cadena)));
    }