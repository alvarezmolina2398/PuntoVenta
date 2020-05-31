Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsreporteCertificadosIva
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function consultar(ByVal fecha_inicial As String, ByVal fecha_final As String) As List(Of datos)
        Dim sql As String = "SELECT Er.Usuario,LTRIM((RTRIM(EF.Serie_Fact)) + '-' + lTRIM(RTRIM(EF.firma))) fac, ER.idRecibo  recibo, valor, convert(varchar,ER.fecha,103) + convert(varchar,ER.fecha,108) fecha from DET_RECIBO DR  " &
            "INNER JOIN ENC_RECIBO  ER ON er.idRecibo = DR.idRecibo " &
            "INNER JOIN DET_RECIBO_FACT DRF ON DRF.idRecibo = ER.idRecibo " &
            "INNER JOIN ENC_FACTURA  EF ON EF.id_enc = DRF.id_enc " &
            "where DR.tipoPago = 1 and (ER.fecha between '" & fecha_inicial & " 00:00:00' and '" & fecha_final & " 23:59:59:999');"


        Dim result As List(Of datos) = New List(Of datos)
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim elemento As datos = New datos()
            elemento.fac = TablaEncabezado.Rows(i).Item("fac")
            elemento.recibo = TablaEncabezado.Rows(i).Item("recibo")
            elemento.valor = Format(TablaEncabezado.Rows(i).Item("valor"), "###,###.00")
            elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            elemento.usuario = TablaEncabezado.Rows(i).Item("Usuario")
            result.Add(elemento)
        Next

        Return result

    End Function



    Public Class datos
        Public fac As String
        Public recibo As Integer
        Public valor As String
        Public fecha As String
        Public usuario As String
    End Class

End Class