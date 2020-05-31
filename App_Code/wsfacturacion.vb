﻿Imports System.Data
Imports System.Data.SqlClient
Imports System.IO
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports iTextSharp.text
Imports iTextSharp.text.pdf

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class wsfacturacion
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function Facturar(ByVal usuario As String, ByVal total As Double, ByVal descuento As Double, ByVal idcliente As Integer,
                             ByVal diascredito As Integer, ByVal listproductos As List(Of productos), ByVal listpagos As List(Of pagos),
                             ByVal efectivo As Double, ByVal cheques As Double, ByVal tarjeta As Double, ByVal valorExcencion As Double,
                             ByVal valorCertificado As Double, ByVal valorCredito As Double, ByVal cotizacion As String) As String
        Dim result As String

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
            Dim data() As String = ObtenerSerie(usuario).Split("|")
            Dim serie As String = data(0).Trim()
            Dim idcorrelativo As Integer = Integer.Parse(data(1))

            Dim validaciones As wsvalidaciones = New wsvalidaciones()


            If validaciones.validarSerieFecha(idcorrelativo) Then
                Dim eliminaDoc1 As String = "FACE66"
                Dim eliminaDoc2 As String = "FACE63"
                Dim eliminaDoc3 As String = serie & "001"
                Dim retornoData As String() = Factura_Autoimpresor(serie, idcorrelativo).Split("|")
                Dim siguiente As Integer = ObtenerSiguienteCorrelativo(idcorrelativo)
                Dim firma As String = retornoData(0)
                Dim cae = retornoData(1)


                total = total - descuento

                Dim totalsiniva As Double = total / 1.12
                Dim iva As Double = totalsiniva * 0.12

                Dim empresa As String = "SELECT id_empresa  FROM  [USUARIO] where USUARIO = '" & usuario & "'"
                Dim sucursal As String = "SELECT id_sucursal  FROM  [USUARIO] where USUARIO = '" & usuario & "'"

                'INSERCION DE LA FACTURA
                Dim str1 As String = "INSERT INTO  [ENC_FACTURA]([USUARIO],[id_empresa],[Serie_Fact],[Fecha],[firma],[Cae],[Total_Factura],[Iva_Factura],[Total_sin_iva],[Total_Descuento],[Id_Clt],[dias_cred],[id_suc],[efectivo],[cheques],[tarjeta],[valorExcencion],[valorCertificado],[valorCredito],[cotizacion],[id_correlativo]) " &
                    "VALUES('" & usuario & "', (" & empresa & "),'" & serie & "',GETDATE(),'" & firma & "','" & cae & "'," & total & "," & Math.Round(iva, 2) & "," & Math.Round(totalsiniva, 2) & "," & descuento & "," & idcliente & "," & diascredito & ", (" & sucursal & ")," & efectivo & "," & cheques & "," & tarjeta & "," & valorExcencion & "," & valorCertificado & "," & valorCredito & ",'" & cotizacion & "', " & idcorrelativo & ")"

                'ejecuto primer comando sql
                comando.CommandText = str1
                comando.ExecuteNonQuery()

                'OBTENEMOS ID DE LA FACTURA
                comando.CommandText = "SELECT @@IDENTITY"
                Dim id As Integer = comando.ExecuteScalar()


                'INSERTAMOS RECIVO
                Dim strRecivo As String = "INSERT INTO  [ENC_RECIBO] ([fecha],[Id_Clt],[Usuario],[empresa],[sucursal],[estado]) " &
                    " VALUES(GETDATE()," & idcliente & ",'" & usuario & "',(" & empresa & "),(" & sucursal & "),1);"

                comando.CommandText = strRecivo
                comando.ExecuteNonQuery()

                'OBTENEMOS ID DE RECIVO
                comando.CommandText = "SELECT @@IDENTITY"
                Dim idRecivo As Integer = comando.ExecuteScalar()


                'INSERTAMOS EL RECIVO EN LA FACTURA
                Dim strFac_RECIVO As String = "INSERT INTO  [DET_RECIBO_FACT]([idRecibo],[id_enc],[abonado]) " &
                    "VALUES(" & idRecivo & "," & id & "," & (total - valorCredito) & ");"

                comando.CommandText = strFac_RECIVO
                comando.ExecuteNonQuery()

                'INSERCION DEL DETALLE DE LA FACTURA
                For Each item As productos In listproductos

                    Dim sql_cantidad As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & item.id & " And id_bod = " & item.bodega

                    Dim Rs As SqlDataReader

                    'ejecuto primer comando sql
                    comando.CommandText = sql_cantidad
                    Rs = comando.ExecuteReader()
                    Rs.Read()

                    Dim existencia_actual As Integer = Rs(0)
                    Rs.Close()


                    Dim diferencia As Integer = existencia_actual - item.cantidad

                    If item.estandar = 1 And Not item.tipoArt = 2 Then
                        If diferencia < 0 Then
                            Dim cant_prod As Integer = item.cantidad - existencia_actual

                            existencia_actual = existencia_actual + cant_prod


                            Dim sql_prod As String = "INSERT INTO [ENC_ORDEN_PRODUCION]([fecha],[usuario],[id_combo],[estado],[tipo],cantidad) VALUES(GETDATE(),'" & usuario & "'," & item.id & ",1," & 1 & "," & cant_prod & ")"


                            'ejecuto primer comando sql
                            comando.CommandText = sql_prod
                            comando.ExecuteNonQuery()



                            'OBTENEMOS ID DE LA FACTURA
                            comando.CommandText = "SELECT @@IDENTITY"
                            Dim id_prod As Integer = comando.ExecuteScalar()

                            For Each prod As productosProduccion In item.produccion

                                'INSERTA LOS DATOS 
                                Dim sql2_prod As String = "INSERT INTO [DET_ORDEN_PRODUCCION]([id_enc],[id_art],[precio],[cantidad],[estado]) VALUES(" & id_prod & "," & prod.id & "," & prod.precio & "," & prod.cantidad & ",1)"
                                Dim bo As Integer = ObtenerBodega(usuario)


                                Dim sql_cantidad2 As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & prod.id & " And id_bod = " & prod.bodega

                                Dim Rs2 As SqlDataReader

                                'ejecuto primer comando sql
                                comando.CommandText = sql_cantidad2
                                Rs2 = comando.ExecuteReader()
                                Rs2.Read()

                                Dim cantidad As Integer = Rs2(0)
                                Rs2.Close()




                                Dim sql3_prod As String = ""
                                sql3_prod = "UPDATE  [Existencias] SET Existencia_Deta_Art =  " & cantidad - (prod.cantidad * cant_prod) & " WHERE [Id_Bod] = " & bo & " and   Id_Art = " & prod.id & "; "


                                'ejecuto segundo comando sql
                                comando.CommandText = sql2_prod
                                comando.ExecuteNonQuery()


                                'ejecuto tercero comando sql
                                comando.CommandText = sql3_prod
                                comando.ExecuteNonQuery()

                            Next

                        End If
                    ElseIf Not item.tipoArt = 2 Then

                        Dim cant_prod As Integer = item.cantidad
                        existencia_actual = existencia_actual + item.cantidad
                        Dim sql_prod As String = "INSERT INTO [ENC_ORDEN_PRODUCION]([fecha],[usuario],[id_combo],[estado],[tipo],cantidad) VALUES(GETDATE(),'" & usuario & "'," & item.id & ",1," & 1 & "," & cant_prod & ")"


                        'ejecuto primer comando sql
                        comando.CommandText = sql_prod
                        comando.ExecuteNonQuery()



                        'OBTENEMOS ID DE LA FACTURA
                        comando.CommandText = "SELECT @@IDENTITY"
                        Dim id_prod As Integer = comando.ExecuteScalar()

                        For Each prod As productosProduccion In item.produccion
                            'INSERTA LOS DATOS 
                            Dim sql2_prod As String = "INSERT INTO [DET_ORDEN_PRODUCCION]([id_enc],[id_art],[precio],[cantidad],[estado]) VALUES(" & id_prod & "," & prod.id & "," & prod.precio & "," & prod.cantidad & ",1)"
                            Dim bo As Integer = ObtenerBodega(usuario)


                            Dim sql_cantidad2 As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & prod.id & " And id_bod = " & prod.bodega

                            Dim Rs2 As SqlDataReader

                            'ejecuto primer comando sql
                            comando.CommandText = sql_cantidad2
                            Rs2 = comando.ExecuteReader()
                            Rs2.Read()

                            Dim cantidad As Integer = Rs2(0)
                            Rs2.Close()




                            Dim sql3_prod As String = ""
                            sql3_prod = "UPDATE  [Existencias] SET Existencia_Deta_Art =  " & cantidad - (prod.cantidad * cant_prod) & " WHERE [Id_Bod] = " & bo & " and   Id_Art = " & prod.id & "; "


                            'ejecuto segundo comando sql
                            comando.CommandText = sql2_prod
                            comando.ExecuteNonQuery()


                            'ejecuto tercero comando sql
                            comando.CommandText = sql3_prod
                            comando.ExecuteNonQuery()
                        Next

                    End If


                    Dim totalsinivaDesc As Double = (item.cantidad * item.precio) / 1.12
                    Dim ivadesc As Double = totalsinivaDesc * 0.12

                    Dim str2 As String = "INSERT INTO  [DET_FACTURA] " &
                    "([id_enc],[Cantidad_Articulo],[Precio_Unit_Articulo],[Sub_Total],[Descuento],[Iva],[Total_Sin_Iva],[Total],[Id_Art],[costoPromedio],[Id_Bod])" &
                    "VALUES(" & id & "," & item.cantidad & "," & item.precio & "," & (item.cantidad * item.precio) & ",0.00," & Math.Round(ivadesc, 2) & "," & Math.Round(totalsinivaDesc, 2) & "," & Math.Round((item.cantidad * item.precio), 2) & "," & item.id & ", ROUND((select CONVERT(varchar,costo_art) from  [Articulo] where id_art = " & item.id & "),2)," & item.bodega & ");"



                    If Not item.tipoArt = 2 Then
                        str2 = str2 + " UPDATE  [Existencias] SET [Existencia_Deta_Art] = " & existencia_actual - item.cantidad & " WHERE Id_Bod = " & item.bodega & " and Id_Art = " & item.id
                    End If


                    comando.CommandText = str2
                    comando.ExecuteNonQuery()
                Next


                'INSERCION DEL DETALLE DEL RECIVO (METODOS DE PAGO)

                For Each item As pagos In listpagos

                    If Not item.fecha = "" Then
                        Dim fechaz As String() = item.fecha.Split("/")
                        item.fecha = fechaz(2) & "-" & fechaz(1) & "-" & fechaz(0)

                    Else
                        item.fecha = ""
                        item.cuenta = 0
                    End If


                    Dim StrPago As String = "INSERT INTO  [DET_RECIBO]([idRecibo],[tipoPago],[documento],[valor],[idBanco],[cuenta],[fecha]) " &
                        "VALUES(" & idRecivo & ",'" & item.tipo & "','" & item.informacion & "'," & item.valor - item.cambio & "," & item.banco & "," & item.cuenta & ",'" & item.fecha & "')"


                    comando.CommandText = StrPago
                    comando.ExecuteNonQuery()


                    If item.tipo = 8 Then
                        Dim strCupon As String = ""
                        If item.cambio = 0 Then
                            strCupon = "UPDATE  [DETA_CUPON] set saldo  = 0   WHERE estado  = 1 and id_cupon_detalle = " & item.extra
                        Else
                            strCupon = "UPDATE  [DETA_CUPON] set saldo  = " & item.valor - (item.valor - item.cambio) & "   WHERE estado  = 1 and id_cupon_detalle = " & item.extra
                        End If

                        comando.CommandText = strCupon
                        comando.ExecuteNonQuery()

                    End If

                Next

                Dim sql_corr As String = "UPDATE  [Correlativos] SET [Corr_Act] = " & siguiente & " WHERE id_correlativo = '" & idcorrelativo & "'"
                comando.CommandText = sql_corr
                comando.ExecuteNonQuery()


                transaccion.Commit()


                result = "SUCCESS| DATOS FACTURADOS EXITOSAMENTE|" & CrearPDF(usuario, listproductos, listpagos, descuento, serie, firma, cae, idcliente)


            Else
                result = "ERROR| LA SERIE A EXPIRADO O HA LLEGADO A SU LIMITE."
            End If

        Catch ex As Exception
            'MsgBox(ex.Message.ToString)
            transaccion.Rollback()
            result = "Error|" & ex.Message
        Finally
            conexion.Close()
        End Try

        Return result
    End Function


    <WebMethod()>
    Public Function FacturacionCopia(ByVal usuario As String, ByVal total As Double, ByVal descuento As Double, ByVal idcliente As Integer,
                             ByVal diascredito As Integer, ByVal listproductos As List(Of productos), ByVal listpagos As List(Of pagos),
                             ByVal efectivo As Double, ByVal cheques As Double, ByVal tarjeta As Double, ByVal valorExcencion As Double,
                             ByVal valorCertificado As Double, ByVal valorCredito As Double, ByVal serie As String, ByVal numero As Integer, ByVal fecha As String, ByVal estado As Integer) As String
        Dim result As String = ""

        Dim correlativo As Integer = ObtenerSerieCopia(usuario)


        Dim validacion As wsvalidaciones = New wsvalidaciones()

        If Not validacion.validarSerieFecha(correlativo) Then
            result = "ERROR| LA SERIE HA EXPIRADO O HA LLEGADO A SU LIMITE."
        ElseIf validarFactura(serie, numero) Then

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

                Dim fechasx As String() = fecha.Split("/")
                fecha = fechasx(2) & "-" & fechasx(1) & "-" & fechasx(0)

                Dim eliminaDoc1 As String = "FACE66"
                Dim eliminaDoc2 As String = "FACE63"
                Dim eliminaDoc3 As String = serie & "001"
                Dim retornoData As String() = Factura_AutoimpresorCopia(serie, numero).Split("|")
                Dim firma As String = retornoData(0)
                Dim cae = retornoData(1)


                total = total - descuento

                Dim totalsiniva As Double = total / 1.12
                Dim iva As Double = totalsiniva * 0.12

                Dim empresa As String = "SELECT id_empresa  FROM  [USUARIO] where USUARIO = '" & usuario & "'"
                Dim sucursal As String = "SELECT id_sucursal  FROM  [USUARIO] where USUARIO = '" & usuario & "'"

                'INSERCION DE LA FACTURA
                Dim str1 As String = "INSERT INTO  [ENC_FACTURA]([USUARIO],[id_empresa],[Serie_Fact],[Fecha],[firma],[Cae],[Total_Factura],[Iva_Factura],[Total_sin_iva],[Total_Descuento],[Id_Clt],[dias_cred],[id_suc],[efectivo],[cheques],[tarjeta],[valorExcencion],[valorCertificado],[valorCredito],[id_correlativo],[estado]) " &
                    "VALUES('" & usuario & "', (" & empresa & "),'" & serie & "','" & fecha & "','" & firma & "','" & cae & "'," & total & "," & Math.Round(iva, 2) & "," & Math.Round(totalsiniva, 2) & "," & descuento & "," & idcliente & "," & diascredito & ", (" & sucursal & ")," & efectivo & "," & cheques & "," & tarjeta & "," & valorExcencion & "," & valorCertificado & "," & valorCredito & ",'" & correlativo & "'," & estado & " )"

                'ejecuto primer comando sql
                comando.CommandText = str1
                comando.ExecuteNonQuery()

                'OBTENEMOS ID DE LA FACTURA
                comando.CommandText = "SELECT @@IDENTITY"
                Dim id As Integer = comando.ExecuteScalar()


                'INSERTAMOS RECIVO
                Dim strRecivo As String = "INSERT INTO  [ENC_RECIBO] ([fecha],[Id_Clt],[Usuario],[empresa],[sucursal],[estado]) " &
                    " VALUES(GETDATE()," & idcliente & ",'" & usuario & "',(" & empresa & "),(" & sucursal & "),1);"

                comando.CommandText = strRecivo
                comando.ExecuteNonQuery()

                'OBTENEMOS ID DE RECIVO
                comando.CommandText = "SELECT @@IDENTITY"
                Dim idRecivo As Integer = comando.ExecuteScalar()


                'INSERTAMOS EL RECIVO EN LA FACTURA
                Dim strFac_RECIVO As String = "INSERT INTO  [DET_RECIBO_FACT]([idRecibo],[id_enc],[abonado]) " &
                    "VALUES(" & idRecivo & "," & id & "," & (total - valorCredito) & ");"

                comando.CommandText = strFac_RECIVO
                comando.ExecuteNonQuery()

                'INSERCION DEL DETALLE DE LA FACTURA
                For Each item As productos In listproductos



                    Dim sql_cantidad As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & item.id & " And id_bod = " & item.bodega

                    Dim Rs As SqlDataReader

                    'ejecuto primer comando sql
                    comando.CommandText = sql_cantidad
                    Rs = comando.ExecuteReader()
                    Rs.Read()

                    Dim existencia_actual As Integer = Rs(0)
                    Rs.Close()


                    Dim diferencia As Integer = existencia_actual - item.cantidad

                    If item.estandar = 1 And Not item.tipoArt = 2 Then
                        If diferencia < 0 Then
                            Dim cant_prod As Integer = item.cantidad - existencia_actual

                            existencia_actual = existencia_actual + cant_prod


                            Dim sql_prod As String = "INSERT INTO [ENC_ORDEN_PRODUCION]([fecha],[usuario],[id_combo],[estado],[tipo],cantidad) VALUES(GETDATE(),'" & usuario & "'," & item.id & ",1," & 1 & "," & cant_prod & ")"


                            'ejecuto primer comando sql
                            comando.CommandText = sql_prod
                            comando.ExecuteNonQuery()



                            'OBTENEMOS ID DE LA FACTURA
                            comando.CommandText = "SELECT @@IDENTITY"
                            Dim id_prod As Integer = comando.ExecuteScalar()

                            For Each prod As productosProduccion In item.produccion

                                'INSERTA LOS DATOS 
                                Dim sql2_prod As String = "INSERT INTO [DET_ORDEN_PRODUCCION]([id_enc],[id_art],[precio],[cantidad],[estado]) VALUES(" & id_prod & "," & prod.id & "," & prod.precio & "," & prod.cantidad & ",1)"
                                Dim bo As Integer = ObtenerBodega(usuario)


                                Dim sql_cantidad2 As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & prod.id & " And id_bod = " & prod.bodega

                                Dim Rs2 As SqlDataReader

                                'ejecuto primer comando sql
                                comando.CommandText = sql_cantidad2
                                Rs2 = comando.ExecuteReader()
                                Rs2.Read()

                                Dim cantidad As Integer = Rs2(0)
                                Rs2.Close()




                                Dim sql3_prod As String = ""
                                sql3_prod = "UPDATE  [Existencias] SET Existencia_Deta_Art =  " & cantidad - (prod.cantidad * cant_prod) & " WHERE [Id_Bod] = " & bo & " and   Id_Art = " & prod.id & "; "


                                'ejecuto segundo comando sql
                                comando.CommandText = sql2_prod
                                comando.ExecuteNonQuery()


                                'ejecuto tercero comando sql
                                comando.CommandText = sql3_prod
                                comando.ExecuteNonQuery()

                            Next

                        End If
                    ElseIf Not item.tipoArt = 2 Then

                        Dim cant_prod As Integer = item.cantidad
                        existencia_actual = existencia_actual + item.cantidad
                        Dim sql_prod As String = "INSERT INTO [ENC_ORDEN_PRODUCION]([fecha],[usuario],[id_combo],[estado],[tipo],cantidad) VALUES(GETDATE(),'" & usuario & "'," & item.id & ",1," & 1 & "," & cant_prod & ")"


                        'ejecuto primer comando sql
                        comando.CommandText = sql_prod
                        comando.ExecuteNonQuery()



                        'OBTENEMOS ID DE LA FACTURA
                        comando.CommandText = "SELECT @@IDENTITY"
                        Dim id_prod As Integer = comando.ExecuteScalar()

                        For Each prod As productosProduccion In item.produccion
                            'INSERTA LOS DATOS 
                            Dim sql2_prod As String = "INSERT INTO [DET_ORDEN_PRODUCCION]([id_enc],[id_art],[precio],[cantidad],[estado]) VALUES(" & id_prod & "," & prod.id & "," & prod.precio & "," & prod.cantidad & ",1)"
                            Dim bo As Integer = ObtenerBodega(usuario)


                            Dim sql_cantidad2 As String = "Select Existencia_Deta_Art As cantidad from  Existencias where Id_Art = " & prod.id & " And id_bod = " & prod.bodega

                            Dim Rs2 As SqlDataReader

                            'ejecuto primer comando sql
                            comando.CommandText = sql_cantidad2
                            Rs2 = comando.ExecuteReader()
                            Rs2.Read()

                            Dim cantidad As Integer = Rs2(0)
                            Rs2.Close()




                            Dim sql3_prod As String = ""
                            sql3_prod = "UPDATE  [Existencias] SET Existencia_Deta_Art =  " & cantidad - (prod.cantidad * cant_prod) & " WHERE [Id_Bod] = " & bo & " and   Id_Art = " & prod.id & "; "


                            'ejecuto segundo comando sql
                            comando.CommandText = sql2_prod
                            comando.ExecuteNonQuery()


                            'ejecuto tercero comando sql
                            comando.CommandText = sql3_prod
                            comando.ExecuteNonQuery()
                        Next

                    End If




                    Dim totalsinivaDesc As Double = (item.cantidad * item.precio) / 1.12
                    Dim ivadesc As Double = totalsinivaDesc * 0.12

                    Dim str2 As String = "INSERT INTO  [DET_FACTURA] " &
                        "([id_enc],[Cantidad_Articulo],[Precio_Unit_Articulo],[Sub_Total],[Descuento],[Iva],[Total_Sin_Iva],[Total],[Id_Art],[costoPromedio],[Id_Bod])" &
                        "VALUES(" & id & "," & item.cantidad & "," & item.precio & "," & (item.cantidad * item.precio) & ",0.00," & Math.Round(ivadesc, 2) & "," & Math.Round(totalsinivaDesc, 2) & "," & Math.Round((item.cantidad * item.precio), 2) & "," & item.id & ", ROUND((select CONVERT(varchar,costo_art) from  [Articulo] where id_art = " & item.id & "),2)," & item.bodega & ");"



                    If Not item.tipoArt = 2 Then
                        str2 = str2 + " UPDATE  [Existencias] SET [Existencia_Deta_Art] = " & existencia_actual - item.cantidad & " WHERE Id_Bod = " & item.bodega & " and Id_Art = " & item.id
                    End If


                    comando.CommandText = str2
                    comando.ExecuteNonQuery()
                Next


                'INSERCION DEL DETALLE DEL RECIVO (METODOS DE PAGO)

                For Each item As pagos In listpagos

                    If Not item.fecha = "" Then
                        Dim fechaz As String() = item.fecha.Split("/")
                        item.fecha = fechaz(2) & "-" & fechaz(1) & "-" & fechaz(0)


                    Else
                        Dim x As Date = Date.Now()
                        item.fecha = x.Year() & "-" & x.Month() & "-" & x.Day()
                    End If


                    Dim StrPago As String = "INSERT INTO  [DET_RECIBO]([idRecibo],[tipoPago],[documento],[valor],[idBanco],[cuenta],[fecha]) " &
                        "VALUES(" & idRecivo & ",'" & item.tipo & "','" & item.informacion & "'," & item.valor - item.cambio & "," & item.banco & "," & item.cuenta & ",'" & item.fecha & "')"

                    comando.CommandText = StrPago
                    comando.ExecuteNonQuery()


                    If item.tipo = 8 Then
                        Dim strCupon As String = ""
                        If item.cambio = 0 Then
                            strCupon = "UPDATE  [DETA_CUPON] set saldo  = 0   WHERE estado  = 1 and id_cupon_detalle = " & item.extra
                        Else
                            strCupon = "UPDATE  [DETA_CUPON] set saldo  = " & item.valor - (item.valor - item.cambio) & "   WHERE estado  = 1 and id_cupon_detalle = " & item.extra
                        End If

                        comando.CommandText = strCupon
                        comando.ExecuteNonQuery()

                    End If



                Next


                Dim sql_fac As String = "UPDATE  [Correlativos] SET [Corr_Act] = " & numero & " WHERE Series = '" & serie & "' and id_empresa =  (select id_empresa from USUARIO where USUARIO = '" & usuario & "') "
                comando.CommandText = sql_fac
                comando.ExecuteNonQuery()

                transaccion.Commit()


                result = "SUCCESS| DATOS FACTURADOS EXITOSAMENTE|" & CrearPDF(usuario, listproductos, listpagos, descuento, serie, firma, cae, idcliente)


            Catch ex As Exception
                'MsgBox(ex.Message.ToString)
                transaccion.Rollback()
                result = "Error|" & ex.Message
            Finally
                conexion.Close()
            End Try
        Else
            result = "Error|DATOS DE FACTURACION INCORRECTOS"
        End If


        Return result
    End Function


    Public Function validarFactura(ByVal serie As String, ByVal numero As Integer) As Boolean
        Dim sql As String = "Select count(*) As cantidad from Correlativos c where c.Series = '" & serie & "' and c.Corr_Act = ( " & numero & " - 1)  and " & numero & " < c.Fact_fin and Doc = 3"

        Dim result As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            result = TablaEncabezado.Rows(i).Item("cantidad")
        Next

        If result = 0 Then
            Return False

        ElseIf result = 1 Then
            Return True

        Else
            Return False
        End If
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


    <WebMethod()>
    Public Function Reimprimir(ByVal id As Integer) As String
        Dim SQL As String = "SELECT TOP (1) [id_enc],[USUARIO] ,[id_empresa],[Serie_Fact],[Fecha],[Tipo_Pago],[firma],[Cae],[Total_Factura],[Iva_Factura],[Total_sin_iva],[Total_Descuento],[Id_Clt],[id_suc] FROM ENC_FACTURA WHERE id_enc =  " & id

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        Dim usuario As String = ""
        Dim serie As String = ""
        Dim firma As String = ""
        Dim cae As String = ""
        Dim descuento As Double = 0
        Dim idcliente As Integer = 0

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                usuario = TablaEncabezado.Rows(i).Item("USUARIO")
                serie = TablaEncabezado.Rows(i).Item("Serie_Fact")
                firma = TablaEncabezado.Rows(i).Item("firma")
                cae = TablaEncabezado.Rows(i).Item("Cae")
                descuento = TablaEncabezado.Rows(i).Item("Total_Descuento")
                idcliente = TablaEncabezado.Rows(i).Item("Id_Clt")
            Next
        Next
        Dim listprod As List(Of productos) = obtenerListProductos(id)
        Dim lispagos As List(Of pagos) = obtenerListPagos(id)
        Return CrearPDF(usuario, listprod, lispagos, descuento, serie, firma, cae, idcliente)

    End Function

    Public Function obtenerListProductos(ByVal idenc As Integer) As List(Of productos)
        Dim SQL As String = "SELECT c.Cantidad_Articulo,c.Precio_Unit_Articulo,c.Id_Art, a.cod_Art, a.Des_Art, b.Id_Bod,b.Nom_Bod FROM  [DET_FACTURA] c  INNER JOIN  [Articulo] a ON a.id_art = c.Id_Art INNER JOIN  [Bodegas] b ON b.Id_Bod = c.Id_Bod   where  id_enc = " & idenc

        Dim result As List(Of productos) = New List(Of productos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As productos = New productos()
            Elemento.id = TablaEncabezado.Rows(i).Item("Id_Art")
            Elemento.cantidad = TablaEncabezado.Rows(i).Item("Cantidad_Articulo")
            Elemento.precio = TablaEncabezado.Rows(i).Item("Precio_Unit_Articulo")
            Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
            Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
            Elemento.bo = TablaEncabezado.Rows(i).Item("Nom_Bod")
            Elemento.bodega = TablaEncabezado.Rows(i).Item("Id_Bod")
            result.Add(Elemento)
        Next

        Return result
    End Function

    Public Function obtenerListPagos(ByVal idenc As Integer) As List(Of pagos)
        Dim SQL As String = "select P.descripcion, R.valor,R.documento, R.tipoPago from DET_RECIBO_FACT DRF INNER JOIN DET_RECIBO R ON R.idRecibo = DRF.idRecibo Inner JOIN TipoPago P ON p.idtipoPago = R.tipoPago INNER JOIN DET_FACTURA	F ON F.id_enc = DRF.id_enc where F.id_enc  =  " & idenc

        Dim result As List(Of pagos) = New List(Of pagos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        For i = 0 To TablaEncabezado.Rows.Count - 1
            Dim Elemento As pagos = New pagos()
            Elemento.cambio = 0
            Elemento.valor = TablaEncabezado.Rows(i).Item("valor")
            Elemento.pago = TablaEncabezado.Rows(i).Item("valor")
            Elemento.informacion = TablaEncabezado.Rows(i).Item("documento")
            Elemento.tipoPagoText = TablaEncabezado.Rows(i).Item("descripcion")
            Elemento.tipo = TablaEncabezado.Rows(i).Item("tipoPago")
            result.Add(Elemento)
        Next

        Return result
    End Function


    <WebMethod()>
    Public Function ObtenerSerie(ByVal usuario As String) As String
        Dim SQL As String = "select top 1 Series,c.id_correlativo  from  [SUCURSALES] S INNER JOIN  [Correlativos] C ON c.id_correlativo = s.id_correlativo where id_suc = (select u.id_sucursal from   [USUARIO] u where USUARIO = '" & usuario & "')"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("Series") & "|" & TablaEncabezado.Rows(i).Item("id_correlativo")
            Next
        Next

        Return result.Trim()

    End Function

    <WebMethod()>
    Public Function ObtenerSerieCopia(ByVal usuario As String) As String
        Dim SQL As String = "select top 1 c.id_correlativo  from  [SUCURSALES] S INNER JOIN  [Correlativos] C ON c.id_correlativo = s.id_correlativoCopia where id_suc = (select u.id_sucursal from   [USUARIO] u where USUARIO = '" & usuario & "')"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("id_correlativo")
            Next
        Next

        Return result.Trim()

    End Function

    <WebMethod()>
    Public Function CrearPDF(ByVal usuario As String, ByVal listproductos As List(Of productos), ByVal listpagos As List(Of pagos), ByVal descuento As Double, ByVal Serie As String, ByVal firma As String, ByVal cae As String, ByVal idcliente As Integer) As String
        Dim result As String = ""
        Try

            Dim doc As Document = New iTextSharp.text.Document(iTextSharp.text.PageSize.LETTER, 5, 5, 5, 5)
            Dim datafecha As Date = Now
            Dim nombredoc As String = "pdf\factura" & Serie & firma & ".pdf"
            Dim pd As PdfWriter = PdfWriter.GetInstance(doc, New FileStream(Server.MapPath("~\vista\" & nombredoc), FileMode.Create))
            result = nombredoc
            doc.AddTitle("FACTURA ")
            doc.AddAuthor("")
            doc.AddCreationDate()

            doc.Open()

            Dim PARRAFO_ESPACIO As Paragraph = New Paragraph(" ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD))
            PARRAFO_ESPACIO.Alignment = Element.ALIGN_CENTER

            Dim d As datos = obtenerDatosEmpresa(usuario)

            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)



            Dim RutaImagen As String = Server.MapPath("~")
            Dim Imagen As Image = Image.GetInstance(RutaImagen & "\img\logo.png")

            Imagen.ScalePercent(30) 'escala al tamaño de la imagen
            Imagen.SetAbsolutePosition(25, 690)

            doc.Add(Imagen)

            Dim Tabla As PdfPTable = New PdfPTable(3)

            Tabla.TotalWidth = 550.0F
            Tabla.LockedWidth = True
            Tabla.SetWidths({33, 33, 34})

            Dim Celda As PdfPCell = New PdfPCell


            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 14, iTextSharp.text.Font.BOLD)))
            Celda.Colspan = 1
            Celda.BorderWidth = 0
            Celda.HorizontalAlignment = Element.ALIGN_LEFT
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(d.descripcionextra, FontFactory.GetFont("Arial", 14, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("VENTA DE MERCADERIA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)



            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(d.descripcion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(d.direccion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Date.Now, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(" ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(d.nit, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(usuario, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 1
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Tabla.AddCell(Celda)


            doc.Add(Tabla)
            doc.Add(PARRAFO_ESPACIO)



            Dim dp As datos = obtenerDatosCliente(idcliente)

            Dim TablaCliente As PdfPTable = New PdfPTable(2)

            TablaCliente.TotalWidth = 550.0F
            TablaCliente.LockedWidth = True
            TablaCliente.SetWidths({20, 80})

            Celda = New PdfPCell(New Paragraph("NIT: ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_JUSTIFIED
            TablaCliente.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(dp.nit, FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthBottom = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_JUSTIFIED
            TablaCliente.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("NOMBRE: ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthBottom = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_JUSTIFIED
            TablaCliente.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(dp.descripcion, FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthBottom = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_JUSTIFIED
            TablaCliente.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("DIRECCION: ", FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_JUSTIFIED
            TablaCliente.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(dp.direccion, FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_JUSTIFIED
            TablaCliente.AddCell(Celda)



            'AGREGAMOS LA TABLA DE DATOS DEL PROVEEDOR
            doc.Add(TablaCliente)
            doc.Add(PARRAFO_ESPACIO)




            Dim TablaDatos As PdfPTable = New PdfPTable(6)

            TablaDatos.TotalWidth = 550.0F
            TablaDatos.LockedWidth = True
            TablaDatos.SetWidths({15, 35, 14, 20, 8, 8})

            Celda = New PdfPCell(New Paragraph("CODIGO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("NOMBRE", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("BODEGA", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("CANTIDAD", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("PRECIO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("SUB-TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaDatos.AddCell(Celda)


            Dim total As Double = 0

            For Each item As productos In listproductos
                Celda = New PdfPCell(New Paragraph(item.codigo, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.descripcion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.cantidad, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_CENTER
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.bo, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(Format(item.precio, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_RIGHT
                TablaDatos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(Format(item.precio * item.cantidad, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_RIGHT
                TablaDatos.AddCell(Celda)


                total += item.precio * item.cantidad

            Next


            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("SUB-TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Format(total, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_RIGHT
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("DESCUENTO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Format(descuento, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_RIGHT
            TablaDatos.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            TablaDatos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph(Format(total - descuento, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 0
            Celda.BorderWidthRight = 1
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_RIGHT
            TablaDatos.AddCell(Celda)

            doc.Add(TablaDatos)

            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)


            Dim PARRAFO_INFO As Paragraph = New Paragraph(" INFORMACION DE PAGO ", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL))
            PARRAFO_INFO.Alignment = Element.ALIGN_CENTER
            doc.Add(PARRAFO_INFO)
            doc.Add(PARRAFO_ESPACIO)
            doc.Add(PARRAFO_ESPACIO)
            Dim TablaPagos As PdfPTable = New PdfPTable(5)

            TablaPagos.TotalWidth = 550.0F
            TablaPagos.LockedWidth = True
            TablaPagos.SetWidths({25, 25, 17, 16, 17})

            Celda = New PdfPCell(New Paragraph("FORMA DE PAGO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("DESCRIPCION", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("VALOR", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("CAMBIO", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph("SUB-TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Dim total_pago As Double = 0


            For Each item As pagos In listpagos
                Celda = New PdfPCell(New Paragraph(item.tipoPagoText, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.HorizontalAlignment = Element.ALIGN_RIGHT
                TablaPagos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(item.informacion, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaPagos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(Format(item.valor, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_RIGHT
                TablaPagos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(Format(item.cambio, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 0
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_LEFT
                TablaPagos.AddCell(Celda)

                Celda = New PdfPCell(New Paragraph(Format(item.valor - item.cambio, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.NORMAL)))
                Celda.BorderWidth = 1
                Celda.BorderWidthTop = 0
                Celda.BorderWidthRight = 1
                Celda.Colspan = 0
                Celda.HorizontalAlignment = Element.ALIGN_RIGHT
                TablaPagos.AddCell(Celda)

                total_pago += item.valor - item.cambio

            Next

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("TOTAL", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)

            Celda = New PdfPCell(New Paragraph("--", FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_CENTER
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)


            Celda = New PdfPCell(New Paragraph(Format(total_pago, "##,###.00"), FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD)))
            Celda.BorderWidth = 1
            Celda.BorderWidthTop = 1
            Celda.BorderWidthRight = 0
            Celda.Colspan = 0
            Celda.HorizontalAlignment = Element.ALIGN_RIGHT
            Celda.BackgroundColor = New iTextSharp.text.BaseColor(195, 199, 200)
            TablaPagos.AddCell(Celda)


            doc.Add(TablaPagos)

            Dim PARRAFO_SERIE As Paragraph = New Paragraph(Serie & "-" & firma, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD))
            PARRAFO_SERIE.Alignment = Element.ALIGN_CENTER
            doc.Add(PARRAFO_SERIE)
            PARRAFO_SERIE = New Paragraph(cae, FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD))
            PARRAFO_SERIE.Alignment = Element.ALIGN_CENTER
            doc.Add(PARRAFO_SERIE)



            doc.Close()


        Catch ex As Exception
            result = ex.Message
        End Try

        Return result
    End Function


    <WebMethod()>
    Public Function obtenerDatosEmpresa(ByVal usuario As String) As datos
        Dim SQL As String = "SELECT  top 1 [id_empresa],[nombre],[nombre_comercial],[direccion],[nit]  FROM  [ENCA_CIA] " &
            " where id_empresa = (select u.id_empresa from  [USUARIO] u where u.USUARIO = '" & usuario & "')"

        Dim result As datos = New datos()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        Dim Elemento As New datos
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                Elemento.id = TablaEncabezado.Rows(i).Item("id_empresa")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("nombre").ToString
                Elemento.descripcionextra = TablaEncabezado.Rows(i).Item("nombre_comercial").ToString
                Elemento.nit = TablaEncabezado.Rows(i).Item("nit").ToString
                Elemento.direccion = TablaEncabezado.Rows(i).Item("direccion").ToString
                ii = ii + 1
            Next
        Next

        Return Elemento

    End Function

    Public Function Factura_Autoimpresor(ByVal serie As String, ByVal correlativo As Integer) As String

        Dim siguienteTurno As Integer = ObtenerSiguienteCorrelativo(correlativo)

        Dim firma As String = siguienteTurno
        Dim cae As String = "FACTURACION-LOCAL"

        Return firma & "|" & cae

    End Function

    Public Function Factura_AutoimpresorCopia(ByVal serie As String, ByVal numero As String) As String


        'Dim siguienteTurno As String = ObtenerSiguienteCorrelativo(correlativo)

        'Dim firma As String = "FACEXC-" & serie & siguienteTurno
        'Dim cae As String = "FACTURA-LOCAL"

        'Return firma & "|" & cae

        Dim firma As String = numero
        Dim cae As String = "FACTURACION-LOCAL"

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
    Public Function ObtenerValorDelCupon(ByVal serie As String, ByVal idcliente As Integer) As String
        Dim SQL As String = "SELECT d.saldo, d. id_cupon_detalle FROM  [DETA_CUPON] d  INNER JOIN  [ENCA_CUPON] EC On EC.id_cupon = d.id_cupon  WHERE d.estado  = 1 And d.saldo > 0 And d.serie = '" & serie & "'  and EC.idcliente  = " & idcliente

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        result = "ERROR|ERROR PUEDA QUE NO EXISTA EL CUPON, NO POSEA SALDO O EL CLIENTE SEA INCORRECTO"
        For i = 0 To TablaEncabezado.Rows.Count - 1
            result = "SUCCESS|" & TablaEncabezado.Rows(i).Item("saldo").ToString & "|" & TablaEncabezado.Rows(i).Item("id_cupon_detalle").ToString
        Next

        Return result

    End Function

    <WebMethod()>
    Public Function obtenerDatosCliente(ByVal id As Integer) As datos
        Dim SQL As String = "SELECT Id_Clt,nit_clt,Nom_clt,Dire_Clt FROM  [CLiente] WHERE Id_Clt = " & id

        Dim result As datos = New datos()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)
        Dim Elemento As New datos
        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                Elemento.id = TablaEncabezado.Rows(i).Item("Id_Clt")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Nom_clt").ToString
                Elemento.direccion = TablaEncabezado.Rows(i).Item("Dire_Clt").ToString
                Elemento.nit = TablaEncabezado.Rows(i).Item("nit_clt").ToString
                ii = ii + 1
            Next
        Next

        Return Elemento

    End Function

    <WebMethod()>
    Public Function ObtenerBodega(ByVal usuario As String) As Integer
        Dim SQL As String = "select Id_Bod from  Bodegas  where id_suc = (select id_sucursal from USUARIO where USUARIO = '" & usuario & "') and principal = 1 "

        Dim result As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            result = TablaEncabezado.Rows(i).Item("Id_Bod")
        Next

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
        Public tipo As Integer
        Public tipoArt As Integer
        Public estandar As Integer
        Public produccion As IList(Of productosProduccion)
    End Class



    Public Class productosProduccion
        Public idcombo As Integer
        Public id As Integer
        Public cantidad As Integer
        Public bo As String
        Public bodega As Integer
        Public precio As Double
        Public descripcion As String
        Public codigo As String
        Public miselaneo As Integer
    End Class


    Public Class pagos
        Public tipo As Integer
        Public valor As Double
        Public informacion As String
        Public tipoPagoText As String
        Public cambio As Double
        Public extra As Integer
        Public pago As Double
        Public fecha As String
        Public banco As Integer
        Public cuenta As Integer
    End Class

    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public descripcionextra As String
        Public direccion As String
        Public nit As String
    End Class


End Class