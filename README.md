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
├── dashboard.html          # Panel de administración (gestión de colores y fondos)
├── config.json             # Archivo de configuración (EDITA ESTE PARA ACTUALIZAR)
├── css/
│   ├── style.css          # Estilos principales
│   └── dashboard.css      # Estilos del dashboard
├── js/
│   ├── main.js            # Aplicación principal
│   ├── config-loader.js   # Cargador de configuración
│   ├── theme-applier.js   # Aplicador de temas personalizados
│   ├── renderers/
│   │   ├── header-renderer.js
│   │   ├── servicios-renderer.js
│   │   ├── contacto-renderer.js
│   │   └── footer-renderer.js
│   └── dashboard/
│       ├── dashboard-app.js       # Aplicación del dashboard
│       ├── theme-manager.js       # Gestor de temas
│       ├── background-manager.js  # Gestor de fondos
│       └── config-storage.js      # Almacenamiento de configuraciones
└── README.md
```

## 🎯 Cómo Actualizar la Información

### Actualizar Contenido (config.json)

Para actualizar la información de tu imprenta, simplemente edita el archivo **`config.json`**:

1. Abre `config.json` en cualquier editor de texto
2. Modifica los datos que necesites (nombre, teléfono, email, servicios, etc.)
3. Guarda el archivo
4. Recarga la página en tu navegador

### Personalizar Colores y Fondos (Dashboard)

Usa el **Dashboard de Gestión** para personalizar colores y fondos sin tocar código:

1. Abre `dashboard.html` en tu navegador
2. Ajusta los colores usando los selectores de color
3. Configura el fondo del hero (gradiente, sólido o imagen)
4. Los cambios se guardan automáticamente en el navegador
5. Recarga `index.html` para ver los cambios aplicados

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

### Ejecutar pruebas localmente (Windows)
En Windows, la ejecución de scripts puede estar bloqueada por la política de PowerShell y evitar que `npm test` funcione. Opciones para ejecutar las pruebas localmente:

- Habilitar ejecución de scripts para el usuario actual (ejecuta PowerShell como administrador o en tu sesión):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

- Usar una shell alternativa como **Git Bash** o **WSL** y ejecutar `npm test` allí.

- Si prefieres no cambiar la política, puedes ejecutar las pruebas desde un entorno de CI (ya configurado en `.github/workflows/ci.yml`) o en una máquina diferente.

> ⚠️ Solo cambia la política si confías en los scripts del entorno. Revertir con `Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser` si lo deseas.

## 🎯 Cómo Actualizar la Información

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

### Colores y Fondos (Recomendado: Dashboard)
Usa el **dashboard.html** para personalizar colores y fondos de forma visual y fácil. Los cambios se guardan automáticamente en el navegador.

### Colores (Edición Manual)
Si prefieres editar manualmente, puedes cambiar los colores editando las variables CSS en `css/style.css`:

```css
:root {
    --color-primary: #2563eb;      /* Color principal */
    --color-secondary: #1e40af;    /* Color secundario */
    --color-accent: #f59e0b;       /* Color de acento */
    ...
}
```

**Nota:** Los cambios desde el dashboard tienen prioridad sobre los valores por defecto del CSS.

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

## 🚀 Despliegue / Hosting

Este proyecto es una web estática. Opciones recomendadas para publicar:

- Netlify (recomendado):
  - Opción rápida: entra en https://app.netlify.com/drop y sube un .zip con los archivos del repo.
  - Con Netlify CLI (instala localmente):
    ```bash
    npm i -g netlify-cli
    netlify deploy --prod --dir=.
    ```

- GitHub Pages:
  - Ve a los ajustes del repositorio → Pages y selecciona la rama `main` y la carpeta `/` o `docs`.
  - O usando `gh-pages`:
    ```bash
    npm install --save-dev gh-pages
    npx gh-pages -d .
    ```

Notas:
- He incluido `netlify.toml` para facilitar despliegues en Netlify (publica el directorio raíz).
- También agregué scripts en `package.json`:
  - `npm run deploy:netlify` — usa Netlify CLI (requiere instalación previa)
  - `npm run deploy:ghpages` — usa `gh-pages` (requiere instalación previa)
- Si eliges GitHub Pages y prefieres no instalar herramientas, sube el contenido al directorio `docs/` y configúralo desde la UI de GitHub.


