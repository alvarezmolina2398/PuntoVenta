
$(function () {
    sucursales();


    $('#tipoM').change(function () {
        $('#dmet').attr('hidden', false);
        $('#btncrear').attr('hidden', false);
        if ($(this).val() == 'M') {
            Mensual();
        }
        else if ($(this).val() == 'S') {
            semanal();
        }

        consular();
    });

    $('#btndis').click(function(){
        var valor = $('#totalM').val();
        var total = 0;
        var counter = 0;

        if ($('#tipoM').val() == 'M') {
            total = Math.round(valor / 12, 2);
            counter = 12;
        }
        else if ($('#tipoM').val() == 'S') {
            total = Math.round(valor / 52, 2);
            counter = 52;
        }

        var e = 1;
        for (var i = 0; i < counter; i++) {
            $('#txt' + e).val(total);
            e++;
        }
    });

    $('#btnlim').click(function () {
        limpiar(); 
    });

    $('#btncrear').click(function () {
        $('#btncrear').attr('disabled', true);
        crear();
    });

    //metodo utilizado para crear una meta

});

function sucursales() {

    //consume el ws para obtener los datos
    $.ajax({
        url: 'wsadmin_sucursales.asmx/ObtenerDatos',
        data: '{}',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (msg) {
            $.each(msg.d, function () {
                $('#suc').append('<option value="' + this.id + '">' + this.descripcion + '</option>')
            });
        }
    });

}

function Mensual() {
    $('#frmdata').html(null);

    var meses= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var i = 0;
    var a = 0
    var e = 1;
    var input = "";
    input += '<div class="col-12 col-md-12 col-lg-12">';
    for (i = 0; i < 12; i++) {
        if (a == 0) {
            input += '<div class="row">'
        }
        input += '<div class="form-group col-6 col-md-3 col-lg-3">'
                + '<label for="nombre" name="descripcion" > '+meses[i]+':</label >'
                + '<input id="txt'+e+'" type="text" oninput="calcular()" class="form-control" placeholder="0" autocomplete="off">'
                + '</div>';
        a++;
        if (a == 4) {
            input += '</div>'
            a = 0;
        }
        e++;
    }
    input += '</div>';

    $('#frmdata').append(input);
}

function semanal() {
    $('#frmdata').html(null);
    var i = 0;
    var a = 0;
    var e = 1;
    var input = "";
    input += '<div class="col-12 col-md-12 col-lg-12">';
    for (i = 0; i < 52; i++) {
        if (a == 0) {
            input += '<div class="row">'
        }
        input += '<div class="form-group col-6 col-md-3 col-lg-3">'
            + '<label for="nombre" name="descripcion" >  Semana ' +e+ ':</label >'
            + '<input id="txt' + e + '" type="text" oninput="calcular()" class="form-control" placeholder="0" autocomplete="off">'
            + '</div>';
        a++;
        if (a == 4) {
            input += '</div>'
            a = 0;
        }
        e++;
    }
    input += '</div>';

    $('#frmdata').append(input);
}

function calcular() {
    var e = 1;
    var i = 0;
    var total = 0;

    if ($('#tipoM').val() == 'M') {
        counter = 12;
    }
    else if ($('#tipoM').val() == 'S') {
        counter = 52;
    }
    var valor = 0;
    for (i = 0; i < counter; i++) {
        valor = $('#txt' + e).val();
        total += parseFloat(valor);
        e++;
    }

    $('#totalM').val(total);
}

function consular() {
    var total = 0;
    var tot = 0;
    var i = 0;
    var sum;
    $.ajax({
        type: "POST",
        url: "wsmetas.asmx/getMeta",
        data: '{periodo: "' + $('#per').val() + '", suc: ' + $('#suc').val() + ', meta: ' + $('#meta').val() + ', tipo: "' + $('#tipoM').val() + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            $.each(msg.d, function () {
                tot = this.total
                $('#txt' + this.id).val(this.valor);
                i++;
            });
            total = Math.round(tot, 2);


            if (total > 0) {
                $('#btncrear').html('<i class="material-icons">cached</i>Actualizar');
                $('#btncrear').removeClass('btn-success');
                $('#btncrear').removeClass('btn-warning');
                $('#btncrear').addClass('btn-info');
                $('#totalM').val(total);
            }
            else if (total == 0) {
                $('#btncrear').html('<i class="material-icons">add</i>Crear Meta');
                $('#btncrear').removeClass('btn-info');
                $('#btncrear').removeClass('btn-warning');
                $('#btncrear').addClass('btn-success');
                $('#totalM').val('');
            }

        }
    });
}

function limpiar() {
    var counter = 0;

    if ($('#tipoM').val() == 'M') {
        counter = 12;
    }
    else if ($('#tipoM').val() == 'S') {
        counter = 52;
    }

    var e = 1;
    var i = 0;
    $('#totalM').val("");
    for (i = 0; i < counter; i++) {
        $('#txt' + e).val("");
        e++;
    }
}

function crear() {
    var counter = 0;
    var valores = [];
    if ($('#tipoM').val() == 'M') {
        counter = 12;
    }
    else if ($('#tipoM').val() == 'S') {
        counter = 52;
    }

    var e = 1;
    var i = 0;

    for (i = 0; i < counter; i++) {
        valores.push($('#txt' + e).val());
        e++;
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "wsmetas.asmx/CrearoActualizarMeta",
        data: '{valores: ' + JSON.stringify(valores) + ', periodo: "' + $('#per').val() + '", suc: ' + $('#suc').val() + ', meta: ' + $('#meta').val() + ', tipo: "' + $('#tipoM').val() + '"}',
        dataType: "json",
        beforeSend: function () {
            $('#btncrear').removeClass('btn-success');
            $('#btncrear').addClass('btn-warning');
            $('#btncrear').html('<i class="material-icons">query_builder</i>Cargando...')
        },
        success: function (msg) {
            limpiar(); $('#per').val(0); $('#suc').val(0); $('#meta').val(0); $('#tipoM').val(0);
            $('#dmet').attr('hidden', true);
            $('#btncrear').attr('hidden', true);
            $('#frmdata').html(null);
            $('#btncrear').attr('disabled', false);
            $('#btncrear').removeClass('btn-warning');
            $('#btncrear').addClass('btn-success');
            $('#btncrear').text("Crear");
            $('.jq-toast-wrap').remove();
            $.toast({
                heading: 'Listo!',
                text: 'Meta creada exitosamente',
                position: 'bottom-right',
                showHideTransition: 'plain',
                icon: 'success',
                stack: false
            })
        }
    });
}