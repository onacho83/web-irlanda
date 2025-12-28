# Web Imprenta - Sitio Web Simple

Un sitio web simple y moderno para imprenta, construido con HTML, CSS y JavaScript vanilla. Diseñado para ser fácil de mantener y actualizar.

## 🚀 Características

- **Simple y fácil de editar**: Solo necesitas editar el archivo `config.json` para actualizar la información
- **Sin dependencias**: HTML, CSS y JavaScript puro, sin frameworks ni compilación
- **Responsive**: Se adapta perfectamente a móviles, tablets y escritorio
- **Principios SOLID**: Código bien estructurado y mantenible
- **Modular**: Cada componente tiene su propia responsabilidad

## 📁 Estructura del Proyecto

```
webIrlanda/
├── index.html              # Página principal
├── config.json             # Archivo de configuración (EDITA ESTE PARA ACTUALIZAR)
├── css/
│   └── style.css          # Estilos principales
├── js/
│   ├── main.js            # Aplicación principal
│   ├── config-loader.js   # Cargador de configuración
│   └── renderers/
│       ├── header-renderer.js
│       ├── servicios-renderer.js
│       ├── contacto-renderer.js
│       └── footer-renderer.js
└── README.md
```

## 🎯 Cómo Actualizar la Información

Para actualizar la información de tu imprenta, simplemente edita el archivo **`config.json`**:

1. Abre `config.json` en cualquier editor de texto
2. Modifica los datos que necesites (nombre, teléfono, email, servicios, etc.)
3. Guarda el archivo
4. Recarga la página en tu navegador

### Ejemplo de edición:

```json
{
  "empresa": {
    "nombre": "Tu Nombre de Imprenta",
    "telefono": "+34 123 456 789",
    "email": "tu-email@ejemplo.com",
    ...
  }
}
```

## 🌐 Cómo Visualizar el Sitio

### Opción 1: Abrir directamente
Simplemente abre `index.html` en tu navegador. **Nota**: Algunas funciones pueden no funcionar correctamente debido a las restricciones CORS de los navegadores.

### Opción 2: Usar un servidor local (Recomendado)

**Con Python**:
```bash
# Python 3
python -m http.server 8000

# Luego abre: http://localhost:8000
```

**Con Node.js** (si tienes instalado):
```bash
npx http-server

# Luego abre: http://localhost:8080
```

**Con Visual Studio Code**:
- Instala la extensión "Live Server"
- Haz clic derecho en `index.html` → "Open with Live Server"

## 📝 Personalización

### Colores
Puedes cambiar los colores editando las variables CSS en `css/style.css`:

```css
:root {
    --color-primary: #2563eb;      /* Color principal */
    --color-secondary: #1e40af;    /* Color secundario */
    --color-accent: #f59e0b;       /* Color de acento */
    ...
}
```

### Servicios
Agrega o elimina servicios editando el array `servicios` en `config.json`:

```json
"servicios": [
  {
    "titulo": "Nuevo Servicio",
    "descripcion": "Descripción del servicio",
    "icono": "🎨"
  }
]
```

### Redes Sociales
Actualiza los enlaces en la sección `redesSociales` de `config.json`.

## 🔧 Principios SOLID Aplicados

- **Single Responsibility**: Cada clase/módulo tiene una única responsabilidad
- **Open/Closed**: Fácil de extender sin modificar código existente
- **Liskov Substitution**: Estructura modular y reutilizable
- **Interface Segregation**: Funciones específicas y bien definidas
- **Dependency Inversion**: La configuración se inyecta, no se hardcodea

## 📄 Licencia

Libre para uso personal y comercial.

