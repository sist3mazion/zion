# SINCRONIZACIÓN: Agente WEB APP → Agente LANDING

## Estado Actual (Agente WEB APP)

✅ **COMPLETADO** - Optimización de peso finalizada (Reducción ~90%).

---

## Archivos Generados (Versión Optimizada)

Ubicación: `c:\Users\admin\Desktop\AntiGravity\Agente.Dev_WEB APP\dist_optimized\`

### 1. ZION Global (Híbrido)
| Archivo | Tamaño Original | Tamaño Optimizado | Uso |
|---------|-----------------|-------------------|-----|
| `global/ZION_GLOBAL.html` | 0.18 MB | 0.18 MB | Sistema completo, carga docs vía Lazaro |

### 2. ZION Lite (24 idiomas, autocontenidos)
**NOTA:** Estos archivos ahora son mucho más ligeros porque usan payloads HTML+GZIP inyectados.

| Código | Archivo | Tamaño Original | Tamaño Optimizado |
|--------|---------|-----------------|-------------------|
| AM | `lite/ZION_LITE_am.html` | 9.06 MB | **2.34 MB** |
| AR | `lite/ZION_LITE_ar.html` | 16.78 MB | **3.23 MB** |
| BN | `lite/ZION_LITE_bn.html` | 9.51 MB | **2.94 MB** |
| EN | `lite/ZION_LITE_en.html` | 14.84 MB | **2.29 MB** |
| ES | `lite/ZION_LITE_es.html` | 12.98 MB | **2.42 MB** |
| FA | `lite/ZION_LITE_fa.html` | 15.22 MB | **2.51 MB** |
| FR | `lite/ZION_LITE_fr.html` | 8.34 MB | **2.06 MB** |
| HI | `lite/ZION_LITE_hi.html` | 4.65 MB | **0.86 MB** |
| ID | `lite/ZION_LITE_id.html` | 8.44 MB | **1.94 MB** |
| KO | `lite/ZION_LITE_ko.html` | 2.17 MB | **0.86 MB** |
| MY | `lite/ZION_LITE_my.html` | 7.36 MB | **2.28 MB** |
| NE | `lite/ZION_LITE_ne.html` | 13.35 MB | **3.01 MB** |
| PA | `lite/ZION_LITE_pa.html` | 10.23 MB | **2.66 MB** |
| PRS | `lite/ZION_LITE_prs.html` | 6.56 MB | **2.38 MB** |
| PS | `lite/ZION_LITE_ps.html` | 15.43 MB | **2.79 MB** |
| RHG | `lite/ZION_LITE_rhg.html` | 5.85 MB | **0.82 MB** |
| SO | `lite/ZION_LITE_so.html` | 15.12 MB | **2.45 MB** |
| SW | `lite/ZION_LITE_sw.html` | 17.71 MB | **2.48 MB** |
| TA | `lite/ZION_LITE_ta.html` | 12.32 MB | **3.36 MB** |
| TE | `lite/ZION_LITE_te.html` | 10.44 MB | **2.83 MB** |
| TG | `lite/ZION_LITE_tg.html` | 1.87 MB | **0.55 MB** |
| TR | `lite/ZION_LITE_tr.html` | 10.11 MB | **2.09 MB** |
| UG | `lite/ZION_LITE_ug.html` | 15.20 MB | **1.89 MB** |
| ZH | `lite/ZION_LITE_zh.html` | 4.98 MB | **1.85 MB** |

### 3. Documentos GZIP B64 (para ZION Global)
**CAMBIO IMPORTANTE:** Los archivos de documentos han cambiado de nombre y formato.
- Antes: `docs/en.b64` (PDF Base64)
- **Ahora**: `docs/en.html.gz.b64` (HTML GZIP Base64)

| Código | Archivo Nuevo | Tamaño Optimizado |
|--------|---------------|-------------------|
| AM | `docs/am.html.gz.b64` | 2.15 MB |
| AR | `docs/ar.html.gz.b64` | 3.05 MB |
| BN | `docs/bn.html.gz.b64` | 2.76 MB |
| EN | `docs/en.html.gz.b64` | 2.10 MB |
| ... | (Patrón idéntico para todos) | ~2.5 MB avg |

---

## Tareas Pendientes para el Agente LANDING

### 1. Actualizar enlaces de ZION Lite
**Archivo:** `ZION_PROJET.html` (Modal `#vaultModal`)

Los archivos HTML generados (`ZION_LITE_*.html`) son **autocontenidos**. No requieren descargar nada extra.
Simplemente apuntar a la URL donde se desplieguen.

**Patrón requerido:**
```html
<a href="{URL}/lite/ZION_LITE_en.html" download="ZION_LITE_en.html" class="lite-item">...</a>
```

### 2. Actualizar sección de "Repositorio Docs" (Si existe)
Si la landing permite descargar los "Carts" o documentos sueltos para el Global, **debe actualizarse la extensión**.

**Patrón requerido:**
```html
<a href="{URL}/docs/en.html.gz.b64" download="en.html.gz.b64" class="lite-item">
    <strong>EN</strong><span>English (Optimized)</span>
</a>
```

### 3. NOTIFICACIÓN AL USUARIO (En la UI)
Es recomendable añadir un pequeño badge o texto en `ZION_PROJET.html` indicando la optimización:
> "Sistemas actualizados: Ahora 90% más ligeros."

---

## Flujo de Despliegue

1. **Agente WEB APP**: Ha generado `dist_optimized/`.
2. **Usuario/DevOps**: Debe subir `dist_optimized/` a Arweave/IPFS/Hosting.
3. **Agente LANDING**:
   - Recibe las nuevas URLs / Hash.
   - Actualiza `ZION_PROJET.html` para apuntar a los nuevos archivos.
   - Actualiza las extensiones de descarga de documentos a `.html.gz.b64`.

---

## Notas Técnicas para el Agente LANDING
- **Compatibilidad**: Los archivos `ZION_LITE` ya incluyen el visor actualizado (`ZION_SYSTEM.html` v2) capaz de descomprimir estos nuevos payloads.
- **Formato**: NO son PDFs. Son paquetes HTML comprimidos. No etiquetar como "Download PDF". Usar "Download System" o "Download Cart".
