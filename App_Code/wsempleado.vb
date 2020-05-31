Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsempleado
    Inherits System.Web.Services.WebService

    'metodo utilizado para obtener los datos de la empresa
    <WebMethod()>
    Public Function getempresa() As List(Of Datos)
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select * from ENCA_CIA  where estado = 1"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_empresa")
                Elemento.depto = TablaEncabezado.Rows(i).Item("nombre")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result

    End Function

    'metodo utilizaod para obtener los datos del departamento laboral 
    <WebMethod()>
    Public Function getDepto(ByVal emp As Integer) As List(Of Datos)
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select * from DEPTO_LAB  where id_empresa = " & emp
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_departamento")
                Elemento.depto = TablaEncabezado.Rows(i).Item("descripcion")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metod utilizado para mostrar el listado de los vendedores 
    <WebMethod()>
    Public Function ObtenerDatos() As List(Of Datos)
        'enviar empresa
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "select e.id, e.nombre, e.correo, d.id_departamento, d.descripcion, em.nombre as emp, em.id_empresa   from empleado e join DEPTO_LAB d on d.id_departamento = e.id_dep join ENCA_CIA em on em.id_empresa = e.idempresa where e.estado = 1"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id")
                Elemento.nombre = TablaEncabezado.Rows(i).Item("nombre").ToString
                Elemento.correo = TablaEncabezado.Rows(i).Item("correo").ToString
                Elemento.iddepto = TablaEncabezado.Rows(i).Item("id_departamento")
                Elemento.depto = TablaEncabezado.Rows(i).Item("descripcion")
                Elemento.idempresa = TablaEncabezado.Rows(i).Item("id_empresa")
                Elemento.emp = TablaEncabezado.Rows(i).Item("emp")

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para insertar un vendedor
    <WebMethod()>
    Public Function GuardarDatos(ByVal nombre As String, ByVal correo As String, ByVal depto As Integer, ByVal emp As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "INSERT INTO   empleado (nombre, correo, id_dep, idempresa, estado) VALUES ('" & nombre & "','" & correo & "', " & depto & ", " & emp & ",1)"
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para actualizar los datos de un vendedor
    <WebMethod()>
    Public Function ActualizarDatos(ByVal nombre As String, ByVal correo As String, ByVal depto As Integer, ByVal emp As Integer, ByVal id As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE  empleado SET nombre = '" & nombre & "', correo = '" & correo & "', id_dep = " & depto & ", idempresa = " & emp & "  WHERE id=" & id
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para deshabilitar un vendedor
    <WebMethod()>
    Public Function Eliminar(ByVal id As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE  empleado SET estado=0 WHERE id=" & id
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    Public Class Datos
        Public id As Integer
        Public nombre As String
        Public correo As String
        Public depto As String
        Public iddepto As Integer
        Public emp As String
        Public idempresa As Integer
    End Class

End Class