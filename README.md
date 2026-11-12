# ZION · Semilla

Un solo archivo HTML que se abre como un bloc de notas corriente y lleva dentro la Biblia, cifrada, para leerla sin conexión y pasarla de mano en mano.

Objetivo de ZION: que alguien en un país con censura pueda **tener**, **leer** y **pasar** la Biblia con el menor riesgo posible. El nombre ZION es el del proyecto; no aparece en ningún archivo que se reparte.

> **Estado: prototipo.** Probado en Chrome de escritorio simulando un móvil y en un solo teléfono real (ver [AMENAZAS.md](AMENAZAS.md#pruebas-en-teléfonos-reales)). Las traducciones de la interfaz no las ha revisado ningún hablante nativo y no ha pasado ninguna auditoría externa. No debe entregarse a personas en riesgo hasta resolver la lista de [pendientes](#qué-falta-antes-de-dárselo-a-alguien-en-riesgo).

## Qué hace

- **Por fuera es un bloc de notas que funciona de verdad**: crear, editar, borrar y buscar notas.
- **Se abre con una clave**: se escribe en el buscador de notas y se pulsa Intro. Si la clave no es correcta, se comporta como una búsqueda sin resultados.
- **Lector de texto, no PDF**: libros, capítulos, búsqueda en toda la Biblia sin acentos ni mayúsculas, tamaño de letra, modo oscuro, y retoma donde lo dejaste.
- **Se cierra al instante**: con ✕, con Atrás, con Escape o al cambiar de aplicación. Vuelve a las notas y borra el texto de la pantalla y de la memoria.
- **Pasar una copia**: desde dentro se genera otro archivo con clave nueva. Es distinto byte a byte del original, así que no se puede detectar comparándolo con una lista de archivos conocidos.
- **No se conecta a nada**: el propio archivo prohíbe al navegador cualquier conexión.

## Historia

Semilla sustituye a la primera versión de ZION (ZION Web/Core/Lite: PDF en claro, esteganografía en imágenes, botón de autodestrucción), que se retiró sin llegar a usarse. Semilla pesa ~9 veces menos, cifra el contenido, no se conecta a nada y no lleva palabras delatoras. El motivo de dejar la esteganografía está en [AMENAZAS.md](AMENAZAS.md). El código anterior sigue en el historial de git.

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

Dice si el archivo lleva exactamente el programa de este repositorio, sin nada añadido. Sirve para quien reparte: una copia que llega de otra persona puede haber sido manipulada, y esto lo detecta. Funciona porque el navegador solo ejecuta el código cuyo hash va escrito en el propio archivo.

## Qué está comprobado

`npm test` ejecuta 48 pruebas sobre el código real (no sobre copias):

- **Cifrado**: ida y vuelta; clave incorrecta o un bit cambiado no abre; el formato lo descifra la criptografía estándar de Node sin usar la app.
- **Lectura de traducciones**: USFM y USFX. Aparte de las pruebas automáticas, pasé 16 Biblias reales completas por el lector sin que quedara un solo resto de marcado.
- **El archivo**: no contiene ninguna palabra delatora ni ninguna vía de red en claro; solo puede ejecutarse el código cuyo hash figura en él; dos archivos con el mismo texto y la misma clave no se parecen.
- **En navegador real** (Chrome sin interfaz, tamaño de móvil, sin red): notas, apertura, navegación, búsqueda, cierre por las cuatro vías, copia con clave nueva, árabe de derecha a izquierda con cifras propias, y funcionamiento sin descompresor nativo ni almacenamiento. Durante toda la sesión: cero errores y cero peticiones de red.

La prueba de navegador necesita Playwright (`npm i -D playwright`); si no está, se salta sola.

Medidas con la Biblia completa en español, en Chrome de escritorio frenado 6× para imitar un móvil modesto: abrir 0,6 s, abrir un libro 0,2 s, primera búsqueda en toda la Biblia 3,7 s, las siguientes 0,7 s, unos 25–30 MB de memoria. La derivación de la clave no se frena con ese método, así que en un teléfono real abrir tardará más (estimación: 1–3 s).

## Traducciones incluidas (14 idiomas)

`node generar-todos.js <carpeta de fuentes> --clave "<clave>"` genera un archivo por cada fila de [traducciones.js](traducciones.js).
Solo entran obras de dominio público o con licencia que permite repartirlas (CC BY-SA, CC BY-NC); se prefieren las traducciones modernas; las antiguas de dominio público solo donde no hay una moderna abierta. Cada archivo lleva su licencia dentro («Acerca de»).
La carpeta de fuentes lleva los zips USFM de eBible.org (`engfbv_usfm.zip`, `arbnav_usfm.zip`, …), el USFX de open-bibles (`spa-vbl.usfx.xml`), el zip del repositorio de Door43 (`ru_rob.zip`) y `eng.vrs`.

| Idioma | Traducción | Licencia | Fuente |
|---|---|---|---|
| es | Versión Biblia Libre | CC BY-SA 4.0 | USFX open-bibles |
| en | Free Bible Version | CC BY-SA 4.0 | USFM eBible.org |
| zh | Biblica Open Chinese Contemporary Bible (simplificado, 2022) | CC BY-SA 4.0 | USFM eBible.org (`cmncbs`) |
| ar | Árabe estándar (NAV) | CC BY-SA 4.0 | USFM eBible.org |
| fa | Biblica Open Persian Contemporary Bible (2022) | CC BY-SA 4.0 | USFM eBible.org (`pesopcb`) |
| ru | Русская открытая Библия (ROB, v8, 2021): revisión moderna de la Sinodal, alineada con el griego de unfoldingWord | CC BY-SA 4.0 | USFM Door43 (`Door43-Catalog/ru_rob`, zip del repositorio) |
| hi | Hindi estándar 2017 | CC BY-SA 4.0 | USFM eBible.org |
| bn | Bengalí IRV | CC BY-SA 4.0 | USFM eBible.org |
| id | Alkitab Yang Terbuka | **ambigua** (no comercial; el texto dice a la vez «compartible» y «sin obras derivadas»: confirmar con YLSA antes de repartir) | USFM eBible.org |
| vi | Biblica Open Vietnamese Contemporary Bible (2015) | CC BY-SA 4.0 | USFM eBible.org (`vieovcb`) |
| my | Birmano, Common Language Bible (2005) | © Bible Society of Myanmar; dominio público fuera de Myanmar según eBible (permiso en trámite) | USFM eBible.org (`mya`); Cantares y Habacuc 3 de la Judson 1840 (`myajvb`, dominio público) |
| ha | Hausa (Biblica) | CC BY-SA 4.0 | USFM eBible.org |
| ckb | Kurdo sorani | CC BY-SA 4.0 | USFM eBible.org |
| ug | Uigur (escritura árabe) | CC BY-SA 4.0 | USFM eBible.org |

**Criterio.** Se prefieren traducciones modernas y abiertas a las de dominio público, que son muy arcaicas. Las de Biblica (chino, persa, vietnamita, hausa, árabe) son «contemporáneas» (lectura natural, no literal) y exigen su aviso de copyright, que va en el «Acerca de». El ruso usa la Russian Open Bible, que es una revisión moderna de la Sinodal (no una traducción independiente); la NRT de Biblica sería más contemporánea y está pendiente de permiso. Los textos antiguos que ya no se usan (CUV 1919, persa antiguo, vietnamita 1934) siguen en el historial de git.

**Permisos pendientes** (en trámite, los gestiona el responsable del proyecto):
- **Indonesio (AYT):** licencia ambigua. Contacto: YLSA (ylsa@sabda.org).
- **Español (VBL) y árabe (NAV):** confirmar la licencia con Free Bible Ministry y con Biblica; hay fuentes que dan la VBL como CC BY-ND.
- **Ruso:** ya incluida la Russian Open Bible (CC BY-SA, sin permiso). Mejora opcional: Новый Перевод на Русский Язык (Biblica, 2006, derechos reservados); hace falta que Biblica dé el texto.
- **Birmano:** ya incluida la Common Language Bible (Bible Society of Myanmar, 2005). eBible la marca como dominio público, pero su copyright rige dentro de Myanmar. Pedir permiso a la Bible Society of Myanmar y pedirles también el texto completo: el de eBible tiene Habacuc 3 vacío y Cantares desplazado un versículo (se parchean con la Judson), y Job, Proverbios y Eclesiastés están en un birmano más antiguo.
- El permiso debe cubrir expresamente: empaquetar el texto comprimido y cifrado en un HTML, repartir copias distintas byte a byte con clave nueva, y que la atribución vaya dentro del contenido cifrado.

**Retoques a las fuentes.** `traducciones.js` declara cada retoque y el «Acerca de» de la copia lo anota (CC BY-SA obliga a indicar los cambios). Ninguno cambia palabras. Ruso: se quitan los títulos «Глава …», seis asteriscos sueltos y cada versículo va en su párrafo. Birmano: se quitan la nota de «fin de libro» de 22 libros, unos 15.000 guiones sueltos que dejaron las notas, los «%» de Habacuc, una referencia cruzada filtrada en Mt 5:27, y las comillas ASCII pasan a tipográficas; Cantares y Habacuc 3 vienen de la Judson, cuyo texto lleva espacios entre palabras y se ve más suelto que el resto. Job 30:30-31 sigue fusionado en un solo versículo en la fuente.

**Versículos sin texto.** Algunas traducciones no traen ciertos versículos y no es un fallo del generador: las modernas omiten a propósito Mt 17:21, 18:11, 23:14, Mr 7:16, 9:44-46, 11:26, 15:28, Lc 17:36, 23:17, Jn 5:4, Hch 8:37… (inglés y hausa: 17 pasajes); en árabe, indonesio, kurdo y uigur son 1–9 casos de numeración distinta. `faltantes()` los detecta al generar.

**Qué hay que NO usar.** `lib/lineas.js` lee el formato «un versículo por línea» de BibleNLP/ebible-corpus, pero ese formato **pierde ~150 versículos** (Joel 2:28-32 y 3:6-21, Malaquías 4, Números 16:36-50…) porque su numeración es la hebrea. Se conserva solo por si no hay otra fuente; si se usa, el archivo debe avisarlo dentro.

**Fuera por licencia** (CC BY-ND / BY-NC-ND prohíben obras derivadas): turco, urdu en escritura árabe, somalí, tibetano, tayiko. **No encontrados en ninguna fuente abierta:** uzbeko, amhárico, tigriña, pastún.

**Sin revisar por nativos:** los nombres de los libros salen de la propia traducción en todos los idiomas. La interfaz existe en 14 idiomas (es, en, fr, pt, ru, ar, fa, zh, id, vi, my, tr, hi, ko): bengalí, hausa, kurdo y uigur la muestran en inglés. La vietnamita y la birmana (y su dedicatoria) están redactadas por IA; la birmana es la menos fiable y no debe repartirse sin revisión nativa. El texto de licencia dentro del archivo está en español.

## Qué falta antes de dárselo a alguien en riesgo

1. **Probarlo en teléfonos reales**, sobre todo Android antiguos: abrir el archivo desde el gestor de archivos, desde WhatsApp y desde Telegram; que la clave abra; que «Enviar» funcione por Bluetooth. No sé todavía si todos los navegadores móviles permiten descifrar en un archivo abierto de esa forma.
2. **Revisión por hablantes nativos** de la interfaz en los 12 idiomas que no son español ni inglés, y traducirla a los que faltan.
3. **Licencias**: elegir, para cada uno de los 24 idiomas, una traducción que se pueda redistribuir.
4. **Auditoría externa** del cifrado y del modelo de amenazas.
5. **Decidir el origen**: cómo llega la primera copia a cada país (ver [AMENAZAS.md](AMENAZAS.md)).

## Estructura

```
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
