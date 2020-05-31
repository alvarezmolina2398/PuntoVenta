Imports System.Data
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsvalidaciones
    Inherits System.Web.Services.WebService

    <WebMethod()>
    Public Function validarLimiteCredito(ByVal usuario As String, ByVal cliente As Integer, ByVal valor As Double) As Boolean
        Dim result As Boolean = False


        Dim existevalidacion As String = "SELECT limite_credito_cliente FROM Config_empresa where id_empresa = (Select id_empresa from USUARIO where USUARIO = '" & usuario & "')"


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            existeValidacionResult = TablaEncabezado.Rows(i).Item("limite_credito_cliente")
        Next

        If existeValidacionResult = 0 Then
            result = True
        Else

            Dim clientelimitesql As String = "select Limite_Credito  from CLiente where Id_Clt = " & cliente & ";"


            Dim limite As Integer = 0
            Dim TablaEncabezado2 As DataTable = manipular.ObtenerDatos(clientelimitesql)

            For i = 0 To TablaEncabezado2.Rows.Count - 1

                limite = TablaEncabezado2.Rows(i).Item("Limite_Credito")
            Next


            If limite = 0 Then
                result = False
            Else
                Dim credito As Double
                Dim valoralcanzado As String = "SELECT  valor - recibos saldos FROM (  " &
                    "SELECT  SUM(df.Sub_Total) valor, ISNULL((SELECT SUM(abonado) FROM DET_RECIBO_FACT WHERE id_enc = ef.id_enc), 0) recibos  " &
                    "FROM ENC_FACTURA ef   " &
                    "INNER JOIN DET_FACTURA df on ef.id_enc = df.id_enc    " &
                    "INNER JOIN CLiente c on ef.Id_Clt = c.Id_Clt   " &
                    " WHERE c.Id_Clt =  2 and ef.estado = 1  " &
                    " group by ef.id_enc " &
                    ") fac WHERE valor > recibos;"


                Dim TablaEncabezado3 As DataTable = manipular.ObtenerDatos(valoralcanzado)

                For i = 0 To TablaEncabezado3.Rows.Count - 1

                    credito += TablaEncabezado3.Rows(i).Item("saldos")
                Next



                Dim comanda As String = "SELECT Total_factura FROM  [ENCA_RESERVA] WHERE estado = 1 and id_Ctl =  " & cliente

                Dim comandaval As Double = 0
                Dim TablaEncabezado4 As DataTable = manipular.ObtenerDatos(comanda)

                For i = 0 To TablaEncabezado4.Rows.Count - 1

                    comandaval += TablaEncabezado4.Rows(i).Item("Total_factura")
                Next


                credito = credito + valor + comandaval



                If credito > limite Then
                    result = False
                Else
                    result = True
                End If

            End If
        End If

        Return result
    End Function



    <WebMethod()>
    Public Function validarDocumentosCredito(ByVal usuario As String, ByVal cliente As Integer) As Boolean
        Dim result As Boolean = False


        Dim existevalidacion As String = "SELECT bloqueo_documentos FROM Config_empresa where id_empresa = (Select id_empresa from USUARIO where USUARIO = '" & usuario & "')"


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            existeValidacionResult = TablaEncabezado.Rows(i).Item("bloqueo_documentos")
        Next



        If existeValidacionResult = 0 Then
            result = True
        Else

            Dim clientelimitesql As String = "select Limite_Credito  from CLiente where Id_Clt = " & cliente & ";"


            Dim limite As Integer = 0
            Dim TablaEncabezado2 As DataTable = manipular.ObtenerDatos(clientelimitesql)

            For i = 0 To TablaEncabezado2.Rows.Count - 1

                limite = TablaEncabezado2.Rows(i).Item("Limite_Credito")
            Next


            If limite = 0 Then
                result = False
            Else
                Dim dias As Double
                Dim valoralcanzado As String = "SELECT  count(Fecha) as dias FROM ( " &
                "SELECT DATEDIFF(day,Getdate(),DATEADD(day,(select c.Dias_Credito from CLiente c where c.Id_Clt = " & cliente & "),ef.Fecha)) Fecha, SUM(df.Sub_Total) valor, ISNULL((SELECT SUM(abonado) FROM DET_RECIBO_FACT WHERE id_enc = ef.id_enc), 0) recibos " &
                "FROM ENC_FACTURA ef " &
                "INNER JOIN DET_FACTURA df on ef.id_enc = df.id_enc  " &
                "INNER JOIN CLiente c on ef.Id_Clt = c.Id_Clt " &
                " WHERE c.Id_Clt =  " & cliente & " and ef.estado = 1 " &
                " group by ef.id_enc, Fecha " &
                ")fac WHERE valor > recibos and Fecha < 0;"


                Dim TablaEncabezado3 As DataTable = manipular.ObtenerDatos(valoralcanzado)

                For i = 0 To TablaEncabezado3.Rows.Count - 1

                    dias = TablaEncabezado3.Rows(i).Item("dias")
                Next

                If dias > 0 Then
                    result = False
                Else
                    result = True
                End If

            End If
        End If

        Return result
    End Function


    <WebMethod()>
    Public Function ValidarFechaVEncimiento(ByVal serie As String, ByVal numero As String) As Boolean
        Dim result As Boolean = False


        Dim existevalidacion As String = "SELECT isnull(count(*),0) as cantidad FROM ENC_RECIBO where serie = '" & serie & "' and numero = '" & numero & "'"


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        existeValidacionResult = TablaEncabezado.Rows(0).Item("cantidad")



        If existeValidacionResult = 0 Then
            result = True
        Else
            result = False
        End If
        Return result
    End Function

    <WebMethod()>
    Public Function validarResolucion(ByVal resolucion As String, ByVal id As Integer) As Boolean
        Dim result As Boolean = False

        Dim existevalidacion As String = ""
        If Not id = 0 Then
            existevalidacion = "Select isnull(count(*), 0) cantidad FROM Correlativos where Autorizacion = '" & resolucion & "' and id_correlativo <> " & id
        Else
            existevalidacion = "Select isnull(count(*), 0) cantidad FROM Correlativos where Autorizacion = '" & resolucion & "' "
        End If

        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        existeValidacionResult = TablaEncabezado.Rows(0).Item("cantidad")

        If existeValidacionResult = 0 Then
            result = True
        Else
            result = False
        End If
        Return result
    End Function


    <WebMethod()>
    Public Function validarSerie(ByVal serie As String, ByVal id As Integer, ByVal company As Integer, ByVal del As Integer, ByVal al As Integer) As Boolean
        Dim result As Boolean = False

        Dim existevalidacion As String = ""
        If Not id = 0 Then
            existevalidacion = "Select isnull(count(*), 0) cantidad FROM Correlativos where Series = '" & serie & "' and id_empresa = " & company & " and (Fact_inic = " & del & " and Fact_fin = " & al & ") and id_correlativo <> " & id
        Else
            existevalidacion = "Select isnull(count(*), 0) cantidad FROM Correlativos where Series = '" & serie & "' and (Fact_inic = " & del & " and Fact_fin = " & al & ") and id_empresa =  " & company
        End If




        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        existeValidacionResult = TablaEncabezado.Rows(0).Item("cantidad")

        If existeValidacionResult = 0 Then
            result = True
        Else
            result = False
        End If
        Return result
    End Function

    <WebMethod()>
    Public Function validarSerieFecha(ByVal serie As Integer) As Boolean
        Dim result As Boolean = False

        Dim existevalidacion As String = "SELECT case when fechavencimiento < cast(GETDATE() as date) then 0 ELSE 1 END as result  FROM Correlativos where id_correlativo = " & serie & ";"


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        existeValidacionResult = TablaEncabezado.Rows(0).Item("result")



        If existeValidacionResult = 0 Then
            result = False
        Else

            Dim sql2 As String = "SELECT case when Corr_Act = Fact_fin then 0 ELSE 1 END as result  FROM Correlativos where id_correlativo = " & serie & ";"

            Dim TablaEncabezado2 As DataTable = manipular.ObtenerDatos(sql2)

            Dim existeValidacionResult2 = TablaEncabezado2.Rows(0).Item("result")

            If existeValidacionResult2 = 0 Then
                result = False
            Else
                result = True
            End If

        End If
        Return result
    End Function



    <WebMethod()>
    Public Function validarSerieExisteCorrelativo(ByVal serie As Integer, ByVal final As Integer) As Boolean
        Dim result As Boolean = False

        Dim existevalidacion As String = "SELECT case when max(Fact_fin) >  " & final & " then 1 else 0 end as result  from Correlativos where id_serie  =  " & serie


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        existeValidacionResult = TablaEncabezado.Rows(0).Item("result")



        If existeValidacionResult = 0 Then
            result = False
        Else

            result = True
        End If
        Return result
    End Function


    'accion para validar que la  devolucion sea a una factura ya existente
    <WebMethod()>
    Public Function validarFacturaCompra(ByVal serie As String, ByVal numero As String, ByVal proveedor As Integer) As Boolean

        Dim result As Boolean = False
        Dim sql As String = "select count(*) cantidad from enc_compra_exterior where facturas = '" & serie & "' and facturan = '" & numero & "' and idproveedor = " & proveedor


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)


        existeValidacionResult = TablaEncabezado.Rows(0).Item("cantidad")

        If existeValidacionResult = 0 Then
            result = False
        Else

            result = True
        End If
        Return result


    End Function



    'accion para obtener la  empresa
    <WebMethod()>
    Public Function obtenerEmpresa(ByVal usuario As String) As String

        Dim result As String = ""
        Dim sql As String = "SELECT nombre FROM ENCA_CIA where id_empresa = (select id_empresa from USUARIO where  USUARIO = '" & usuario & "');"



        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        result = TablaEncabezado.Rows(0).Item("nombre")


        Return result
    End Function

    'accion para obtener la  empresa
    <WebMethod()>
    Public Function obtenerNombreEmpresa(ByVal usuario As String) As String

        Dim result As String = ""
        Dim sql As String = "select nombre1,nombre2 from Config_empresa where id_empresa = (select id_empresa from USUARIO where USUARIO = '" & usuario & "');"



        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)
        result = TablaEncabezado.Rows(0).Item("nombre1") & "|" & TablaEncabezado.Rows(0).Item("nombre2")


        Return result
    End Function

    'valida la existencia de producto
    <WebMethod()>
    Public Function validarexistencia(ByVal usuario As String, ByVal cantidad As Integer, ByVal idart As Integer, ByVal bodega As Integer) As Boolean
        Dim result As Boolean = False


        Dim existevalidacion As String = "SELECT controlar_existencia FROM Config_empresa where id_empresa = (Select id_empresa from USUARIO where USUARIO = '" & usuario & "')"


        Dim existeValidacionResult As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(existevalidacion)

        existeValidacionResult = TablaEncabezado.Rows(0).Item("controlar_existencia")



        If existeValidacionResult = 0 Then
            result = True
        Else
            Dim tipo As Integer = 0
            Dim miselaneo As Integer = 0
            Dim sqltipoArt As String = "select t.tipo, a.miselaneo from Articulo a inner join TIPOARTICULO t on a.id_tipo = t.idTipoLente where id_art = " & idart

            Dim TablatipoARt As DataTable = manipular.ObtenerDatos(sqltipoArt)
            tipo = TablatipoARt.Rows(0).Item("tipo")
            miselaneo = TablatipoARt.Rows(0).Item("miselaneo")



            If tipo = 2 Or miselaneo = 1 Then
                result = True
            Else
                Dim sql_existencia As String = "SELECT (e.Existencia_Deta_Art - isnull((SELECT isnull(sum(cantidad_articulo),0) as cantidad FROM DETA_RESERVA dr where dr.Id_Art = e.Id_Art  and dr.Id_Bod = e.Id_Bod and dr.estado = 1),0)) as cantidad FROM Existencias e where e.Id_Art = " & idart & " and e.Id_Bod = " & bodega & ";"


                Dim TablaEncabezado2 As DataTable = manipular.ObtenerDatos(sql_existencia)

                Dim existencia = TablaEncabezado2.Rows(0).Item("cantidad")

                If cantidad > existencia Then

                    result = False
                Else
                    result = True
                End If
            End If



        End If
        Return result
    End Function



    <WebMethod()>
    Public Function PermisoPagina(ByVal usuario As String, ByVal direccion As String) As Boolean
        Dim result As Boolean = False
        If direccion = "principal.html" Then
            result = True
        Else

            Dim sql As String = "select count(dm.id_deta) as cantidad from DET_ROLE d  " &
               " Join DETA_MENU dm " &
               " on dm.id_deta = d.id_detalle  " &
               " Join ENCA_MENU m " &
               " on m.id = dm.id_menu " &
               " Join ENC_ROLE r " &
               " on r.idRole = d.idRole " &
               " where r.idRole = (select idRole from USUARIO where USUARIO  = '" & usuario & "') and dm.direccion = '" & direccion & "'"


            Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql)


            If TablaEncabezado.Rows(0).Item("cantidad") = 0 Then
                result = False
            Else
                result = True
            End If
        End If



        Return result

    End Function
End Class


