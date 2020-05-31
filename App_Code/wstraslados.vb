﻿Imports System.Data
Imports System.Data.SqlClient
Imports System.IO
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports iTextSharp.text
Imports iTextSharp.text.pdf

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wstraslados
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerExistenciasPorBodega(ByVal bodega As Integer) As IList(Of productos)

        Dim sql As String = " SELECT a.id_art, a.requiereProduccion, (e.Existencia_Deta_Art)  - (SELECT isnull(sum(d.cantidad_articulo),0)  " &
            " FROM   [DETA_RESERVA] d WHERE d.Id_Bod = " & bodega & " and d.id_Art =  a.id_art and estado = 1) as existencia, a.Des_Art, a.cod_Art, a.precio1 " &
            "  FROM   [Existencias] e INNER JOIN   [Articulo] a on a.id_art = e.Id_Art WHERE a.estado = 1 and  Id_Bod = " & bodega

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
                Elemento.tipo = TablaEncabezado.Rows(i).Item("requiereProduccion")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function ObtenerExistenciasPorBodegaBusqueda(ByVal bodega As Integer, ByVal busqueda As String) As IList(Of productos)

        Dim sql As String = "  SELECT a.id_art, a.requiereProduccion, (e.Existencia_Deta_Art)  - (SELECT isnull(sum(d.cantidad_articulo),0)  " &
            " FROM   [DETA_RESERVA] d WHERE d.Id_Bod = " & bodega & " and d.id_Art =  a.id_art and estado = 1) as existencia, a.Des_Art, a.cod_Art, a.precio1 " &
            "  FROM   [Existencias] e INNER JOIN   [Articulo] a on a.id_art = e.Id_Art WHERE a.estado = 1 and  Id_Bod = " & bodega & " and (a.cod_Art  LIKE '%" & busqueda & "%'  or  a.Des_Art LIKE  '%" & busqueda & "%') "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As productos = New productos()
            Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
            Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
            Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
            Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
            Elemento.tipo = TablaEncabezado.Rows(i).Item("requiereProduccion")
            result.Add(Elemento)
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function ObtenerExistenciasPorBodegaSimple(ByVal bodega As Integer) As IList(Of productos)

        Dim sql As String = "  SELECT a.id_art, (e.Existencia_Deta_Art)  - (SELECT isnull(sum(d.cantidad_articulo),0)  " &
            " FROM   [DETA_RESERVA] d WHERE d.Id_Bod = " & bodega & " and d.id_Art =  a.id_art and estado = 1) as existencia, a.Des_Art, a.cod_Art, a.precio1 " &
            "  FROM   [Existencias] e INNER JOIN   [Articulo] a on a.id_art = e.Id_Art WHERE  a.estado = 1 and  a.requiereProduccion = 0  and   Id_Bod = " & bodega

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function ObtenerExistenciasSinBodega(ByVal bodega As Integer) As IList(Of productos)

        Dim sql As String = " SELECT a.id_art,a.cod_Art,a.Des_Art,a.precio1, (select ISNULL(Existencia_Deta_Art,0) from Existencias WHERE Id_Bod =" & bodega & " AND Id_Art = a.id_art) existencia FROM Articulo a where a.requiereProduccion = 0 and a.Estado =1; "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")

                If IsDBNull(TablaEncabezado.Rows(i).Item("existencia")) Then
                    Elemento.cantidad = 0
                Else
                    Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
                End If


                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function ObtenerExistenciasSinBodegaServicio(ByVal busqueda As String) As IList(Of productos)

        Dim sql As String = "SELECT a.id_art,a.cod_Art,a.Des_Art,a.precio1 " &
                        "From Articulo a  " &
                        "INNER JOIN TIPOARTICULO t on t.idTipoLente = a.id_tipo " &
                        "Where a.requiereProduccion = 0 and a.Estado =1 and t.tipo =2 and (a.cod_Art  LIKE '%" & busqueda & "%'  or  a.Des_Art LIKE  '%" & busqueda & "%'); "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function ObtenerProductoSinBodegaServicio(ByVal codigoproducto As String) As IList(Of productos)

        Dim sql As String = "SELECT a.id_art,a.cod_Art,a.Des_Art,a.precio1 " &
                        "From Articulo a  " &
                        "INNER JOIN TIPOARTICULO t on t.idTipoLente = a.id_tipo " &
                        "Where a.requiereProduccion = 0 and a.Estado =1 and t.tipo =2 and a.cod_Art = '" & codigoproducto & "'; "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function




    <WebMethod()>
    Public Function BuscarExistenciasPorBodega(ByVal bodega As Integer, ByVal nombre As String, ByVal precio As Integer) As IList(Of productos)

        Dim sql As String = "SELECT TOP 10 a.miselaneo, T.tipo, a.requiereProduccion, a.id_art, (e.Existencia_Deta_Art)  - (SELECT isnull(sum(d.cantidad_articulo),0)  " &
            " FROM   [DETA_RESERVA] d WHERE d.Id_Bod = " & bodega & " and d.id_Art =  a.id_art and estado = 1) as existencia, a.Des_Art, a.cod_Art, a.precio1,a.precio2,a.precio3 " &
            " FROM   [Existencias] e INNER JOIN   [Articulo] a on a.id_art = e.Id_Art INNER JOIN  [TIPOARTICULO] T on T.idTipoLente =  a.id_tipo WHERE a.estado = 1 and  Id_Bod = " & bodega & " and a.Des_Art LIKE '%" & nombre & "%' "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As productos = New productos()
            Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
            Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
            Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
            If precio = 1 Then
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
            ElseIf precio = 2 Then
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio2")
            ElseIf precio = 3 Then
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio3")
            Else
                Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")

            End If



            Elemento.tipoArt = TablaEncabezado.Rows(i).Item("tipo")
            Elemento.tipo = TablaEncabezado.Rows(i).Item("requiereProduccion")

            If TablaEncabezado.Rows(i).Item("miselaneo") = 1 Then
                Elemento.tipoArt = 2
            End If
            result.Add(Elemento)
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function ObtenerExistenciasPorCodigo(ByVal bodega As Integer, ByVal codigoproducto As String, ByVal precio As Integer) As IList(Of productos)

        Dim sql As String = "SELECT a.miselaneo, T.tipo, a.requiereProduccion, a.id_art, (e.Existencia_Deta_Art)  - (SELECT isnull(sum(d.cantidad_articulo),0)  FROM   [DETA_RESERVA] d " &
            "WHERE d.Id_Bod = " & bodega & " and d.id_Art =  a.id_art and estado = 1) as existencia, a.Des_Art, a.cod_Art, a.precio1,a.precio2,a.precio3  " &
            " FROM   [Existencias] e INNER JOIN   [Articulo] a on a.id_art = e.Id_Art INNER JOIN  [TIPOARTICULO] T on T.idTipoLente =  a.id_tipo WHERE Id_Bod = " & bodega & " and a.cod_Art = '" & codigoproducto & "' AND a.estado = 1 "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                If precio = 1 Then
                    Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")
                ElseIf precio = 2 Then
                    Elemento.precio = TablaEncabezado.Rows(i).Item("precio2")
                ElseIf precio = 3 Then
                    Elemento.precio = TablaEncabezado.Rows(i).Item("precio3")
                Else
                    Elemento.precio = TablaEncabezado.Rows(i).Item("precio1")

                End If
                Elemento.tipoArt = TablaEncabezado.Rows(i).Item("tipo")
                Elemento.tipo = TablaEncabezado.Rows(i).Item("requiereProduccion")

                If TablaEncabezado.Rows(i).Item("miselaneo") = 1 Then
                    Elemento.tipoArt = 2
                End If

                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function ObtenerBodegasDiferentesA(ByVal bodega As Integer) As IList(Of productos)

        Dim sql As String = "SELECT [Id_Bod],[Id_suc],[Id_Empsa],[Nom_Bod],[Observ_Bod],[estado],[principal],[receptora],[consignacion] FROM   [Bodegas] where estado = 1 and   Id_Bod <> " & bodega

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("Id_Bod")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Nom_Bod")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function CrearPDF(ByVal usuario As String, ByVal observacion As String, ByVal traslado As List(Of trasladolist)) As String
        Dim result As String = ""
        Try

            Dim doc As Document = New iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER, 5, 5, 5, 5)
            Dim datafecha As Date = Now
            Dim nombredoc As String = "pdf\traslado" & Date.Now.Hour & Date.Now.Second & Date.Now.Day & ".pdf"
            Dim pd As PdfWriter = PdfWriter.GetInstance(doc, New FileStream(Server.MapPath("~\vista\" & nombredoc), FileMode.Create))
            result = nombredoc
            doc.AddTitle("TRASLADO DE MERCADERIA ")
            doc.AddAuthor("")
            doc.AddCreationDate()

            doc.Open()

            Dim PARRAFO_ESPACIO As Paragraph = New Paragraph(" ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD))
            PARRAFO_ESPACIO.Alignment = Element.ALIGN_CENTER

            Dim d As datos = obtenerDatosEmpresa(usuario)

            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)



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


            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 14, iTextSharp.text.Font.BOLD)))
            Celda.Colspan = 1
            Celda.BorderWidth = 0
            Celda.HorizontalAlignment = Element.ALIGN_LEFT
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(d.descripcionextra, FontFactory.GetFont("Arial", 14, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("TRASLADO DE MERCADERIA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
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


            Celda = New PdfPCell(New Paragraph(d.descripcion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
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


            Celda = New PdfPCell(New Paragraph(d.direccion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
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


            Celda = New PdfPCell(New Paragraph(d.nit, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(usuario, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 1
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            doc.Add(Tabla)
            doc.Add(PARRAFO_ESPACIO)


            Dim TablaDatos As PdfPTable = New PdfPTable(5)

            TablaDatos.TotalWidth = 550.0F
            TablaDatos.LockedWidth = True
            TablaDatos.SetWidths({15, 40, 15, 15, 15})

            Celda = New PdfPCell(New Paragraph("CODIGO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("NOMBRE", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("CANTIDAD", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("BODEGA ORIGEN", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("BODEGA DESTINO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Dim total As Double = 0


            For Each item As trasladolist In traslado
                Celda = New PdfPCell(New Paragraph(item.codigo, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.descripcion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.cantidad, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.bo1, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.bo2, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)
            Next



            doc.Add(TablaDatos)

            doc.Add(PARRAFO_ESPACIO)

            Dim PARRAFO1 As Paragraph = New Paragraph("OBSERVACIONES: ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD))
            PARRAFO1.Alignment = Element.ALIGN_LEFT
            PARRAFO1.SpacingAfter = 10.0F
            PARRAFO1.IndentationLeft = 25.0F
            PARRAFO1.IndentationRight = 25.0F
            doc.Add(PARRAFO1)

            Dim PARRAFO2 As Paragraph = New Paragraph(observacion, FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL))
            PARRAFO2.Alignment = Element.ALIGN_JUSTIFIED
            PARRAFO2.SpacingAfter = 10.0F
            PARRAFO2.IndentationLeft = 25.0F
            PARRAFO2.IndentationRight = 25.0F
            doc.Add(PARRAFO2)



            doc.Close()


        Catch ex As Exception
            result = ex.Message
        End Try

        Return result
    End Function


    <WebMethod()>
    Public Function obtenerDatosEmpresa(ByVal usuario As String) As datos
        Dim SQL As String = "SELECT  top 1 [id_empresa],[nombre],[nombre_comercial],[direccion],[nit]  FROM   [ENCA_CIA] " &
            " where id_empresa = (select u.id_empresa from  [USUARIO] u where u.USUARIO = '" & usuario & "')"

        Dim result As datos = New datos()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        Dim Elemento As New datos
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

    'compras en el interior
    <WebMethod()>
    Public Function Trasladar(ByVal usuario As String, ByVal observacion As String, ByVal traslado As List(Of trasladolist)) As String

        Dim result As String = ""


        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion

        Try
            Dim sql As String = "INSERT INTO  [ENC_TRASLADO] ([Fecha],[Usuario],[Observaciones],[id_empresa]) VALUES (getdate(),'" & usuario & "','" & observacion & "',(select id_empresa from USUARIO where USUARIO = '" & usuario & "'))"

            'ejecuto primer comando sql
            comando.CommandText = sql
            comando.ExecuteNonQuery()


            'OBTENEMOS ID DE LA FACTURA
            comando.CommandText = "SELECT @@IDENTITY"
            Dim id As Integer = comando.ExecuteScalar()


            For Each item As trasladolist In traslado

                'INSERTA LOS DATOS 
                Dim sql2 As String = "INSERT INTO   [DET_TRASLADO]([IdTraslado],[id_art],[Cantidad],[IdBodOrigen],[IdBodDestino]) VALUES(" & id & "," & item.id & "," & item.cantidad & "," & item.origen & "," & item.destino & ")"

                Dim cantidad As Integer = ObtenerCantidadProducto(item.id, item.destino)
                Dim precio As Double = ObtenerCostoActual(item.id)
                Dim sql3 = ""
                If cantidad = -1 Then

                    sql3 = "INSERT INTO  [Existencias]([Id_Bod],[Id_Art],[Existencia_Deta_Art],[costoAnt]) VALUES(" & item.destino & ", " & item.id & "," & item.cantidad & ", " & precio & "); " &
                     "UPDATE  [Existencias] SET [Existencia_Deta_Art] = " & ObtenerCantidadProducto(item.id, item.origen) - item.cantidad & " WHERE [Id_Bod] = " & item.origen & " and   Id_Art = " & item.id & "; "
                Else
                    sql3 = "UPDATE   [Existencias] SET Existencia_Deta_Art =  " & (cantidad + item.cantidad) & ",  costoAnt =  " & precio & "  WHERE [Id_Bod] = " & item.destino & " and   Id_Art = " & item.id & "; " &
                     "UPDATE  [Existencias] SET [Existencia_Deta_Art] = " & (ObtenerCantidadProducto(item.id, item.origen) - item.cantidad) & " WHERE [Id_Bod] = " & item.origen & " and   Id_Art = " & item.id & "; "
                End If


                'ejecuto segundo comando sql
                comando.CommandText = sql2
                comando.ExecuteNonQuery()


                'ejecuto tercer comando sql
                comando.CommandText = sql3
                comando.ExecuteNonQuery()
            Next

            transaccion.Commit()
            result = "SUCCESS|COMPRA GENERADA EXITOSAMENTE|" & CrearPDF(usuario, observacion, traslado)

        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "ERROR|" & ex.Message
        Finally
            conexion.Close()
        End Try



        Return result
    End Function


    <WebMethod()>
    Public Function ObtenerCostoActual(ByVal idart As Integer) As Double
        Dim SQL As String = "SELECT  a.costo_art as costo FROM   [Articulo] a where a.id_art  = " & idart

        Dim result As Double = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            result = TablaEncabezado.Rows(i).Item("costo")
        Next

        Return result

    End Function

    <WebMethod()>
    Public Function ObtenerCantidadProducto(ByVal idart As Integer, ByVal idbodega As Integer) As Integer
        Dim SQL As String = "Select isnull(sum(Existencia_Deta_Art),-1) as cantidad from  Existencias where Id_Art = " & idart & " and id_bod = " & idbodega

        Dim result As Integer = -1
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            result = TablaEncabezado.Rows(i).Item("cantidad")
        Next

        Return result

    End Function



    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public descripcionextra As String
        Public direccion As String
        Public nit As String
    End Class

    Public Class productos
        Public id As Integer
        Public descripcion As String
        Public codigo As String
        Public cantidad As Integer
        Public precio As Double
        Public tipo As Integer
        Public tipoArt As Integer
    End Class

    Public Class trasladolist
        Public id As Integer
        Public cantidad As Integer
        Public codigo As String
        Public descripcion As String
        Public bo1 As String
        Public bo2 As String
        Public origen As Integer
        Public destino As Integer
        Public observacion As String

    End Class


End Class
