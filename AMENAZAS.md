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
| Te sorprenden leyendo | **En parte** | ✕, apagar la pantalla o cambiar de aplicación devuelven a las notas en el acto (Atrás solo retrocede un nivel), tras 30 segundos sin tocar la pantalla vuelve solo, y agitar o girar bruscamente el móvil lo cierra al instante. No evita que hayan visto la pantalla |
| Un analista con tiempo examina el archivo sin la clave | **En parte** | No puede leer el contenido ni saber qué es. Sí ve que el archivo contiene un bloque cifrado grande y un programa que descifra (sin comentarios, pero con los nombres de las funciones del navegador y de Argon2id) |

## De qué NO protege

Hay que decírselo con claridad a quien lo reciba.

- **De alguien que conoce esta herramienta.** El código es público. Quien lo haya estudiado reconocerá el archivo por su programa, aunque no pueda abrirlo. Semilla resiste listas de huellas y búsquedas de palabras; no resiste un detector hecho a medida, y ese detector es barato: el programa es el mismo en todas las copias, así que basta buscar un trozo fijo de él (por ejemplo el hash de la política de seguridad) para encontrarlas todas. Cambiar el programa en cada copia no lo arreglaría sin perder la comprobación de que el programa es auténtico (`verificar.js`).
- **De que te obliguen a dar la clave.** No hay clave falsa ni contenido señuelo.
- **De una clave débil.** Con el archivo en la mano se pueden probar claves sin límite. Cada intento cuesta una derivación Argon2id con 64 MiB de memoria: una tarjeta gráfica de gama alta (RTX 4090) prueba unas 1 700 claves por segundo (con el PBKDF2 de antes eran unas 8 900). Una clave de cuatro cifras cae enseguida, y una frase adivinable también: quien persigue a cristianos probará primero versículos y frases religiosas. Cinco palabras elegidas al azar, no. El generador exige como mínimo 16 caracteres (los espacios cuentan), pero el mínimo no garantiza nada: lo que protege es el azar. Por eso «Pasar una copia» no deja inventar la clave: la pone siempre la app, 20 cifras al azar en grupos de cuatro (10²⁰ combinaciones, 66 bits; con mil tarjetas como esa se tardaría más de un millón de años en recorrer la mitad). Cifras porque todos los teclados las tienen y en todos los idiomas se dictan; una lista de palabras por idioma no se podía verificar en los 21 idiomas, y las letras latinas obligan a cambiar de teclado. La app trata igual las cifras de cualquier alfabeto (las 77 series de Unicode: árabe, persa, devanagari, bengalí, tibetano, birmano, de ancho completo, tailandés…) y, si la clave es solo de cifras, ignora espacios, guiones y puntos; el mínimo de 16 cuenta entonces solo las cifras. Es más difícil de memorizar que una frase: hay que volver a escribirla antes de crear la copia, para comprobar que se ha apuntado bien. No hay que apuntarla en una nota: las notas se guardan sin cifrar.
- **De un teléfono intervenido.** Si hay un programa espía, ve la pantalla y lo que se teclea.
- **Del teclado.** La clave se escribe en un campo de búsqueda normal. Se le pide al teclado que no sugiera ni corrija, pero algunos teclados aprenden lo que se escribe. Conviene comprobar en el teléfono real que la clave no aparece luego como sugerencia.
- **De los rastros del sistema.** El nombre del archivo en «Descargas», el historial del navegador («Notas») y la miniatura de aplicaciones recientes quedan fuera del control del archivo. El lector no deja nada en el almacenamiento del navegador: allí solo quedan las notas y las preferencias de aspecto, que son la portada.
- **De quien te lo pasó.** Si esa persona es detenida y conoce tu clave, la conoce.
- **De lo que queda en las aplicaciones de mensajería.** Si el archivo llega por WhatsApp o Telegram, el chat guarda el nombre del archivo, quién lo envió y cuándo, y la miniatura de esa app en «recientes» puede enseñarlo. Semilla no puede borrar nada de eso. Mejor pasarlo sin red (tarjeta, cable, Bluetooth) y borrar el mensaje.
- **De la miniatura de «recientes», en todos los teléfonos.** Android hace una foto de la pantalla al cambiar de aplicación. Semilla se cierra al perder el foco para que la foto muestre las notas; en el único teléfono probado llega a tiempo, pero una página web no puede garantizarlo. Lo seguro es cerrar con ✕ antes de salir.
- **De que el mismo archivo pase de mano en mano.** Cada copia hecha con «Pasar una copia» es única; un archivo reenviado tal cual a varias personas es idéntico en todas, y una lista de huellas (como las que usan los escáneres de teléfonos de Xinjiang) lo encuentra en todos. Una copia para cada persona.
- **De una copia trampa, ni de no saber si la primera copia es buena.** Ningún archivo puede demostrar por sí mismo que es auténtico: una trampa diría de sí misma lo mismo. En el teléfono no hay forma de distinguirlo. Por eso:
  - Quien recibe su primera copia depende de quien se la da. La comprueba quien reparte, con `verificar.js`, antes de pasarla.
  - Lo más importante es comprobar a quien va a **hacer** copias: una copia trampa contagia la trampa a todas las que se hagan desde ella.
  - Quien ya tiene una copia buena no necesita otra: no hay que aceptar «versiones nuevas» de nadie.
  - `verificar.js` reconoce todas las versiones publicadas del programa (`versiones.json`) y dice cuál lleva la copia. Hay que verificar con el repositorio actualizado: con una lista antigua, una copia legítima de una versión más nueva saldría «NO AUTÉNTICO». Una versión con aviso es auténtica, pero conviene sustituirla por una copia de la versión actual hecha por alguien de confianza.
  - Si hay que abrir un archivo de origen dudoso, no escribir la clave. El modo avión no basta: los archivos HTML abiertos en el mismo navegador comparten el almacenamiento (comprobado en Chromium con archivos locales; en Android, sin comprobar), así que una trampa puede leer las notas y guardar lo que se escriba en ella para enviarlo cuando el teléfono vuelva a tener red.

