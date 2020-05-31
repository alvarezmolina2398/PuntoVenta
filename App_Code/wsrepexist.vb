Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports iTextSharp.text
Imports System.IO
Imports iTextSharp.text.pdf

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsrepexist
    Inherits System.Web.Services.WebService

    'metodo utilizado para llenar las regiones
    <WebMethod()>
    Public Function regiones(ByVal empresa As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select id_region, descripcion from REGIONES where id_empresa = " & empresa & " and estado = 1"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_region")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("descripcion").ToString

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para llenar las sucursales
    <WebMethod()>
    Public Function sucursales(ByVal empresa As Integer, ByVal region As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select id_suc, descripcion from SUCURSALES where id_empresa = " & empresa & " and id_region = " & region
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_suc")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("descripcion").ToString

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para llenar las bodegas
    <WebMethod()>
    Public Function bodegas(ByVal sucursal As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT id_bod, nom_bod FROM bodegas WHERE id_suc = " & sucursal & " and estado = 1 order by nom_bod"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_bod")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("nom_bod").ToString

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function


    'metodo utilizado para obtener el listado de existencias 
    <WebMethod()>
    Public Function consultar(ByVal region As Integer, ByVal sucursal As Integer, ByVal bodega As Integer) As List(Of [Datos])
        Dim filtro = ""

        If region > 0 Then
            filtro = filtro & " and s.id_region = " & region & ""
            If sucursal > 0 Then
                filtro = filtro & " and b.Id_suc = " & sucursal & ""
                If bodega > 0 Then
                    filtro = filtro & " and e.id_bod = " & bodega & ""
                End If
            End If
        End If


        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select e.Id_Bod,e.Id_Art,(e.Existencia_Deta_Art- (SELECT isnull(sum(d.cantidad_articulo),0)  FROM   [DETA_RESERVA] d WHERE d.Id_Bod = b.Id_Bod and a.id_art = s.id_suc and estado = 1) ) as existencia, " &
                                    "ISNULL((SELECT isnull(sum(d.cantidad_articulo),0)  FROM   [DETA_RESERVA] d WHERE d.Id_Bod = b.Id_Bod  and d.id_Art = a.id_art  and estado = 1),0) AS facturar," &
                                    "e.Reservadas,b.Nom_Bod as bodega,a.cod_Art, a.cod_pro1,a.costo_art,A.Des_Art, b.Id_suc,s.id_region, ISNULL(c.descripcionColor, '') colorn, a.precio1, M.NOM_MARCA, " &
                                    "(select sum(cantidad_articulo) from det_or_compra d inner join ENC_OR_COMPRA e on e.id_enc = d.id_enc where e.estatus = 2 and e.estado = 0 and d.id_art = a.id_art) transito " &
                                    "from Existencias e inner join Bodegas b on b.Id_Bod = e.Id_Bod inner join Articulo a on a.id_art = e.Id_Art inner join SUCURSALES s on s.id_suc = b.Id_suc " &
                                    "FULL JOIN COLOR c ON a.idColor = c.idColor " &
                                    "FULL JOIN MARCAS M ON M.ID_MARCA = A.ID_MARCA " &
                                    "where e.Existencia_Deta_Art > 0" & filtro & ""
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art").ToString
                Elemento.marcas = TablaEncabezado.Rows(i).Item("NOM_MARCA").ToString
                Elemento.color = TablaEncabezado.Rows(i).Item("colorn").ToString
                Elemento.bodega = TablaEncabezado.Rows(i).Item("bodega").ToString
                Elemento.existencia = TablaEncabezado.Rows(i).Item("existencia")
                Elemento.facturar = TablaEncabezado.Rows(i).Item("facturar")
                Elemento.costoUnit = Convert.ToDouble(TablaEncabezado.Rows(i).Item("costo_art")).ToString("#,##0.00")
                Elemento.precio = Convert.ToDouble(TablaEncabezado.Rows(i).Item("precio1")).ToString("#,##0.00")
                Elemento.costoTotal = Convert.ToDouble(TablaEncabezado.Rows(i).Item("existencia") * Convert.ToDouble(TablaEncabezado.Rows(i).Item("costo_art"))).ToString("#,##0.00")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function


    'metodo utilizado para obtener el listado de existencias 
    <WebMethod()>
    Public Function consultarPDF(ByVal region As Integer, ByVal sucursal As Integer, ByVal bodega As Integer, ByVal usr As String) As String
        Dim filtro = ""

        If region > 0 Then
            filtro = filtro & " and s.id_region = " & region & ""
            If sucursal > 0 Then
                filtro = filtro & " and b.Id_suc = " & sucursal & ""
                If bodega > 0 Then
                    filtro = filtro & " and e.id_bod = " & bodega & ""
                End If
            End If
        End If


        Dim result As String = ""
        Dim StrEncabezado As String = "select e.Id_Bod,e.Id_Art,(e.Existencia_Deta_Art- (SELECT isnull(sum(d.cantidad_articulo),0)  FROM   [DETA_RESERVA] d WHERE d.Id_Bod = b.Id_Bod and a.id_art = s.id_suc and estado = 1) ) as existencia, " &
                                    "ISNULL((SELECT isnull(sum(d.cantidad_articulo),0)  FROM   [DETA_RESERVA] d WHERE d.Id_Bod = b.Id_Bod  and d.id_Art = a.id_art  and estado = 1),0) AS facturar," &
                                    "e.Reservadas,b.Nom_Bod as bodega,a.cod_Art, a.cod_pro1,a.costo_art,A.Des_Art, b.Id_suc,s.id_region, ISNULL(c.descripcionColor, '') colorn, a.precio1, M.NOM_MARCA, " &
                                    "(select sum(cantidad_articulo) from det_or_compra d inner join ENC_OR_COMPRA e on e.id_enc = d.id_enc where e.estatus = 2 and e.estado = 0 and d.id_art = a.id_art) transito " &
                                    "from Existencias e inner join Bodegas b on b.Id_Bod = e.Id_Bod inner join Articulo a on a.id_art = e.Id_Art inner join SUCURSALES s on s.id_suc = b.Id_suc " &
                                    "FULL JOIN COLOR c ON a.idColor = c.idColor " &
                                    "FULL JOIN MARCAS M ON M.ID_MARCA = A.ID_MARCA " &
                                    "where e.Existencia_Deta_Art > 0" & filtro & ""
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        Dim doc As Document = New iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER, 5, 5, 5, 5)

        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")

        Try
            Dim datafecha As Date = Now
            Dim nombredoc As String = "pdf\reporteexistencias.pdf"
            Dim pd As PdfWriter = PdfWriter.GetInstance(doc, New FileStream(Server.MapPath("~\vista\" & nombredoc), FileMode.Create))
            result = nombredoc
            doc.AddTitle("REPORTE DE EXISTENCIAS")
            doc.AddAuthor("")
            doc.AddCreationDate()

            doc.Open()

            Dim PARRAFO_ESPACIO As Paragraph = New Paragraph(" ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD))
            PARRAFO_ESPACIO.Alignment = Element.ALIGN_CENTER

            Dim d As Datos2 = obtenerDatosEmpresa(id)
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



            Dim TablaDatos As PdfPTable = New PdfPTable(10)

            TablaDatos.TotalWidth = 550.0F
            TablaDatos.LockedWidth = True
            TablaDatos.SetWidths({10, 10, 10, 10, 10, 10, 10, 10, 10, 10})

            Celda = New PdfPCell(New Paragraph("CODIGO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("DESCRIPCION", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("MARCA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("COLOR", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("BODEGA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph("DISPONIBLE", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("POR FACTURAR", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph("COSTO UNI", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("PRECIO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("COSTO TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Dim total As Double = 0




            Dim Elemento As New Datos

            Dim totsaldo = 0
            Dim totvalor = 0

            Dim existencia As Integer = 0
            Dim facturar As Integer = 0
            Dim cosotUnit As Double = 0
            Dim costoTotal As Double = 0

            For i = 0 To TablaEncabezado.Rows.Count - 1

                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("cod_Art"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("Des_Art"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)


                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("NOM_MARCA").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)




                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("colorn"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("bodega").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)



                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("existencia"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)


                existencia = existencia + TablaEncabezado.Rows(i).Item("existencia")

                Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("facturar"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                facturar += TablaEncabezado.Rows(i).Item("facturar")

                Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("costo_art"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                cosotUnit += Double.Parse(TablaEncabezado.Rows(i).Item("costo_art").ToString)

                Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("precio1"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)


                Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("existencia") * Convert.ToDouble(TablaEncabezado.Rows(i).Item("costo_art")), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                costoTotal += Double.Parse(TablaEncabezado.Rows(i).Item("existencia") * Convert.ToDouble(TablaEncabezado.Rows(i).Item("costo_art")))

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


            Celda = New PdfPCell(New Paragraph("", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
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

            Celda = New PdfPCell(New Paragraph(existencia, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(facturar, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Format(cosotUnit, "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
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





            Celda = New PdfPCell(New Paragraph(Format(costoTotal, "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
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
    Public Function obtenerDatosEmpresa(ByVal empresa As Integer) As Datos2
        Dim SQL As String = "SELECT  top 1 [id_empresa],[nombre],[nombre_comercial],[direccion],[nit]  FROM  [ENCA_CIA] " &
            " where id_empresa = " & empresa

        Dim result As Datos2 = New Datos2()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        Dim Elemento As New Datos2
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
        Public id As Integer
        Public codigo As String
        Public descripcion As String
        Public marcas As String
        Public color As String
        Public bodega As String
        Public existencia As Integer
        Public costoUnit As String
        Public precio As String
        Public costoTotal As String
        Public facturar As Integer
    End Class

    Public Class Datos2
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