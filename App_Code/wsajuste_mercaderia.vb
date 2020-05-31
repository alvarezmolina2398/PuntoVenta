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
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsajuste_mercaderia
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerExistencias() As IList(Of productos)

        Dim sql As String = "  SELECT a.id_art, (e.Existencia_Deta_Art)  - (SELECT isnull(sum(d.cantidad_articulo),0)  FROM   [DETA_RESERVA] d WHERE  d.id_Art =  a.id_art and estado = 1) as existencia, a.Des_Art, a.cod_Art  FROM   [Existencias] e INNER JOIN   [Articulo] a on a.id_art = e.Id_Art  "

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As productos = New productos()
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("existencia")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art").ToString
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function obtenerDatosEmpresa(ByVal usuario As String) As datos
        Dim SQL As String = "SELECT  top 1 [id_empresa],[nombre],[nombre_comercial],[direccion],[nit]  FROM   [ENCA_CIA] " &
            " where id_empresa = (select u.id_empresa from   [USUARIO] u where u.USUARIO = '" & usuario & "')"

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

    <WebMethod()>
    Public Function CrearPDF(ByVal usuario As String, ByVal datos_ajuste As List(Of ajuste_mer)) As String
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
            TablaDatos.SetWidths({15, 40, 10, 25, 10})

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

            Celda = New PdfPCell(New Paragraph("OBSERVACIONES", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
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
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)


            For Each item As ajuste_mer In datos_ajuste
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


                Dim tipo As String = ""

                If item.tipo = 1 Then
                    tipo = "+"
                ElseIf item.tipo = 2 Then
                    tipo = "-"
                End If

                Celda = New PdfPCell(New Paragraph(tipo & item.cantidad, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.observacion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.bod, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)
            Next



            doc.Add(TablaDatos)

            doc.Add(PARRAFO_ESPACIO)




            doc.Close()


        Catch ex As Exception
            result = ex.Message
        End Try

        Return result
    End Function

    <WebMethod()>
    Public Function RealizarAjuste(ByVal datos_ajuste As List(Of ajuste_mer), ByVal usuario As String) As String

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
            Dim sql As String = "INSERT INTO   [ENC_AJUSTE]([fecha],[usuario],[id_empresa],[observaciones]) VALUES(GETDATE(),'" & usuario & "',(select id_empresa from USUARIO where USUARIO = '" & usuario & "'),'AJUSTE DE MERCADERIA');"

            'ejecuto primer comando sql
            comando.CommandText = sql
            comando.ExecuteNonQuery()


            'OBTENEMOS ID DE LA FACTURA
            comando.CommandText = "SELECT @@IDENTITY"
            Dim id As Integer = comando.ExecuteScalar()
            For Each item As ajuste_mer In datos_ajuste
                Dim cantidad As Integer = ObtenerCantidadProducto(item.id, item.bodega)


                If item.tipo = 2 Then
                    If cantidad >= item.cantidad Then
                        'INSERTA LOS DATOS 
                        Dim sql2 As String = "INSERT INTO   [DET_AJUSTE]([IdAjuste],[Id_Art],[Id_Bod],[cantidad],[observaciones],[tipo]) VALUES (" & id & "," & item.id & "," & item.bodega & "," & item.cantidad & ",'" & item.observacion & "'," & item.tipo & ");"

                        If validarCantidadProducto(item.id, item.bodega) > 0 Then
                            sql2 = sql2 & " UPDATE   [Existencias] SET [Existencia_Deta_Art] = " & cantidad - item.cantidad & " WHERE Id_Bod = " & item.bodega & " and Id_Art = " & item.id
                        Else
                            sql2 = sql2 & "INSERT INTO [dbo].[Existencias] ([Id_Bod],[Id_Art],[Existencia_Deta_Art],[costoAnt]) VALUES(" & item.bodega & "," & item.id & "," & item.cantidad & ",0) "
                        End If




                        'ejecuto primer comando sql
                        comando.CommandText = sql2
                        comando.ExecuteNonQuery()


                    Else
                        transaccion.Rollback()
                        result = "Error | UN ARTICULO NO SE PUEDE REDUCIR YA QUE NO EXISTE LA SUFICIENTE CANTIDAD DE PRODUCTO ( " & item.codigo & ", CANT EXT " & cantidad & ", CAN RET " & item.cantidad & ")"
                        Exit For
                    End If
                Else
                    'INSERTA LOS DATOS 
                    Dim sql2 As String = "INSERT INTO   [DET_AJUSTE]([IdAjuste],[Id_Art],[Id_Bod],[cantidad],[observaciones],[tipo]) VALUES (" & id & "," & item.id & "," & item.bodega & "," & item.cantidad & ",'" & item.observacion & "'," & item.tipo & ");"


                    If validarCantidadProducto(item.id, item.bodega) > 0 Then
                        sql2 = sql2 & " UPDATE   [Existencias] SET [Existencia_Deta_Art] = " & cantidad + item.cantidad & " WHERE Id_Bod = " & item.bodega & " and Id_Art = " & item.id

                    Else
                        sql2 = sql2 & "INSERT INTO [dbo].[Existencias] ([Id_Bod],[Id_Art],[Existencia_Deta_Art],[costoAnt]) VALUES(" & item.bodega & "," & item.id & "," & item.cantidad & ",0) "
                    End If

                    'ejecuto primer comando sql
                    comando.CommandText = sql2
                    comando.ExecuteNonQuery()

                End If
            Next


            result = "SUCCESS| AJUSTE GENERADO EXITOSAMENTE EXITOSAMENTE PRODUCTO  | " & CrearPDF(usuario, datos_ajuste)
            transaccion.Commit()
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
    Public Function validarCantidadProducto(ByVal idart As Integer, ByVal idbodega As Integer) As Integer
        Dim SQL As String = "Select count(Existencia_Deta_Art) as cantidad from Existencias where Id_Art = " & idart & " and id_bod = " & idbodega

        Dim result As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("cantidad")
            Next
        Next

        Return result

    End Function

    <WebMethod()>
    Public Function ObtenerCantidadProducto(ByVal idart As Integer, ByVal idbodega As Integer) As Integer
        Dim SQL As String = "Select Existencia_Deta_Art as cantidad from Existencias where Id_Art = " & idart & " and id_bod = " & idbodega

        Dim result As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("cantidad")
            Next
        Next

        Return result

    End Function


    Public Class productos
        Public id As Integer
        Public descripcion As String
        Public codigo As String
        Public cantidad As Integer
    End Class


    Public Class ajuste_mer
        Public cantidad As Integer
        Public codigo As String
        Public descripcion As String
        Public tipo As Integer
        Public id As Integer
        Public observacion As String
        Public bodega As Integer
        Public bod As String
    End Class

    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public descripcionextra As String
        Public direccion As String
        Public nit As String
    End Class


End Class