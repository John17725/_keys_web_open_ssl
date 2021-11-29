# 🚩Pasos para la generacion de llaves con OPENSSL para un sitio web
---
## Credenciales para accesar a la maquina virtual
- User: seguridad
- Password: root
---
## Pasos para generar las credenciales y certificados con OpenSSL
### Primero debemos ubicarnos en la carpeta que contiene el sitio web que serviremos con HTTPS
```
$ cd ~/Documentos/_keys_web_open_ssl/
```
## Paso 1 generar primero el .key 
Para esto ejecuten el siguiente comando, tomen en cuenta que el nombre antes del .test.key puede ser un nombre cualquiera no necesariamente el del ejemplo
```
$ sudo openssl genrssa -out pruebaseguridad.test.key
```
Esto nos generara un archivo con el nombre ``` pruebaseguridad.test.key ``` el cual contiene una llave con alfanumericos

![image](https://user-images.githubusercontent.com/51938997/143799386-b0f057d7-76d4-4099-9a06-c218406fb126.png)

## Paso 2 generar el certificado (CSR) que por sus siglas significa ``` Certificate Signing Request ```
Basicamente es un bloque de texto cifrado que normalmente es generado en el servidor donde el certificado SSL será utilizado, teniendo en cuenta esto procederemos a ejecutar el siguiente comando
Es importante que identifiquemos para que nos sirven los parameros a continuacion especificaremos para que nos sirve cada uno
- req: crea y procesa principalmente solicitudes de certificado en formato PKCS
- -new: especificamos que es una llave nueva
- -key: especificamos el nombre del fichero que contiene la key generada anteriormente
- -out: especificamos el nombre de salida del fichero .csr a generar en este caso es ``` pruebaseguridad.test.csr ```
```
$ sudo openssl req -new -key pruebaseguridad.test.key -out pruebaseguridad.test.csr
```
Al ejecutar este comando nos pedira datos de identidad que van ligados al certificado que tenemos que generar los datos que pueden ingresar son como los que se muestran a continuacion
```
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:MX
State or Province Name (full name) [Some-State]:MEXICO
Locality Name (eg, city) []:MEXICO
Organization Name (eg, company) [Internet Widgits Pty Ltd]:seguridadtesjo S.A de C.V
Organizational Unit Name (eg, section) []:Departamento de despliegues
Common Name (e.g. server FQDN or YOUR name) []:despliegue.test
Email Address []:seguridadtesjo@tesjo.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:root
An optional company name []:root
```
## Paso 3 Firmar el certificado generado
Finalmente para obtener el ultimo fichero que es el que mas nos interesa ejecutaremos el siguiente comando
De igual forma como en el paso anterior es importante saber de que forma nos ayudan los parametros que contiene el comando
- x509: Genera un objeto de solicitud de certificacion
- -req: Crea y procesa principalmente solicitudes de certificado en formato PKCS
- -days: Asigna un tiempo de vida del certificado en este caso especificamos 1 año en dias
- -in: Especificamos el csr, que contiene los datos de la identidad.
- -signkey: Especificamos el origen de la llave del certificado
- -out: Especificamos el nombre de salida del certificado con extension .crt
```
$ sudo openssl x509 -req -days 365 -in pruebaseguridad.test.csr -signkey pruebaseguridad.test.key -out pruebaseguridad.test.crt
```
## Como penultimo paso debemos tener 3 ficheros generados pero de los cuales solo usaremos 2, ``` el .crt y .key ``` como se muestra en la siguiente imagen debemos tenerlos en el directorio de ``` ~/Documentos/_keys_web_open_ssl/ ```

![image](https://user-images.githubusercontent.com/51938997/143801913-db41b2ac-0ef1-4038-8e4a-6b7e3cacdcd7.png)

## Finalmente para correr el sitio debemos modificar el archivo ``` index.js ``` y solo agregar el nombre de los ficheros en el apartado de cert y key
Con la herramienta de nano editaremos rapidamente este segmento de codigo
Ejecutamos el comando

``` sudo nano  index.js ```

```
const express = require("express")
const fs = require("fs");
const https = require("https");

var app = express();

const port = 3000;

https.createServer({
	cert: fs.readFileSync('AQUI VA EL NOMBRE DEL .CRT'),
	key: fs.readFileSync('AQUI VA EL NOMBRE DEL .KEY')
}, app).listen(port, function(){
	console.log('Server runnig',port);
});

app.get('/', function(req, res){
	res.send("Hola estas en la pagina principal");
	console.log("Peticion GET recibida")
})
```
## Guardamos los cambios del fichero con ``` CTRL + O ``` y nos salimos con ``` CTRL + X ```
---
### Consultamos la ip de nuestra maquina virtual con ``` ifconfig ```
### Lanzamos el servidor con ``` sudo npm start ```

## Y en nuestra consola debemos ver algo similar a la ilustracion que se muestra a continuacion

![image](https://user-images.githubusercontent.com/51938997/143802548-7cc7097f-9293-4e8a-b38a-ddb5898f4c68.png)

