Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Data

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsmetas
    Inherits System.Web.Services.WebService

    'metodo utilizado para obtener una meta
    <WebMethod()>
    Public Function getMeta(ByVal periodo As String, ByVal suc As Integer, ByVal meta As Integer, ByVal tipo As String) As List(Of [Datos])
        Dim result As List(Of [Datos]) = New List(Of Datos)()
        Dim Tot As Double = 0
        Dim str As String = "select id_presu from det_metas where cuenta = " & suc & " and periodoa= '" & periodo & "' and centroc = " & meta & " and tipo = '" & tipo & "'"
        Dim id As String = manipular.idempresabusca(str)
        Dim StrEncabezado As String = "select s.* from det_metas_sem s " &
                                      " join det_metas m " &
                                      " on m.id_presu = s.id_presu " &
                                      " where m.id_presu = " & id
        Dim TablaEncabezado As DataTable = manipular.Login(StrEncabezado)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New Datos
                Elemento.id = TablaEncabezado.Rows(i).Item("semana")
                Elemento.valor = TablaEncabezado.Rows(i).Item("valor")
                Tot = Tot + TablaEncabezado.Rows(i).Item("valor")
                Elemento.total = Tot

                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result
    End Function


    'metodo utilizado para crear una meta
    <WebMethod(True)>
    Public Function CrearoActualizarMeta(ByVal valores As List(Of Double), ByVal periodo As String, ByVal suc As Integer, ByVal meta As Integer, ByVal tipo As String) As Boolean

        Dim retorno As String = Nothing
        Dim guardar As String = Nothing

        Dim id As String = manipular.idempresabusca("SELECT id_presu FROM det_metas WHERE cuenta = '" & suc & "' and periodoa =  '" & periodo & "' and centroc= " & meta & " and tipo = '" & tipo & "'")
        If id = "" Then
            guardar = "INSERT INTO det_metas(cuenta,periodoa,centroc,tipo) values (" & suc & ",'" & periodo & "','" & meta & "','" & tipo & "')"
            retorno = manipular.EjecutaTransaccion1(guardar)
            id = manipular.idempresabusca("SELECT id_presu FROM det_metas WHERE cuenta = '" & suc & "' and periodoa =  '" & periodo & "' and centroc= " & meta & " and tipo = '" & tipo & "'")
            If id = "" Then

            Else
                Dim i As Integer = 0
                For Each valor As Double In valores
                    i = i + 1
                    guardar = "insert into det_metas_sem (id_presu,semana,valor) values (" & id & ",'" & i & "','" & valor & "')"
                    retorno = manipular.EjecutaTransaccion1(guardar)
                Next
            End If
        Else
            Dim i As Integer = 0
            For Each valor As Double In valores
                i = i + 1
                guardar = "update det_metas_sem set valor=" & valor & " where id_presu = '" & id & "' and semana =" & i
                retorno = manipular.EjecutaTransaccion1(guardar)

            Next
        End If

        Return retorno

    End Function


    Public Class Datos
        Public id As String
        Public valor As String
        Public total As Double
    End Class
End Class