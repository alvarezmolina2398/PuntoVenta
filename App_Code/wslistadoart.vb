Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data
Imports iTextSharp.text
Imports iTextSharp.text.pdf
Imports System.IO
' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wslistadoart
    Inherits System.Web.Services.WebService

    'metodo utilizado para obtener el listado de existencias 
    <WebMethod()>
    Public Function consultar(ByVal estado As Integer) As List(Of [Datos])


        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select a.cod_Art as cod, a.Des_Art as descripcion, m.nom_marca as marca, " &
                                      "c.Nom_Tipo_Art as clasif, t.tipoLente as tipo, a.costo_art as costo " &
                                      "from Articulo a " &
                                    "join Marcas  m " &
                                    "on m.id_marca  = a.id_marca  " &
                                    "join clasificacionarticulo c " &
                                    "on c.Id_Tipo_Art  = a.id_clasi " &
                                    "join TIPOARTICULO  t " &
                                    " on t.idTipoLente = a.id_tipo " &
                                    "where a.Estado  = " & estado
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod").ToString
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("descripcion").ToString
                Elemento.marcas = TablaEncabezado.Rows(i).Item("marca").ToString
                Elemento.clasificacion = TablaEncabezado.Rows(i).Item("clasif").ToString
                Elemento.tipo = TablaEncabezado.Rows(i).Item("tipo").ToString
                Elemento.costo = Convert.ToDouble(TablaEncabezado.Rows(i).Item("costo")).ToString("#,##0.00")

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para generar pdf
    <WebMethod()>
    Public Function generarPDF(ByVal usr As String, ByVal estado As Integer) As String
        Dim result As String = ""

        Dim doc As Document = New iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER, 5, 5, 5, 5)

        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")
        Dim fechaHoraActual As DateTime = Date.Now

        Dim datafecha As Date = Now
        Dim nombredoc As String = "pdf\listadoarticulos" & Day(fechaHoraActual) & Month(fechaHoraActual) & Year(fechaHoraActual) & Hour(fechaHoraActual) & Minute(fechaHoraActual) & Second(fechaHoraActual) & ".pdf"

        Try
            Dim pd As PdfWriter = PdfWriter.GetInstance(doc, New FileStream(Server.MapPath("~\vista\" & nombredoc), FileMode.Create))
            result = nombredoc
            doc.AddTitle("LISTA DE ARTICULOS")
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

            Celda = New PdfPCell(New Paragraph("LISTA DE ARTICULOS", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
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

            Celda = New PdfPCell(New Paragraph("CLASIFICACION", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("TIPO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            'Celda = New PdfPCell(New Paragraph("COSTO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            'Celda.BorderWidth = 1
            'Celda.BorderWidthTop = 1
            'Celda.BorderWidthRight = 0
            'Celda.Colspan = 0
            'Celda.HorizontalAlignment = Element.ALIGN_CENTER
            'Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            'TablaDatos.AddCell(Celda)

            Dim total As Double = 0


            Dim SQL As String = "select a.cod_Art as cod, a.Des_Art as descripcion, m.nom_marca as marca, " &
                                      "c.Nom_Tipo_Art as clasif, t.tipoLente as tipo, a.costo_art as costo " &
                                      "from Articulo a " &
                                    "join Marcas  m " &
                                    "on m.id_marca  = a.id_marca  " &
                                    "join clasificacionarticulo c " &
                                    "on c.Id_Tipo_Art  = a.id_clasi " &
                                    "join TIPOARTICULO  t " &
                                    " on t.idTipoLente = a.id_tipo " &
                                    "where a.Estado  = " & estado

            Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
            Dim Elemento As New Datos

            If TablaEncabezado.Rows.Count > 0 Then

                For i = 0 To TablaEncabezado.Rows.Count - 1
                    For ii = 0 To 1

                        Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("cod"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                        Celda.BorderWidth = 1
                        Celda.BorderWidthTop = 0
                        Celda.BorderWidthRight = 0
                        Celda.HorizontalAlignment = Element.ALIGN_CENTER
                        TablaDatos.AddCell(Celda)

                        Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("descripcion"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                        Celda.BorderWidth = 1
                        Celda.BorderWidthTop = 0
                        Celda.BorderWidthRight = 0
                        Celda.Colspan = 0
                        Celda.HorizontalAlignment = Element.ALIGN_CENTER
                        TablaDatos.AddCell(Celda)


                        Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("marca").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                        Celda.BorderWidth = 1
                        Celda.BorderWidthTop = 0
                        Celda.BorderWidthRight = 1
                        Celda.Colspan = 0
                        Celda.HorizontalAlignment = Element.ALIGN_CENTER
                        TablaDatos.AddCell(Celda)

                        Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("clasif").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                        Celda.BorderWidth = 1
                        Celda.BorderWidthTop = 0
                        Celda.BorderWidthRight = 1
                        Celda.Colspan = 0
                        Celda.HorizontalAlignment = Element.ALIGN_CENTER
                        TablaDatos.AddCell(Celda)

                        Celda = New PdfPCell(New Paragraph(TablaEncabezado.Rows(i).Item("tipo").ToString, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                        Celda.BorderWidth = 1
                        Celda.BorderWidthTop = 0
                        Celda.BorderWidthRight = 1
                        Celda.Colspan = 0
                        Celda.HorizontalAlignment = Element.ALIGN_CENTER
                        TablaDatos.AddCell(Celda)

                        'Celda = New PdfPCell(New Paragraph(Format(TablaEncabezado.Rows(i).Item("costo"), "##,##0.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                        'Celda.BorderWidth = 1
                        'Celda.BorderWidthTop = 0
                        'Celda.BorderWidthRight = 0
                        'Celda.Colspan = 0
                        'Celda.HorizontalAlignment = Element.ALIGN_CENTER
                        'TablaDatos.AddCell(Celda)


                        ii = ii + 1
                    Next
                Next

            End If

            doc.Add(TablaDatos)


            doc.Close()


        Catch ex As Exception
            doc.Close()
            result = ex.Message
        Finally
            doc.Close()
            result = nombredoc
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


    Public Class Datos
        Public id As Integer
        Public codigo As String
        Public descripcion As String
        Public marcas As String
        Public clasificacion As String
        Public tipo As String
        Public costo As String
        Public descripcionextra As String
        Public nit As String
        Public direccion As String
    End Class

End Class