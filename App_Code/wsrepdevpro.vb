Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsrepdevpro
    Inherits System.Web.Services.WebService
    <WebMethod()>
    Public Function getData(ByVal fechaIn As String, ByVal fechaFin As String, ByVal pro As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()

        Dim filtro As String = ""

        If pro > 0 Then
            filtro = "p.Id_PRO = " & pro & " AND "
        End If

        Dim StrEncabezado As String = "SELECT d.id_enc, d.Serie_Fact, d.Num_Fact,CONVERT(varchar(10), CAST(d.Fecha As Date), 103) As Fecha, d.Usuario, p.Nom_pro, d.Total_Factura " &
                                       " FROM ENC_DEV_COMPRA d " &
                                       " JOIN PROVEEDOR p " &
                                       " ON p.Id_PRO = d.Id_Proveedor " &
                                       " WHERE " & filtro & "  CAST(d.Fecha As Date) BETWEEN '" & fechaIn & "' AND   '" & fechaFin & "'"





        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.num = TablaEncabezado.Rows(i).Item("id_enc").ToString
                Elemento.factura = TablaEncabezado.Rows(i).Item("Num_Fact").ToString
                Elemento.fecha = TablaEncabezado.Rows(i).Item("Fecha").ToString
                Elemento.user = TablaEncabezado.Rows(i).Item("Usuario").ToString
                Elemento.prov = TablaEncabezado.Rows(i).Item("Nom_pro").ToString
                Elemento.total = TablaEncabezado.Rows(i).Item("Total_Factura").ToString
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function


    <WebMethod()>
    Public Function getDetalle(ByVal num As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = " select a.cod_art,dt.Precio_Unit_Articulo, a.Des_Art As descripcion, dt.Cantidad_Articulo, p.Nom_PRO from DET_DEV_COMPRA dt  " &
                                     "Join ENC_DEV_COMPRA et " &
                                     "On et.id_enc = dt.id_enc " &
                                     "Join Articulo a " &
                                     "On a.id_art = dt.id_art " &
                                    " JOIN PROVEEDOR p " &
                                    " ON p.Id_PRO = et.Id_Proveedor " &
                                     "where et.id_enc = " & num

        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_art").ToString
                Elemento.desc = TablaEncabezado.Rows(i).Item("descripcion").ToString
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("Cantidad_Articulo").ToString
                Elemento.valor_unitario = TablaEncabezado.Rows(i).Item("Precio_Unit_Articulo")
                Elemento.prov = TablaEncabezado.Rows(i).Item("Nom_PRO").ToString
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function

    Public Class Datos
        Public codigo As String
        Public factura As String
        Public cantidad As String
        Public valor_unitario As Double
        Public desc As String
        Public num As String
        Public fecha As String
        Public user As String
        Public obs As String
        Public prov As String
        Public total As String
    End Class

End Class