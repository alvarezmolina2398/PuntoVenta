Imports System.Data
Imports System.Data.SqlClient
Imports System.Drawing
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports IronBarCode

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsadmin_articulos
    Inherits System.Web.Services.WebService

    'accion para obtener las bodegas
    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)
        Dim SQL As String = "SELECT a.miselaneo, a.id_art,a.cod_Art,a.Des_Art,a.id_tipo,a.id_marca,a.id_clasi,a.costo_art,isnull(a.precio1,0.00) precio1, isnull(a.cod_pro2,' ') cod_pro2, isnull(a.cod_pro1,' ') cod_pro1, " &
            "a.idColor,isnull(a.precio2,0.00) precio2,isnull(a.precio3,0.00) precio3,isnull(a.id_SubMarca,0) id_SubMarca " &
            ",isnull(a.id_Subclasi,0) id_Subclasi, c.descripcionColor, a.requiereProduccion" &
            " FROM  [Articulo] a " &
            " INNER JOIN  [COLOR] c on c.idColor = a.idColor where a.estado = 1 "

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
                Elemento.tipo = TablaEncabezado.Rows(i).Item("id_tipo")
                Elemento.idmarca = TablaEncabezado.Rows(i).Item("id_marca")
                Elemento.idclasificacion = TablaEncabezado.Rows(i).Item("id_clasi")
                Elemento.costo = TablaEncabezado.Rows(i).Item("costo_art")
                Elemento.precioGt = TablaEncabezado.Rows(i).Item("precio1")
                Elemento.precioEs = TablaEncabezado.Rows(i).Item("precio2")
                Elemento.precio3 = TablaEncabezado.Rows(i).Item("precio3")
                Elemento.codigo1 = TablaEncabezado.Rows(i).Item("cod_pro1")
                Elemento.codigo2 = TablaEncabezado.Rows(i).Item("cod_pro2")
                Elemento.idcolor = TablaEncabezado.Rows(i).Item("idColor")
                Elemento.idsubmarca = TablaEncabezado.Rows(i).Item("id_SubMarca")
                Elemento.id_Subclasificacion = TablaEncabezado.Rows(i).Item("id_Subclasi")
                Elemento.color = TablaEncabezado.Rows(i).Item("descripcionColor")
                Elemento.producir = TablaEncabezado.Rows(i).Item("requiereProduccion")
                Elemento.miselaneo = TablaEncabezado.Rows(i).Item("miselaneo")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result

    End Function

    'accion para obtener las bodegas
    <WebMethod()>
    Public Function ObtenerArticulosCompuestos() As List(Of datos)
        Dim SQL As String = "SELECT a.id_art,a.cod_Art,a.Des_Art,a.id_tipo,a.id_marca,a.id_clasi,a.costo_art,isnull(a.precio1,0.00) precio1, isnull(a.cod_pro2,' ') cod_pro2, isnull(a.cod_pro1,' ') cod_pro1, " &
            "a.idColor,isnull(a.precio2,0.00) precio2,isnull(a.precio3,0.00) precio3,isnull(a.id_SubMarca,0) id_SubMarca " &
            ",isnull(a.id_Subclasi,0) id_Subclasi, c.descripcionColor" &
            " FROM  [Articulo] a " &
            " INNER JOIN  [COLOR] c on c.idColor = a.idColor where a.estado = 1 and  a.requiereProduccion = 1 "

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_art")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("Des_Art")
                Elemento.codigo = TablaEncabezado.Rows(i).Item("cod_Art")
                Elemento.tipo = TablaEncabezado.Rows(i).Item("id_tipo")
                Elemento.idmarca = TablaEncabezado.Rows(i).Item("id_marca")
                Elemento.idclasificacion = TablaEncabezado.Rows(i).Item("id_clasi")
                Elemento.costo = TablaEncabezado.Rows(i).Item("costo_art")
                Elemento.precioGt = TablaEncabezado.Rows(i).Item("precio1")
                Elemento.precioEs = TablaEncabezado.Rows(i).Item("precio2")
                Elemento.precio3 = TablaEncabezado.Rows(i).Item("precio3")
                Elemento.codigo1 = TablaEncabezado.Rows(i).Item("cod_pro1")
                Elemento.codigo2 = TablaEncabezado.Rows(i).Item("cod_pro2")
                Elemento.idcolor = TablaEncabezado.Rows(i).Item("idColor")
                Elemento.idsubmarca = TablaEncabezado.Rows(i).Item("id_SubMarca")
                Elemento.id_Subclasificacion = TablaEncabezado.Rows(i).Item("id_Subclasi")
                Elemento.color = TablaEncabezado.Rows(i).Item("descripcionColor")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result

    End Function

    'Metodo para Guardar Los datos
    <WebMethod()>
    Public Function Insertar(ByVal descripcion As String, ByVal codigo As String, ByVal tipo As Integer, ByVal cod_pro1 As String, ByVal cod_pro2 As String, ByVal marca As Integer,
                             ByVal idsubmarca As Integer, ByVal id_clasi As Integer, ByVal id_subclasi As Integer, ByVal idcolor As Integer, ByVal preciogt As Double, ByVal precio3 As Double, ByVal precioEs As Double,
                             ByVal costo As Double, ByVal usuario As String, ByVal requiereProduccion As Integer, ByVal codigobarras As Integer, miselaneo As Integer) As String



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
            If validarMisielaneo(miselaneo, codigo) Then
                'consulta sql
                Dim sql As String = "INSERT INTO   [Articulo] (cod_Art,Des_Art,id_tipo,cod_pro1,cod_pro2,id_marca,id_SubMarca,id_clasi,id_Subclasi,idColor,precio1,precio2,precio3,costo_art,usuario,Estado,requiereProduccion,miselaneo)  " &
                    "VALUES('" & codigo & "', '" & descripcion & "'," & tipo & ",'" & cod_pro1 & "','" & cod_pro2 & "'," & marca & "," & idsubmarca & "," & id_clasi & "," & id_subclasi & "," & idcolor &
                    "," & preciogt & "," & precioEs & "," & precio3 & ", " & costo & ", '" & usuario & "',1," & requiereProduccion & "," & miselaneo & ");"



                'ejecuto primer comando sql
                comando.CommandText = sql
                comando.ExecuteNonQuery()

                'OBTENEMOS ID DE LA FACTURA
                comando.CommandText = "SELECT @@IDENTITY"
                Dim id As Integer = comando.ExecuteScalar()




                Dim sql_bodegas As String = "select Id_Bod  from  Bodegas b where  b.estado = 1 "
                Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(sql_bodegas)

                For i = 0 To TablaEncabezado.Rows.Count - 1
                    Dim Sql2 As String = "INSERT INTO  [Existencias]([Id_Bod],[Id_Art],[Existencia_Deta_Art]) VALUES(" & TablaEncabezado.Rows(i).Item("Id_Bod") & ", " & id & ",0); "

                    'ejecuto primer comando sql
                    comando.CommandText = Sql2
                    comando.ExecuteNonQuery()

                Next
                transaccion.Commit()
                result = "SUCCESS|Datos Insertador Correctamente."

                If codigobarras = 1 Then
                    result += "|" & crearBarcode(codigo)
                End If
            Else
                result = "ERROR|YA EXISTE UN PRODUCTO CON LA NOMINACION DE MISELANEO"
            End If

        Catch ex As Exception
            transaccion.Rollback()
            result = "ERROR|" & ex.Message()
        Finally
            conexion.Close()
        End Try

        Return result
    End Function

    Private Function validarMisielaneo(miselaneo As Integer, ByVal codigo As String) As Boolean


        If miselaneo = 0 Then
            Return True
        Else
            If ObtenerCantidadMiselaneos(codigo) <= 0 Then
                Return True
            Else
                Return False
            End If
        End If


    End Function


    <WebMethod()>
    Public Function ObtenerCantidadMiselaneos(ByVal codido As String) As Integer
        Dim SQL As String = "SELECT count(cod_art) as cantidad, cod_art FROM  Articulo where miselaneo = 1 and estado =1  GROUP BY cod_art"

        Dim result As Integer = 0
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            If codido = TablaEncabezado.Rows(i).Item("cod_art") Then
                result = 0
            Else
                result = TablaEncabezado.Rows(i).Item("cantidad")
            End If
        Next

        Return result

    End Function

    'Metodo para Actualizar Los datos
    <WebMethod()>
    Public Function Actualizar(ByVal descripcion As String, ByVal codigo As String, ByVal tipo As Integer, ByVal cod_pro1 As String, ByVal cod_pro2 As String, ByVal marca As Integer,
                             ByVal idsubmarca As Integer, ByVal id_clasi As Integer, ByVal id_subclasi As Integer, ByVal idcolor As Integer, ByVal preciogt As Double, ByVal precioEs As Double,
                             ByVal costo As Double, ByVal usuario As String, ByVal id As Integer, ByVal precio3 As Double, ByVal requiereProduccion As Integer, ByVal codigobarras As Integer, ByVal miselaneo As Integer) As String
        'consulta sql
        Dim sql As String = "UPDATE   [Articulo] set cod_Art = '" & codigo & "',Des_Art = '" & descripcion & "',id_tipo = " & tipo & ",cod_pro1 = '" & cod_pro1 & "',cod_pro2 = '" & cod_pro2 &
            "',id_marca = " & marca & ",id_SubMarca = " & idsubmarca & ",id_clasi = " & id_clasi & ",id_Subclasi = " & id_subclasi & ",idColor = " & idcolor & ",precio1 = " & preciogt & ", precio2=" & precioEs &
            ",costo_art = " & costo & ", usuario = '" & usuario & "', precio3 = " & precio3 & ", requiereProduccion = " & requiereProduccion & ", miselaneo = " & miselaneo & " where id_art = " & id



        Dim result As String = ""

        If validarMisielaneo(miselaneo, codigo) Then
            'ejecuta el query a travez de la clase manipular 
            If (manipular.EjecutaTransaccion1(sql)) Then
                result = "SUCCESS|Datos Actualizados Correctamente"

                If codigobarras = 1 Then
                    result += "|" & crearBarcode(codigo)
                End If
            Else
                result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
            End If
        Else
            result = "ERROR|YA EXISTE UN PRODUCTO CON LA NOMINACION DE MISELANEO"
        End If



        Return result
    End Function


    'Metodo para Eliminar Los datos
    <WebMethod()>
    Public Function Inhabilitar(ByVal id As Integer) As String
        'consulta sql
        Dim sql As String = "UPDATE   [Articulo] set estado = 0 where id_art = " & id


        Dim result As String = ""


        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Actualizados Correctamente"
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result
    End Function

    Public Function crearBarcode(ByVal codigoCrear As String) As String

        'Dim BarcodeBmp As Bitmap = BarcodeWriter.CreateBarcode(codigoCrear, BarcodeEncoding.Code128).AddAnnotationTextAboveBarcode(codigoCrear).ResizeTo(800, 400).SetMargins(300).ToBitmap()



        Dim retorno As String = "pdf\codigoBarra" & codigoCrear & ".jpg"



        'BarcodeBmp.Save(Server.MapPath(retorno))



        Dim barCode As String = codigoCrear



        Dim codigo As BarcodeLib.Barcode = New BarcodeLib.Barcode

        codigo.IncludeLabel = True

        Dim image As Image = codigo.Encode(BarcodeLib.TYPE.CODE128, barCode, Color.Black, Color.White, 400, 100)

        Dim rectangleAreaToDrawImage As Rectangle = New Rectangle(88, 400, 200, 100)



        image.Save(Server.MapPath(retorno))

        Return retorno

    End Function

    <WebMethod()>
    Public Function ObtenerCodigoMiselaneo() As String
        Dim SQL As String = "SELECT cod_art FROM  Articulo where miselaneo = 1 and estado =1 ;"

        Dim result As String = ""
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1

                result = TablaEncabezado.Rows(i).Item("cod_art")
            Next
        Next

        Return result.Trim()

    End Function



    <WebMethod()>
    Public Function AgregarImagen(ByVal img As String, ByVal id_art As Integer, ByVal principal As Integer) As String
        Dim sql As String = ""

        If principal = 1 Then
            sql = "UPDATE logo_Imagen Set principal = 0 where id_art = " & id_art & " ; "
        End If

        sql = sql & " INSERT INTO logo_Imagen([id_art],[principal],[img],[estado])VALUES(" & id_art & "," & principal & ",'" & img & "',1)"

        Dim result As String = ""

        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|IMAGEN AGREGADA  EXITOSAMENTE"

        Else
            result = "ERROR|HA SUCCESIDO ALGUN ERROR"
        End If



        Return result
    End Function

    <WebMethod()>
    Public Function ActualizarPrincipal(ByVal id_art As Integer, ByVal id_img As Integer) As String
        Dim sql As String = ""
        sql = "UPDATE logo_Imagen Set principal = 0 where id_art = " & id_art & " ;UPDATE logo_Imagen Set principal = 1 where id_img = " & id_img & " ; "

        Dim result As String = ""

        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|IMAGEN CAMBIADA A PRINCIPAL  EXITOSAMENTE"

        Else
            result = "ERROR|HA SUCCESIDO ALGUN ERROR"
        End If



        Return result
    End Function


    <WebMethod()>
    Public Function EliminarImagen(ByVal id_img As Integer) As String
        Dim sql As String = ""
        sql = "UPDATE logo_Imagen Set estado = 0 where id_img = " & id_img & " ; "

        Dim result As String = ""

        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|IMAGEN ELIMINADA  EXITOSAMENTE"

        Else
            result = "ERROR|HA SUCCESIDO ALGUN ERROR"
        End If



        Return result
    End Function



    <WebMethod()>
    Public Function MostrarCatalogo(ByVal id As Integer) As List(Of catalogo)
        Dim consulta As String = "SELECT id_img,img,principal FROM logo_Imagen where id_art = " & id & " and estado = 1; "

        Dim result As List(Of catalogo) = New List(Of catalogo)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(consulta)

        For i = 0 To TablaEncabezado.Rows.Count - 1

            Dim Elemento As New catalogo
            Elemento.id = TablaEncabezado.Rows(i).Item("id_img")
            Elemento.img = TablaEncabezado.Rows(i).Item("img")
            Elemento.principal = TablaEncabezado.Rows(i).Item("principal")

            result.Add(Elemento)
        Next

        Return result

    End Function


    Public Class catalogo
        Public img As String
        Public id As Integer
        Public principal As Integer
    End Class

    Public Class datos
        Public id As Integer
        Public codigo As String
        Public descripcion As String
        Public tipo As Integer
        Public idmarca As Integer
        Public idclasificacion As Integer
        Public precioGt As Double
        Public precio3 As Double
        Public costo As Double
        Public codigo1 As String
        Public codigo2 As String
        Public idcolor As Integer
        Public precioEs As Double
        Public color As String
        Public idsubmarca As Integer
        Public id_Subclasificacion As Integer
        Public producir As Integer
        Public miselaneo As Integer
    End Class

End Class