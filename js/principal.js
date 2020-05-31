$(function () {

    $(document).ready(function () {
        TicketdelDia();
        AlertaConsumoSeries();
        AlertaSeriesVencimiento();
        EstaSemana();
        EsteMes();
        TClientes();
    });

    function TicketdelDia() {
        $.ajax({
            type: "POST",
            url: "wsdashboard.asmx/hoy",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function correcto(msg) {
                $.each(msg.d, function () {
                    $('#tdia').text(this.total);
                });
            }
        });
    }


    function EstaSemana() {
        $.ajax({
            type: "POST",
            url: "wsdashboard.asmx/EstaSemana",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function correcto(msg) {
                $.each(msg.d, function () {
                    $('#tsem').text(this.total);
                });
            }
        });
    }


    function EsteMes() {
        $.ajax({
            type: "POST",
            url: "wsdashboard.asmx/EsteMes",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function correcto(msg) {
                $.each(msg.d, function () {
                    $('#tmes').text(this.total);
                });
            }
        });
    }



    function TClientes() {
        $.ajax({
            type: "POST",
            url: "wsdashboard.asmx/top5ventas",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
            },
            success: function correcto(msg) {


                var i = 0;
                var tickets = "";
                $.each(msg.d, function () {
                    tickets += "<tr>";
                    tickets += "<td>";
                    tickets += '<div class="media">';
                    tickets += '<div class="mr-3">';
                    tickets += '<button class="btn btn-outline-dark btn-sm" style="margin-top:5px"><i class="material-icons">account_circle</i></button></div>';
                    tickets += '<div class="media-body"> <h6 class="my-0 mt-1">  ' + this.cliente + '</h6>   <p class="small">  Cliente</p></div></div></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.total + '</h6><p class="content-color-secondary small mb-0"> Total</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.fecha + '</h6><p class="content-color-secondary small mb-0"> Fecha</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.hora + '</h6><p class="content-color-secondary small mb-0">  Hora</p></td>';
                    tickets += '</tr>';
                });

                $('#tbUsers').append(tickets);





            }
        });
    }

    function AlertaConsumoSeries() {
        $.ajax({
            type: "POST",
            url: "wsdashboard.asmx/AlertaConsumoSeries",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
            },
            success: function correcto(msg) {


                var i = 0;
                var tickets = "";
                $.each(msg.d, function () {
                    tickets += "<tr>";
                    tickets += "<td>";
                    tickets += '<div class="media">';
                    tickets += '<div class="mr-3">';
                    tickets += '<button class="btn btn-outline-dark btn-sm" style="margin-top:5px"><i class="material-icons">account_circle</i></button></div>';
                    tickets += '<div class="media-body"> <h6 class="my-0 mt-1">  ' + this.Series + '</h6>   <p class="small">  SERIE</p></div></div></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.Fac_inicial + '</h6><p class="content-color-secondary small mb-0"> DEL</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.Fac_Fin + '</h6><p class="content-color-secondary small mb-0"> AL</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.Fac_Act + '</h6><p class="content-color-secondary small mb-0">  Actual</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.porcentage + ' %</h6><p class="content-color-secondary small mb-0"> % de Consumo</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.autorizacion + ' </h6><p class="content-color-secondary small mb-0">  Resolucion</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.fecha + ' </h6><p class="content-color-secondary small mb-0">  Fecha Autorizacion</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.fechasvencimiento + ' </h6><p class="content-color-secondary small mb-0">  Fecha Vencimiento</p></td>';
                    tickets += '</tr>';
                });

                $('#tbConsumoSerie').append(tickets);





            }
        });
    }

    function AlertaSeriesVencimiento() {
        $.ajax({
            type: "POST",
            url: "wsdashboard.asmx/AlertaVencimientoSerie",
            data: '{}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function () {
            },
            success: function correcto(msg) {


                var i = 0;
                var tickets = "";
                $.each(msg.d, function () {
                    tickets += "<tr>";
                    tickets += "<td>";
                    tickets += '<div class="media">';
                    tickets += '<div class="mr-3">';
                    tickets += '<button class="btn btn-outline-dark btn-sm" style="margin-top:5px"><i class="material-icons">account_circle</i></button></div>';
                    tickets += '<div class="media-body"> <h6 class="my-0 mt-1">  ' + this.Series + '</h6>   <p class="small">  SERIE</p></div></div></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.Fac_inicial + '</h6><p class="content-color-secondary small mb-0"> DEL</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.Fac_Fin + '</h6><p class="content-color-secondary small mb-0"> AL</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.Fac_Act + '</h6><p class="content-color-secondary small mb-0">  Actual</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.diasvencimiento + '</h6><p class="content-color-secondary small mb-0">Dias para el vencimiento</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.autorizacion + ' </h6><p class="content-color-secondary small mb-0">  Resolucion</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.fecha + ' </h6><p class="content-color-secondary small mb-0">  Fecha Autorizacion</p></td>';
                    tickets += '<td><h6 class="my-0 mt-1">' + this.fechasvencimiento + ' </h6><p class="content-color-secondary small mb-0">  Fecha Vencimiento</p></td>';
                    tickets += '</tr>';
                });

                $('#tbvencimientoSerie').append(tickets);





            }
        });
    }

   

});