## Decisiones y motivos

**Sin esteganografía.** Esconder datos en imágenes da una sensación de seguridad que no se sostiene: el contenedor PNG de ZION se reconoce por su estructura, y en mis pruebas (con fotos sintéticas) el «Enlace en Foto» se detecta con un cálculo sencillo sin conocer la contraseña. Un archivo que parece una app de notas y no se puede leer es más honesto y más fácil de explicar.

**Sin autodestrucción.** El archivo no puede borrarse a sí mismo del teléfono; una pantalla negra con un «sistema detenido» llama más la atención que unas notas. Cerrar es volver a las notas, nada más.

**Sin red.** Ni fuentes, ni enlaces, ni descargas, ni tráfico de camuflaje. El tráfico señuelo hacia una lista fija de dominios identifica a quien lo usa. La política de contenido del archivo es `default-src 'none'` y solo admite el script y los estilos cuyo hash lleva escrito, y compilar el WebAssembly que va dentro de ese script.

**Texto y no PDF.** Casi nueve veces menos peso, se abre al instante, se puede buscar y ajustar la letra, y no arrastra un visor de PDF de un megabyte.

**La copia cambia de clave.** Quien pasa el archivo da una clave nueva al siguiente: 20 cifras al azar que pone la app. Así ninguna copia es igual a otra y cada persona solo conoce su clave y las que ella misma ha dado. Por defecto la copia lleva solo el idioma que se está leyendo (archivo más pequeño); se pueden marcar más y cambiar el idioma de las notas.

