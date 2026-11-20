#!/usr/bin/env node
'use strict';
/**
 * Huella de la versión actual del programa, para añadirla a versiones.json.
 *
 *   node versiones.js          muestra la huella y dice si ya está en la lista
 *   node versiones.js --añadir la añade con la fecha de hoy (si no estaba)
 */
const fs = require('fs');
const path = require('path');
const { huellaActual, VERSIONES } = require('./lib/paquete');

const h = huellaActual();
const ya = VERSIONES.find(v => v.js === h.js && v.css === h.css);
console.log('programa: ' + h.js + '\nestilos:  ' + h.css);
if (ya) { console.log('✔ Ya está en versiones.json (' + ya.fecha + ').'); process.exit(0); }
if (!process.argv.includes('--añadir')) { console.log('✖ No está en versiones.json. Añádela con: node versiones.js --añadir'); process.exit(1); }
const ruta = path.join(__dirname, 'versiones.json');
const d = JSON.parse(fs.readFileSync(ruta, 'utf8'));
d.versiones.push({ fecha: new Date().toISOString().slice(0, 10), js: h.js, css: h.css, aviso: '' });
fs.writeFileSync(ruta, JSON.stringify(d, null, 2) + '\n');
console.log('✔ Añadida.');
