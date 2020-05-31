Imports System.Data
Imports System.Data.SqlClient
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports wscobrar_Recibos
Imports wsventasinrecibo

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsProgramacionPagos
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerLista() As List(Of datos)
        Dim sql As String = "SELECT p.nit_pro, p.Nom_pro, convert(varchar,c.fecha,103) as fecha, convert(varchar,c.fecha_pago,103) as fecha_limite, DATEDIFF(DAY,GETDATE() ,c.fecha_pago) as dias,c.total_fact from enc_compra_exterior c " &
           " inner join PROVEEDOR p on p.Id_PRO  = c.idproveedor " &
           " where c.pagada = 0;"

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New datos
            Elemento.nit = TablaEncabezado.Rows(i).Item("nit_pro")
            Elemento.proveedor = TablaEncabezado.Rows(i).Item("Nom_pro")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.fecha_limite = TablaEncabezado.Rows(i).Item("fecha_limite")
            Elemento.dias = TablaEncabezado.Rows(i).Item("dias")
            Elemento.valor = Format(TablaEncabezado.Rows(i).Item("total_fact"), "###,###,##0.00")
            result.Add(Elemento)
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function Pagar(ByVal usuario As String, ByVal idproveedor As Integer, ByVal total As Double, ByVal listpagos As List(Of pagos), ByVal listcompras As List(Of compras)) As String
        Dim result As String

        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion

        Try

            'INSERTAMOS RECIVO
            Dim strRecivo As String = "INSERT INTO [ENC_PAGO_COMPRA] ([fecha],[id_Pro],[usuario],[estado]) " &
                " VALUES(GETDATE()," & idproveedor & ",'" & usuario & "',1);"

            comando.CommandText = strRecivo
            comando.ExecuteNonQuery()

            'OBTENEMOS ID DE RECIVO
            comando.CommandText = "SELECT @@IDENTITY"
            Dim idRecivo As Integer = comando.ExecuteScalar()


            Dim saldo As Double = total

            For Each item As compras In listcompras
                Dim valor_utilizar As Double = 0

                If saldo >= item.valor Then
                    valor_utilizar = item.valor
                    saldo = saldo - item.valor
                Else
                    valor_utilizar = saldo
                    saldo = 0
                End If
                'INSERTAMOS EL RECIVO EN LA FACTURA
                Dim strFac_RECIVO As String = "INSERT INTO [DET_PAGOC_COMPRA]([id_pago],[id_compra],[abono]) " &
                "VALUES(" & idRecivo & "," & item.id & "," & valor_utilizar & ");"


                comando.CommandText = strFac_RECIVO
                comando.ExecuteNonQuery()

                If valor_utilizar = item.valor Then
                    Dim strAct As String = "UPDATE enc_compra_exterior set pagada = 1 where id_enc_orcompra_ing = " & item.id

                    comando.CommandText = strAct
                    comando.ExecuteNonQuery()
                End If


            Next

            'INSERCION DEL DETALLE DEL RECIVO (METODOS DE PAGO)

            For Each item As pagos In listpagos
                Dim StrPago As String = "INSERT INTO [DET_PAGO_COMPRA]([id_enc],[tipoPago],[idBanco],[documento],[valor]) " &
                    "VALUES(" & idRecivo & ",'" & item.tipo & "',0,'" & item.informacion & "'," & item.valor - item.cambio & ")"

                comando.CommandText = StrPago
                comando.ExecuteNonQuery()

            Next


            transaccion.Commit()


            result = "SUCCESS| DATOS PROCESADOS EXITOSAMENTE"


        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message
        Finally
            conexion.Close()
        End Try

        Return result
    End Function

    <WebMethod()>
    Public Function ObtenerProveedores(ByVal busqueda As String) As List(Of proveedores)
        Dim sql As String = "SELECT distinct p.Id_PRO, p.nit_pro,p.Nom_pro from enc_compra_exterior C  " &
            "INNER JOIN PROVEEDOR p On p.id_pro = c.idproveedor  where c.pagada = 0 and (p.Nom_pro like '%" & busqueda.Trim() & "%' or p.nit_pro = '%" & busqueda.Trim() & "%')"

        Dim result As List(Of proveedores) = New List(Of proveedores)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New proveedores
            Elemento.id = TablaEncabezado.Rows(i).Item("Id_PRO")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("nit_pro") & " | " & TablaEncabezado.Rows(i).Item("Nom_pro")
            result.Add(Elemento)
        Next

        Return result

    End Function

    <WebMethod()>
    Public Function obtenerFacturas(ByVal idproveedor As Integer) As List(Of compras)
        Dim sql = "SELECT ce.id_enc_orcompra_ing, convert(varchar,ce.fecha,103) fecha, ce.usuario,total_fact - (SELECT isnull(sum(DPC.abono),0) " &
        "FROM DET_PAGOC_COMPRA DPC " &
        "INNER JOIN  ENC_PAGO_COMPRA P oN DPC.id_pago = P.id_enc " &
        "INNER JOIN DET_PAGO_COMPRA D  ON D.id_enc = p.id_enc where DPC.id_compra = ce.id_enc_orcompra_ing) as total ,fecha_pago " &
        "FROM enc_compra_exterior  ce where idproveedor = " & idproveedor & " and pagada = 0;"

        Dim result As List(Of compras) = New List(Of compras)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New compras
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.fecha_limite = TablaEncabezado.Rows(i).Item("fecha_pago")
            Elemento.valor = TablaEncabezado.Rows(i).Item("total")
            Elemento.usuario = TablaEncabezado.Rows(i).Item("usuario").ToString
            Elemento.id = TablaEncabezado.Rows(i).Item("id_enc_orcompra_ing")
            result.Add(Elemento)
        Next

        Return result

    End Function

    Public Class compras
        Public fecha As String
        Public fecha_limite As String
        Public usuario As String
        Public valor As String
        Public id As String
    End Class


    Public Class datos
        Public nit As String
        Public proveedor As String
        Public fecha As String
        Public fecha_limite As String
        Public dias As Integer
        Public valor As String
    End Class



    Public Class pagos
        Public tipo As Integer
        Public valor As Double
        Public informacion As String
        Public tipoPagoText As String
        Public cambio As Double
        Public extra As Integer
        Public pago As Double
    End Class



    Public Class proveedores
        Public id As Integer
        Public descripcion As String
    End Class

End Class