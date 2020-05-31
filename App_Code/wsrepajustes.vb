Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsrepajustes
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function getData(ByVal fechaIn As String, ByVal fechaFin As String, ByVal bodega As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()

        Dim filtro As String = ""

        If bodega > 0 Then
            filtro = "dt.Id_Bod = " & bodega & " AND "
        End If

        Dim StrEncabezado As String = "SELECT e.idAjuste, CONVERT(varchar(10), CAST(e.Fecha As Date), 103) As Fecha, e.Usuario " &
                                       " From ENC_AJUSTE  e " &
                                       "Join DET_AJUSTE  dt " &
                                       " On dt.IdAjuste = e.idAjuste " &
                                       " WHERE " & filtro & "  CAST(e.Fecha As Date) BETWEEN '" & fechaIn & "' AND   '" & fechaFin & "'" &
                                       " Group by e.idAjuste, e.Fecha, e.Usuario"


        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.num = TablaEncabezado.Rows(i).Item("idAjuste").ToString
                Elemento.fecha = TablaEncabezado.Rows(i).Item("Fecha").ToString
                Elemento.user = TablaEncabezado.Rows(i).Item("Usuario").ToString
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next


        Return result
    End Function


    <WebMethod()>
    Public Function getDetalle(ByVal num As Integer) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = " select a.cod_art, a.Des_Art As descripcion, dt.Cantidad, b.Nom_Bod,isnull( dt.observaciones,'---') observaciones, case when  dt.tipo =1 then 'ENTRADA' ELSE 'SALIDA' end tipo from DET_AJUSTE dt  " &
                                     "Join ENC_AJUSTE et " &
                                     "On et.idAjuste = dt.IdAjuste " &
                                     "Join Articulo a " &
                                     "On a.id_art = dt.id_art " &
                                     "Join Bodegas b " &
                                     "On b.Id_Bod  = dt.Id_Bod " &
                                     "where et.idAjuste = " & num

        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_art").ToString
                Elemento.desc = TablaEncabezado.Rows(i).Item("descripcion").ToString
                Elemento.cantidad = TablaEncabezado.Rows(i).Item("Cantidad").ToString
                Elemento.bod = TablaEncabezado.Rows(i).Item("Nom_Bod").ToString
                Elemento.tipo = TablaEncabezado.Rows(i).Item("tipo").ToString
                Elemento.obs = TablaEncabezado.Rows(i).Item("observaciones").ToString
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
        Public tipo As String
    End Class


End Class