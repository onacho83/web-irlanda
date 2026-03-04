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

### DonWeb (FTP)

Para desplegar en DonWeb normalmente se usan FTP/SFTP desde el panel. Opciones:

- Manual (recomendado si lo haces una vez):
  1. Comprime el contenido del repo (sin `.git`), o selecciona los archivos desde tu máquina local.
  2. Accede al panel de DonWeb → Administrador de Archivos o FTP.
  3. Sube los archivos al public_html (o la carpeta que te indiquen) y asegúrate de que `index.html` quede en la raíz pública.

- Automático (desde tu máquina):
  - He incluido un script en `deploy/ftp-deploy.js` que usa `basic-ftp`. Para ejecutarlo:
    1. Crea un fichero `.env` en la raíz con estas variables (no lo subas a Git):
       ```env
       FTP_HOST=ftp.tudominio.com
       FTP_USER=usuario
       FTP_PASS=contraseña
       FTP_REMOTE_PATH=/public_html/
       ```
    2. Instala la dependencia:
       ```bash
       npm install basic-ftp
       ```
    3. Ejecuta:
       ```bash
       npm run deploy:donweb
       ```

  - El script sube el contenido del repo al `FTP_REMOTE_PATH` y sobrescribe los archivos.
  - Si prefieres SFTP, adapta el script o usa un cliente SFTP (FileZilla, WinSCP).

  ### Node.js server endpoint (recomendado si el hosting soporta Node)

  Si tu hosting permite ejecutar Node.js (o tienes un servidor separado), puedes usar el endpoint Node que incluye el proyecto:

  1. Define el token en la variable de entorno `DEPLOY_TOKEN` en el servidor y arranca el servidor:

  ```bash
  DEPLOY_TOKEN="tu-token-secreto" node server/save-config.js
  ```

  2. El servidor escuchará en el puerto `3000` por defecto; desde el dashboard pulsa **Guardar en config.json** introduciendo el mismo token.

  Nota: si tu hosting no permite Node, el dashboard seguirá intentando el endpoint PHP `save-config.php` como fallback.

  #### Ejecutar en producción (ejemplos)

  Si quieres ejecutar el servidor Node en producción con manejo de procesos, tienes dos opciones comunes.

  - `systemd` (Linux): crea el archivo `/etc/systemd/system/save-config.service` con el contenido de `deploy/systemd-save-config.service`, ajusta `WorkingDirectory` y `DEPLOY_TOKEN`, y ejecuta:

  ```bash
  sudo systemctl daemon-reload
  sudo systemctl enable save-config
  sudo systemctl start save-config
  sudo journalctl -u save-config -f
  ```

  - `pm2`: usa el archivo `deploy/ecosystem.config.js`. Instala `pm2` y arranca el proceso:

  ```bash
  npm i -g pm2
  pm2 start deploy/ecosystem.config.js
  pm2 save
  pm2 startup
  ```

  Ambos enfoques asegurarán que el servicio se reinicie automáticamente y que el endpoint `/save-config` esté disponible para las peticiones desde el dashboard.



