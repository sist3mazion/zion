'use strict';
/**
 * Las traducciones elegidas para repartir, con su licencia y de dónde sale cada texto.
 * Solo entran obras de dominio público o con licencia que permite copiar y redistribuir
 * (CC BY-SA, CC BY-NC). Se dejan fuera las CC BY-ND y BY-NC-ND (prohíben obras derivadas).
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
    acerca: 'کتاب مقدس، ترجمۀ معاصر رایگان Biblica® (Biblica® Open Persian Contemporary Bible 2022). Copyright © 2022 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia (open.bible).' },
  { id: 'ru',  nombre: 'Синодальный перевод', fuente: 'sm-RusSynodal.csv', formato: 'csv', nombres: 'ru',
    acerca: 'Traducción Sinodal rusa. Dominio público.' },
  { id: 'hi',  nombre: 'मानक हिन्दी बाइबल (2017)', fuente: 'hin2017_usfm.zip', formato: 'zip',
    acerca: 'Hindi Standard Bible 2017. © Bridge Connectivity Solutions. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' },
  { id: 'bn',  nombre: 'বাংলা IRV', fuente: 'benirv_usfm.zip', formato: 'zip',
    acerca: 'Bengali Indian Revised Version. © Bridge Connectivity Solutions Pvt. Ltd. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' },
  { id: 'id',  nombre: 'Alkitab Yang Terbuka (AYT)', fuente: 'indayt_usfm.zip', formato: 'zip',
    acerca: 'Alkitab Yang Terbuka (AYT). © YLSA-AYT. Uso no comercial y citando la fuente. AVISO: su licencia es ambigua (dice a la vez «compartible» y «sin obras derivadas»); confirmar con YLSA (ylsa@sabda.org) antes de repartir.' },
  { id: 'vi',  nombre: 'Thiên Ban Kinh Thánh Hiện Đại', fuente: 'vieovcb_usfm.zip', formato: 'zip',
    acerca: 'Biblica® Thiên Ban Kinh Thánh Hiện Đại™ (Biblica® Open Vietnamese Contemporary Bible™). Copyright © 1982, 1987, 1994, 2005, 2015 by Biblica, Inc. «Biblica» es una marca registrada de Biblica, Inc., usada con permiso. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia (open.bible).' },
  { id: 'my',  nombre: 'ဗမာ ကျမ်းစာ (Common Language Bible)', fuente: 'mya_usfm.zip', formato: 'zip',
    acerca: 'Burmese Common Language Bible. © 2005 Bible Society of Myanmar. Dominio público fuera de Myanmar según eBible.org (Myanmar no firmó el Convenio de Berna); dentro de Myanmar rige el copyright de la Bible Society of Myanmar.' },
  { id: 'ha',  nombre: 'Hausa Littafi Mai Tsarki', fuente: 'hausa_usfm.zip', formato: 'zip',
    acerca: 'Hausa Bible. © Biblica, Inc. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia.' },
  { id: 'ckb', nombre: 'کوردی سۆرانی', fuente: 'ckb_usfm.zip', formato: 'zip',
    acerca: 'Central Kurdish (Sorani) Bible. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' },
  { id: 'ug',  nombre: 'ئۇيغۇرچە (ئەرەب يېزىقى)', fuente: 'uigara_usfm.zip', formato: 'zip',
    acerca: 'Uyghur Bible (Arabic script). Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia.' }
];
