Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data


' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsmunicipios
    Inherits System.Web.Services.WebService

    Public Class drop
        Public valor As String
        Public texto As String
    End Class

    'metodo utilizado para obtener el listado de departamentos
    <WebMethod()>
    Public Function busca_depto() As List(Of [drop])

        Dim result As List(Of [drop]) = New List(Of drop)()
        Dim StrEncabezado As String = "select ID_DEPTO,DESC_DEPTO from DEPARTAMENTOS WHERE estado = 1"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New drop
                Elemento.valor = TablaEncabezado.Rows(i).Item("ID_DEPTO").ToString()
                Elemento.texto = TablaEncabezado.Rows(i).Item("DESC_DEPTO").ToString()
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result

    End Function


    'Metodo utilizado para obtener el listado de municipios
    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)
        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim StrEncabezado As String = "SELECT M.ID_MUNI,d.ID_DEPTO,M.DESCRIPCION,d.DESC_DEPTO FROM MUNICIPIOS M INNER JOIN DEPARTAMENTOS d ON d.ID_DEPTO = M.ID_DEPTO WHERE M.estado = 1"
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = TablaEncabezado.Rows(i).Item("ID_MUNI")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("DESCRIPCION").ToString()
                Elemento.iddepartamento = TablaEncabezado.Rows(i).Item("ID_DEPTO")
                Elemento.departamento = TablaEncabezado.Rows(i).Item("DESC_DEPTO")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para insertar el municipio
    <WebMethod()>
    Public Function GuardarDatos(ByVal nombre As String, ByVal departamento As Integer) As Boolean
        Dim result As Boolean = False
        Dim id As String = Nothing
        id = manipular.idempresabusca("SELECT MAX(ID_MUNI) FROM MUNICIPIOS WHERE ID_DEPTO = " & departamento & "")
        Dim ide As Double = 0
        If id = "" Then
            ide = 1
        Else
            ide = Convert.ToDouble(id) + 1
        End If

        Dim StrEncabezado As String = "INSERT INTO  MUNICIPIOS(ID_MUNI,DESCRIPCION,ID_DEPTO,estado) VALUES(" & ide & ",'" & nombre & "', '" & departamento & "',1)"
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para actualizar datos
    <WebMethod()>
    Public Function ActualizarDatos(ByVal nombre As String, ByVal departamento As Integer, ByVal id As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE MUNICIPIOS SET DESCRIPCION = '" & nombre & "',  ID_DEPTO= '" & departamento & "' WHERE ID_MUNI = " & id & " AND ID_DEPTO = " & departamento

        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para cambiar el estado del municipio
    <WebMethod()>
    Public Function cambiarEstado(ByVal id As Integer, ByVal depto As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE MUNICIPIOS SET estado = 0 WHERE ID_MUNI = " & id & " AND ID_DEPTO = " & depto
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'declaracion de variables a utilizar
    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public departamento As String
        Public iddepartamento As Integer
    End Class
End Class