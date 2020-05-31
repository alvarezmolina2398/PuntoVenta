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
Public Class wslista_facturas
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function ObtenerFacturas(ByVal fechainicio As String, ByVal fechafin As String) As List(Of datos)

        Dim fechaformat As String() = fechainicio.Split("/")
        fechainicio = fechaformat(2) & "-" & fechaformat(1) & "-" & fechaformat(0)

        fechaformat = fechafin.Split("/")
        fechafin = fechaformat(2) & "-" & fechaformat(1) & "-" & fechaformat(0)


        Dim SQL As String = "SELECT F.id_enc,F.USUARIO,F.Serie_Fact,convert(varchar,F.Fecha,103)+' '+convert(varchar,F.Fecha,24) as fecha,F.firma,F.Total_Factura, isnull(F.Total_Descuento,0) as Total_Descuento,C.Id_Clt, C.nit_clt, c.Nom_clt " &
            "FROM ENC_FACTURA F " &
            "INNER JOIN CLiente C  ON C.Id_Clt = F.Id_Clt where F.estado = 1 and f.Fecha between  '" & fechainicio & "  00:00:00'  and '" & fechafin & "  23:59:59'"

        Dim result As List(Of datos) = New List(Of datos)
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New datos
            Elemento.id = TablaEncabezado.Rows(i).Item("id_enc")
            Elemento.factura = TablaEncabezado.Rows(i).Item("Serie_Fact") & "-" & TablaEncabezado.Rows(i).Item("firma")
            Elemento.nit = TablaEncabezado.Rows(i).Item("nit_clt")
            Elemento.usuario = TablaEncabezado.Rows(i).Item("USUARIO")
            Elemento.cliete = TablaEncabezado.Rows(i).Item("Nom_clt")
            Elemento.fecha = TablaEncabezado.Rows(i).Item("fecha")
            Elemento.total = Format(TablaEncabezado.Rows(i).Item("Total_Factura"), "###,##0.00")
            result.Add(Elemento)
        Next
        Return result
    End Function



    <WebMethod()>
    Public Function AnularFactura(ByVal id As Integer, ByVal observacion As String, ByVal usuario As String) As String

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
            'consulta sql
            Dim sql As String = "INSERT INTO HISTORIAL_ANULARFACTURAS([id_enc],[observacion],[fecha],[usuario],[tipo])VALUES(" & id & ",'" & observacion & "',GETDATE(),'" & usuario & "',1); " &
            "UPDATE   [ENC_FACTURA] SET [estado] = 0 WHERE  id_enc = " & id


            comando.CommandText = sql
            comando.ExecuteNonQuery()


            Dim detalle As String = "SELECT Id_Art, Cantidad_Articulo, Id_Bod FROM DET_FACTURA WHERE id_enc = " & id


            Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(detalle)

            For i = 0 To TablaEncabezado.Rows.Count - 1

                Dim id_art As Integer = TablaEncabezado.Rows(i).Item("Id_Art")
                Dim Cantidad As Integer = TablaEncabezado.Rows(i).Item("Cantidad_Articulo")
                Dim id_bod As Integer = TablaEncabezado.Rows(i).Item("Id_Bod")

                Dim existencia_actual As Integer = ObtenerCantidadProducto(id_art, id_bod)

                Dim sql_exististencia As String = " UPDATE  [Existencias] SET [Existencia_Deta_Art] = " & existencia_actual + Cantidad & " WHERE Id_Bod = " & id_bod & " and Id_Art = " & id_art

                comando.CommandText = sql_exististencia
                comando.ExecuteNonQuery()

            Next


            'anulacion de Recivos
            Dim sql_REcibos As String = "SELECT  idRecibo FROM DET_RECIBO_FACT  WHERE id_enc = " & id

            Dim TablaEncabezado2 As DataTable = manipular.ObtenerDatos(sql_REcibos)

            For i = 0 To TablaEncabezado2.Rows.Count - 1
                Dim recibo As Integer = TablaEncabezado2.Rows(i).Item("idRecibo")


                Dim anular_recibo As String = "UPDATE ENC_RECIBO set ESTADO = 0 WHERE idRecibo = " & recibo

                comando.CommandText = anular_recibo
                comando.ExecuteNonQuery()
            Next

            transaccion.Commit()
            result = "SUCCESS|Factura Anulada  Correctamente"
        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message
        Finally
            conexion.Close()
        End Try


        Return result
    End Function


    Public Function NotaCredito_ElectronicaDemo(ByVal serie As String, ByVal correlativo As Integer) As String

        Dim chars As String = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789#/="
        Dim unit As String = ""
        Dim r As New Random
        Dim fechaHora As DateTime = DateTime.Now

        For i As Integer = 1 To 64

            Dim siguiente As Integer = r.Next(0, chars.Length)
            unit &= chars.Substring(siguiente, 1)

        Next

        Dim siguienteTurno As Integer = ObtenerSiguienteCorrelativo(correlativo)

        Dim firma As String = "FACE63" & serie.Trim() & siguienteTurno
        Dim cae As String = unit

        Return firma & "|" & cae

    End Function

    <WebMethod()>
    Public Function ObtenerSiguienteCorrelativo(ByVal correlativo As Integer) As Integer
        Dim SQL As String = "  select (Corr_Act + 1) as Siguiente  from Correlativos where id_correlativo = " & correlativo

        Dim result As Integer = -1
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            result = TablaEncabezado.Rows(i).Item("Siguiente").ToString.Trim()
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function obtenerDetalle(ByVal id As Integer) As List(Of productos)
        Dim result As List(Of productos) = New List(Of productos)

        Dim sql = "SELECT A.cod_Art,A.Des_Art, A.Id_Art, (D.Cantidad_Articulo - (SELECT isnull(sum(DN.devolucion),0) as dev  from ENC_NOTA_CREDITO NC  INNER JOIN DET_NOTA_CREDITO DN ON DN.idNota = NC.idNota WHERE DN.id_detalle = D.Id_detalle)) as cantidad, B.Id_Bod ,B.Nom_Bod, D.Precio_Unit_Articulo, D.Id_detalle " &
            "FROM DET_FACTURA D  " &
            "INNER JOIN ENC_FACTURA F ON F.id_enc = D.id_enc " &
            "INNER JOIN Bodegas B ON b.Id_Bod = D.Id_Bod " &
            " INNER JOIN Articulo a ON a.id_art = D.Id_Art " &
            "WHERE f.id_enc = " & id


        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As New productos
            Elemento.id = TablaEncabezado.Rows(i).Item("Id_Art")
            Elemento.iddetalle = TablaEncabezado.Rows(i).Item("Id_detalle")
            Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
            Elemento.cantidad = TablaEncabezado.Rows(i).Item("cantidad")
            Elemento.bodega = TablaEncabezado.Rows(i).Item("Id_Bod")
            Elemento.bo = TablaEncabezado.Rows(i).Item("Nom_Bod")
            Elemento.precio = TablaEncabezado.Rows(i).Item("Precio_Unit_Articulo")
            result.Add(Elemento)
        Next

        Return result
    End Function



    <WebMethod()>
    Public Function ObtenerCantidadProducto(ByVal idart As Integer, ByVal idbodega As Integer) As Integer
        Dim SQL As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & idart & " And id_bod = " & idbodega

        Dim result As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("cantidad")
            Next
        Next

        Return result

    End Function


    Public Function notacredito() As Boolean
        Return True
    End Function

    Public Class datos
        Public id As Integer
        Public fecha As String
        Public factura As String
        Public nit As String
        Public cliete As String
        Public total As String
        Public usuario As String
    End Class


    <WebMethod()>
    Public Function ObtenerSerie(ByVal usuario As String) As String
        Dim SQL As String = "select top 1 Series,c.id_correlativo from  [SUCURSALES] S INNER JOIN  [Correlativos] C ON c.id_correlativo = s.id_correlativoNota where id_suc = (select u.id_sucursal from   [USUARIO] u where USUARIO = '" & usuario & "')"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("Series").ToString().Trim() & "|" & TablaEncabezado.Rows(i).Item("id_correlativo")
            Next
        Next

        Return result.Trim()

    End Function

    <WebMethod()>
    Public Function ObtenerSerieNotaAbono(ByVal usuario As String) As String
        Dim SQL As String = "select top 1 Series,c.id_correlativo from  [SUCURSALES] S INNER JOIN  [Correlativos] C ON c.id_correlativo = s.id_correlativoAbono where id_suc = (select u.id_sucursal from   [USUARIO] u where USUARIO = '" & usuario & "')"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("Series").ToString().Trim() & "|" & TablaEncabezado.Rows(i).Item("id_correlativo")
            Next
        Next

        Return result.Trim()

    End Function

    <WebMethod()>
    Public Function ObtenerSerieNotaDebito(ByVal usuario As String) As String
        Dim SQL As String = "select top 1 Series,c.id_correlativo from  [SUCURSALES] S INNER JOIN  [Correlativos] C ON c.id_correlativo = s.id_correlativoDebito where id_suc = (select u.id_sucursal from   [USUARIO] u where USUARIO = '" & usuario & "')"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("Series").ToString().Trim() & "|" & TablaEncabezado.Rows(i).Item("id_correlativo")
            Next
        Next

        Return result.Trim()

    End Function


    <WebMethod()>
    Public Function NotaDebito(ByVal valor As Double, ByVal observacion As String, ByVal usuario As String, ByVal id As Integer, ByVal tipo As Integer) As String
        Dim result As String



        Dim data() As String = ObtenerSerieNotaDebito(usuario).Split("|")
        Dim serie As String = data(0).Trim()
        Dim idcorrelativo As Integer = Integer.Parse(data(1))
        Dim eliminaDoc1 As String = "FACE66"
        Dim eliminaDoc2 As String = "FACE63"
        Dim eliminaDoc3 As String = serie & "001"
        Dim retornoData As String() = NotaCredito_ElectronicaDemo(serie, idcorrelativo).Split("|")
        Dim siguiente As String = ObtenerSiguienteCorrelativo(idcorrelativo)
        Dim firma As String = retornoData(0)
        Dim cae = retornoData(1)

        Dim sucursal As String = ""
        Dim empresa As String = ""


        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion

        Try
            Dim sql As String = "INSERT INTO ENC_NOTA_DEBITO ([id_empresa],[id_suc],[id_correlativo],[idSerieNota],[firma],[cae],[fecha],[id_enc],[usuario],[observaciones])  " &
           "VALUES(" & empresa & "," & sucursal & "," & idcorrelativo & ",'" & serie & "','" & firma & "','" & cae & "',GETDATE()," & id & ", '" & usuario & "','" & observacion & "')"

            Dim sql2 As String = ""

            'ejecuto primer comando sql
            comando.CommandText = sql
            comando.ExecuteNonQuery()

            'OBTENEMOS ID DE LA FACTURA
            comando.CommandText = "SELECT @@IDENTITY"
            Dim id_nota_debito As Integer = comando.ExecuteScalar()

            If tipo = 1 Then
                sql2 = "INSERT INTO [idNota],[id_detalle],[descuento],[devolucion] VALUES(" & id_nota_debito & "," & 0 & "," & valor & "," & 0 & ")"
            Else
                sql2 = "INSERT INTO [idNota],[id_detalle],[descuento],[devolucion] VALUES(" & id_nota_debito & "," & 0 & "," & valor & "," & 0 & ")"
            End If



            'ejecuto primer comando sql
            comando.CommandText = sql2
            comando.ExecuteNonQuery()

            transaccion.Commit()


            result = "SUCCESS| DATOS FACTURADOS EXITOSAMENTE|"


        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message

        Finally
            conexion.Close()
        End Try





        Return result
    End Function


    Public Class productos
        Public id As Integer
        Public cantidad As Integer
        Public bo As String
        Public bodega As Integer
        Public precio As Double
        Public descripcion As String
        Public codigo As String
        Public iddetalle As Integer
    End Class

    <WebMethod()>
    Public Function RealizarNotaCredito(ByVal id As Integer, ByVal observacion As String, ByVal usuario As String, ByVal listproductos As List(Of productos), ByVal tipo As Integer, ByVal esabono As Integer) As String



        Dim result As String = ""


        Dim conexion As SqlConnection
        conexion = New SqlConnection()
        conexion.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings("ConString").ConnectionString
        conexion.Open()
        Dim comando As New SqlCommand
        Dim transaccion As SqlTransaction
        transaccion = conexion.BeginTransaction
        comando.Connection = conexion
        comando.Transaction = transaccion

        Try
            'consulta sql
            Dim sql As String = "INSERT INTO HISTORIAL_ANULARFACTURAS([id_enc],[observacion],[fecha],[usuario],[tipo])VALUES(" & id & ",'" & observacion & "',GETDATE(),'" & usuario & "',2); "


            comando.CommandText = sql
            comando.ExecuteNonQuery()


            ' METODOS PARA OBTENER SERIE Y NUMERO DE NOTA DE CRETIDO
            Dim data() As String

            If esabono = 0 Then
                data = ObtenerSerie(usuario).Split("|")
            Else
                data = ObtenerSerieNotaAbono(usuario).Split("|")
            End If
            Dim serie As String = data(0).Trim()
            Dim idcorrelativo As Integer = Integer.Parse(data(1))
            Dim eliminaDoc1 As String = "FACE66"
            Dim eliminaDoc2 As String = "FACE63"
            Dim eliminaDoc3 As String = serie & "001"
            Dim retornoData As String() = NotaCredito_ElectronicaDemo(serie, idcorrelativo).Split("|")
            Dim siguiente As String = ObtenerSiguienteCorrelativo(idcorrelativo)
            Dim firma As String = retornoData(0)
            Dim cae = retornoData(1)



            Dim sql_empresa As String = "SELECT id_empresa  from USUARIO where USUARIO = '" & usuario & "'"
            Dim sql_sucursal As String = "SELECT id_sucursal  from USUARIO where USUARIO = '" & usuario & "'"
            Dim nota_credito As String = "INSERT INTO [dbo].[ENC_NOTA_CREDITO]([id_empresa],[id_suc],[id_correlativo],[idSerieNota],[firma],[cae],[fecha],[id_enc],[usuario],[observaciones],[tipoNota],[esAbono],[estado])" &
                "VALUES((" & sql_empresa & "),(" & sql_sucursal & ")," & idcorrelativo & ",'" & serie & "','" & firma & "','" & cae & "',GETDATE()," & id & ",'" & usuario & "','" & observacion & "', " & tipo & "," & esabono & ",1)"

            comando.CommandText = nota_credito
            comando.ExecuteNonQuery()

            'OBTENEMOS ID DE RECIVO
            comando.CommandText = "SELECT @@IDENTITY"
            Dim id_nota As Integer = comando.ExecuteScalar()


            Dim detalle As String = "SELECT Id_Art, Cantidad_Articulo, Id_Bod FROM DET_FACTURA WHERE id_enc = " & id

            For Each item As productos In listproductos

                If tipo = 2 Or 3 Then
                    Dim existencia_actual As Integer = ObtenerCantidadProducto(item.id, item.bodega)

                    Dim sql_exististencia As String = " UPDATE  [Existencias] SET [Existencia_Deta_Art] = " & existencia_actual + item.cantidad & " WHERE Id_Bod = " & item.bodega & " and Id_Art = " & item.id

                    comando.CommandText = sql_exististencia
                    comando.ExecuteNonQuery()

                    Dim sql_det_nota As String = "INSERT INTO [dbo].[DET_NOTA_CREDITO]([idNota],[id_detalle],[devolucion],[descuento])" &
                        "VALUES(" & id_nota & "," & item.iddetalle & "," & item.cantidad & ",0)"


                    comando.CommandText = sql_det_nota
                    comando.ExecuteNonQuery()


                    Dim sql_corr As String = "UPDATE  [Correlativos] SET [Corr_Act] = " & siguiente & " WHERE id_correlativo = '" & idcorrelativo & "'"
                    comando.CommandText = sql_corr
                    comando.ExecuteNonQuery()

                End If
            Next

            Dim extra As String = ""

            If esabono = 0 Then
                extra = "credito"
            Else
                extra = "abono"
            End If


            transaccion.Commit()
            result = "SUCCESS|Nota de " & extra & " Exitosa "
        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()

            If ex.Message = "Índice fuera de los límites de la matriz." Or ex.Message = "Index was outside the bounds of the array." Then
                Dim extra As String = ""

                If esabono = 0 Then
                    extra = "CREDITO"
                Else
                    extra = "ABONO"
                End If
                result = "Error|" & ex.Message & " (VERIFIQUE QUE TENGA NOTA DE " & extra & " ASIGNADA A LA SUSUCURSAL)"
            Else
                result = "Error|" & ex.Message
            End If




        Finally
            conexion.Close()
        End Try


        Return result
    End Function


End Class