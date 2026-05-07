# SISTEMA ZION: ESPECIFICACIONES TÉCNICAS Y ARQUITECTURA
**Versión:** 2.1 (Edición de Resiliencia)
**Estado:** Soberano · Descentralizado · Huella Cero (Zero-Footprint)

---

## 1. MISIÓN E IDENTIDAD
ZION es un bóveda digital descentralizada diseñada para una resiliencia extrema en entornos de alto riesgo. Opera como un **Monolito Híbrido**: un ecosistema completo contenido dentro de archivos HTML únicos, que no requieren ejecución en el servidor, ni bases de datos, ni dependencias externas una vez cargados.

---

## 2. ARQUITECTURA NÚCLEO (EL MONOLITO HÍBRIDO)
ZION sigue una estricta filosofía **Vanilla JS Purist** para asegurar la compatibilidad a través de décadas y dispositivos.

### 2.1. Capas Lógicas
El sistema está estructurado en siete secciones lógicas dentro de cada archivo:
1.  **CONFIG**: Constantes inmutables y parámetros operativos.
2.  **UTILS**: Funciones de ayuda puras (Criptografía, Codificación, ayudantes del DOM).
3.  **STATE**: Gestión de estado nativa (Patrón Observer/FSM).
4.  **STORAGE**: Persistencia de doble capa (IndexedDB para datos, LocalStorage para configuración).
5.  **DOMAIN**: Lógica de negocio central (Cifrado, Esteganografía, Protocolos).
6.  **UI BINDINGS**: Manipulación reactiva del DOM sin frameworks.
7.  **BOOTSTRAP**: Inicialización segura y comprobaciones de integridad.

---

## 3. LA TRÍADA ZION (VERSIONES)

### 3.1. ZION WEB (LA BÓVEDA / VAULT)
*   **Rol:** Centro de operaciones principal.
*   **Capacidades:** Suite completa de cifrado/descifrado, Dead Man Switch (Interruptor de hombre muerto), gestión de múltiples archivos y módulo de Esteganografía Arka.
*   **Almacenamiento:** Utiliza la **Arquitectura Omnibus** para almacenar múltiples documentos de forma segura dentro de un único entorno de navegador.

### 3.2. ZION CORE (LA IMPRESORA)
*   **Rol:** Nodo de distribución y replicación.
*   **Mecanismo:** Incrusta una versión comprimida de la plantilla ZION Lite. Cuando se carga un "Cartucho" PDF, el Core "imprime" un nuevo archivo ZION Lite.
*   **Uso:** Se utiliza para generar kits de supervivencia localizados desde cualquier dispositivo.

### 3.3. ZION LITE (EL CARTUCHO)
*   **Rol:** Documento ultra-portátil y de propósito único.
*   **Optimización:** Utiliza cargas útiles (payloads) **GZIP + Base64**. Un PDF de 15MB se reduce a ~2MB y se incrusta directamente en el HTML.
*   **Portabilidad:** Funciona 100% offline. Cero peticiones externas. Incluye un worker de PDF.js integrado.

---

## 4. PROTOCOLOS DE SEGURIDAD

### 4.1. Protocolo de Pánico (NUKE)
*   **Activador:** Botón manual o brecha de seguridad.
*   **Acción:** Trituración inmediata en memoria de las claves de cifrado y destrucción del DOM. La interfaz es reemplazada por un estado de "Agujero Negro".
*   **Técnico:** Limpia el estado de `window` y activa `localStorage.clear()` + `indexedDB.deleteDatabase()`.

### 4.2. Interruptor de Hombre Muerto (Dead Man Switch - DMS)
*   **Lógica:** Temporizador de inactividad (configurable).
*   **Comportamiento:** Si no se detecta interacción del usuario dentro del umbral, el sistema asume que el usuario está comprometido y activa el Protocolo de Pánico.

### 4.3. Despliegue de Huella Cero (Zero-Footprint)
*   **Privacidad:** Sin cookies, sin rastreadores, sin telemetría.
*   **Integridad:** Todos los scripts externos (CDNs) se cargan con hashes de **Integridad de Subrecursos (SRI)**.

---

## 5. SISTEMA DE CONSTRUCCIÓN (BUILD SYSTEM)

El sistema de construcción (Node.js) es la "Fragua" de Zion.
1.  **GZIP Nivel 9:** Máxima compresión de activos binarios (PDFs/Workers).
2.  **Inyección Base64:** Transformación de binarios en cadenas UTF-8 seguras.
3.  **Reemplazo de Marcadores:** Inyección dinámica de cargas útiles en etiquetas `[[PAYLOAD_HERE]]`.
4.  **Localización:** Inyección automática de 24 diccionarios de idiomas en el motor de traducción.

---

## 6. ENTORNO OPERATIVO IDÓNEO (EFICACIA)

Para una máxima eficacia y seguridad, ZION debe utilizarse en los siguientes "Entornos Ideales":

### 6.1. Entorno Táctico (Alto Riesgo)
*   **Dispositivo:** Máquina aislada (air-gapped, sin internet) o dispositivo de "usar y tirar" (burner).
*   **Navegador:** Tor Browser (para anonimato) o Brave/LibreWolf (para privacidad estricta).
*   **Distribución:** De mano en mano vía USB cifrado o escondido dentro de Imágenes Arka.

### 6.2. Entorno Resiliente (Censura)
*   **Red:** Acceso vía Gateways de IPFS o Arweave.
*   **Redundancia:** Si un gateway es bloqueado, el usuario sondea una lista descentralizada de nodos alternativos.

### 6.3. Uso Diario (Privacidad)
*   **Almacenamiento:** Ejecución local desde un archivo `.html` guardado en el escritorio.
*   **Sincronización:** Uso de la función "Propagate" para sincronizar datos Omnibus entre dispositivos de confianza mediante fragmentos cifrados.

---

## 7. RESUMEN DE CAPACIDADES
*   **Primero Offline (Offline-First):** No se necesita internet tras la primera carga.
*   **Datos Soberanos:** Eres dueño de las llaves y del almacenamiento.
*   **Localizado:** Soporte nativo para 24 idiomas, incluyendo RTL (Árabe/Persa) y escrituras complejas (Amhárico/Birmano).
*   **Esteganográfico:** Capacidad de ocultar sistemas enteros dentro de imágenes de apariencia inocente.

---
*Documento generado por el Arquitecto para la Resiliencia de Zion.*
