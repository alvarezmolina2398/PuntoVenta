Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data


' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wslistarecibos
    Inherits System.Web.Services.WebService

    'metodo utilizado para consultar el resumen de corte de caja
    <WebMethod()>
    Public Function getTitulos(ByVal usr As String, ByVal fechaIni As String, ByVal fechaFin As String) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")


        Dim StrEncabezado As String = "SELECT descripcion " &
                                      "FROM TIPOPAGO " &
                                      "WHERE idempresa = " & id
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.titulo = TablaEncabezado.Rows(i).Item("descripcion")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para consultar el listado de recibos
    <WebMethod()>
    Public Function Consultar(ByVal fechaIni As String, ByVal fechaFin As String, ByVal suc As Integer, ByVal usr As String) As String
        Dim id As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")
        Dim iid As Double = Convert.ToDouble(id)
        'Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim result As String = Nothing
        'Dim StrEncabezado As String = "SELECT e.idRecibo as numero, c.Nom_clt as cliente, ISNULL(CASE WHEN d.tipoPago = t.idtipoPago THEN d.valor END, 0) as valor, t.descripcion, CASE WHEN e.estado =1 THEN 'ACTIVO' WHEN e.estado = 0 THEN 'ANULADO' END as estado " &
        '                               "from DET_RECIBO d " &
        '                               " join ENC_RECIBO e " &
        '                                "On  e.idRecibo= d.idRecibo " &
        '                                "join CLiente c " &
        '                                "on c.Id_Clt = e.Id_Clt " &
        '                                "join TipoPago t  " &
        '                                "On t.idtipoPago = d.tipoPago " &
        '                                "where CAST(e.fecha as date) BETWEEN '" & fechaIni & "' AND '" & fechaFin & "' AND  t.idempresa =  " & id & " and e.idRecibo = d.idRecibo " &
        '                                "Group by e.idRecibo, d.tipoPago, c.Nom_clt, d.valor, t.descripcion, t.idtipoPago, e.estado " &
        '                                "order by e.idRecibo, t.idtipoPago "
        'Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        'For i = 0 To TablaEncabezado.Rows.Count - 1
        '    For ii = 0 To 1
        '        Dim Elemento As New Datos
        '        Elemento.id = TablaEncabezado.Rows(i).Item("numero")
        '        Elemento.cliente = TablaEncabezado.Rows(i).Item("cliente").ToString
        '        Elemento.tipo = TablaEncabezado.Rows(i).Item("descripcion").ToString
        '        Elemento.valor = Convert.ToDouble(TablaEncabezado.Rows(i).Item("valor")).ToString("#,##0.00")
        '        Elemento.estado = TablaEncabezado.Rows(i).Item("estado")
        '        result.Add(Elemento)
        '        ii = ii + 1
        '    Next
        'Next

        Dim consulta As String = "EXEC dbo.corteCajaRecDetalladoPrueba '" & fechaIni & "', '" & fechaFin & "', " & suc & ", " & iid

        Dim tblConsulta As DataTable = manipular.Llena_Drop(consulta)

        Dim javaScriptRetorno As System.Web.Script.Serialization.JavaScriptSerializer = New System.Web.Script.Serialization.JavaScriptSerializer()
        Dim filas As List(Of Dictionary(Of String, Object)) = New List(Of Dictionary(Of String, Object))()
        Dim fila As Dictionary(Of String, Object)

        For Each dr As DataRow In tblConsulta.Rows
            fila = New Dictionary(Of String, Object)()

            For Each col As DataColumn In tblConsulta.Columns
                fila.Add(col.ColumnName, dr(col))
            Next

            filas.Add(fila)
        Next
        result = javaScriptRetorno.Serialize(filas)

        Return result
    End Function



    'metodo utilizado para llenar las sucursales
    <WebMethod()>
    Public Function sucursales(ByVal usr As String) As List(Of [Datos])
        Dim empresa As String = manipular.idempresabusca("SELECT id_empresa FROM USUARIO WHERE USUARIO = '" & usr & "'  AND estado = 1")
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select id_suc, descripcion from SUCURSALES where id_empresa = " & empresa
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_suc")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("descripcion").ToString

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    Public Class Datos
        Public id As String
        Public cliente As String
        Public valor As String
        Public total As String
        Public tipo As String
        Public titulo As String
        Public contador As Integer
        Public estado As String
        Public descripcion As String
    End Class

End Class