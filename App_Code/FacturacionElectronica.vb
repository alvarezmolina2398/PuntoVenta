Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class FacturacionElectronica
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function Factura_ElectronicaPeriodica() As String
        Dim chars As String = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789#/="
        Dim unit As String = ""
        Dim r As New Random
        Dim fechaHora As DateTime = DateTime.Now
        Dim data() As String = ObtenerSerie("sistema").Split("|")
        Dim serie As String = data(0).Trim()
        Dim correlativo As String = data(1).Trim()
        For i As Integer = 1 To 64

            Dim siguiente As Integer = r.Next(0, chars.Length)
            unit &= chars.Substring(siguiente, 1)

        Next

        Dim siguienteTurno As Integer = ObtenerSiguienteCorrelativo(correlativo)

        Dim firma As String = "FACE63" & "FAC" & siguienteTurno
        Dim cae As String = unit

        Return serie & "|" & firma & "|" & cae & "|" & correlativo

    End Function

    <WebMethod()>
    Public Function ObtenerSiguienteCorrelativo(ByVal correlativo As Integer) As Integer
        Dim SQL As String = "  select (Corr_Act + 1) as Siguiente  from Correlativos where id_correlativo = " & correlativo

        Dim result As Integer = -1
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            result = TablaEncabezado.Rows(i).Item("Siguiente").ToString.Trim()
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function ObtenerSerie(ByVal usuario As String) As String
        Dim SQL As String = "select top 1 Series,c.id_correlativo  from  [SUCURSALES] S INNER JOIN  [Correlativos] C ON c.id_correlativo = s.id_correlativo where id_suc = (select u.id_sucursal from   [USUARIO] u where USUARIO = '" & usuario & "')"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("Series") & "|" & TablaEncabezado.Rows(i).Item("id_correlativo")
            Next
        Next

        Return result.Trim()

    End Function

End Class