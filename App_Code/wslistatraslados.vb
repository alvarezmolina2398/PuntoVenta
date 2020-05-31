Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data


' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wslistatraslados
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function getData(ByVal fechaIn As String, ByVal fechaFin As String, ByVal bodegaO As Integer, ByVal bodegaD As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()

        Dim filtro As String = ""

        If bodegaO > 0 And bodegaD > 0 Then
            filtro = "dt.IdBodOrigen = " & bodegaO & " And dt.IdBodDestino = " & bodegaD & " AND "
        ElseIf bodegaO > 0 And bodegaD = 0 Then
            filtro = "dt.IdBodOrigen = 19 AND "
        End If

        Dim StrEncabezado As String = "SELECT et.idTraslado, CONVERT(varchar(10), CAST(et.Fecha as date), 103)  as Fecha, et.Usuario, ISNULL(et.Observaciones, 'No') as Observaciones   FROM ENC_TRASLADO et " &
                                      "JOIN DET_TRASLADO  dt " &
                                      "on dt.IdTraslado = et.IdTraslado " &
                                      "WHERE " & filtro & " CAST(et.Fecha as DATE) BETWEEN '" & fechaIn & "' AND '" & fechaFin & "' " &
                                      " Group by et.IdTraslado, et.Fecha, et.Usuario, et.Observaciones "
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.num = TablaEncabezado.Rows(i).Item("idTraslado").ToString
                Elemento.fecha = TablaEncabezado.Rows(i).Item("Fecha").ToString
                Elemento.user = TablaEncabezado.Rows(i).Item("Usuario").ToString
                Elemento.obs = TablaEncabezado.Rows(i).Item("Observaciones").ToString
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function


    <WebMethod()>
    Public Function getDetalle(ByVal num As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select a.cod_art, a.Des_Art as descripcion, dt.Cantidad, b.Nom_Bod, bo.Nom_Bod origen from DET_TRASLADO dt " &
                                      "JOIN ENC_TRASLADO et " &
                                      "on et.IdTraslado = dt.IdTraslado  " &
                                      "JOIN Articulo  a " &
                                      "on a.id_art = dt.id_art " &
                                      "JOIN Bodegas b " &
                                      "on b.Id_Bod  = dt.IdBodDestino " &
                                      "JOIN Bodegas bo on bo.Id_Bod  = dt.IdBodOrigen " &
                                      "where et.IdTraslado = " & num
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_art").ToString
                Elemento.desc = TablaEncabezado.Rows(i).Item("descripcion").ToString
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("Cantidad").ToString
                Elemento.bod = TablaEncabezado.Rows(i).Item("Nom_bod").ToString
                Elemento.bodo = TablaEncabezado.Rows(i).Item("origen").ToString
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function

    Public Class Datos
        Public codigo As String
        Public cantidad As String
        Public desc As String
        Public num As String
        Public fecha As String
        Public user As String
        Public obs As String
        Public bod As String
        Public bodo As String
    End Class

End Class