**Criptografía estándar, sin inventar nada.** AES-256-GCM de WebCrypto y, para derivar la clave, Argon2id con la segunda opción de RFC 9106 (64 MiB, 3 pasadas, 4 carriles). El navegador aún no trae Argon2: va como WebAssembly de la librería hash-wasm (MIT), sin cambios respecto a la publicada (`src/argon2.js` lleva la huella del original), y los tests comprueban que da exactamente lo mismo que la implementación de referencia en C. Se cambió desde PBKDF2 tras medirlo en teléfonos de 4 GB: con la misma espera, Argon2id frena 2,6 veces más a una tarjeta gráfica, y mucho más a un hardware hecho a medida, porque cada intento necesita 64 MiB de memoria. La sal se queda en 128 bits, lo que recomienda RFC 9106. No hay implementación propia de ningún algoritmo de cifrado. El código «propio» sensible son dos descompresores: LZMA (el que se usa siempre) y zlib de reserva. Los dos se ejecutan después de que AES-GCM haya verificado la autenticidad del bloque, y ante datos dañados lanzan error en vez de colgarse.

## El origen

Cómo llega la primera copia a un país es el punto más delicado y no lo resuelve el archivo.

- Una copia publicada en internet con clave conocida **sí** es identificable por su huella. Solo sirve como origen para quien reparte desde un lugar seguro.
- Quien reparte debe generar copias con claves propias (con `generar.js`, o con «Pasar una copia» desde una que ya tenga) antes de que entren en zona de riesgo.
- Vías sin red para pasarla: tarjeta microSD, cable, Bluetooth, «Compartir con dispositivos cercanos».

## Para quien audite

**Formato.** `base64( sal[16] ‖ caja(u32le posición, u32le longitud del índice) ‖ bloques ‖ caja(índice) ‖ cola aleatoria de 0–65 535 bytes )`, con `caja = iv[12] ‖ AES-256-GCM(clave, iv, datos)` y `clave = Argon2id(frase en NFC con las cifras de cualquier alfabeto pasadas a 0–9 y, si solo hay cifras, sin espacios ni signos, sal, m = 64 MiB, t = 3, p = 4, 32 bytes)`. Una sola derivación de clave; cada caja lleva su propio IV aleatorio (un archivo de 18 idiomas tiene ~110 cajas). Sin cabecera, firma ni versión en claro: las fronteras entre cajas solo se conocen tras descifrar el índice. Sal, IV y cola salen de `crypto.getRandomValues` y se renuevan en cada copia.

**Datos asociados.** La cabecera se cifra con `"h"`, el índice con `"i"` y el bloque *j* de la traducción *i* con `"i.j"`: una caja no se puede mover a otro sitio del archivo sin que falle la verificación. La posición de lectura, que solo está en memoria, con `"c"`.

**Contenido.** El índice es JSON: los textos de la interfaz en todos los idiomas y, por traducción, nombre, licencia, dirección de escritura, libros (bloque, posición y longitud de cada uno) y dónde está cada bloque. Cada bloque son varios libros seguidos, comprimidos con LZMA crudo (`lc=3 lp=0 pb=2`) o zlib; ~6 bloques por traducción. Al abrir se descifra solo el índice; un bloque se descifra y descomprime cuando se lee uno de sus libros, y se guardan como mucho dos.

**Dónde mirar.**

- `src/app.js`, entre `/* <core> */` y `/* </core> */`: todo el cifrado y el ensamblado. Es el mismo código que usa el generador.
- `open()`: único punto donde se prueba una clave (desde `enter()`). `lock()`: sobrescribe con ceros los bloques descifrados, suelta los libros y el índice de búsqueda, y vacía el lector. Un bloque que se termina de descifrar después de cerrar se sobrescribe con ceros sin llegar a usarse.
- `build()`: el mismo código monta el archivo en el generador y la copia en el móvil. La copia descifra cada bloque y lo vuelve a cifrar con la clave nueva; no recomprime.
- `assemble()`: la copia reutiliza literalmente el script, los estilos y la política del archivo original; solo cambia el bloque cifrado.
- La posición de lectura solo está en memoria, cifrada con la misma clave: no se guarda en el teléfono y se pierde al cerrar el navegador. Al abrir, el archivo borra la que guardaban las versiones anteriores (`nt.c`), que delataba sin la clave que se había usado el lector. Las notas y las preferencias de aspecto se guardan en claro: son la portada.

