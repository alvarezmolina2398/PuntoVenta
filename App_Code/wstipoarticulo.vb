﻿Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()> _
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wstipoarticulo
    Inherits System.Web.Services.WebService
    'metod utilizado para mostrar el listado de los tipos de articulo 
    <WebMethod()> _
    Public Function ObtenerDatos() As List(Of Datos)

        'enviar tipo
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim StrEncabezado As String = "SELECT * FROM TIPOARTICULO WHERE estado = 1 "
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("idTipoLente")
                Elemento.nombre = TablaEncabezado.Rows(i).Item("tipolente").ToString
                Elemento.tipo = TablaEncabezado.Rows(i).Item("tipo")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function

    'metodo utilizado para insertar un tipo
    <WebMethod()>
    Public Function GuardarDatos(ByVal nombre As String, ByVal tipo As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "INSERT INTO TIPOARTICULO (tipolente,estado, tipo ) VALUES ('" & nombre & "',1," & tipo & ")"
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para actualizar un tipo
    <WebMethod()>
    Public Function ActualizarDatos(ByVal nombre As String, ByVal id As Integer, ByVal tipo As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE TIPOARTICULO SET tipoLente = '" & nombre & "', tipo = " & tipo & " WHERE idTipoLente=" & id
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    'metodo utilizado para deshabilitar un tipo
    <WebMethod()> _
    Public Function Eliminar(ByVal id As Integer) As Boolean
        Dim result As Boolean = False
        Dim StrEncabezado As String = "UPDATE TIPOARTICULO SET estado=0 WHERE idTipoLente=" & id
        result = manipular.EjecutaTransaccion1(StrEncabezado)
        Return result
    End Function

    Public Class Datos
        Public id As Integer
        Public nombre As String
        Public tipo As Integer
    End Class
End Class