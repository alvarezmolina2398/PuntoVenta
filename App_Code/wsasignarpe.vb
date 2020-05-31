Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsasignarpe
    Inherits System.Web.Services.WebService

    'metodo utilizado para obtener la lista de Usuarios 
    <WebMethod()>
    Public Function getSucursales(ByVal user As String) As List(Of [datos])
        Dim id As Integer = Convert.ToDouble(manipular.idempresabusca("SELECT id_empresa FROM  USUARIO WHERE  USUARIO = '" & user & "'"))

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim strEncabezado As String = "select * from SUCURSALES where id_empresa = " & id
        Dim tabla As DataTable = manipular.Login(strEncabezado)

        For i = 0 To tabla.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = tabla.Rows(i).Item("id_suc")
                Elemento.descripcion = tabla.Rows(i).Item("descripcion")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result

    End Function


    'metodo utilizado para obtener la lista de Usuarios 
    <WebMethod()>
    Public Function getUsers(ByVal suc As Integer) As List(Of [datos])
        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim strEncabezado As String = "select * from USUARIO where id_sucursal = " & suc
        Dim tabla As DataTable = manipular.Login(strEncabezado)

        For i = 0 To tabla.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = tabla.Rows(i).Item("ID")
                Elemento.descripcion = tabla.Rows(i).Item("USUARIO")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function



    'Metodo utilizado para obtener el listado de permisos no asignados 
    <WebMethod()>
    Public Function obtenerNoAsignados(ByVal user As Integer) As List(Of [datos])
        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim strEncabezado As String = "select p.id, p.descripcion from permisosEspeciales p   " &
                                      " where not exists(select * from asignarPE ap  " &
                                      " where (ap.idPe  = p.id and ap.id_usuario = " & user & ") )"
        Dim tabla As DataTable = manipular.Login(strEncabezado)

        For i = 0 To tabla.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = tabla.Rows(i).Item("id")
                Elemento.descripcion = tabla.Rows(i).Item("descripcion")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para obtener la lista de permisos asignados
    <WebMethod()>
    Public Function obtenerAsignados(ByVal user As Integer) As List(Of [datos])
        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim strEncabezado As String = "select p.id, p.descripcion from permisosEspeciales p " &
                                       "JOIN asignarPE a " &
                                       "on a.idPe  = p.id " &
                                       "where a.id_usuario  = " & user & ""
        Dim tabla As DataTable = manipular.Login(strEncabezado)

        For i = 0 To tabla.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = tabla.Rows(i).Item("id")
                Elemento.descripcion = tabla.Rows(i).Item("descripcion")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para agregar permisos
    <WebMethod()>
    Public Function addPermisos(ByVal permiso As List(Of Integer), ByVal user As Integer) As Boolean

        Dim result As Boolean = False

        Dim str As String = ""
        For Each p As Integer In permiso
            str = "INSERT INTO asignarPE (idPe, id_usuario) VALUES (" & p & ", " & user & ")"
            result = manipular.EjecutaTransaccion1(str)
        Next

        Return result
    End Function

    'metodo utilizado para quitar los permisos
    <WebMethod()>
    Public Function delPermisos(ByVal permiso As String, ByVal user As Integer) As Boolean
        Dim result As Boolean = False
        Dim str As String = ""

        str = "DELETE FROM asignarPE where idPe in (" & permiso & ") and id_usuario =" & user
        result = manipular.EjecutaTransaccion1(str)

        Return result
    End Function
    Public Class datos
        Public id As Integer
        Public descripcion As String
    End Class

End Class