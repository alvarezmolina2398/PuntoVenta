Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsreporteminimos
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerMinimos() As List(Of datos)
        Dim sql As String = "select (select  isnull(sum(df.Cantidad_Articulo),0) + (select isnull(sum(dr.cantidad_articulo),0) " &
            "from ENCA_RESERVA er inner join DETA_RESERVA dr on er.id_enc = dr.id_enc where dr.Id_Art = a.id_art   and YEAR(er.Fecha) =  YEAR(GETDATE()) and  ( DATEPART(ISO_WEEK, er.Fecha)   between DATEPART(ISO_WEEK, GETDATE())-8 and DATEPART(ISO_WEEK, GETDATE() ) )  )  " &
            "from ENC_FACTURA ef inner join DET_FACTURA  df on ef.id_enc = df.id_enc " &
            "where df.Id_Art = a.id_art   and  YEAR(ef.Fecha) =  YEAR(GETDATE()) and  ( DATEPART(ISO_WEEK, ef.Fecha) " &
            "  between DATEPART(ISO_WEEK, GETDATE())-8 and DATEPART(ISO_WEEK, GETDATE() )  ) )/8 cantidadsemana, a.Des_Art ,a.cod_Art, (select sum(Existencia_Deta_Art) " &
            "  + isnull((select sum(d.cantidad_articulo) from DETA_RESERVA d where d.id_Art = 1 and d.estado = 1 ),0)  from Existencias	 where Id_Art = id_art) existencia " &
            "FROM Articulo a where a.Estado = 1 ;"



        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New datos
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
            Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
            Elemento.existencia = TablaEncabezado.Rows(i).Item("existencia")
            Elemento.consumo_medio = Math.Round(TablaEncabezado.Rows(i).Item("cantidadsemana"), 2)

            Elemento.semanas = Math.Round(Elemento.existencia / Elemento.consumo_medio, 2)
            result.Add(Elemento)
        Next

        Return result

    End Function


    Public Class datos
        Public consumo_medio As Double
        Public descripcion As String
        Public codigo As String
        Public existencia As Integer
        Public semanas As Double
    End Class




End Class