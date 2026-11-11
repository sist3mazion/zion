'use strict';
/**
 * Las traducciones elegidas para repartir, con su licencia y de dónde sale cada texto.
 * Solo entran obras de dominio público o con licencia que permite copiar y redistribuir
 * (CC BY-SA, CC BY-NC). Se dejan fuera las CC BY-ND y BY-NC-ND (prohíben obras derivadas).
 *   fuente: archivo dentro de la carpeta de fuentes. formato: 'usfx' (completo) | 'csv' (scrollmapper, completo) | 'lineas' (ebible-corpus: pierde ~150 versículos, se avisa dentro)
 */
module.exports = [
  { id: 'es',  nombre: 'Versión Biblia Libre (VBL)', fuente: 'spa-vbl.usfx.xml', formato: 'usfx',
    acerca: 'Versión Biblia Libre. © Jonathan Gallagher y Shelly Barrios de Avila, Free Bible Ministry. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente (freebibleversion.org) y con la misma licencia.' },
  { id: 'en',  nombre: 'Free Bible Version (FBV)', fuente: 'eng-engfbv.txt', formato: 'lineas', nombres: 'en',
    acerca: 'Free Bible Version. Free Bible Ministry. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente (freebibleversion.org) y con la misma licencia. Solo texto: sin notas ni títulos.' },
  { id: 'zh',  nombre: '和合本 (简体)', fuente: 'chi-cuv-simp.usfx.xml', formato: 'usfx',
    acerca: 'Chinese Union Version (simplified). Dominio público.' },
  { id: 'ar',  nombre: 'الترجمة العربية المبسطة (NAV)', fuente: 'arb-arbnav.txt', formato: 'lineas', nombres: 'ar',
    acerca: 'Arabic Standard Version (NAV). © Biblica, Inc. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia. Solo texto.' },
  { id: 'fa',  nombre: 'ترجمه قدیم (OPV)', fuente: 'pes-pesOPV.txt', formato: 'lineas', nombres: 'fa',
    acerca: 'Persian Old Version. Dominio público. Solo texto.' },
  { id: 'ru',  nombre: 'Синодальный перевод', fuente: 'sm-RusSynodal.csv', formato: 'csv', nombres: 'ru',
    acerca: 'Traducción Sinodal rusa. Dominio público. Solo texto.' },
  { id: 'hi',  nombre: 'मानक हिन्दी बाइबल (2017)', fuente: 'hin-hin2017.txt', formato: 'lineas', nombres: 'hi',
    acerca: 'Hindi Standard Bible 2017. © Bridge Connectivity Solutions. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia. Solo texto.' },
  { id: 'bn',  nombre: 'বাংলা IRV', fuente: 'ben-benirv.txt', formato: 'lineas', nombres: 'bn',
    acerca: 'Bengali Indian Revised Version. © Bridge Connectivity Solutions Pvt. Ltd. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia. Solo texto.' },
  { id: 'id',  nombre: 'Alkitab Yang Terbuka (AYT)', fuente: 'ind-indayt.txt', formato: 'lineas', nombres: 'id',
    acerca: 'Alkitab Yang Terbuka (AYT). © YLSA-AYT. Licencia CC BY-NC 4.0: puedes copiarla y repartirla citando la fuente y sin fines comerciales. Solo texto.' },
  { id: 'vi',  nombre: 'Kinh Thánh 1934', fuente: 'sm-Viet.csv', formato: 'csv', nombres: 'vi',
    acerca: 'Kinh Thánh Tiếng Việt 1934. Dominio público. Solo texto.' },
  { id: 'my',  nombre: 'ဗမာ ဂျပ်စန် (Judson)', fuente: 'sm-BurJudson.csv', formato: 'csv', nombres: 'my',
    acerca: 'Burmese Judson Bible. Adoniram Judson. Dominio público. Solo texto.' },
  { id: 'ha',  nombre: 'Hausa Littafi Mai Tsarki', fuente: 'hau-hausa.txt', formato: 'lineas', nombres: 'ha',
    acerca: 'Hausa Bible. © Biblica, Inc. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando a Biblica y con la misma licencia. Solo texto.' },
  { id: 'ckb', nombre: 'کوردی سۆرانی', fuente: 'ckb-ckb.txt', formato: 'lineas', nombres: 'ckb',
    acerca: 'Central Kurdish (Sorani) Bible. Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia. Solo texto.' },
  { id: 'ug',  nombre: 'ئۇيغۇرچە (ئەرەب يېزىقى)', fuente: 'uig-uigara.txt', formato: 'lineas', nombres: 'ug',
    acerca: 'Uyghur Bible (Arabic script). Licencia CC BY-SA 4.0: puedes copiarla y repartirla citando la fuente y con la misma licencia. Solo texto.' }
];
