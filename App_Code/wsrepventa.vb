Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports iTextSharp.text
Imports iTextSharp.text.pdf
Imports System.IO

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()> _
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsrepventa
    Inherits System.Web.Services.WebService


    'metodo utilizado parA obtener los departamentos
    <WebMethod()> _
    Public Function getClientes() As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select * from CLiente"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("Id_Clt")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Nom_clt").ToString

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function

    <WebMethod()> _
    Public Function Consultar(ByVal fechaIni As String, ByVal fechaFin As String, ByVal suc As Integer, ByVal region As Integer, ByVal cliente As String) As List(Of [Datos])
        Dim filtro As String = ""

        If suc > 0 Then
            filtro = " and id_suc = " & suc
        End If


        If cliente <> "" Then
            filtro &= " and cliente = '" & cliente & "' "
        End If


        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT factura, fecha, total TOTR, notas, " &
                                      "  CASE WHEN total - notas = 0 THEN 'Anulada' " &
                                      " WHEN notas > 0 and total - notas > 0 THEN 'Nota de Credito'  WHEN (total - notas - rec)  <= 0 AND estado = 1 THEN  'Cancelada' WHEN estado = 0 THEN 'Anulada'  ELSE  'Vigente' END estado, " &
                                      " cliente, fechaf, id_dep, id_muni, id_suc, id_region, CASE WHEN notas > 0 THEN 0 ELSE CASE  WHEN total - notas - rec > total or total - notas - rec < 0  THEN 0 ELSE total - notas - rec  END  END SALDO, " &
                                      "  id_enc, Total_Factura FROM ( SELECT Serie_Fact +'-'+ RTRIM(firma)  factura, CONVERT(varchar(10), CAST(fecha as date), 103) fecha, " &
                                      " (SUM(df.Sub_Total) - ef.Total_Descuento) as total, ISNULL((SELECT SUM(CASE WHEN devolucion > 0 THEN devolucion * Precio_Unit_Articulo " &
                                      "  ELSE dnc.descuento END) valor FROM ENC_NOTA_CREDITO enc INNER JOIN DET_NOTA_CREDITO dnc ON enc.idNota = dnc.idNota " &
                                      "  INNER JOIN DET_FACTURA df2 on dnc.id_detalle = df2.Id_detalle WHERE enc.id_enc = ef.id_enc ), '0') notas , " &
                                      "   (SELECT estado from ENC_FACTURA WHERE id_enc = ef.id_enc) estado, " &
                                      "  c.Nom_clt cliente, fecha fechaf, c.id_dep, c.id_muni, ef.id_suc, r.id_region, ISNULL((SELECT SUM(abonado) " &
                                      "  FROM DET_RECIBO_FACT WHERE id_enc = ef.id_enc), 0) rec, ef.id_enc, ef.total_factura FROM ENC_FACTURA ef INNER JOIN DET_FACTURA df " &
                                      "  on ef.id_enc = df.id_enc INNER JOIN CLiente c on ef.Id_Clt = c.Id_Clt INNER JOIN SUCURSALES s on ef.id_suc = s.id_suc " &
                                      "  INNER JOIN REGIONES r on s.id_region = r.id_region GROUP BY Serie_Fact, firma, Fecha, ef.id_enc, c.Nom_clt, c.nit_clt, ef.Total_Descuento, " &
                                      "  c.id_dep, c.id_muni, ef.id_suc, r.id_region, ef.Total_Factura " &
                                      ")ORDEN WHERE CAST(fechaf as date) between '" & fechaIni & "' and '" & fechaFin & "'" & filtro
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_enc")
                Elemento.factura = TablaEncabezado.Rows(i).Item("factura").ToString
                Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha").ToString
                Elemento.cliente = TablaEncabezado.Rows(i).Item("cliente").ToString
                Elemento.valor = Convert.ToDouble(TablaEncabezado.Rows(i).Item("TOTR")).ToString("#,##0.00")
                Elemento.estado = TablaEncabezado.Rows(i).Item("estado").ToString
                Elemento.saldo = Convert.ToDouble(TablaEncabezado.Rows(i).Item("SALDO")).ToString("#,##0.00")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next
        Return result
    End Function



    'metodo utilizado para generar pdf
    <WebMethod()>
    Public Function generarPDF(ByVal usr As String, ByVal fechaIni As String, ByVal fechaFin As String, ByVal suc As Integer, ByVal region As Integer, ByVal cliente As String) As String
        Dim result As String = ""

        Dim filtro As String = ""

        If suc > 0 Then
            filtro = " and id_suc = " & suc
        End If


        If cliente <> "" Then
            filtro &= " and cliente = '" & cliente & "' "
        End If


        Dim doc As Document = New iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER, 5, 5, 5, 5)

        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")

        Try
            Dim datafecha As Date = Now
            Dim nombredoc As String = "pdf\repventas.pdf"
            Dim pd As PdfWriter = PdfWriter.GetInstance(doc, New FileStream(Server.MapPath("~\vista\" & nombredoc), FileMode.Create))
            result = nombredoc
            doc.AddTitle("REPORTE DE VENTAS")
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

            Celda = New PdfPCell(New Paragraph("REPORTE DE VENTAS", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
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



            Dim TablaDatos As PdfPTable = New PdfPTable(6)

            TablaDatos.TotalWidth = 550.0F
            TablaDatos.LockedWidth = True
            TablaDatos.SetWidths({15, 15, 40, 15, 15, 15})

            Celda = New PdfPCell(New Paragraph("FACTURA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("FECHA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
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

            Celda = New PdfPCell(New Paragraph("VALOR", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
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


            Celda = New PdfPCell(New Paragraph("SALDO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)


            Dim total As Double = 0


            Dim SQL As String = "SELECT factura, fecha, total TOTR, notas, " &
                                      "  CASE WHEN total - notas = 0 THEN 'Anulada' " &
                                      " WHEN notas > 0 and total - notas > 0 THEN 'Nota de Credito'  WHEN (total - notas - rec)  <= 0 AND estado = 1 THEN  'Cancelada' WHEN estado = 0 THEN 'Anulada'  ELSE  'Vigente' END estado, " &
                                      " cliente, fechaf, id_dep, id_muni, id_suc, id_region, CASE WHEN notas > 0 THEN 0 ELSE CASE  WHEN total - notas - rec > total or total - notas - rec < 0  THEN 0 ELSE total - notas - rec  END  END SALDO, " &
                                      "  id_enc, Total_Factura FROM ( SELECT  RTRIM(firma)  factura, CONVERT(varchar(10), CAST(fecha as date), 103) fecha, " &
                                      " (SUM(df.Sub_Total) - ef.Total_Descuento) as total, ISNULL((SELECT SUM(CASE WHEN devolucion > 0 THEN devolucion * Precio_Unit_Articulo " &
                                      "  ELSE dnc.descuento END) valor FROM ENC_NOTA_CREDITO enc INNER JOIN DET_NOTA_CREDITO dnc ON enc.idNota = dnc.idNota " &
                                      "  INNER JOIN DET_FACTURA df2 on dnc.id_detalle = df2.Id_detalle WHERE enc.id_enc = ef.id_enc ), '0') notas , " &
                                      "   (SELECT estado from ENC_FACTURA WHERE id_enc = ef.id_enc) estado, " &
                                      "  c.Nom_clt cliente, fecha fechaf, c.id_dep, c.id_muni, ef.id_suc, r.id_region, ISNULL((SELECT SUM(abonado) " &
                                      "  FROM DET_RECIBO_FACT WHERE id_enc = ef.id_enc), 0) rec, ef.id_enc, ef.total_factura FROM ENC_FACTURA ef INNER JOIN DET_FACTURA df " &
                                      "  on ef.id_enc = df.id_enc INNER JOIN CLiente c on ef.Id_Clt = c.Id_Clt INNER JOIN SUCURSALES s on ef.id_suc = s.id_suc " &
                                      "  INNER JOIN REGIONES r on s.id_region = r.id_region GROUP BY Serie_Fact, firma, Fecha, ef.id_enc, c.Nom_clt, c.nit_clt, ef.Total_Descuento, " &
                                      "  c.id_dep, c.id_muni, ef.id_suc, r.id_region, ef.Total_Factura " &
                                      ")ORDEN WHERE CAST(fechaf as date) between '" & fechaIni & "' and '" & fechaFin & "'" & filtro

            Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
            Dim Elemento As New Datos

            Dim totsaldo = 0
            Dim totvalor = 0

            For i = 0 To TablaEncabezado.Rows.Count - 1


                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("factura"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)

                    Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("fecha"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 0
                    Celda.Colspan = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)


                    Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("cliente").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 1
                    Celda.Colspan = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)


                    totvalor = totvalor + Double.Parse(TablaEncabezado.Rows(i).Item("TOTR"))

                    Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("TOTR"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
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

                    totsaldo += Double.Parse(TablaEncabezado.Rows(i).Item("SALDO"))

                    Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("SALDO"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                    Celda.BorderWidth = 1
                    Celda.BorderWidthTop = 0
                    Celda.BorderWidthRight = 1
                    Celda.Colspan = 0
                    Celda.HorizontalAlignment = Element.ALIGN_CENTER
                    TablaDatos.AddCell(Celda)



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




            Celda = New PdfPCell(New Paragraph(Format(totvalor, "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
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


            Celda = New PdfPCell(New Paragraph(Format(totsaldo, "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
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
    Public Function obtenerDatosEmpresa(ByVal empresa As Integer) As Datos
        Dim SQL As String = "SELECT  top 1 [id_empresa],[nombre],[nombre_comercial],[direccion],[nit]  FROM  [ENCA_CIA] " &
            " where id_empresa = " & empresa

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



    'consultar detalle 
    <WebMethod()> _
    Public Function consultarDet(ByVal id As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select b.Nom_Bod, a.cod_Art, a.Des_Art, df.Cantidad_Articulo, df.Precio_Unit_Articulo, (df.Cantidad_Articulo * df.Precio_Unit_Articulo) total " &
                                      "from DET_FACTURA df " &
                                      "JOIN Bodegas b " &
                                      "on b.Id_Bod = df.Id_Bod " &
                                      "JOIN Articulo a " &
                                      "on a.id_art = df.Id_Art " &
                                      "where df.id_enc = " & id
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        Dim tot As Double = 0

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.bodega = TablaEncabezado.Rows(i).Item("Nom_Bod").ToString
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art").ToString
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("Cantidad_Articulo")
                Elemento.precio = Convert.ToDouble(TablaEncabezado.Rows(i).Item("Precio_Unit_Articulo")).ToString("#,##0.00")
                Elemento.total = Convert.ToDouble(TablaEncabezado.Rows(i).Item("total")).ToString("#,##0.00")
                tot += Convert.ToDouble(TablaEncabezado.Rows(i).Item("total")).ToString("#,##0.00")
                Elemento.tot = tot.ToString("#,##0.00")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    Public Class Datos
        Public id As Integer
        Public descripcion As String
        Public factura As String
        Public fecha As String
        Public cliente As String
        Public valor As String
        Public estado As String
        Public saldo As String
        Public bodega As String
        Public codigo As String
        Public articulo As String
        Public cantidad As Integer
        Public precio As String
        Public total As String
        Public tot As String
        Public descripcionextra As String
        Public nit As String
        Public direccion As String
    End Class

End Class