**Puntos débiles que ya conozco.**

- Argon2id va en WebAssembly de terceros porque WebCrypto aún no lo ofrece: es código que no se lee como texto (lo acotan su huella y la comparación con la referencia en C), y obliga a admitir `'wasm-unsafe-eval'` en la política. Un navegador que no lo admita no puede abrir el archivo, y quien lo intente creerá que la clave está mal.
- La memoria de Argon2id (64 MiB) no se borra a mano: la libera el recolector.
- JavaScript no garantiza el borrado de memoria: al cerrar se sueltan los libros y el índice de búsqueda, pero las cadenas ya creadas (texto del capítulo, índice) siguen en memoria hasta que el recolector las libera.
- El programa es idéntico en todas las copias; solo varía el bloque cifrado.
- Los archivos HTML abiertos en el mismo navegador comparten almacenamiento (medido en Chromium con archivos locales; en Android, sin medir): las notas de una copia se ven en otra, y un archivo trampa puede leerlas.
- La clave se ve mientras se escribe: es el buscador de notas. Un campo de contraseña (con puntos) delataría el disfraz, y el gestor de contraseñas del teléfono ofrecería guardarla. Al pulsar Intro desaparece, correcta o no, y si se cambia de aplicación mientras se comprueba, el lector no se abre.
- El tamaño del archivo, aun con la cola aleatoria, delata el orden de magnitud del contenido. Con los 18 idiomas son ~28 MB: un «bloc de notas» de ese tamaño llama la atención si alguien revisa el teléfono. Una copia con uno o dos idiomas pesa 2–4 MB.
- Los textos de la interfaz no se borran de memoria al cerrar (son cadenas de JavaScript); el índice tampoco.

## Pruebas en teléfonos reales

`movil/prueba.html` es un archivo de diagnóstico, sin Biblia y sin red: dice si el navegador puede descifrar, cuánto tarda la clave, si las notas se guardan y si la página reacciona al cambiar de aplicación.

| Teléfono | Cómo se abrió | Resultado |
|---|---|---|
| Motorola, Android 10, Brave | Desde WhatsApp (`content://`) | Descifra (contexto seguro, WebCrypto y descompresor nativo). Clave en ~0,1 s. Las notas persisten al cerrar y reabrir. Bajar las notificaciones no cierra el lector. El teclado no sugirió la palabra de prueba (escrita una vez). Miniatura de «recientes»: muestra la Biblia con solo `visibilitychange`; muestra las notas al cerrar también en `blur` |
| Samsung de gama de entrada, Android 10, Chrome 157, 4 GB | Desde WhatsApp | `movil/generar-prueba-grande.js` (25 MB, sin Biblia, mismo tamaño y descompresor que el archivo de 18 idiomas): abre. Carga 1,2 s; clave y descifrado 0,24 s; descomprimir 16,8 MB de texto birmano de una vez 0,69 s |
| Dos teléfonos Android 10, 4 GB, 8 núcleos, Chrome 157 | Desde WhatsApp | Página de prueba de la clave (sin Biblia): Argon2id con 64 MiB 0,7 s (PBKDF2 con 1 000 000 de rondas, 0,36 s); con 128 MiB, 1,4 s. WebAssembly permitido con la política del archivo y resultado idéntico a la referencia en C |

Sin probar: **teléfonos con 1–2 GB de RAM** (frecuentes en las zonas de destino), el archivo real de 18 idiomas en un teléfono (solo la página de prueba del mismo tamaño), otros fabricantes, abrir desde el gestor de archivos o Telegram, iPhone.
