Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wscuentasPorPagar
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function Consultar() As List(Of Datos)

        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim sql As String = "SELECT DISTINCT px.Nom_pro,px.Id_PRO, " &
         " isnull((SELECT sum(total) from(SELECT isnull(c.total_fact- (SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) total, DATEDIFF(day,GETDATE(),c.fecha_pago) as dias from enc_compra_exterior c  where c.pagada = 0 and c.idproveedor = px.Id_PRO ) filtrar where  dias < 0 ),0) retrasado , " &
         " isnull((SELECT sum(total) from(SELECT isnull(c.total_fact- (SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) total, DATEDIFF(day,GETDATE(),c.fecha_pago) as dias from enc_compra_exterior c  where c.pagada = 0 and c.idproveedor = px.Id_PRO ) filtrar where  dias between 0 and 30),0) unmes, " &
         " isnull((SELECT sum(total) from(SELECT isnull(c.total_fact- (SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) total, DATEDIFF(day,GETDATE(),c.fecha_pago) as dias from enc_compra_exterior c  where c.pagada = 0 and c.idproveedor = px.Id_PRO ) filtrar where  dias between 31 and 60),0) dosmese, " &
         " isnull((SELECT sum(total) from(SELECT isnull(c.total_fact- (SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) total, DATEDIFF(day,GETDATE(),c.fecha_pago) as dias from enc_compra_exterior c  where c.pagada = 0 and c.idproveedor = px.Id_PRO ) filtrar where  dias between 61 and 90),0) tresmeses, " &
         " isnull((SELECT sum(total) from(SELECT isnull(c.total_fact- (SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) total, DATEDIFF(day,GETDATE(),c.fecha_pago) as dias from enc_compra_exterior c  where c.pagada = 0 and c.idproveedor = px.Id_PRO ) filtrar where  dias > 90),0) masdetres  " &
         " FROM PROVEEDOR px  " &
         " INNER JOIN enc_compra_exterior cex on cex.idproveedor = px.Id_PRO " &
         " where cex.pagada = 0 ;"

        Dim TablaEncabezado As DataTable = manipular.Login(sql)

        For Each row As DataRow In TablaEncabezado.Rows
            Dim elemento As New Datos
            elemento.proveedor = row(0).ToString
            elemento.id = row(1)
            elemento.atrasados = Convert.ToDouble(row(2).ToString).ToString("#,##0.00")
            elemento.treinta = Convert.ToDouble(row(3).ToString).ToString("#,##0.00")
            elemento.sesenta = Convert.ToDouble(row(4).ToString).ToString("#,##0.00")
            elemento.noventa = Convert.ToDouble(row(5).ToString).ToString("#,##0.00")
            elemento.noventamas = Convert.ToDouble(row(6).ToString).ToString("#,##0.00")

            result.Add(elemento)
        Next
        Return result
    End Function

    <WebMethod()>
    Public Function GetDetalle(ByVal id As Integer, ByVal dias As Integer) As List(Of Detalle)

        Dim filtroDias As String = ""

        If dias = 0 Then
            filtroDias = "< 0"
        ElseIf dias = 1 Then
            filtroDias = "between 0 and 30"
        ElseIf dias = 1 Then
            filtroDias = "between 0 and 30"
        ElseIf dias = 2 Then
            filtroDias = "between 31 and 60"
        ElseIf dias = 3 Then
            filtroDias = "between 61 and 90"
        ElseIf dias = 4 Then
            filtroDias = "> 90"
        End If


        Dim consulta As String = "SELECT  nit_pro, Nom_pro,fecha,fecha_limite,dias, total_fact,factura FROM(SELECT p.nit_pro, p.Nom_pro, c.facturas+'-'+c.facturan as  factura, convert(varchar,c.fecha,103) as fecha, convert(varchar,c.fecha_pago,103) as fecha_limite, DATEDIFF(DAY,GETDATE() ,c.fecha_pago) as dias,c.total_fact- isnull((SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) as total_fact " &
            " from enc_compra_exterior c " &
            " inner join PROVEEDOR p on p.Id_PRO  = c.idproveedor " &
            " where  c.pagada = 0 and p.Id_PRO = " & id & ")filtra where dias  " & filtroDias

        Dim result As List(Of Detalle) = New List(Of Detalle)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(consulta)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New Detalle
            Elemento.nit = TablaEncabezado.Rows(i).Item("nit_pro")
            Elemento.proveedor = TablaEncabezado.Rows(i).Item("Nom_pro")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.fecha_limite = TablaEncabezado.Rows(i).Item("fecha_limite")
            Elemento.dias = TablaEncabezado.Rows(i).Item("dias")
            Elemento.valor = Format(TablaEncabezado.Rows(i).Item("total_fact"), "##,##0.00")
            Elemento.valord = TablaEncabezado.Rows(i).Item("total_fact")
            Elemento.factura = TablaEncabezado.Rows(i).Item("factura")
            result.Add(Elemento)
        Next

        Return result


    End Function

    <WebMethod()>
    Public Function ProgramacionPagos() As List(Of ProgramacionPago)
        Dim consulta As String = "SELECT   sum(total_fact) as total,DATEPART(ISO_WEEK,fecha_limite) as semana FROM(SELECT p.nit_pro, p.Nom_pro, fecha, c.fecha_pago as fecha_limite, DATEDIFF(DAY,GETDATE() ,c.fecha_pago) as dias,c.total_fact - isnull((SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where c.id_enc_orcompra_ing = DPC.id_compra),0) as total_fact  " &
        "from enc_compra_exterior c " &
        "inner join PROVEEDOR p on p.Id_PRO  = c.idproveedor " &
        "where  c.pagada = 0)filtrar group by DATEPART(ISO_WEEK,fecha_limite) "

        Dim result As List(Of ProgramacionPago) = New List(Of ProgramacionPago)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(consulta)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New ProgramacionPago
            Elemento.semana = TablaEncabezado.Rows(i).Item("semana")
            Elemento.valor = Double.Parse(TablaEncabezado.Rows(i).Item("total"))
            result.Add(Elemento)
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function DetalleProgramacion(ByVal sem As Integer) As List(Of Detalle)
        Dim consulta As String = "SELECT   Nom_pro,sum(total_fact) as total,fecha,fecha_limite, factura, DATEDIFF(day,GETDATE(),fecha_limite) as dias  FROM(SELECT p.nit_pro, p.Nom_pro,c.facturas+'-'+c.facturan as  factura, fecha, c.fecha_pago as fecha_limite, DATEDIFF(DAY,GETDATE() ,c.fecha_pago) as dias,c.total_fact  -  isnull((SELECT isnull(sum(DPC.abono),0) FROM DET_PAGOC_COMPRA DPC INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = c.id_enc_orcompra_ing),0) as total_fact " &
            " from enc_compra_exterior c " &
            " inner join PROVEEDOR p on p.Id_PRO  = c.idproveedor " &
            " where  c.pagada = 0)filtrar where  DATEPART(ISO_WEEK,fecha_limite)  = " & sem & " group by Nom_pro,fecha,fecha_limite,factura "

        Dim result As List(Of Detalle) = New List(Of Detalle)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(consulta)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New Detalle
            Elemento.proveedor = TablaEncabezado.Rows(i).Item("Nom_pro")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.fecha_limite = TablaEncabezado.Rows(i).Item("fecha_limite")
            Elemento.dias = TablaEncabezado.Rows(i).Item("dias")
            Elemento.valor = Format(TablaEncabezado.Rows(i).Item("total"), "###,###,##0.00")
            Elemento.valord = TablaEncabezado.Rows(i).Item("total")
            Elemento.factura = TablaEncabezado.Rows(i).Item("factura")
            result.Add(Elemento)
        Next

        Return result
    End Function


    Public Class Datos
        Public proveedor As String
        Public atrasados As String
        Public treinta As String
        Public sesenta As String
        Public noventa As String
        Public noventamas As String
        Public id As Integer
    End Class


    Public Class Detalle
        Public factura As String
        Public nit As String
        Public proveedor As String
        Public fecha As String
        Public fecha_limite As String
        Public dias As Integer
        Public valor As String
        Public valord As Double
    End Class


    Public Class ProgramacionPago
        Public semana As Integer
        Public valor As String
    End Class

End Class