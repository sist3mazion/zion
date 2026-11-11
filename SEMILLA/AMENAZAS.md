# Modelo de amenazas

Borrador para revisar con alguien que conozca el terreno y con un auditor. Dice qué protege Semilla, qué no, y por qué está hecha así.

## A quién protege y de qué

La persona que **lleva** el archivo en su teléfono, en un lugar donde tener una Biblia puede traerle problemas.

| Situación | ¿Protege? | Cómo |
|---|---|---|
| Alguien coge el teléfono y abre el archivo | **Sí** | Ve un bloc de notas que funciona. No hay botón, menú ni texto que sugiera otra cosa |
| Alguien busca palabras religiosas dentro del archivo | **Sí** | El texto, los nombres de los libros y los menús del lector van cifrados. En claro solo hay palabras de una app de notas |
| Un programa compara el archivo con una lista de archivos prohibidos (por huella) | **Sí** | Cada copia tiene sal, cifrado y tamaño distintos: no hay dos iguales |
| Se vigila el tráfico de red del teléfono | **Sí** | El archivo no hace ninguna conexión, y prohíbe al navegador hacerlas |
| Te sorprenden leyendo | **En parte** | ✕, Atrás o cambiar de aplicación devuelven a las notas en el acto. No evita que hayan visto la pantalla |
| Un analista con tiempo examina el archivo sin la clave | **En parte** | No puede leer el contenido ni saber qué es. Sí ve que el archivo contiene un bloque cifrado grande |

## De qué NO protege

Hay que decírselo con claridad a quien lo reciba.

- **De alguien que conoce esta herramienta.** El código es público. Quien lo haya estudiado reconocerá el archivo por su programa, aunque no pueda abrirlo. Semilla resiste listas de huellas y búsquedas de palabras; no resiste un detector hecho a medida.
- **De que te obliguen a dar la clave.** No hay clave falsa ni contenido señuelo.
- **De una clave débil.** Con el archivo en la mano se pueden probar claves sin límite. Cada intento cuesta 600 000 rondas de PBKDF2; una clave de cuatro cifras cae enseguida con una tarjeta gráfica; tres palabras al azar, no.
- **De un teléfono intervenido.** Si hay un programa espía, ve la pantalla y lo que se teclea.
- **Del teclado.** La clave se escribe en un campo de búsqueda normal. Se le pide al teclado que no sugiera ni corrija, pero algunos teclados aprenden lo que se escribe. Conviene comprobar en el teléfono real que la clave no aparece luego como sugerencia.
- **De los rastros del sistema.** El nombre del archivo en «Descargas», el historial del navegador («Notas») y la miniatura de aplicaciones recientes quedan fuera del control del archivo.
- **De quien te lo pasó.** Si esa persona es detenida y conoce tu clave, la conoce.
- **De una copia trampa.** Alguien puede repartir un archivo modificado que parezca igual. En el teléfono no hay forma de distinguirlo; quien reparte sí puede comprobarlo con `verificar.js` antes de pasarlo.

## Decisiones y motivos

**Sin esteganografía.** Esconder datos en imágenes da una sensación de seguridad que no se sostiene: el contenedor PNG de ZION se reconoce por su estructura, y en mis pruebas (con fotos sintéticas) el «Enlace en Foto» se detecta con un cálculo sencillo sin conocer la contraseña. Un archivo que parece una app de notas y no se puede leer es más honesto y más fácil de explicar.

**Sin autodestrucción.** El archivo no puede borrarse a sí mismo del teléfono; una pantalla negra con un «sistema detenido» llama más la atención que unas notas. Cerrar es volver a las notas, nada más.

**Sin red.** Ni fuentes, ni enlaces, ni descargas, ni tráfico de camuflaje. El tráfico señuelo hacia una lista fija de dominios identifica a quien lo usa. La política de contenido del archivo es `default-src 'none'` y solo admite el script y los estilos cuyo hash lleva escrito.

**Texto y no PDF.** Casi nueve veces menos peso, se abre al instante, se puede buscar y ajustar la letra, y no arrastra un visor de PDF de un megabyte.

**La copia cambia de clave.** Quien pasa el archivo elige una clave nueva para el siguiente. Así ninguna copia es igual a otra y cada persona solo conoce su clave y las que ella misma ha dado.

**Criptografía del navegador, sin inventar nada.** PBKDF2-SHA256 (600 000 rondas) y AES-256-GCM de WebCrypto. No hay implementación propia de ningún algoritmo de cifrado. El único código «propio» sensible es un descompresor de reserva, que se ejecuta después de verificar la autenticidad del contenido.

## El origen

Cómo llega la primera copia a un país es el punto más delicado y no lo resuelve el archivo.

- Una copia publicada en internet con clave conocida **sí** es identificable por su huella. Solo sirve como origen para quien reparte desde un lugar seguro.
- Quien reparte debe generar copias con claves propias (con `generar.js`, o con «Pasar una copia» desde una que ya tenga) antes de que entren en zona de riesgo.
- Vías sin red para pasarla: tarjeta microSD, cable, Bluetooth, «Compartir con dispositivos cercanos».

## Para quien audite

**Formato.** `base64( sal[16] ‖ iv[12] ‖ AES-256-GCM(clave, iv, contenido) )`, con `clave = PBKDF2-HMAC-SHA256(frase en NFC, sal, 600 000, 32 bytes)`. Sin cabecera, firma ni versión en claro. Sal e IV salen de `crypto.getRandomValues` y se renuevan en cada copia.

**Contenido.** `u32le(n) ‖ cabecera JSON[n] ‖ un bloque zlib por libro ‖ cola aleatoria de 0–65 535 bytes`. La cola solo sirve para variar el tamaño.

**Dónde mirar.**

- `src/app.js`, entre `/* <core> */` y `/* </core> */`: todo el cifrado y el ensamblado. Es el mismo código que usa el generador.
- `enter()`: único punto donde se prueba una clave. `lock()`: sobrescribe con ceros el contenido descifrado y vacía el lector.
- `assemble()`: la copia reutiliza literalmente el script, los estilos y la política del archivo original; solo cambia el bloque cifrado.
- La posición de lectura se guarda cifrada con la misma clave. Las notas y las preferencias de aspecto se guardan en claro: son la portada.

**Puntos débiles que ya conozco.**

- PBKDF2 es más barato de atacar con GPU que Argon2 o scrypt, que WebCrypto no ofrece.
- JavaScript no garantiza el borrado de memoria: las cadenas ya creadas (texto del capítulo en pantalla, índice de búsqueda) las libera el recolector cuando quiere.
- El programa es idéntico en todas las copias; solo varía el bloque cifrado.
- La clave pasa por un campo de texto visible.
- El tamaño del archivo, aun con la cola aleatoria, delata el orden de magnitud del contenido.
