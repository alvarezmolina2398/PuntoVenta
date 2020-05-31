Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data


' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsdepartamentos
    Inherits System.Web.Services.WebService
    'metodo utilizado para mostrar la lista de departamentos
    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim StrEncabezado As String = "select * from DEPARTAMENTOS where estado=1 order by DESC_DEPTO asc"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = TablaEncabezado.Rows(i).Item("ID_DEPTO")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("DESC_DEPTO").ToString().Trim()
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para guardar un nuevo departamento
    <WebMethod()>
    Public Function GuardarDatos(ByVal nombre As String) As Boolean
        Dim result As Boolean = False
        Dim id As String = Nothing
        id = manipular.idempresabusca("SELECT MAX(ID_DEPTO) FROM DEPARTAMENTOS")
        Dim ide As Double = 0
        If id = "" Then
            ide = 1
        Else
            ide = Convert.ToDouble(id) + 1
        End If

        Dim StrEncabezado As String = "INSERT INTO  DEPARTAMENTOS (ID_DEPTO,DESC_DEPTO,estado) VALUES(" & ide & ",'" & nombre & "',1)"
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para actualizar un departamento
    <WebMethod()>
    Public Function ActualizarDatos(ByVal nombre As String, ByVal id As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE DEPARTAMENTOS SET DESC_DEPTO = '" & nombre & "' WHERE  ID_DEPTO = " & id
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function


    'metodo utilizado para actualizar un departamento
    <WebMethod()>
    Public Function cambiarEstado(ByVal id As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE DEPARTAMENTOS SET estado = 0 WHERE ID_DEPTO = " & id
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'declaracion de variables a utilizar
    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public orden_cedula As String
    End Class

End Class