# Semilla

Un solo archivo HTML que se abre como un bloc de notas corriente y lleva dentro la Biblia, cifrada, para leerla sin conexión y pasarla de mano en mano.

Es una propuesta para sustituir a ZION Lite + Core en el objetivo del proyecto: que alguien en un país con censura pueda **tener**, **leer** y **pasar** la Biblia con el menor riesgo posible.

> **Estado: prototipo.** Funciona y está probado en Chrome de escritorio simulando un móvil. No se ha probado en teléfonos reales, las traducciones de la interfaz no las ha revisado ningún hablante nativo y no ha pasado ninguna auditoría externa. No debe entregarse a personas en riesgo hasta resolver la lista de [pendientes](#qué-falta-antes-de-dárselo-a-alguien-en-riesgo).

## Qué hace

- **Por fuera es un bloc de notas que funciona de verdad**: crear, editar, borrar y buscar notas.
- **Se abre con una clave**: se escribe en el buscador de notas y se pulsa Intro. Si la clave no es correcta, se comporta como una búsqueda sin resultados.
- **Lector de texto, no PDF**: libros, capítulos, búsqueda en toda la Biblia sin acentos ni mayúsculas, tamaño de letra, modo oscuro, y retoma donde lo dejaste.
- **Se cierra al instante**: con ✕, con Atrás, con Escape o al cambiar de aplicación. Vuelve a las notas y borra el texto de la pantalla y de la memoria.
- **Pasar una copia**: desde dentro se genera otro archivo con clave nueva. Es distinto byte a byte del original, así que no se puede detectar comparándolo con una lista de archivos conocidos.
- **No se conecta a nada**: el propio archivo prohíbe al navegador cualquier conexión.

## En qué cambia respecto a ZION Lite / Core

| | ZION Lite / Core (hoy) | Semilla |
|---|---|---|
| Tamaño, Biblia completa en español | 16,0 MB | **1,84 MB** (solo NT: 0,48 MB) |
| Contenido dentro del archivo | PDF en claro | Texto cifrado (AES-256-GCM) |
| Cómo se abre | Pulsar 3 s el título, sin clave | Clave en el buscador de notas |
| Copias de un mismo idioma | Idénticas | Cada una distinta, en bytes y en tamaño |
| Conexiones de red | Fuentes de Google y tráfico señuelo | Ninguna (bloqueadas por el archivo) |
| Lectura | Páginas de PDF, sin búsqueda | Libros y capítulos, búsqueda, tamaño de letra |
| Botón de emergencia | Pantalla negra; el archivo sigue ahí | Vuelve a las notas |
| Palabras visibles en el archivo | `NUKE`, `steganography`, `ZION`… | Solo las de una app de notas |
| Sin tocar la pantalla | Se autodestruye a los 60 s | Nada; se cierra solo a los 10 min |
| Esteganografía en imágenes | Sí | No, a propósito (ver [AMENAZAS.md](AMENAZAS.md)) |

## Cómo se usa (quien lo recibe)

1. Abre el archivo con el navegador del móvil. Verás un bloc de notas.
2. Escribe la clave en **Buscar** y pulsa Intro.
3. Para cerrar: ✕, Atrás, o cambia de aplicación.
4. Para dárselo a otra persona: **⋯ → Pasar una copia**, elige una clave nueva y dísela en persona.

## Cómo se genera (quien reparte)

Hace falta [Node.js](https://nodejs.org) 20 o posterior. No hay nada que instalar.

1. Descarga la traducción de [eBible.org](https://ebible.org): en la página de cada traducción, el archivo `…_usfm.zip`.
2. **Comprueba la licencia de esa traducción.** Muchas son de dominio público o Creative Commons; otras tienen copyright y no se pueden redistribuir.
3. Ejecuta:

```bash
cd SEMILLA
node generar.js ruta/al/arb-vd_usfm.zip --idioma ar --nombre "فان دايك"
```

Pedirá la clave por teclado (mínimo 8 caracteres; mejor tres palabras al azar) y dejará el archivo en `dist/`. Opciones útiles:

| Opción | Para qué |
|---|---|
| `--solo NT` | Solo Nuevo Testamento (archivo cuatro veces más pequeño). También `AT` o una lista: `MAT,MRK,LUK,JHN` |
| `--ui es` | Idioma de la portada y los menús. Hay: es, en, fr, pt, ru, ar, fa, zh, id, tr, hi, ko |
| `--ui-archivo x.json` | Textos propios para un idioma que no está en la lista |
| `--acerca "…"` | Licencia y atribución que se muestran dentro. Si el zip trae `copr.htm`, se usa solo |
| `--salida ruta.html` | Dónde guardar |

También acepta una carpeta con archivos `.usfm` o un archivo `.usfx.xml`.

### Comprobar una copia

```bash
node verificar.js dist/notas.html
```

Dice si el archivo lleva exactamente el programa de esta carpeta, sin nada añadido. Sirve para quien reparte: una copia que llega de otra persona puede haber sido manipulada, y esto lo detecta. Funciona porque el navegador solo ejecuta el código cuyo hash va escrito en el propio archivo.

## Qué está comprobado

`npm test` ejecuta 40 pruebas sobre el código real (no sobre copias):

- **Cifrado**: ida y vuelta; clave incorrecta o un bit cambiado no abre; el formato lo descifra la criptografía estándar de Node sin usar la app.
- **Lectura de traducciones**: USFM y USFX. Aparte de las pruebas automáticas, pasé 16 Biblias reales completas por el lector sin que quedara un solo resto de marcado.
- **El archivo**: no contiene ninguna palabra delatora ni ninguna vía de red en claro; solo puede ejecutarse el código cuyo hash figura en él; dos archivos con el mismo texto y la misma clave no se parecen.
- **En navegador real** (Chrome sin interfaz, tamaño de móvil, sin red): notas, apertura, navegación, búsqueda, cierre por las cuatro vías, copia con clave nueva, árabe de derecha a izquierda con cifras propias, y funcionamiento sin descompresor nativo ni almacenamiento. Durante toda la sesión: cero errores y cero peticiones de red.

La prueba de navegador necesita Playwright (`npm i -D playwright`); si no está, se salta sola.

Medidas con la Biblia completa en español, en Chrome de escritorio frenado 6× para imitar un móvil modesto: abrir 0,6 s, abrir un libro 0,2 s, primera búsqueda en toda la Biblia 3,7 s, las siguientes 0,7 s, unos 25–30 MB de memoria. La derivación de la clave no se frena con ese método, así que en un teléfono real abrir tardará más (estimación: 1–3 s).

## Traducciones incluidas (14 idiomas)

`node generar-todos.js <carpeta de fuentes> --clave "<clave>"` genera un archivo por cada fila de [traducciones.js](traducciones.js).
Solo entran obras de dominio público o con licencia que permite repartirlas (CC BY-SA, CC BY-NC); cada archivo lleva su licencia dentro («Acerca de»).
La carpeta de fuentes lleva los zips USFM de eBible.org (`engfbv_usfm.zip`, `arbnav_usfm.zip`, …), los dos USFX de open-bibles (`spa-vbl.usfx.xml`, `chi-cuv-simp.usfx.xml`), los CSV de scrollmapper (`sm-RusSynodal.csv`, `sm-Viet.csv`, `sm-BurJudson.csv`) y `eng.vrs`.

| Idioma | Traducción | Licencia | Fuente |
|---|---|---|---|
| es | Versión Biblia Libre | CC BY-SA 4.0 | USFX open-bibles |
| en | Free Bible Version | CC BY-SA 4.0 | USFM eBible.org |
| zh | 和合本 simplificado | dominio público | USFX open-bibles |
| ar | Árabe estándar (NAV) | CC BY-SA 4.0 | USFM eBible.org |
| fa | Persa, versión antigua | dominio público | USFM eBible.org |
| ru | Sinodal | dominio público | CSV scrollmapper |
| hi | Hindi estándar 2017 | CC BY-SA 4.0 | USFM eBible.org |
| bn | Bengalí IRV | CC BY-SA 4.0 | USFM eBible.org |
| id | Alkitab Yang Terbuka | **ambigua** (no comercial; el texto dice a la vez «compartible» y «sin obras derivadas»: confirmar con YLSA antes de repartir) | USFM eBible.org |
| vi | Kinh Thánh 1934 | dominio público | CSV scrollmapper |
| my | Birmano, Judson | dominio público | CSV scrollmapper (14 versículos menos que el estándar) |
| ha | Hausa (Biblica) | CC BY-SA 4.0 | USFM eBible.org |
| ckb | Kurdo sorani | CC BY-SA 4.0 | USFM eBible.org |
| ug | Uigur (escritura árabe) | CC BY-SA 4.0 | USFM eBible.org |

**Versículos sin texto.** Algunas traducciones no traen ciertos versículos y no es un fallo del generador: las modernas omiten a propósito Mt 17:21, 18:11, 23:14, Mr 7:16, 9:44-46, 11:26, 15:28, Lc 17:36, 23:17, Jn 5:4, Hch 8:37… (inglés y hausa: 17 pasajes); el persa antiguo omite otros 21 (Gn 15:21, 21:34, 1 S 8:22…); en árabe, indonesio, kurdo y uigur son 1–9 casos de numeración distinta. `faltantes()` los detecta al generar.

**Qué hay que NO usar.** `lib/lineas.js` lee el formato «un versículo por línea» de BibleNLP/ebible-corpus, pero ese formato **pierde ~150 versículos** (Joel 2:28-32 y 3:6-21, Malaquías 4, Números 16:36-50…) porque su numeración es la hebrea. Se conserva solo por si no hay otra fuente; si se usa, el archivo debe avisarlo dentro.

**Fuera por licencia** (CC BY-ND / BY-NC-ND prohíben obras derivadas): turco, urdu en escritura árabe, somalí, tibetano, tayiko. **No encontrados en ninguna fuente abierta:** uzbeko, amhárico, tigriña, pastún.

**Sin revisar por nativos:** los nombres de los libros en ruso, vietnamita y birmano (`lib/nombres.js`) los escribí a mano; los demás salen de la propia traducción. La portada solo existe en 12 idiomas (es, en, fr, pt, ru, ar, fa, zh, id, tr, hi, ko): bengalí, vietnamita, birmano, hausa, kurdo y uigur muestran la portada en inglés. El texto de licencia dentro del archivo está en español.

## Qué falta antes de dárselo a alguien en riesgo

1. **Probarlo en teléfonos reales**, sobre todo Android antiguos: abrir el archivo desde el gestor de archivos, desde WhatsApp y desde Telegram; que la clave abra; que «Enviar» funcione por Bluetooth. No sé todavía si todos los navegadores móviles permiten descifrar en un archivo abierto de esa forma.
2. **Revisión por hablantes nativos** de la interfaz en los 10 idiomas que no son español ni inglés, y traducirla a los que faltan.
3. **Licencias**: elegir, para cada uno de los 24 idiomas, una traducción que se pueda redistribuir.
4. **Auditoría externa** del cifrado y del modelo de amenazas.
5. **Decidir el origen**: cómo llega la primera copia a cada país (ver [AMENAZAS.md](AMENAZAS.md)).

## Estructura

```
SEMILLA/
  generar.js        el comando que crea el archivo
  verificar.js      comprueba que un archivo lleva el programa auténtico
  src/app.js        la app (portada + lector). Va tal cual dentro del archivo, sin minificar
  src/app.css       estilos
  src/ui.js         textos de la interfaz por idioma
  lib/texto.js      lee USFM y USFX
  lib/lineas.js     lee «un versículo por línea» (ebible-corpus) y detecta lo que falta
  lib/csv.js        lee CSV de scrollmapper
  lib/nombres.js    nombres de los 66 libros en 12 idiomas
  traducciones.js   las 14 traducciones elegidas y su licencia
  generar-todos.js  genera un archivo por traducción
  lib/paquete.js    empaqueta, cifra y ensambla
  lib/nucleo.js     carga en Node el mismo código de cifrado que usa la app
  lib/zip.js        lee los .zip de eBible
  tests/            pruebas y textos de muestra (dominio público)
```

Sin dependencias: ni para generar ni dentro del archivo.
