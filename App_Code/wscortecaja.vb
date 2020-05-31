Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports iTextSharp.text
Imports iTextSharp.text.pdf
Imports System.IO

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wscortecaja
    Inherits System.Web.Services.WebService

    'metodo utilizado para obtener la fecha cierre
    <WebMethod()>
    Public Function getFechaCierre(ByVal usuario As String) As String
        Dim result As String = ""
        Dim fCorresponde As String = manipular.idempresabusca("SELECT ISNULL(CONVERT(varchar(10), DATEADD(DAY, 1, MAX(fCorresponde)), 103), convert(varchar,GETDATE(),103)) FROM CIERRESUC WHERE id_suc = (select id_sucursal from USUARIO where USUARIO = '" & usuario & "')  AND estado = 1")
        result = fCorresponde
        Return result
    End Function

    'metodo utilizado para generar el cierre de caja
    <WebMethod(True)>
    Public Function generarCierre(ByVal fCierre As String) As String

        Dim retorno As String = Nothing

        Dim fechass As String() = fCierre.Split("/")
        fCierre = fechass(2) & "-" & fechass(1) & "-" & fechass(0)

        Dim strInsert As String = "INSERT INTO CIERRESUC " &
                                  "(fCorresponde, usuario, id_suc) " &
                                  "VALUES " &
                                  "('" & fCierre & "', 'admin1', 1)"
        Dim insertado As Boolean = manipular.EjecutaTransaccion1(strInsert)

        If insertado Then

            Dim idInsertado As Integer = manipular.idempresabusca("SELECT MAX(idCierre) FROM CIERRESUC WHERE fCorresponde = '" & fCierre & "' AND estado = 1")

            Dim strDetalle As String = "INSERT INTO DETCIERRESUC " &
                                       "(idCierre, efectivo, visa, credomatic, cheques) " &
                                       "SELECT " &
                                       "" & idInsertado & ", ISNULL(SUM(ef.efectivo), 0) efectivo, ISNULL((SELECT SUM(ef.tarjeta) tarjeta FROM ENC_FACTURA ef WHERE CAST(Fecha as date) between '" & fCierre & "' AND '" & fCierre & "' AND (tipoTarjeta = 1 OR tipoTarjeta IS NULL)), 0) visa, ISNULL((SELECT SUM(ef.tarjeta) tarjeta FROM ENC_FACTURA ef WHERE CAST(Fecha as date) between '" & fCierre & "' AND '" & fCierre & "' AND (tipoTarjeta = 2)), 0) credomatic, ISNULL(SUM(ef.cheques), 0) cheque " &
                                       "FROM ENC_FACTURA ef " &
                                       "WHERE CAST(Fecha as date) between '" & fCierre & "' AND '" & fCierre & "' AND ef.id_suc =1"
            manipular.EjecutaTransaccion1(strDetalle)

            retorno = manipular.idempresabusca("SELECT CONVERT(varchar(10), DATEADD(DAY, 1, fCorresponde), 103) FROM CIERRESUC WHERE idCierre = " & idInsertado)

        Else
            retorno = "E"
        End If

        Return retorno

    End Function




    'metodo utilizado para consultar el resumen de corte de caja
    <WebMethod()>
    Public Function getTitulos(ByVal usr As String, ByVal fechaIni As String, ByVal fechaFin As String) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim tot As Double = 0
        Dim res As Double = 0
        Dim temp As String = ""

        Dim fechass As String() = fechaIni.Split("/")
        fechaIni = fechass(2) & "-" & fechass(1) & "-" & fechass(0)



        fechass = fechaFin.Split("/")
        fechaFin = fechass(2) & "-" & fechass(1) & "-" & fechass(0)

        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")


        Dim StrEncabezado As String = "SELECT descripcion, ISNULL((SELECT SUM(d.VALOR) FROM DET_RECIBO d JOIN ENC_RECIBO e ON d.idRecibo = e.idRecibo WHERE e.estado = 1 and d.tipoPago = idTipoPago AND CAST(e.fecha as date) BETWEEN '" & fechaIni & "' AND '" & fechaFin & "'), 0) as valor " &
                                      "FROM TIPOPAGO " &
                                      "WHERE idempresa = " & id
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.valor = Convert.ToDouble(TablaEncabezado.Rows(i).Item("valor")).ToString("#,##0.00")
                Elemento.titulo = TablaEncabezado.Rows(i).Item("descripcion")

                tot += TablaEncabezado.Rows(i).Item("valor")
                Elemento.total = tot.ToString("#,##0.00")



                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para consultar el listado de recibos
    <WebMethod()>
    Public Function Consultar(ByVal fechaIni As String, ByVal fechaFin As String, ByVal usr As String) As List(Of [Datos])
        Dim outIva As Double = 0

        Dim fechass As String() = fechaIni.Split("/")
        fechaIni = fechass(2) & "-" & fechass(1) & "-" & fechass(0)



        fechass = fechaFin.Split("/")
        fechaFin = fechass(2) & "-" & fechass(1) & "-" & fechass(0)



        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT d.idRecibo as numero,convert(varchar,e.fecha,103) + ' ' +  convert(varchar,e.fecha,24) fecha, c.Nom_clt as cliente, ISNULL(SUM(d.valor), 0) as valor, CASE WHEN e.estado =1 THEN 'ACTIVO' WHEN e.estado = 0 THEN 'ANULADO' END as estado " &
                                       "from DET_RECIBO d " &
                                       " join ENC_RECIBO e " &
                                        "On  e.idRecibo= d.idRecibo " &
                                        "join CLiente c " &
                                        "on c.Id_Clt = e.Id_Clt " &
                                        "join TipoPago t  " &
                                        "On t.idtipoPago = d.tipoPago " &
                                        "where CAST(e.fecha as date) BETWEEN '" & fechaIni & "' AND '" & fechaFin & "' AND  t.idempresa =  " & id & " and e.idRecibo = d.idRecibo " &
                                        "Group by d.idRecibo, c.Nom_clt, e.estado,e.fecha " &
                                        "order by d.idRecibo "
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("numero")
                Elemento.cliente = TablaEncabezado.Rows(i).Item("cliente").ToString
                Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha").ToString
                Elemento.valor = Convert.ToDouble(TablaEncabezado.Rows(i).Item("valor")).ToString("#,##0.00")
                Elemento.estado = TablaEncabezado.Rows(i).Item("estado")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function

    'metodo  utilizado para generar el pdf 
    <WebMethod()>
    Public Function generarPDF(ByVal fechaIni As String, ByVal fechaFin As String, ByVal usr As String) As String
        Dim result As String = ""

        Dim fechass As String() = fechaIni.Split("/")
        fechaIni = fechass(2) & "-" & fechass(1) & "-" & fechass(0)



        fechass = fechaFin.Split("/")
        fechaFin = fechass(2) & "-" & fechass(1) & "-" & fechass(0)


        Dim doc As Document = New iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER, 5, 5, 5, 5)

        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")

        Try
            Dim datafecha As Date = Now
            Dim nombredoc As String = "pdf\cortecaja.pdf"
            Dim pd As PdfWriter = PdfWriter.GetInstance(doc, New FileStream(Server.MapPath("~\vista\" & nombredoc), FileMode.Create))
            result = nombredoc
            doc.AddTitle("CORTE DE CAJA")
            doc.AddAuthor("")
            doc.AddCreationDate()

            doc.Open()

            Dim PARRAFO_ESPACIO As Paragraph = New Paragraph(" ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD))
            PARRAFO_ESPACIO.Alignment = Element.ALIGN_CENTER

            Dim d As Datos = obtenerDatosEmpresa(id)
            Dim empresa = ""
            Dim nombre = ""
            Dim direccion = ""
            Dim nit = ""

            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)

            empresa = d.descripcion
                nombre = d.descripcionextra
                direccion = d.direccion
            nit = d.nit


            Dim RutaImagen As String = Server.MapPath("~")
            Dim Imagen As Image = Image.GetInstance(RutaImagen & "\img\logo.png")

            Imagen.ScalePercent(30) 'escala al tamaño de la imagen
            Imagen.SetAbsolutePosition(25, 690)

            doc.Add(Imagen)

            Dim Tabla As PdfPTable = New PdfPTable(3)

            Tabla.TotalWidth = 550.0F
            Tabla.LockedWidth = True
            Tabla.SetWidths({33, 33, 34})

            Dim Celda As PdfPCell = New PdfPCell
            Dim celda1 As PdfPCell = New PdfPCell


            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 14, iTextSharp.text.Font.BOLD)))
            Celda.Colspan = 1
            Celda.BorderWidth = 0
            Celda.HorizontalAlignment = Element.ALIGN_LEFT
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(nombre, FontFactory.GetFont("Arial", 14, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("CORTE DE CAJA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)



            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(empresa, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(direccion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Date.Now, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(nit, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 1
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)



            doc.Add(Tabla)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)


            Dim TablaResumen As PdfPTable = New PdfPTable(2)
            TablaResumen.TotalWidth = 550.0F
            TablaResumen.LockedWidth = True
            TablaResumen.SetWidths({40, 15})

            Dim total1 As Double = 0


            Dim SQL1 As String = "SELECT descripcion, ISNULL((SELECT SUM(d.VALOR) FROM DET_RECIBO d JOIN ENC_RECIBO e ON d.idRecibo = e.idRecibo WHERE e.estado = 1 and d.tipoPago = idTipoPago AND CAST(e.fecha as date) BETWEEN '" & fechaIni & "' AND '" & fechaFin & "'), 0) as valor " &
                                      "FROM TIPOPAGO " &
                                      "WHERE idempresa = " & id

            Dim TablaR As DataTable = manipular.ObtenerDatos(SQL1)

            For i = 0 To TablaR.Rows.Count - 1
                Celda = New PdfPCell(New Paragraph(TablaR.Rows(i).Item("descripcion"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 0
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaResumen.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(Format(TablaR.Rows(i).Item("valor"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 0
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaResumen.AddCell(Celda)

                total1 += Convert.ToDouble(TablaR.Rows(i).Item("valor"))
            Next


            Celda = New PdfPCell(New Paragraph("Total", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.HorizontalAlignment = Element.ALIGN_LEFT
            TablaResumen.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Format(total1, "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_LEFT
            TablaResumen.AddCell(Celda)


            doc.Add(TablaResumen)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)


            '/////////////////////////////////////////////


            Dim TablaDatos As PdfPTable = New PdfPTable(4)

            TablaDatos.TotalWidth = 550.0F
            TablaDatos.LockedWidth = True
            TablaDatos.SetWidths({15, 40, 15, 15})

            Celda = New PdfPCell(New Paragraph("NO.RECIBO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("CLIENTE", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("ESTADO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Dim total As Double = 0


            Dim SQL As String = "SELECT d.idRecibo as numero, c.Nom_clt as cliente, ISNULL(SUM(d.valor), 0) as valor, CASE WHEN e.estado =1 THEN 'ACTIVO' WHEN e.estado = 0 THEN 'ANULADO' END as estado " &
                                "from DET_RECIBO d " &
                                " join ENC_RECIBO e " &
                                "On  e.idRecibo= d.idRecibo " &
                                "join CLiente c " &
                                "on c.Id_Clt = e.Id_Clt " &
                                "join TipoPago t  " &
                                "On t.idtipoPago = d.tipoPago " &
                                "where CAST(e.fecha as date) BETWEEN '" & fechaIni & "' AND '" & fechaFin & "' AND  t.idempresa =  " & id & " and e.idRecibo = d.idRecibo " &
                                "Group by d.idRecibo, c.Nom_clt, e.estado " &
                                "order by d.idRecibo "


            Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
            Dim Elemento As New Datos
            Dim totalFAc As Double = 0
            For i = 0 To TablaEncabezado.Rows.Count - 1
                For ii = 0 To 1

                    Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("numero"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)

                    Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("cliente"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 0
                    Celda.Colspan = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)


                    Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("estado").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 1
                    Celda.Colspan = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)

                    totalFAc += TablaEncabezado.Rows(i).Item("valor")
                    Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("valor"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 0
                    Celda.Colspan = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)


                    ii = ii + 1
                Next
            Next


            Celda = New PdfPCell(New Paragraph("TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph("", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Format(totalFAc, "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)


            doc.Add(TablaDatos)



            doc.Close()


        Catch ex As Exception
            doc.Close()
            result = ex.Message
        End Try

        Return result
    End Function

    <WebMethod()>
    Public Function obtenerDatosEmpresa(ByVal id As Integer) As Datos
        Dim SQL As String = "SELECT  top 1 [id_empresa],[nombre],[nombre_comercial],[direccion],[nit]  FROM  [ENCA_CIA] " &
            " where id_empresa = " & id

        Dim result As Datos = New Datos()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        Dim Elemento As New Datos
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                Elemento.id = TablaEncabezado.Rows(i).Item("id_empresa")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("nombre").ToString
                Elemento.descripcionextra = TablaEncabezado.Rows(i).Item("nombre_comercial").ToString
                Elemento.nit = TablaEncabezado.Rows(i).Item("nit").ToString
                Elemento.direccion = TablaEncabezado.Rows(i).Item("direccion").ToString
                ii = ii + 1
            Next
        Next

        Return Elemento

    End Function

    Public Class Datos
        Public id As String
        Public cliente As String
        Public valor As String
        Public total As String
        Public tipo As String
        Public titulo As String
        Public contador As Integer
        Public estado As String
        Public descripcion As String
        Public descripcionextra As String
        Public fecha As String
        Public nit As String
        Public direccion As String
    End Class

End Class