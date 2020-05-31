Imports System.Data
Imports System.Data.SqlClient
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsadmincobrosrecurentes
    Inherits System.Web.Services.WebService


    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)
        Dim SQL As String = "SELECT c.nit_clt,c.Id_Clt, R.ultimo_dia_mes, R.cantidad_fecuencia, R.frecuencia, convert(varchar,R.fecha_incio,103) fecha, R.id_enc, c.Nom_clt,CONVERT(varchar,R.proximo_cobro,103) proximo, F.descripcion, R.tipo_cobro FROM ENC_RECURRENTE R INNER JOIN CLiente c on c.Id_Clt =  r.id_clt  INNER  JOIN frecuencia F on F.id_frecuencia = R.frecuencia where r.estado = 1;"

        Dim result As List(Of datos) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New datos
            Elemento.id = TablaEncabezado.Rows(i).Item("id_enc")
            Elemento.cliente = TablaEncabezado.Rows(i).Item("Nom_clt")
            Elemento.idcliente = TablaEncabezado.Rows(i).Item("Id_Clt")
            Elemento.Nit = TablaEncabezado.Rows(i).Item("nit_clt")
            Elemento.proximafecha = TablaEncabezado.Rows(i).Item("proximo")
            Elemento.frecuencia = TablaEncabezado.Rows(i).Item("descripcion")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.idfrecuencia = TablaEncabezado.Rows(i).Item("frecuencia")
            Elemento.cantidad = TablaEncabezado.Rows(i).Item("cantidad_fecuencia")
            Elemento.ultimo = TablaEncabezado.Rows(i).Item("ultimo_dia_mes")
            If (TablaEncabezado.Rows(i).Item("tipo_cobro")) Then
                Elemento.tipo = "FACTURADO"
            Else
                Elemento.tipo = "POR COMANDA"
            End If
            result.Add(Elemento)
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function ObtenerFrecuencia() As List(Of frecuencia)
        Dim SQL As String = "SELECT id_frecuencia, descripcion FROM FRECUENCIA WHERE estado = 1 "

        Dim result As List(Of frecuencia) = New List(Of frecuencia)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New frecuencia
            Elemento.id = TablaEncabezado.Rows(i).Item("id_frecuencia")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("descripcion")
            result.Add(Elemento)
        Next

        Return result
    End Function

    <WebMethod>
    Public Function Insertar(ByVal idcliente As String, ByVal fecha As String, ByVal frecuencia As Integer, ByVal total As String, ByVal tipo As Integer, ByVal listproductos As List(Of productos), ByVal usuario As String, ByVal cantidad As Integer, ByVal ultimodia As Integer, ByVal descuento As Double) As String

        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion
        Dim result As String = ""

        Try


            Dim fecha_act() As String = fecha.Split("/")
            fecha = fecha_act(2) & "-" & fecha_act(1) & "-" & fecha_act(0)

            'INSERCION DE LA FACTURA
            Dim str1 As String = "INSERT INTO ENC_RECURRENTE(fecha_incio,id_clt,tipo_cobro,frecuencia,total,estado,usuario,proximo_cobro,cantidad_fecuencia,ultimo_dia_mes,descuento) " &
                "VALUES('" & fecha & "'," & idcliente & "," & tipo & "," & frecuencia & "," & total & ",1, '" & usuario & "','" & fecha & "'," & cantidad & "," & ultimodia & "," & descuento & ")"

            'ejecuto primer comando sql
            comando.CommandText = str1
            comando.ExecuteNonQuery()

            'OBTENEMOS ID DE LA FACTURA
            comando.CommandText = "SELECT @@IDENTITY"
            Dim id As Integer = comando.ExecuteScalar()



            'INSERCION DEL DETALLE DE LA FACTURA
            For Each item As productos In listproductos

                Dim str2 As String = "INSERT INTO DET_RECURRENTE(id_enc,precio,cantidad,id_art,estado) VALUES(" & id & "," & item.precio & "," & item.cantidad & "," & item.id & ",1)"

                comando.CommandText = str2
                comando.ExecuteNonQuery()
            Next



            result = "SUCCESS| FACTURACION PERIODICA REGISTRADA  EXITOSAMENTE"

            transaccion.Commit()
        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message
        Finally
            conexion.Close()
        End Try

        Return result
    End Function

    <WebMethod>
    Public Function Actualizar(ByVal idcliente As String, ByVal fecha As String, ByVal frecuencia As Integer, ByVal total As String, ByVal tipo As Integer, ByVal listproductos As List(Of productos), ByVal usuario As String, ByVal cantidad As Integer, ByVal ultimodia As Integer, ByVal descuento As Double, ByVal id As Integer) As String

        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion
        Dim result As String = ""

        Try


            Dim fecha_act() As String = fecha.Split("/")
            fecha = fecha_act(2) & "-" & fecha_act(1) & "-" & fecha_act(0)

            'INSERCION DE LA FACTURA
            Dim str1 As String = "UPDATE ENC_RECURRENTE SET fecha_incio =  '" & fecha & "',id_clt = " & idcliente & " ,tipo_cobro = " & tipo & ",frecuencia=" & frecuencia & ",total = " & total & ",usuario = '" & usuario & "',proximo_cobro= '" & fecha & "',cantidad_fecuencia = " & cantidad & ",ultimo_dia_mes = " & ultimodia & ",descuento =" & descuento & "   where id_enc = " & id &
                "; UPDATE DET_RECURRENTE set estado = 0 where id_enc = " & id


            'ejecuto primer comando sql
            comando.CommandText = str1
            comando.ExecuteNonQuery()




            'INSERCION DEL DETALLE DE LA FACTURA
            For Each item As productos In listproductos

                Dim str2 As String = "INSERT INTO DET_RECURRENTE(id_enc,precio,cantidad,id_art,estado) VALUES(" & id & "," & item.precio & "," & item.cantidad & "," & item.id & ",1)"

                comando.CommandText = str2
                comando.ExecuteNonQuery()
            Next



            result = "SUCCESS| FACTURACION PERIODICA REGISTRADA  EXITOSAMENTE"

            transaccion.Commit()
        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message
        Finally
            conexion.Close()
        End Try

        Return result
    End Function

    <WebMethod>
    Public Function Eliminar(ByVal id As Integer) As String

        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion
        Dim result As String = ""

        Try

            'INSERCION DE LA FACTURA
            Dim str1 As String = "UPDATE ENC_RECURRENTE SET estado = 0   where id_enc = " & id

            'ejecuto primer comando sql
            comando.CommandText = str1
            comando.ExecuteNonQuery()

            result = "SUCCESS| FACTURACION PERIODICA DESHABILITADA  EXITOSAMENTE"

            transaccion.Commit()
        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message
        Finally
            conexion.Close()
        End Try

        Return result
    End Function



    <WebMethod>
    Public Function ObtenerDetalle(ByVal id As Integer) As List(Of productos)
        Dim result As List(Of productos) = New List(Of productos)
        Dim sql As String = "select a.cod_Art, a.Des_Art, a.id_art, DT.precio,DT.cantidad " &
            "from DET_Recurrente DT inner join Articulo a on a.id_art = DT.id_art where Dt.estado = 1 and Dt.id_enc = " & id & ";"

        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New productos
            Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
            Elemento.cantidad = TablaEncabezado.Rows(i).Item("cantidad")
            Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
            Elemento.precio = TablaEncabezado.Rows(i).Item("precio")
            result.Add(Elemento)
        Next


        Return result
    End Function

    Public Class datos
        Public id As Integer
        Public cliente As String
        Public cantidad As Integer
        Public proximafecha As String
        Public fecha As String
        Public tipo As String
        Public frecuencia As String
        Public idfrecuencia As Integer
        Public ultimo As Integer
        Public Nit As String
        Public idcliente As Integer
    End Class


    Public Class frecuencia
        Public id As Integer
        Public descripcion As String
    End Class

    Public Class productos
        Public precio As Double
        Public codigo As Double
        Public cantidad As Integer
        Public descripcion As String
        Public id As Integer
    End Class


End Class