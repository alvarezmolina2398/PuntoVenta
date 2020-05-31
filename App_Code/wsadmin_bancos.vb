Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsadmin_bancos
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)

        Dim sql As String = "SELECT ID_BANCO, NOMBRE from BANCOS where estado = 1"


        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New datos
            Elemento.id = TablaEncabezado.Rows(i).Item("ID_BANCO")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("NOMBRE")
            result.Add(Elemento)

        Next

        Return result
    End Function


    <WebMethod()>
    Public Function Insertar(ByVal descripcion As String) As Boolean
        Dim sql As String = "INSERT INTO BANCOS VALUES('" & descripcion & "',1)"
        Return manipular.EjecutaTransaccion1(sql)
    End Function

    <WebMethod()>
    Public Function Actualizar(ByVal descripcion As String, ByVal id As Integer) As Boolean
        Dim sql As String = "UPDATE BANCOS SET  NOMBRE = '" & descripcion & "' where ID_BANCO = " & id
        Return manipular.EjecutaTransaccion1(sql)
    End Function


    <WebMethod()>
    Public Function Eliminar(ByVal id As Integer) As Boolean
        Dim sql As String = "UPDATE BANCOS SET  estado = 0 where ID_BANCO = " & id
        Return manipular.EjecutaTransaccion1(sql)
    End Function



    <WebMethod()>
    Public Function ObtenerCuentas(ByVal banco As Integer) As List(Of Cuentas)
        Dim sql As String = "SELECT id_banco,id_cuenta,id_moneda,nomb_cuenta,no_cuenta,observaciones from CUENTA_BANCO where id_banco = " & banco & " and estado = 1"


        Dim result As List(Of Cuentas) = New List(Of Cuentas)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New Cuentas
            Elemento.id = TablaEncabezado.Rows(i).Item("id_cuenta")
            Elemento.id_banco = TablaEncabezado.Rows(i).Item("id_banco")
            Elemento.id_moneda = TablaEncabezado.Rows(i).Item("id_moneda")
            Elemento.numero = TablaEncabezado.Rows(i).Item("no_cuenta")
            Elemento.nombre = TablaEncabezado.Rows(i).Item("nomb_cuenta")
            Elemento.observaciones = TablaEncabezado.Rows(i).Item("observaciones")
            result.Add(Elemento)

        Next

        Return result

    End Function

    <WebMethod()>
    Public Function cargarMonedas() As List(Of datos)
        Dim SQL As String = "select ID_MONEDA, DESCRIPCION from MONEDAS where estado = 1"

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = TablaEncabezado.Rows(i).Item("ID_MONEDA")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("DESCRIPCION")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function InsertarCta(ByVal numero As String, ByVal nombre As String, ByVal banco As Integer, ByVal observacion As String, ByVal moneda As Integer, ByVal usuario As String) As Boolean
        Dim sql As String = "INSERT INTO CUENTA_BANCO(id_cia,id_banco,id_moneda,no_cuenta,nomb_cuenta,tipo_cuenta,saldo,observaciones,estado) " &
            "VALUES((Select id_empresa from USUARIO where USUARIO ='" & usuario & "')," & banco & "," & moneda & ",'" & numero & "','" & nombre & "',1,0,'" & observacion & "',1)"
        Return manipular.EjecutaTransaccion1(sql)
    End Function


    <WebMethod()>
    Public Function ActualizarCta(ByVal numero As String, ByVal nombre As String, ByVal banco As Integer, ByVal observacion As String, ByVal moneda As Integer, ByVal usuario As String, ByVal id As Integer) As Boolean
        Dim sql As String = "UPDATE CUENTA_BANCO SET id_banco = " & banco & ",id_moneda = " & moneda & ",no_cuenta = '" & numero & "',nomb_cuenta = '" & nombre & "', observaciones = '" & observacion & "' " &
            "where id_cuenta = " & id
        Return manipular.EjecutaTransaccion1(sql)
    End Function


    <WebMethod()>
    Public Function EliminarCta(ByVal id As Integer) As Boolean
        Dim sql As String = "UPDATE CUENTA_BANCO SET estado = 0 " &
            "where id_cuenta = " & id
        Return manipular.EjecutaTransaccion1(sql)
    End Function

    Public Class datos
        Public id As Integer
        Public descripcion As String
    End Class

    Public Class Cuentas
        Public id As Integer
        Public id_banco As Integer
        Public id_moneda As Integer
        Public nombre As String
        Public numero As String
        Public observaciones As String
    End Class


End Class