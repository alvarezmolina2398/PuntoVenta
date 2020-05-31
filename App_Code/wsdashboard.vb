Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()> _
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsdashboard
    Inherits System.Web.Services.WebService
    <WebMethod()> _
    Public Function hoy() As List(Of [Datos])

        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT COUNT(*) AS total from ENC_FACTURA  WHERE CONVERT(date, Fecha) = CONVERT(date, GETDATE())"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.total = TablaEncabezado.Rows(i).Item("total")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function EstaSemana() As List(Of [Datos])

        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT COUNT(*) AS total from ENC_FACTURA  WHERE Fecha >=  DATEADD(day,-7, GETDATE()) "
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.total = TablaEncabezado.Rows(i).Item("total")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function



    <WebMethod()> _
    Public Function EsteMes() As List(Of [Datos])

        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT COUNT(*) AS total from ENC_FACTURA   WHERE Fecha BETWEEN DATEADD(mm,DATEDIFF(mm,0,GETDATE()),0) AND DATEADD(ms,-3,DATEADD(mm,0,DATEADD(mm,DATEDIFF(mm,0,GETDATE())+1,0)))"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.total = TablaEncabezado.Rows(i).Item("total")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para obtener las ultimas 5 ventas 
    <WebMethod()>
    Public Function top5ventas() As List(Of [Datos])

        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select top 5 e.id_enc, c.Nom_clt, e.Total_Factura, CONVERT(varchar(10), CAST(e.Fecha as date), 103) AS Fecha, RIGHT(CONVERT(DATETIME, e.Fecha, 108),8) AS hora    from ENC_FACTURA e " &
                                       "join CLiente  c " &
                                       " on c.Id_Clt  = e.Id_Clt " &
                                       " order by e.id_enc desc"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.cliente = TablaEncabezado.Rows(i).Item("Nom_clt")
                Elemento.total = Convert.ToDouble(TablaEncabezado.Rows(i).Item("Total_Factura")).ToString("#,##0.00")
                Elemento.fecha = TablaEncabezado.Rows(i).Item("Fecha")
                Elemento.hora = TablaEncabezado.Rows(i).Item("hora")
                result.Add(Elemento)

                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para obtener las ultimas 5 ventas 
    <WebMethod()>
    Public Function AlertaConsumoSeries() As List(Of Serie)
        Dim result As List(Of Serie) = New List(Of Serie)()
        Dim StrEncabezado As String = "SELECT convert(varchar,fechavencimiento,103) as fechavencimientos, Series, Fact_inic,Fact_fin,Corr_Act,(Corr_Act * 100 / Fact_fin) as porcentage, Autorizacion, convert(varchar,fecha,103) as fecha  FROM Correlativos where (Corr_Act * 100 / Fact_fin) >= 75;;"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New Serie
            Elemento.Series = TablaEncabezado.Rows(i).Item("Series")
            Elemento.Fac_inicial = TablaEncabezado.Rows(i).Item("Fact_inic")
            Elemento.Fac_Fin = TablaEncabezado.Rows(i).Item("Fact_fin")
            Elemento.Fac_Act = TablaEncabezado.Rows(i).Item("Corr_Act")
            Elemento.porcentage = TablaEncabezado.Rows(i).Item("porcentage")
            Elemento.autorizacion = TablaEncabezado.Rows(i).Item("Autorizacion")
            Elemento.fechasvencimiento = TablaEncabezado.Rows(i).Item("fechavencimientos")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            result.Add(Elemento)
        Next

        Return result
    End Function


    'metodo utilizado para obtener las ultimas 5 ventas 
    <WebMethod()>
    Public Function AlertaVencimientoSerie() As List(Of Serie)
        Dim result As List(Of Serie) = New List(Of Serie)()
        Dim StrEncabezado As String = "SELECT  Series, Fact_inic,Fact_fin,Corr_Act,DATEDIFF(DAY, GETDATE(),fechavencimiento) as diasvencimiento,convert(varchar,fechavencimiento,103) as fechavencimientos, Autorizacion, convert(varchar,fecha,103) as fecha   FROM Correlativos where DATEDIFF(DAY, GETDATE(),fechavencimiento) <= 365"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New Serie
            Elemento.Series = TablaEncabezado.Rows(i).Item("Series")
            Elemento.Fac_inicial = TablaEncabezado.Rows(i).Item("Fact_inic")
            Elemento.Fac_Fin = TablaEncabezado.Rows(i).Item("Fact_fin")
            Elemento.Fac_Act = TablaEncabezado.Rows(i).Item("Corr_Act")
            Elemento.autorizacion = TablaEncabezado.Rows(i).Item("Autorizacion")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.fechasvencimiento = TablaEncabezado.Rows(i).Item("fechavencimientos")
            Elemento.diasvencimiento = TablaEncabezado.Rows(i).Item("diasvencimiento")
            result.Add(Elemento)
        Next

        Return result
    End Function

    Public Class Datos
        Public total As String
        Public cliente As String
        Public fecha As String
        Public hora As String
    End Class


    Public Class Serie
        Public Series As String
        Public Fac_inicial As Integer
        Public Fac_Fin As Integer
        Public Fac_Act As Integer
        Public porcentage As Integer
        Public autorizacion As String
        Public fecha As String
        Public diasvencimiento As Integer
        Public fechasvencimiento As String
    End Class
End Class