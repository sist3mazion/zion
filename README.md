# ZION · Semilla

Un solo archivo HTML que se abre como un bloc de notas corriente y lleva dentro la Biblia en 44 idiomas, cifrada, para leerla sin conexión y pasarla de mano en mano.

Objetivo de ZION: que alguien en un país con censura pueda **tener**, **leer** y **pasar** la Biblia con el menor riesgo posible. El nombre ZION es el del proyecto; no aparece en ningún archivo que se reparte.

> **Estado: prototipo.** Probado en Chrome de escritorio simulando un móvil y en un solo teléfono real (ver [AMENAZAS.md](AMENAZAS.md#pruebas-en-teléfonos-reales)). Las traducciones de la interfaz no las ha revisado ningún hablante nativo y no ha pasado ninguna auditoría externa. No debe entregarse a personas en riesgo hasta resolver la lista de [pendientes](#qué-falta-antes-de-dárselo-a-alguien-en-riesgo).

## Qué hace

- **Por fuera es un bloc de notas que funciona de verdad**: crear, editar, borrar y buscar notas.
- **Se abre con una clave**: se escribe en el buscador de notas y se pulsa Intro. Al pulsar Intro lo escrito desaparece del buscador, sea la clave correcta o no, y si se cambia de aplicación mientras se comprueba, no se abre. Lo que tiene menos de 16 caracteres es una búsqueda normal de notas.
- **Lector de texto, no PDF**: libros, capítulos, búsqueda en toda la Biblia sin acentos ni mayúsculas, tamaño de letra, modo oscuro, y retoma donde lo dejaste mientras el archivo siga abierto en el navegador (la posición no se guarda en el teléfono).
- **Varios idiomas en un archivo**: **⋯ → Idioma** cambia de traducción. Solo se descifra lo que se lee.
- **Se cierra al instante**: con ✕, con Atrás, con Escape o al cambiar de aplicación. Vuelve a las notas y borra el texto de la pantalla y de la memoria.
- **Avisa donde hace falta**: al abrir el lector, un aviso breve encima de los libros explica cómo cerrar y que la clave va en papel, nunca en una nota (sale cada vez que se abre el archivo, hasta que se lee algo; no se guarda nada para ello). «Pasar una copia» recuerda que cada persona necesita su propia copia y que una clave perdida no se recupera. «Acerca de» añade que el archivo no se conecta a nada.
- **Pasar una copia**: desde dentro se genera otro archivo con clave nueva. La pantalla propone una clave al azar de 20 cifras en grupos de cuatro (por ejemplo `4821 0937 5512 8846 0393`, 66 bits): cualquier teclado tiene cifras y en cualquier idioma se pueden dictar. Vale escrita con las cifras de cualquier alfabeto (٤٨٢١, ۴۸۲۱, ४८२१…) y con o sin espacios, guiones o puntos. «Otra» da otra distinta y se puede escribir una propia. Solo se ve en esa pantalla y no se guarda en ningún sitio. Es distinto byte a byte del original, así que no se puede detectar comparándolo con una lista de archivos conocidos. Por defecto lleva solo el idioma que se está leyendo; se pueden marcar más y elegir el idioma de las notas de la copia. Cualquier copia puede a su vez hacer copias. A cada persona hay que darle su propia copia: un mismo archivo reenviado a varias es idéntico en todas y una lista de huellas lo encuentra.
- **No se conecta a nada**: el propio archivo prohíbe al navegador cualquier conexión.

## Historia

Semilla sustituye a la primera versión de ZION (ZION Web/Core/Lite: PDF en claro, esteganografía en imágenes, botón de autodestrucción), que se retiró sin llegar a usarse. Semilla pesa ~9 veces menos, cifra el contenido, no se conecta a nada y no lleva palabras delatoras. El motivo de dejar la esteganografía está en [AMENAZAS.md](AMENAZAS.md). El código anterior sigue en el historial de git.

## Cómo se usa (quien lo recibe)

1. Abre el archivo con el navegador del móvil. Verás un bloc de notas.
2. Escribe la clave en **Buscar** y pulsa Intro.
3. Para cerrar: ✕, Atrás, o cambia de aplicación.
4. Para cambiar de idioma: **⋯ → Idioma**.
5. Para dárselo a otra persona: **⋯ → Pasar una copia**, usa la clave sugerida (o pulsa «Otra», o escribe la tuya) y dísela en persona o en un papel aparte, nunca por mensaje ni en una nota del teléfono. Una copia para cada persona: no reenvíes el mismo archivo a varias. Por defecto la copia lleva solo el idioma que estás leyendo (pesa 2–4 MB en vez de ~32 MB y llama menos la atención); marca más idiomas si los necesitas. El idioma de las notas (la portada que se ve sin clave) sigue al primer idioma marcado hasta que lo cambies a mano.

## Cómo se genera (quien reparte)

Hace falta [Node.js](https://nodejs.org) 20 o posterior y la orden `xz` (viene en Linux y macOS) para comprimir con LZMA. Sin `xz` se comprime con zlib y el archivo sale ~40 % más grande. No hay paquetes que instalar.

1. Descarga la traducción de [eBible.org](https://ebible.org): en la página de cada traducción, el archivo `…_usfm.zip`.
2. **Comprueba la licencia de esa traducción.** Muchas son de dominio público o Creative Commons; otras tienen copyright y no se pueden redistribuir.
3. Ejecuta:

```bash
node generar.js ruta/al/arb-vd_usfm.zip --idioma ar --nombre "فان دايك"
```

Pedirá la clave por teclado (mínimo 16 caracteres, los espacios cuentan; mejor cinco palabras al azar) y dejará el archivo en `dist/`. Opciones útiles:

| Opción | Para qué |
|---|---|
| `--solo NT` | Solo Nuevo Testamento (archivo cuatro veces más pequeño). También `AT` o una lista: `MAT,MRK,LUK,JHN` |
| `--ui es` | Idioma de la portada y los menús. Hay: es, en, fr, pt, ru, ar, fa, zh, id, vi, my, tr, hi, ko, bn, ha, ckb, ug, ur, so, bo |
| `--ui-archivo x.json` | Textos propios para un idioma que no está en la lista |
| `--acerca "…"` | Licencia y atribución que se muestran dentro. Si el zip trae `copr.htm`, se usa solo |
| `--salida ruta.html` | Dónde guardar |

También acepta una carpeta con archivos `.usfm` o un archivo `.usfx.xml`.

### Comprobar una copia

```bash
node verificar.js dist/notas.html
```

Dice si el archivo lleva exactamente una versión publicada del programa, sin nada añadido, y cuál: la actual o una anterior (con su aviso, si esa versión tiene un fallo conocido). Las versiones publicadas están en `versiones.json`. Verifica siempre con el repositorio actualizado: una lista antigua no conoce las versiones más nuevas y las daría por falsas. Sirve para quien reparte: una copia que llega de otra persona puede haber sido manipulada, y esto lo detecta. Funciona porque el navegador solo ejecuta el código cuyo hash va escrito en el propio archivo.

## Qué está comprobado

`npm test` ejecuta 48 pruebas sobre el código real (no sobre copias):

- **Cifrado**: ida y vuelta; clave incorrecta o un bit cambiado no abre; la clave que sale de Argon2id es idéntica a la de la implementación de referencia en C, y el formato lo descifra la criptografía estándar de Node sin usar la app.
- **Lectura de traducciones**: USFM y USFX. Aparte de las pruebas automáticas, pasé 16 Biblias reales completas por el lector sin que quedara un solo resto de marcado.
- **El archivo**: no contiene ninguna palabra delatora ni ninguna vía de red en claro; el programa va sin comentarios (los del repo explican el diseño; en el archivo solo queda la licencia MIT de Argon2id), y `verificar.js` aplica la misma limpieza al comparar; solo puede ejecutarse el código cuyo hash figura en él; dos archivos con el mismo texto y la misma clave no se parecen.
- **En navegador real** (Chrome sin interfaz, tamaño de móvil, sin red): notas, apertura, navegación, búsqueda, cierre por las cuatro vías, copia con clave nueva, árabe de derecha a izquierda con cifras propias, y funcionamiento sin descompresor nativo ni almacenamiento. Durante toda la sesión: cero errores y cero peticiones de red.

La prueba de navegador necesita Playwright (`npm i -D playwright`); si no está, se salta sola.

Medidas con la Biblia completa en español, en Chrome de escritorio frenado 6× para imitar un móvil modesto: abrir 0,6 s, abrir un libro 0,2 s, primera búsqueda en toda la Biblia 3,7 s, las siguientes 0,7 s, unos 25–30 MB de memoria. Esas medidas son de cuando la clave se derivaba con PBKDF2. La derivación con Argon2id, medida aparte en dos teléfonos Android 10 de 4 GB con Chrome 157: 0,7 s (con PBKDF2 eran 0,36 s); usa 64 MiB de memoria mientras dura.

Con 18 idiomas en un archivo (27,7 MB; con francés, portugués y coreano serán unos 32 MB, estimado y sin medir), en el mismo Chrome frenado 6×: cargar el archivo 2,0 s, abrir con la clave 0,5 s, cambiar de idioma 0,2 s, abrir un libro en birmano (el idioma más pesado) 0,6 s, buscar en chino 0,8 s, hacer una copia con los 18 idiomas 2,5 s; memoria de JavaScript 34 MB leyendo y 81 MB tras copiar. En un Samsung de gama de entrada (Android 10, 4 GB), desde WhatsApp, la página de prueba del mismo tamaño abre bien (ver [AMENAZAS.md](AMENAZAS.md#pruebas-en-teléfonos-reales)). **No está probado en teléfonos de 1–2 GB.**

Para probar un teléfono sin llevar ninguna Biblia: `node movil/generar-prueba-grande.js` genera `dist/prueba-grande.html`, del mismo tamaño y con el mismo descompresor.

## Traducciones incluidas (44 idiomas)

`node generar-todos.js <carpeta de fuentes> --clave "<clave de 16 caracteres o más>"` genera **un solo archivo** con todas las filas de [traducciones.js](traducciones.js) (`dist/notas.html`, 27,7 MB con 18 idiomas y unos 32 MB con los 21, estimado; con zlib serían ~38 MB). `--solo es,ar` deja solo esas; `--ui` elige el idioma de la portada. Una copia con uno o dos idiomas pesa 2–4 MB.
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
| id | Alkitab Yang Terbuka | Texto operativo de eBible (2024): permite compartir, redistribuir **o adaptar** en cualquier formato, sin uso comercial (la cabecera dice «No Derivatives», pero la cláusula concede la adaptación); `permiso: 'formato'` | USFM eBible.org (`indayt`) |
| vi | Biblica Open Vietnamese Contemporary Bible (2015) | CC BY-SA 4.0 | USFM eBible.org (`vieovcb`) |
| my | Birmano, Common Language Bible (2005) | © Bible Society of Myanmar; dominio público fuera de Myanmar según eBible; dentro de Myanmar rige su copyright | USFM eBible.org (`mya`); Cantares y Habacuc 3 de la Judson 1840 (`myajvb`, dominio público) |
| ha | Hausa (Biblica) | CC BY-SA 4.0 | USFM eBible.org |
| ckb | Biblica Open Kurdi Sorani Standard Version (2020) | CC BY-SA 4.0 | USFM eBible.org (`ckb`) |
| ug | Uigur (escritura árabe), Mukeddes Kalam (2010) | CC BY-SA 4.0 | USFM eBible.org (`uigara`) |
| ur | Biblica Open Urdu Contemporary Version (2024) | CC BY-SA 4.0 | USFM eBible.org (`urdoucv`) |
| tr | Yorumsuz Türkçe Çeviri (YTC, Turkish WEB) | **CC BY-ND 4.0**, «en cualquier formato» sin cambiar palabras ni puntuación: se usa como cambio técnico de formato (`permiso: 'formato'`) | USFM eBible.org (`turytc`) |
| so | Kitaabka Quduuska Ah (SIM) | **CC BY-NC-ND 4.0** (la fuente conserva también el aviso de la 3.0): permite expresamente pasar el texto a otros formatos sin tocar texto ni puntuación; `permiso: 'formato'` | USFM eBible.org (`som`) |
| bo | New Tibetan Bible | **CC BY-NC-ND 4.0**, «en cualquier formato» sin cambiar palabras ni puntuación: se usa como cambio técnico de formato (`permiso: 'formato'`) | USFM eBible.org (`bodn`) |
| fr | Sainte Bible néo-Crampon Libre (2022): modernización de la Crampon católica. Se reparten los 66 libros; se quitan los 7 deuterocanónicos | CC BY-SA 4.0 | USFM eBible.org (`francl`) |
| pt | Bíblia Livre (BLIVRE, 2018): actualización de la Almeida de 1819 sobre el Textus Receptus | CC BY 4.0 (citar fuente y fecha de la versión) | USFM eBible.org (`porbr2018`) |
| ko | Korean Revised Version (개역한글, 1961) | Dominio público desde 2011 según la Sociedad Bíblica de Corea (hay que citar la autoría y no alterar el texto) | CSV scrollmapper/bible_databases (`KorRV`) |
| sw | Biblica Open Kiswahili Contemporary Scriptures (Neno: Maandiko Matakatifu, 2024) | CC BY-SA 4.0 | USFM eBible.org (`swhonmm`) |
| om | Biblica Open New Oromo Contemporary Version, occidental (2022) | CC BY-SA 4.0 | USFM eBible.org (`gaz`) |
| hne | Biblica Open Chhattisgarhi Contemporary Version (2024) | CC BY-SA 4.0 | USFM eBible.org (`hne`) |
| or | Indian Revised Version, odia (BCS 2021) | CC BY-SA 4.0 | USFM eBible.org (`ory`) |
| az | Azərbaycan dilində Müqəddəs Kitab (2008, alfabeto latino) | CC BY-NC-ND, con permiso expreso de cambio de formato (no se cambia ninguna palabra ni signo). Es el azerí de la República de Azerbaiyán; el de Irán se escribe en alfabeto árabe-persa y no está cubierto | USFM eBible.org (`azb`) |
| aeb | Árabe tunecino, Nuevo Testamento (2022, solo NT: 27 libros) | CC BY-NC-ND 4.0 (United Bible Societies; © 2020 Wycliffe Bible Translators): «en cualquier formato» sin cambiar palabras ni puntuación: se usa como cambio técnico de formato (`permiso: 'formato'`) | USFM eBible.org (`aeb`) |
| rhg | Rohingya, Nuevo Testamento (Kitabul Mukaddos or Injil Córif, 2024, alfabeto latino; solo NT: 27 libros) | CC BY-SA 4.0 (The Word for the World International; indicar los cambios) | USFM eBible.org (`rhgc`) |
| zlm | Malayo de Malasia, Nuevo Testamento contextualizado (Kitab Suci Zabur dan Injil, 2013; solo NT: 27 libros) | CC BY-ND 4.0 (Pengamat Kitab Mulia): «en cualquier formato» sin cambiar palabras ni puntuación; se usa como cambio técnico de formato (`permiso: 'formato'`), sin carta de confirmación | USFM eBible.org (`zlmKSZI`) |
| ffm | Fulfulde de Maasina, Nuevo Testamento (Aadi keyri: linjiila iisaa almasiihu, 2005; solo NT: 27 libros) | CC BY-NC-ND (Wycliffe Bible Translators), con permiso expreso de cambio de formato sin tocar texto ni puntuación (`permiso: 'formato'`) | USFM eBible.org (`ffm`) |
| sce | Dongxiang, Nuevo Testamento (Hudani Kielien, 2020-2024, alfabeto latino; solo NT: 27 libros) | CC BY-SA 4.0 (River Street Publishing; indicar los cambios). La fuente se identifica como «draft 2» (borrador); el alfabeto latino es una ortografía reciente que casi nadie lee | USFM eBible.org (`sce`) |
| thr | Rana tharu, Nuevo Testamento (2024, escritura devanagari; solo NT: 27 libros) | CC BY-SA 4.0 (The Word for the World International y Rana Tharu Translation Samithi, Khatima, Uttarakhand; indicar los cambios). Edición hecha para los rana tharu de la India | USFM eBible.org (`thr`) |
| mni | Meitei, Nuevo Testamento (ANOUBA WAREPNABA, 2022, escritura romana; solo NT: 27 libros) | CC BY 4.0 (The Word for the World International; indicar los cambios). Es la primera traducción meitei en alfabeto romano; no está en escritura bengalí ni en meitei mayek | USFM eBible.org (`mni`) |
| ne | Biblica Open Nepali Contemporary Version (2024) | CC BY-SA 4.0 | USFM eBible.org (`npioncb`) |
| ta | Biblica Open Tamil Contemporary Version (2022) | CC BY-SA 4.0 | USFM eBible.org (`tamtcv`) |
| te | Biblica Open Telugu Contemporary Version (2024) | CC BY-SA 4.0 | USFM eBible.org (`telotsa`) |
| kn | Biblica Open Kannada Contemporary Version (2022) | CC BY-SA 4.0 | USFM eBible.org (`kanokcv`) |
| am | Amárico, Nuevo Testamento (Revised Amharic Bible 1962/2003; solo NT: 27 libros) | © United Bible Societies; «con permiso de la Sociedad Bíblica de Etiopía»: uso no comercial con el aviso completo; cifrar y comprimir se tratan como cambio técnico de formato (`permiso: 'formato'`) | USFM eBible.org (`amh`) |
| tk | Turcomano, Biblia completa (Mukaddes Kitap, 2026, escritura latina; 66 libros) | CC BY-NC-ND 4.0 (© Institute for Bible Translation, Moscú; la licencia la declara la propia edición); se reparte con `permiso: 'formato'` (cifrar y comprimir son un cambio de formato; no se toca el texto) | EPUB oficial del IBT (`ibtrussia.org`), pasado a USFM por un conversor propio |
| uz | Uzbeko, Biblia completa (Muqaddas Kitob, 2016-2020, escritura latina; 66 libros) | CC BY-NC-ND 4.0 (© Institute for Bible Translation, Moscú; la licencia la declara la propia edición); se reparte con `permiso: 'formato'` (cifrar y comprimir son un cambio de formato; no se toca el texto) | EPUB oficial del IBT (`ibtrussia.org`), pasado a USFM por el mismo conversor que el turcomano |
| tg | Tayiko, Китоби Муқаддас 1992 (cirílico; 66 libros) | CC BY-NC-ND 4.0 (© Institute for Bible Translation, Moscú; la declara la ficha de dbs.org, mientras los metadatos del EPUB dicen CC BY-SA 3.0: se aplica la más restrictiva); se reparte con `permiso: 'formato'` | HTML oficial de dbs.org (`TGKIBC`), pasado a USFM; el EPUB de la misma ficha pierde los saltos de línea de la poesía y no se usa |
| prs | Dari, Today's Dari Version (TDV, 2008; 66 libros) | CC BY-NC-ND (versión no indicada; la declara la ficha de dbs.org); se reparte con `permiso: 'formato'` (cifrar y comprimir son un cambio de formato; no se toca el texto) | HTML oficial de dbs.org (`PRSTDV`), pasado a USFM |
| bcc | Baluchi meridional (Makrani), porciones del Nuevo Testamento (12 libros: Evangelios, Hechos, Santiago, 1-2 Pedro, 1-3 Juan, Judas) | CC BY-SA (© Wycliffe Bible Translators; la declara la ficha de dbs.org, sin indicar versión); licencia libre, sin `permiso` | HTML oficial de dbs.org (`BCCWBT`), pasado a USFM |
| ce | Checheno, Делан Йозанаш (2012; 66 libros) | CC BY-NC-ND (© Institute for Bible Translation, Moscú; la declara la ficha de dbs.org, sin indicar versión); se reparte con `permiso: 'formato'` | HTML oficial de dbs.org (`CHEIBT`), pasado a USFM |

**Criterio.** Se prefieren traducciones modernas y abiertas a las de dominio público, que son muy arcaicas. Las de Biblica (chino, persa, vietnamita, hausa, árabe, kurdo, urdu, suajili, oromo, chhattisgarhi, nepalí, tamil, telugu, canarés) son «contemporáneas» (lectura natural, no literal) y exigen su aviso de copyright, que va en el «Acerca de». Como cada copia es una obra derivada (cambio de formato, cifrado, sin notas), la licencia de Biblica obliga a quitar la marca registrada, indicar los cambios y citar «Original work by Biblica, Inc., available free of charge from www.biblica.com and open.bible»; así va en todos. El ruso usa la Russian Open Bible, que es una revisión moderna de la Sinodal (no una traducción independiente); la NRT de Biblica sería más contemporánea y está pendiente de permiso. Los textos antiguos que ya no se usan (CUV 1919, persa antiguo, vietnamita 1934) siguen en el historial de git.

**Notas sobre licencias** (lo que aclararía una confirmación expresa de cada titular):
- **Indonesio (AYT):** licencia leída en eBible (2024): permite adaptar en cualquier formato sin uso comercial. Contacto: YLSA (ylsa@sabda.org); no hace falta confirmación para repartir. Se incluye por la presión que sufren los conversos (Aceh, Java Occidental), aunque la Biblia se venda legalmente.
- **Español (VBL) y árabe (NAV):** eBible los publica hoy como CC BY-SA 4.0 (la VBL, con permiso expreso de «revisiones y adaptaciones razonables»). Fuentes antiguas (Biblearc, open.bible, un prefacio de 2022) la dan como BY-ND: pedir confirmación escrita a Free Bible Ministry (info@freebibleministry.org) y a Biblica.
- **Amárico (am):** no hay Biblia completa abierta en amárico. eBible solo publica el Nuevo Testamento de 1962/2003 (Sociedades Bíblicas), con permiso de uso no comercial y aviso íntegro, pero sin licencia abierta que cubra cifrarlo y empaquetarlo. Se usa con `permiso: 'formato'` acogiéndose al uso no comercial con el aviso íntegro; el permiso expreso para cifrarlo y empaquetarlo no existe, así que conviene pedir confirmación escrita a la Sociedad Bíblica de Etiopía. La Biblica NASV (2001) es de derechos reservados.
- **Turcomano (tk):** el IBT publica la Biblia completa en turcomano (latino, 2026) en EPUB, y el propio texto declara CC BY-NC-ND 4.0; por eso se reparte con `permiso: 'formato'`, como el tunecino y el tarifit. No está en eBible: se convierte el EPUB a USFM (se descartan notas, referencias cruzadas, glosario e introducciones; los versículos que la fuente agrupa, como «1-2», se conservan agrupados; la poesía se une en párrafo). El IBT numera como la Biblia Sinodal rusa (los Salmos siguen la numeración griega y cuentan el título como versículo, y cambia algún número suelto), así que el generador avisa de 79 «tramos sin texto» que son diferencia de numeración, igual que en el ruso: el texto está. Las condiciones de uso del IBT (`ibtrussia.org/rules`) solo hablan de uso personal y de permiso escrito para otras webs; la licencia CC de la edición es la base para repartirlo. Si el IBT lo pidiera, se retira.
- **Uzbeko (uz):** misma situación que el turcomano: Biblia completa del IBT en latino (EPUB), con CC BY-NC-ND 4.0 declarada en el propio texto y `permiso: 'formato'`. Se usa la edición latina (la oficial desde la reforma de escritura); existe otra cirílica que no se incluye. Numera como la Sinodal rusa (79 «tramos sin texto» que son diferencia de numeración). Las ilustraciones de la edición llevan otros derechos y no se incluyen. Mismas condiciones del IBT que el turcomano: si lo pidiera, se retira.
- **Tayiko (tg):** Biblia completa del IBT de 1992 (31.164 versículos, 66 libros) desde el HTML de dbs.org. Licencia en conflicto dentro de la propia fuente (BY-NC-ND 4.0 en la ficha; CC BY-SA 3.0 en los metadatos del EPUB): se trata como la más restrictiva, `permiso: 'formato'`. Mismas condiciones del IBT: si lo pidiera, se retira.
- **Dari (prs):** Biblia completa en dari (30.659 versículos, 66 libros) desde el HTML de dbs.org. La licencia CC BY-NC-ND la declara la ficha de la edición, sin indicar versión y sin que el propio archivo traiga ninguna declaración; es una base más débil que en turcomano o uzbeko. Además une con frecuencia varios versículos en uno, sobre todo en el AT: el generador avisa de 580 «tramos sin texto» (Números 144, Levítico 67…); es numeración, no texto perdido (comprobado en Génesis 6:19-20; el total de versículos, 30.659 frente a 31.102, cuadra con esa explicación), no tramo a tramo. Se retira si el titular lo pide.
- **Baluchi meridional (bcc):** primera fuente de baluchi con licencia abierta (CC BY-SA, declarada por la ficha de dbs.org). Es parcial: 12 libros del NT (5.185 versículos), sin las cartas de Pablo, Hebreos ni Apocalipsis, y con 20 pasajes ausentes en el original (listados en su «Acerca de»). Se declara con `soloLibros` en `traducciones.js`.
- **Checheno (ce):** Biblia completa del IBT (2012; 31.102 versículos). La licencia CC BY-NC-ND la declara la ficha de dbs.org, no el propio archivo. Numera como la Sinodal rusa y une algunos versículos en uno (el generador avisa de 138 «tramos sin texto»: 63 de Salmos por la numeración griega y el resto por versículos unidos u omitidos a propósito; comprobado por muestreo, no tramo a tramo). Mismas condiciones del IBT: si lo pidiera, se retira.
- **Árabe tunecino (aeb):** CC BY-NC-ND 4.0 de United Bible Societies, con `permiso: 'formato'` (se reparte; cifrar y comprimir se tratan como cambio técnico de formato). Una confirmación expresa de UBS sería deseable, no es imprescindible. Es solo el Nuevo Testamento (`soloNT: true`).
- **Azerí (az):** CC BY-NC-ND con permiso expreso de cambio de formato (marca `permiso: 'formato'`, no se bloquea). Pedir confirmación a Bible Society of Azerbaijan / Institute for Bible Translation de que cubre omitir notas e introducciones, cifrar y repartir copias con clave distinta.
- **Turco (YTC), somalí (SIM) y tibetano (NTB):** son CC BY-ND / BY-NC-ND. Se usan con `permiso: 'formato'` (ya salen en copias): la licencia permite redistribuir en cualquier formato sin cambiar palabras ni puntuación y el cifrado y la compresión se tratan como cambio técnico de formato. El responsable del proyecto pide igualmente la confirmación expresa: que cubre pasar el texto a datos comprimidos y cifrados, omitir notas e introducciones, y repartir copias con clave distinta. Alternativa limpia para el turco: `turobt` (Biblica, CC BY-SA, solo Nuevo Testamento).
- **Ruso:** ya incluida la Russian Open Bible (CC BY-SA, sin permiso). Mejora opcional: Новый Перевод на Русский Язык (Biblica, 2006, derechos reservados); hace falta que Biblica dé el texto.
- **Birmano:** ya incluida la Common Language Bible (Bible Society of Myanmar, 2005). eBible la marca como dominio público, pero su copyright rige dentro de Myanmar. El texto de eBible tiene Habacuc 3 vacío y Cantares desplazado un versículo (se parchean con la Judson), y Job, Proverbios y Eclesiastés están en un birmano más antiguo.
- El permiso debe cubrir expresamente: empaquetar el texto comprimido y cifrado en un HTML, repartir copias distintas byte a byte con clave nueva, y que la atribución vaya dentro del contenido cifrado.

**Retoques a las fuentes.** `traducciones.js` declara cada retoque y el «Acerca de» de la copia lo anota (CC BY-SA obliga a indicar los cambios). Ninguno cambia palabras. Ruso: se quitan los títulos «Глава …», seis asteriscos sueltos y Jonás 2:11, que en la fuente repite el 2:10 (`sinRepetidos`), y cada versículo va en su párrafo. Birmano: se quitan la nota de «fin de libro» de 22 libros, unos 15.000 guiones sueltos que dejaron las notas, los «%» de Habacuc, una referencia cruzada filtrada en Mt 5:27, y las comillas ASCII pasan a tipográficas; Cantares y Habacuc 3 vienen de la Judson, cuyo texto lleva espacios entre palabras y se ve más suelto que el resto. Job 30:30-31 sigue fusionado en un solo versículo en la fuente, y Juan 7:53 va dentro del 8:1 («luego cada uno se fue a su casa; el Señor Jesús fue al monte de los Olivos»): el texto está, falta el número.

**Versículos sin texto.** Algunas traducciones no traen ciertos versículos y no es un fallo del generador: las modernas omiten a propósito Mt 17:21, 18:11, 23:14, Mr 7:16, 9:44-46, 11:26, 15:28, Lc 17:36, 23:17, Jn 5:4, Hch 8:37… (inglés y hausa: 17 pasajes); en árabe, indonesio, kurdo y uigur son 1–9 casos de numeración distinta. `faltantes()` los detecta al generar.

**Qué hay que NO usar.** `lib/lineas.js` lee el formato «un versículo por línea» de BibleNLP/ebible-corpus, pero ese formato **pierde ~150 versículos** (Joel 2:28-32 y 3:6-21, Malaquías 4, Números 16:36-50…) porque su numeración es la hebrea. Se conserva solo por si no hay otra fuente; si se usa, el archivo debe avisarlo dentro.

**Francés y portugués:** la néo-Crampon usa la numeración hebrea (Joel 2:28-32 va como Joel 3, Malaquías 4 como 3:19-24…), por eso el generador avisa de 45 «tramos sin texto»: el texto está completo, solo cambia el número. La Bíblia Livre solo avisa de 3 Juan 1:15 y Apocalipsis 12:18, que van unidos al versículo anterior. Se descartó la Nova Bíblia Viva de Biblica (poronbv, CC BY-SA) por ser una paráfrasis; queda como alternativa.

**Ruso:** la ROB numera como la Biblia Sinodal, la que conocen los lectores rusos: los Salmos siguen la numeración griega (el 23 es el 22; el 119, el 118) y cuentan el título como versículo, y en algunos libros cambia el número de algún versículo. Por eso el generador avisa de 73 «tramos sin texto». Comprobado salmo a salmo frente al francés (que usa la numeración hebrea) y tramo a tramo en el resto: el texto está, salvo **Apocalipsis 12:18** («y se quedó en la arena del mar»), que la fuente no trae. Además la fuente une varios versículos en uno (Números 13:33, Job 39:30 y 40:24, Eclesiastés 4:16, Cantares 7:13, Isaías 3:19, Daniel 3:30, Oseas 14:9, 2 Corintios 11:32): el texto está, pero faltan esos números. El «Acerca de» del ruso lo dice.

**Otros defectos de las fuentes**: en persa, el Salmo 136:3 repetía el 136:2 y falta su texto propio («al Señor de los señores»); se quita el duplicado (`sinRepetidos`) y se avisa en «Acerca de», así que la numeración salta del 2 al 4. En indonesio, Isaías 22:10 y 22:11 solo dicen «(22:9)» porque la fuente agrupa su texto en el 22:9: no falta nada, solo los números.

**Coreano:** se usa la Korean Revised Version (개역한글, 1961) del CSV de scrollmapper. La única de dominio público en eBible (`kor`, 1910) está truncada (1 Pedro acaba en 4:14, Colosenses en 4:9, el Salmo 118 en el v. 9; 45 tramos sin texto) y se descartó. La Sociedad Bíblica de Corea declara en su web que los derechos de explotación de la 개역한글 vencieron el 31-12-2011 y se puede usar sin permiso; siguen vigentes los derechos morales (citar la autoría y no alterar el texto). El CSV trae 20 números de versículo sin texto propio (lista en el «Acerca de»), pero no falta ninguna palabra: unos van unidos al versículo anterior en la propia traducción (Romanos 9:1-2, Isaías 30:1-2…) y otros los omite a propósito. Los nombres de los libros están escritos a mano.

**Fuera:** el tayiko (CC BY-NC-ND y casi incompleto) y el amhárico (solo Nuevo Testamento, copyright de la Bible Society of Ethiopia sin licencia clara). **No encontrados en eBible:** uzbeko, tigriña y pastún.

**Sin revisar por nativos:** los nombres de los libros salen de la propia traducción en todos los idiomas. La interfaz existe en 25 idiomas (es, en, fr, pt, ru, ar, fa, zh, id, vi, my, tr, hi, ko, bn, ha, ckb, ug, ur, so, bo, sw, hne, om, or); el menú del lector sale en el idioma del teléfono si el archivo lo tiene. La de bengalí, hausa, kurdo, uigur, urdu, somalí, suajili, oromo, odia y tibetano es de IA; la de chhattisgarhi es la hindi con su propio nombre y la menos fiable, sobre todo la tibetana. La vietnamita y la birmana están redactadas por IA; la birmana es la menos fiable y no debe repartirse sin revisión nativa. Las dedicatorias de todos los idiomas salvo es y en también son de IA; las de hausa, kurdo, uigur, somalí, suajili, oromo, odia y tibetano son las menos fiables (la de chhattisgarhi es la hindi). El texto de licencia dentro del archivo está en español.

## Qué falta antes de dárselo a alguien en riesgo

1. **Probarlo en teléfonos reales**, sobre todo Android antiguos. La clave se deriva con Argon2id en WebAssembly: un navegador que no lo permita dentro del archivo (`'wasm-unsafe-eval'`) no podrá abrirlo nunca, y quien lo intente creerá que la clave está mal. Comprobado solo en Chrome 157 (Android 10); faltan Brave, Samsung Internet, Firefox, navegadores antiguos e iPhone. abrir el archivo desde el gestor de archivos, desde WhatsApp y desde Telegram; que la clave abra; que «Enviar» funcione por Bluetooth. No sé todavía si todos los navegadores móviles permiten descifrar en un archivo abierto de esa forma. Con los 18 idiomas (~28 MB): probar en teléfonos de **1–2 GB de RAM** y medir cuánto tarda en pasar por Bluetooth.
2. **Revisión por hablantes nativos** de la interfaz en los 23 idiomas que no son español ni inglés; primero las frases de clave y copia (`h1`, `hp`, `h2`, `e1`, `e2`). Los textos nuevos de idioma y copia (`nm`, `lg`, `cl`, `cc`, `e3`, `ks`, `ot`, `h3`, `fi`, `nc` en `src/ui.js`) también son de IA.
3. **Licencias**: elegir, para cada uno de los 44 idiomas, una traducción que se pueda redistribuir.
4. **Auditoría externa** del cifrado y del modelo de amenazas.
5. **Decidir el origen**: cómo llega la primera copia a cada país (ver [AMENAZAS.md](AMENAZAS.md)).
6. **Programa congelado**: desde ahora, cada cambio en `src/app.js`, `src/app.css` o `src/argon2.js` añade su versión a `versiones.json` en el mismo commit (`node versiones.js --añadir`); `npm test` falla si falta. Ninguna versión se borra nunca: las copias repartidas dependen de la lista. Si una versión resulta tener un fallo, se le pone un aviso en vez de quitarla.

## Estructura

```
  generar.js        el comando que crea el archivo
  verificar.js      comprueba que un archivo lleva una versión publicada del programa
  versiones.json    versiones publicadas del programa (huellas SHA-256 del script y los estilos)
  versiones.js      calcula la huella actual y la añade a versiones.json
  src/app.js        la app (portada + lector). Va tal cual dentro del archivo, sin minificar
  src/argon2.js     Argon2id para derivar la clave (hash-wasm 4.13.0, licencia MIT, sin cambios). Va delante de la app
  src/app.css       estilos
  src/ui.js         textos de la interfaz por idioma
  lib/texto.js      lee USFM y USFX
  lib/lineas.js     lee «un versículo por línea» (ebible-corpus) y detecta lo que falta
  lib/csv.js        lee CSV de scrollmapper
  lib/nombres.js    nombres de los 66 libros en 12 idiomas
  traducciones.js   las 44 traducciones elegidas y su licencia
  generar-todos.js  genera un archivo con todas las traducciones
  lib/paquete.js    reparte en bloques, comprime (LZMA o zlib), cifra y ensambla
  lib/nucleo.js     carga en Node el mismo código de cifrado que usa la app
  lib/zip.js        lee los .zip de eBible
  tests/            pruebas y textos de muestra (dominio público)
  movil/            páginas de diagnóstico para teléfonos (sin Biblia)
```

Dentro del archivo solo va una librería de terceros: el Argon2id de hash-wasm (`src/argon2.js`, licencia MIT; su cabecera lleva la huella del original para comprobar que no se ha tocado). Para generar: Node y, para LZMA, la orden `xz`.

## Cómo se contribuye

Los cambios entran por pull request y se fusionan con **Squash and merge**: `main` recibe un solo commit por PR, creado y firmado por GitHub (sale «Verified»). Antes de fusionar, el CI debe ejecutar `npm test` en verde (48 pruebas).
