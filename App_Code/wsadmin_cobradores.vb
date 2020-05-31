Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsadmin_cobradores
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function Insertar(ByVal nombre As String, ByVal dpi As String, ByVal telefono As String, ByVal correo As String, ByVal direccion As String, ByVal tipo As Integer, ByVal id As Integer, ByVal correlativo As Integer) As String

        Dim sql = ""

        Dim result As String = ""

        If id = 0 Then
            sql = "INSERT INTO [cobradores]([nombre],[direccion],[DPI],[tipo],[telefono],[correo],[estado],[correlativo]) VALUES ('" & nombre & "','" & direccion & "','" & dpi & "'," & tipo & ",'" & telefono & "','" & correo & "',1," & correlativo & ")"
        Else
            sql = "UPDATE cobradores set  nombre = '" & nombre & "', direccion = '" & direccion & "', DPI = '" & dpi & "', tipo = " & tipo & " , telefono = '" & telefono & "',  correo = '" & correo & "', correlativo = " & correlativo & " where id_cobrador = " & id
        End If

        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Insertador Correctamente."
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If

        Return result

    End Function


    <WebMethod()>
    Public Function Eliminar(ByVal id As Integer) As String

        Dim sql = ""


        Dim result As String = ""


        sql = "UPDATE cobradores set  estado = '" & 0 & "'  where id_cobrador = " & id






        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Insertador Correctamente."
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result

    End Function




    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)
        Dim sql As String = "SELECT id_cobrador, nombre, direccion,DPI,tipo, telefono,correo,correlativo  from Cobradores where estado = 1"


        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New datos
            Elemento.id = TablaEncabezado.Rows(i).Item("id_cobrador")
            Elemento.nombre = TablaEncabezado.Rows(i).Item("nombre")
            Elemento.direccion = TablaEncabezado.Rows(i).Item("direccion")
            Elemento.DPI = TablaEncabezado.Rows(i).Item("DPI")
            Elemento.telefono = TablaEncabezado.Rows(i).Item("telefono")
            Elemento.correo = TablaEncabezado.Rows(i).Item("correo")
            Elemento.tipo = TablaEncabezado.Rows(i).Item("tipo")
            Elemento.correlativo = TablaEncabezado.Rows(i).Item("correlativo")
            If TablaEncabezado.Rows(i).Item("tipo") = 1 Then
                Elemento.tipotext = "INTERNO"
            Else
                Elemento.tipotext = "EXTERNO"
            End If
            result.Add(Elemento)
        Next

        Return result
    End Function


    Public Class datos
        Public id As Integer
        Public nombre As String
        Public direccion As String
        Public DPI As String
        Public tipo As Integer
        Public tipotext As String
        Public telefono As String
        Public correo As String
        Public correlativo As Integer
    End Class

End Class

