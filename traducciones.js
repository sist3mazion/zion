'use strict';
/**
 * Las traducciones elegidas para repartir, con su licencia y de dónde sale cada texto.
 * Solo entran obras de dominio público o con licencia que permite copiar y redistribuir
 * (CC BY-SA, CC BY-NC). Las CC BY-ND y BY-NC-ND (turco, somalí, tibetano) entran solo con `permiso: 'pendiente'` (el titular aún no ha contestado; ver README).
 *   fuente: archivo dentro de la carpeta de fuentes. formato: 'usfx' (completo) | 'csv' (scrollmapper, completo) | 'zip' (USFM de eBible.org, completo; es la vía recomendada) | 'lineas' (ebible-corpus: pierde ~150 versículos)
 */
module.exports = [
  { id: 'es',  nombre: 'Versión Biblia Libre (VBL)', fuente: 'spa-vbl.usfx.xml', formato: 'usfx',
    acerca: 'Versión Biblia Libre. © Jonathan Gallagher y Shelly Barrios de Avila, Free Bible Ministry. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente (freebibleversion.org) y con la misma licencia.' },
  { id: 'en',  nombre: 'Free Bible Version (FBV)', fuente: 'engfbv_usfm.zip', formato: 'zip',
    acerca: 'Free Bible Version. Free Bible Ministry. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente (freebibleversion.org) y con la misma licencia. Solo texto: sin notas ni títulos.' },
  { id: 'zh',  nombre: 'Biblica® 圣经当代译本开放资源', fuente: 'cmncbs_usfm.zip', formato: 'zip',
    acerca: 'Biblica® 圣经当代译本™开放资源 (Open Chinese Contemporary Bible, escritura simplificada). 版权所有©1979, 2005, 2007, 2011, 2022 Biblica, Inc. Copyright © 1979, 2005, 2007, 2011, 2022 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia (open.bible).' },
  { id: 'ar',  nombre: 'الترجمة العربية المبسطة (NAV)', fuente: 'arbnav_usfm.zip', formato: 'zip',
    acerca: 'Arabic Standard Version (NAV). © Biblica, Inc. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia.' },
  { id: 'fa',  nombre: 'کتاب مقدس، ترجمۀ معاصر رایگان', fuente: 'pesopcb_usfm.zip', formato: 'zip',
    // Salmo 136:3 repite en la fuente el 136:2: se quita (lib/texto.js, sinRepetidos)
    sinRepetidos: true,
    acerca: 'کتاب مقدس، ترجمۀ معاصر رایگان Biblica® (Biblica® Open Persian Contemporary Bible 2022). Copyright © 2022 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia (open.bible). تغییر: در منبع، مزمور ۱۳۶:۳ عین مزمور ۱۳۶:۲ را تکرار می‌کرد و حذف شد.' },
  { id: 'ru',  nombre: 'Русская открытая Библия (РОБ)', fuente: 'ru_rob.zip', formato: 'zip', quitarTitulos: '^Глава\\s+([ХX]|\\d+)$',
    // Jonás 2:11 repite en la fuente el 2:10: se quita (lib/texto.js, sinRepetidos)
    sustituciones: [['\\*', '']], versiculoPorParrafo: true, sinRepetidos: true,
    acerca: 'Русская открытая Библия (Russian Open Bible, ROB), versión 8 (2021). Door43 World Missions Community / Russian Open Bible Committee. Revisión moderna basada en la Biblia Sinodal rusa de 1876 (dominio público) y alineada con el unfoldingWord Greek New Testament. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente (door43.org) y con la misma licencia.\n\nCambios respecto al original: se han quitado los títulos de relleno «Глава …» de cada capítulo, seis asteriscos sueltos (3 Reyes 7, 10 y 20) y Jonás 2:11, que en la fuente repite el 2:10; y cada versículo va en su propio párrafo. No se ha cambiado ninguna palabra.\n\nNumeración de la Biblia Sinodal. La fuente une algunos versículos en uno (el texto está, falta el número; por ejemplo Job 39:30 y 40:24, Daniel 3:30) y no trae el texto de Apocalipsis 12:18.' },
  { id: 'hi',  nombre: 'मानक हिन्दी बाइबल (2017)', fuente: 'hin2017_usfm.zip', formato: 'zip',
    acerca: 'Hindi Standard Bible 2017. © Bridge Connectivity Solutions. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' },
  { id: 'bn',  nombre: 'বাংলা IRV', fuente: 'benirv_usfm.zip', formato: 'zip',
    acerca: 'Bengali Indian Revised Version. © Bridge Connectivity Solutions Pvt. Ltd. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' },
  { id: 'id',  nombre: 'Alkitab Yang Terbuka (AYT)', fuente: 'indayt_usfm.zip', formato: 'zip',
    acerca: 'Alkitab Yang Terbuka (AYT). © YLSA-AYT. Uso no comercial y citando la fuente. AVISO: su licencia es ambigua (dice a la vez «compartible» y «sin obras derivadas»); confirmar con YLSA (ylsa@sabda.org) antes de repartir.' },
  { id: 'vi',  nombre: 'Thiên Ban Kinh Thánh Hiện Đại', fuente: 'vieovcb_usfm.zip', formato: 'zip',
    acerca: 'Biblica® Thiên Ban Kinh Thánh Hiện Đại™ (Biblica® Open Vietnamese Contemporary Bible™). Copyright © 1982, 1987, 1994, 2005, 2015 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia (open.bible).' },
  { id: 'my',  nombre: 'ဗမာ ကျမ်းစာ (Common Language Bible)', fuente: 'mya_usfm.zip', formato: 'zip',
    // la fuente de eBible trae Habacuc 3 vacío y Cantares desplazado un versículo: se toman de la Judson (myajvb)
    parches: [{ fuente: 'myajvb_usfm.zip', libros: ['SNG'], capitulos: { HAB: [3] }, sustituciones: [['\\s+([၊။])', '$1']] }],
    // restos de conversión de la fuente: «%» sueltos en Habacuc, el «-» que queda de cada nota al final de unos 15.000 versículos, una referencia cruzada filtrada en Mt 5:27 y comillas ASCII
    sustituciones: [['%\\s?', ''], ['-ထွ၊ ၂၀:၁၄။ တရား၊ ၅:၁၈။\\*\\s*$', ''], ['-+(?=\\s*$)', ''], ['-(?=\\))', ''], ['``', '\u201c'], ["''", '\u201d'], ['`', '\u2018'], ["'", '\u2019']],
    quitarFinal: '[^။]*(?:ကျမ်း|သီချင်းစာ)[\\u200b\\s]*ပြီး[\\u200b\\s]*၏[\\u200b\\s]*။[\\u200b\\s]*$',
    acerca: 'Burmese Common Language Bible. © 2005 Bible Society of Myanmar. Dominio público fuera de Myanmar según eBible.org (Myanmar no firmó el Convenio de Berna); dentro de Myanmar rige el copyright de la Bible Society of Myanmar.\n\nProcedencia mixta: el texto CLB de eBible trae Habacuc 3 vacío y Cantares desplazado un versículo, así que Cantares (entero) y Habacuc 3 son de la versión Judson de 1840 (dominio público, eBible.org). Job, Proverbios y Eclesiastés siguen en esa fuente un birmano más antiguo, muy cercano a la Judson. Cambios respecto a la fuente: se han quitado la nota de «fin de libro» que cierra muchos libros, guiones y símbolos «%» sueltos, una referencia cruzada filtrada en Mt 5:27, y las comillas se han pasado a tipográficas. No se ha cambiado ninguna palabra. Job 30:31 va unido al 30:30 y Juan 7:53 al 8:1: el texto está, falta el número.' },
  { id: 'ha',  nombre: 'Hausa Littafi Mai Tsarki', fuente: 'hausa_usfm.zip', formato: 'zip',
    acerca: 'Hausa Bible. © Biblica, Inc. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia.' },
  { id: 'ckb', nombre: 'کوردی سۆرانی', fuente: 'ckb_usfm.zip', formato: 'zip',
    acerca: 'Biblica® وەشانی بێبەرامبەری کوردیی سۆرانیی ستاندەر (Biblica® Open Kurdi Sorani Standard Version). Copyright © 1998, 2011, 2016, 2020 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica (www.biblica.com, open.bible) y con la misma licencia.' },
  { id: 'ug',  nombre: 'ئۇيغۇرچە (ئەرەب يېزىقى)', fuente: 'uigara_usfm.zip', formato: 'zip',
    acerca: 'مۇقېددېس كالام (يەنگى يېزىق), Uyghur Bible (Arabic script). © 2010 Mukeddes Kalam - Uyghur Bible Translation Committee. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' },
  { id: 'ur',  nombre: 'Biblica® آزادانہ اردو ہم عصر ترجمہ', fuente: 'urdoucv_usfm.zip', formato: 'zip',
    acerca: 'Biblica® آزادانہ اردو ہم عصر ترجمہ (Biblica® Open Urdu Contemporary Version). Copyright © 1999, 2005, 2022, 2024 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia (open.bible).' },
  { id: 'tr',  nombre: 'Yorumsuz Türkçe Çeviri (YTC)', fuente: 'turytc_usfm.zip', formato: 'zip', permiso: 'pendiente',
    acerca: 'Yorumsuz Türkçe Çeviri (YTC, Turkish WEB). Copyright © 2023-2025 İsmail Serinken y eBible.org. Licencia CC BY-ND 4.0 (atribución, sin obras derivadas); la copia solo cambia el formato del texto y omite notas y títulos de sección.' },
  { id: 'so',  nombre: 'Kitaabka Quduuska Ah', fuente: 'som_usfm.zip', formato: 'zip', permiso: 'pendiente',
    acerca: 'Kitaabka Quduuska Ah (Somali Bible). Copyright © 1979, 2008 Society for International Ministries (Kenia). Licencia CC BY-NC-ND 4.0, según la página actual de eBible (la propia fuente conserva también el aviso de la 3.0): atribución, uso no comercial, sin obras derivadas; la licencia permite pasar el texto a otros formatos sin cambiar texto ni puntuación. Esta copia omite notas y títulos de sección.' },
  { id: 'bo',  nombre: 'དམ་པའི་གསུང་རབ་བོད་འགྱུར་གསར་མ།', fuente: 'bodn_usfm.zip', formato: 'zip', permiso: 'pendiente',
    acerca: 'དམ་པའི་གསུང་རབ་བོད་འགྱུར་གསར་མ། (New Tibetan Bible). Copyright © 2016-2023 New Tibetan Bible Translation Committee. Licencia CC BY-NC-ND 4.0 (atribución, uso no comercial, sin obras derivadas); esta copia solo cambia el formato del texto y omite notas y títulos de sección.' },
  { id: 'fr',  nombre: 'Sainte Bible néo-Crampon Libre', fuente: 'francl_usfm.zip', formato: 'zip', sinDeuterocanonicos: true,
    acerca: 'Sainte Bible néo-Crampon Libre, modernización de la traducción católica francesa de Crampon. © 2022 Fraternité de Tibériade. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia. Sin notas. Conserva los títulos y resúmenes de sección y las referencias paralelas de la edición. Sin los libros deuterocanónicos (Tobías, Judit, Sabiduría, Eclesiástico, Baruc y 1-2 Macabeos), para repartir los mismos 66 libros que en los demás idiomas.' },
  { id: 'pt',  nombre: 'Bíblia Livre (BLIVRE)', fuente: 'porbr2018_usfm.zip', formato: 'zip',
    acerca: 'Bíblia Livre (BLIVRE), 2018, actualización de la traducción de João Ferreira de Almeida (1819), edición Textus Receptus. © Diego Santos, Mario Sérgio y Marco Teles. Licencia CC BY 4.0: puedes copiarla y repartirla citando la fuente (sites.google.com/site/biblialivre) e indicando la fecha de la versión (febrero de 2018). Solo texto: sin notas ni títulos.' },
  { id: 'ko',  nombre: '성경전서 개역한글판', fuente: 'KorRV.csv', formato: 'csv', nombres: 'ko',
    acerca: 'Korean Revised Version (성경전서 개역한글판), 1961. © 대한성서공회 (Korean Bible Society) 1961. Dominio público desde el 31 de diciembre de 2011, según la propia Sociedad Bíblica de Corea, que sigue exigiendo citar la autoría y no alterar el texto (derechos morales). Fuente: scrollmapper/bible_databases (KorRV). El texto no se ha cambiado; solo va sin notas ni títulos. NOTA: 20 números de versículo no tienen texto propio. Doce van unidos al versículo anterior en la propia 개역한글 (p. ej. Ro 9:2 dentro de 9:1, Is 30:2 dentro de 30:1; también Sal 72:20, Is 48:2, Jer 21:2, Ez 24:5, Hch 15:26, 2 Co 13:14 y Ap 12:18 por la numeración) y el resto los omite la traducción a propósito (Mt 18:11, Mr 9:44, 9:46, 11:26 y 15:28, Lc 17:36 y 23:17, Hch 8:37, 15:34 y 28:29, Ro 16:24). No falta ninguna palabra.' },
];
