Imports System.Data
Imports System.Drawing
Imports System.IO
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols

' Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class wsadmin_empresas
    Inherits System.Web.Services.WebService




    <WebMethod()>
    Public Function ObtenerDatos() As List(Of datos)
        Dim SQL As String = "SELECT [id_empresa],[nombre],[nombre_comercial],[id_depto],[id_municipio],[direccion],[tel1],[actividad],[tipo_pago],[nit],[no_establecimiento],[registro_merca],[no_registro_merca],convert(varchar,f_constitucion_cia,103) as f_constitucion_cia ,convert(varchar,fecha_registro_mercantil,103) as fecha_registro_mercantil   FROM ENCA_CIA where estado  = 1"

        Dim result As List(Of [datos]) = New List(Of datos)()
        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        For i = 0 To TablaEncabezado.Rows.Count - 1
            For ii = 0 To 1
                Dim Elemento As New datos
                Elemento.id = TablaEncabezado.Rows(i).Item("id_empresa")
                Elemento.descripcion = TablaEncabezado.Rows(i).Item("nombre").ToString
                Elemento.nombrecomercial = TablaEncabezado.Rows(i).Item("nombre_comercial").ToString
                Elemento.iddep = TablaEncabezado.Rows(i).Item("id_depto")
                Elemento.idmun = TablaEncabezado.Rows(i).Item("id_municipio")
                Elemento.direccion = TablaEncabezado.Rows(i).Item("direccion").ToString
                Elemento.telefono = TablaEncabezado.Rows(i).Item("tel1").ToString
                Elemento.actividad = TablaEncabezado.Rows(i).Item("actividad")
                Elemento.tipopago = TablaEncabezado.Rows(i).Item("tipo_pago")
                Elemento.nit = TablaEncabezado.Rows(i).Item("nit").ToString
                Elemento.noesta = TablaEncabezado.Rows(i).Item("no_establecimiento")
                Elemento.noregistro = TablaEncabezado.Rows(i).Item("no_registro_merca")
                Elemento.fecharegistro = TablaEncabezado.Rows(i).Item("fecha_registro_mercantil")
                Elemento.fechaconstitucion = TablaEncabezado.Rows(i).Item("f_constitucion_cia")
                result.Add(Elemento)
                ii = ii + 1
            Next
        Next

        Return result

    End Function

    'Metodo para Guardar Los datos
    <WebMethod()>
    Public Function Insertar(ByVal nombre As String, ByVal nombrecomercial As String, ByVal dep As Integer, ByVal mun As Integer, ByVal direccion As String, ByVal telefono As String, ByVal actividad As Integer, ByVal tipoPago As Integer, ByVal nit As String, ByVal noesta As Integer, ByVal noregistro As Integer, ByVal fechaCons As String, ByVal fecharegistro As String) As String

        Dim result As String = ""

        Dim fechaformat As String() = fechaCons.Split("/")

        fechaCons = fechaformat(2) & "-" & fechaformat(1) & "-" & fechaformat(0)

        fechaformat = fecharegistro.Split("/")

        fecharegistro = fechaformat(2) & "-" & fechaformat(1) & "-" & fechaformat(0)

        'consulta sql
        Dim sql As String = "INSERT INTO [ENCA_CIA] ([nombre],[nombre_comercial],[id_depto],[id_municipio],[direccion],[tel1],[actividad],[tipo_pago],[nit],[no_establecimiento],[no_registro_merca],[f_constitucion_cia],[fecha_registro_mercantil],[estado]) " &
            " VALUES('" & nombre & "','" & nombrecomercial & "'," & dep & ", " & mun & ",'" & direccion & "','" & telefono & "', " & actividad & ", " & tipoPago & ",'" & nit & "','" & noesta & "','" & noregistro & "','" & fechaCons & "','" & fecharegistro & "',1);"

        Dim id As Integer = manipular.EjecutaTransaccion_devolverid(sql)
        'ejecuta el query a travez de la clase manipular 
        If (Not id = 0) Then
            Dim sql_config As String = "INSERT INTO [dbo].[Config_empresa]([id_empresa],[estado],[limite_credito_cliente],[controlar_existencia],[impuesto],[bloqueo_documentos])VALUES(" & id & ",1,1,1,12,1,'NOMBRE','ERP')"
            manipular.EjecutaTransaccion1(sql_config)
            result = "SUCCESS|Datos Insertador Correctamente."
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result
    End Function



    'Metodo para Actualizar Los datos
    <WebMethod()>
    Public Function Actualizar(ByVal nombre As String, ByVal nombrecomercial As String, ByVal dep As Integer, ByVal mun As Integer, ByVal direccion As String, ByVal telefono As String, ByVal actividad As Integer, ByVal tipoPago As Integer, ByVal nit As String, ByVal noesta As Integer, ByVal noregistro As Integer, ByVal fechaCons As String, ByVal fecharegistro As String, ByVal id As Integer) As String

        Dim result As String = ""

        Dim fechaformat As String() = fechaCons.Split("/")

        fechaCons = fechaformat(2) & "-" & fechaformat(1) & "-" & fechaformat(0)

        fechaformat = fecharegistro.Split("/")

        fecharegistro = fechaformat(2) & "-" & fechaformat(1) & "-" & fechaformat(0)

        'consulta sql
        Dim sql As String = "UPDATE [ENCA_CIA] set nombre = '" & nombre & "',nombre_comercial = '" & nombrecomercial & "',id_depto= " & dep & ",id_municipio= " & mun & ",direccion= '" & direccion & "',tel1= '" & telefono & "',actividad= " & actividad & ",tipo_pago= " & tipoPago & ",nit= '" & nit & "',no_establecimiento= " & noesta & ",no_registro_merca= " & noregistro & ",f_constitucion_cia= '" & fechaCons & "',fecha_registro_mercantil= '" & fecharegistro & "' where id_empresa = " & id



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
        Dim sql As String = "UPDATE [ENCA_CIA] set   estado = 0 where id_empresa = " & id


        Dim result As String = ""


        'ejecuta el query a travez de la clase manipular 
        If (manipular.EjecutaTransaccion1(sql)) Then
            result = "SUCCESS|Datos Actualizados Correctamente"
        Else
            result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
        End If


        Return result
    End Function



    <WebMethod()>
    Public Function DetConfiguracion(ByVal idempresa As Integer) As configuracion
        Dim c As configuracion = New configuracion()

        Dim SQL As String = "SELECT id_validacion,limite_credito_cliente,controlar_existencia,impuesto,bloqueo_documentos, ISNULL(nombre1,'ERP') nombre1 " &
            ", ISNULL(nombre2,'NOMBRE') nombre2 FROM Config_empresa where id_empresa = " & idempresa & " and estado = 1"


        Dim TablaEncabezado As DataTable = manipular.ObtenerDatos(SQL)

        c.id = TablaEncabezado.Rows(0).Item("id_validacion")
        c.limite = TablaEncabezado.Rows(0).Item("limite_credito_cliente")
        c.documento = TablaEncabezado.Rows(0).Item("bloqueo_documentos")
        c.existencia = TablaEncabezado.Rows(0).Item("controlar_existencia")
        c.impuesto = TablaEncabezado.Rows(0).Item("impuesto")
        c.nombre1 = TablaEncabezado.Rows(0).Item("nombre1")
        c.nombre2 = TablaEncabezado.Rows(0).Item("nombre2")


        Return c
    End Function

    <WebMethod()>
    Public Function ActualizarDetalle(ByVal id As Integer, ByVal limite As Integer, ByVal existencia As Integer, ByVal impuesto As Integer, ByVal documento As Integer, ByVal archivo As String, ByVal nombre1 As String, ByVal nombre2 As String) As String
        'consulta sql
        Dim sql As String = "Update Config_empresa set nombre1 = '" & nombre1 & "', nombre2='" & nombre2 & "', limite_credito_cliente = " & limite & ",controlar_existencia = " & existencia & " ,impuesto = " & impuesto & ",bloqueo_documentos = " & documento & "  where id_validacion = " & id
        Dim result As String = ""
        Try


            Dim carpeta As String = Server.MapPath("~\img\logo-" & id)

            If Not archivo = "" Then

                If Not Directory.Exists(carpeta) Then
                    My.Computer.FileSystem.CreateDirectory(carpeta)
                End If


                If File.Exists(carpeta & "/logo.png") Then
                    File.Delete(carpeta & "/logo.png")
                End If


                Dim image As Byte() = Convert.FromBase64String(Replace(archivo, "data:image/png;base64,", ""))

                Dim camino As String = Path.Combine(carpeta, "logo.png")

                Dim fs = New FileStream(camino, FileMode.CreateNew, FileAccess.Write)
                Dim bw = New BinaryWriter(fs)
                bw.Write(image)
                fs.Close()

            End If



        Catch ex As Exception
            result = "ERROR|" & ex.Message
        Finally
            'ejecuta el query a travez de la clase manipular 
            If (manipular.EjecutaTransaccion1(sql)) Then
                result = "SUCCESS|Datos Actualizados Correctamente"
            Else
                result = "ERROR|Sucedio Un error, Por Favor Comuníquese con el Administrador. "
            End If
        End Try


        Return result
    End Function

    Public Class configuracion
        Public id As Integer
        Public limite As Integer
        Public documento As Integer
        Public existencia As Integer
        Public impuesto As Double
        Public nombre1 As String
        Public nombre2 As String
    End Class

    Public Class datos
        Public id As Integer
        Public descripcion As String
        Public nombrecomercial As String
        Public iddep As Integer
        Public idmun As Integer
        Public direccion As String
        Public telefono As String
        Public actividad As Integer
        Public tipopago As Integer
        Public nit As String
        Public noesta As Integer
        Public noregistro As String
        Public fechaconstitucion As String
        Public fecharegistro As String
    End Class

End Class