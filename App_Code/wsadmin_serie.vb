Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsadmin_serie
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)
        Dim SQL As String = "SELECT S.id_serie,S.descripcion,E.id_empresa,E.nombre FROM SERIE S INNER JOIN ENCA_CIA E ON E.id_empresa = S.company WHERE S.estado = 1"
        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New datos
            Elemento.id = TablaEncabezado.Rows(i).Item("id_serie")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("descripcion").ToString
            Elemento.compania = TablaEncabezado.Rows(i).Item("nombre").ToString
            Elemento.idcompania = TablaEncabezado.Rows(i).Item("id_empresa")
            result.Add(Elemento)
        Next

        Return result

    End Function


    'Metodo para Guardar Los datos
    <WebMethod()>
    Public Function Insertar(ByVal descripcion As String, ByVal empresa As String) As String
        'consulta sql
        Dim sql As String = "INSERT INTO  [SERIE] (descripcion ,estado,company) VALUES('" & descripcion & "',1," & empresa & ");"


        Dim result As String = ""


        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Insertador Correctamente."
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result
    End Function



    'Metodo para Actualizar Los datos
    <WebMethod()>
    Public Function Actualizar(ByVal descripcion As String, ByVal empresa As String, ByVal id As Integer) As String
        'consulta sql
        Dim sql As String = "UPDATE    [SERIE] set  descripcion = '" & descripcion & "', company = " & empresa & " where id_serie = " & id


        Dim result As String = ""


        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Actualizados Correctamente"
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result
    End Function


    'Metodo para Eliminar Los datos
    <WebMethod()>
    Public Function Inhabilitar(ByVal id As Integer) As String
        'consulta sql
        Dim sql As String = "UPDATE  [SERIE] set   estado = 0 where id_serie = " & id


        Dim result As String = ""


        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Actualizados Correctamente"
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result
    End Function

    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public compania As String
        Public idcompania As String
    End Class

End Class