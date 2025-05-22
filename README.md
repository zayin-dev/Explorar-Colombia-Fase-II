# Explorar Colombia

![Home Page](https://github.com/zayin-dev/react-project/blob/main/imgs/home.png)

## Descripción
Explorar Colombia es una aplicación web moderna desarrollada con React que permite a los usuarios explorar y conocer las diferentes regiones de Colombia. La aplicación ofrece una experiencia interactiva con un mapa interactivo y un chatbot para descubrir la riqueza cultural y natural del país.

## Estructura del Proyecto
```
explorar_colombia/
├── src/                                # Código fuente principal
│   ├── assets/                         # Recursos estáticos
│   ├── componentes/                    # Componentes reutilizables
│   │   ├── MapaColombia.jsx            # Componente del mapa interactivo
│   │   ├── ChatBot.jsx                 # Componente de chatbot
│   │   ├── Footer.jsx                  # Componente del pie de página
│   │   ├── PrivateRoute.jsx            # Componente de ruta privada
│   │   ├── Navbar.jsx                  # Componente de barra de navegación
│   │   ├── Carrusel.jsx                # Componente de carrusel
│   │   └── FormularioConCollapse.jsx   # Componente de formulario
│   │
│   ├── datos/                          # Datos y configuraciones
│   │   └── InfoRegiones.js             # Información de las regiones de Colombia
│   │
│   ├── estilos/                        # Estilos CSS
│   ├── imagenes/                       # Recursos visuales
│   ├── paginas/                        # Páginas principales
│   │   ├── Panel.jsx                   # Panel del mapa interactivo
│   │   ├── Login.jsx                   # Página de inicio de sesión
│   │   └── Inicio.jsx                  # Página principal
│   │
│   ├── App.jsx                         # Componente raíz de la aplicación
│   └── main.jsx                        # Punto de entrada de la aplicación
│
├── public/                             # Archivos públicos
│   └── favicon.ico                     # Icono del sitio
│
├── node_modules/                       # Dependencias del proyecto
├── .gitignore                          # Archivos ignorados por Git
├── eslint.config.js                    # Configuración de ESLint
├── index.html                          # Plantilla HTML principal
├── package.json                        # Configuración del proyecto y dependencias
├── vite.config.js                      # Configuración de Vite
└── README.md                           # Documentación del proyecto
```
- **src/**: Directorio principal del código fuente
   - **componentes/**: Componentes React reutilizables
      - **Navbar.jsx**: Barra de navegación principal. Contiene el login y un boton para ir a la pagina principal
      - **Footer.jsx**: Pie de página. Contiene enlaces e información sobre los creadores del proyecto
      - **PrivateRoute.jsx**: Componente de protección de rutas para acceso a la pagina privada
      - **FormularioConCollapse.jsx**: Componente de formulario. Al no estar conectado a una base de datos, no realiza ninguna funcion.
      - **Carrusel.jsx**: Componente de carrusel de imágenes. Es la responsable de que se vean las imagenes en la pagina principal
      - **MapaColombia.jsx**: Mapa interactivo de Colombia. Accesible despues de iniciar sesion en el sitio.
      - **ChatBot.jsx**: Un asistente que brinda informacion sobre los departamentos
   - **estilos/**: Archivos CSS y recursos de estilos
   - **imagenes/**: Recursos de imágenes utilizados en la aplicación
   - **paginas/**: Componentes de páginas principales
      - **Inicio.jsx**: Página principal
      - **Login.jsx**: Login
      - **Panel.jsx**: Pagina accesible tras iniciar sesion
- **index.html**: Punto de entrada HTML de la aplicación

## Funcionalidades Principales
- **Mapa Interactivo**: Navegación por las diferentes regiones de Colombia con información detallada
- **Información Regional**: Descripciones completas de cada región con datos clave y fotografías
- **ChatBot**: Asistente virtual para responder preguntas sobre Colombia
- **Formulario de Registro**: Sistema para registrar usuarios al sitio 
- **Sistema de Autenticación**: Login y rutas privadas para acceso seguro

## Componentes
1. **Barra de Navegación** (`Navbar`)
   - Menú de navegación responsivo
   - Visualización dinámica del estado de autenticación
   - Funcionalidad de cierre de sesión

2. **Pie de Página** (`Footer`)
   - Pie de página consistente en toda la página
   - Contiene enlaces adicionales e información sobre los creadores

3. **Ruta Privada** (`PrivateRoute`)
   - Componente de protección de rutas
   - Maneja verificaciones de autenticación

4. **Formulario con Secciones Plegables** (`FormularioConCollapse`)
   - Componente de formulario interactivo
   - Secciones plegables para mejor organización
   - Manejo dinámico de formularios

5. **Carrusel** (`Carrusel`)
   - Componente de presentación de imágenes
   - Diseño responsivo
   - Controles de navegación

6. **Mapa de Colombia** (`MapaColombia`)
   - Componente de mapa interactivo
   - Representación visual de datos geográficos
   - Capacidades de selección de regiones

7. **ChatBot** (`ChatBot`)
   - Componente de ChatBot
   - Brinda informacion sobre los departamentos
   - De uso casi intuitivo

## Navegación y Páginas
1. **Página Principal** (`/`)
   - Página de inicio con carrusel y secciones de contenido
   - Acceso público

   Esta es la pagina a la cual el usuario entrara apenas ingrese al sitio web. La pagina consta de cuatro partes principales. Consta de un menu principal, el cual contiene el logo del proyecto, un boton para ir a la pagina principal y un boton para iniciar sesion en el sitio web. 

   ![Menu principal](https://github.com/zayin-dev/react-project/blob/main/imgs/menu.png)

   Tanto el logo como el boton 'inicio' llevan a la pagina principal, mientras que el boton 'login' enviara al usuario a la pagina de inicio de sesion. Una vez el usuario ya inicio sesion sera redirigido a una pagina en la cual se encontrara con un mapa interactivo. Si el usuario vuelve a la pagina principal ya con su sesion iniciada, tendra un boton mas en el menu, el cual corresponde al mapa interactivo.
   
   Despues, esta un componente de carrousel
   
   ![Menu principal](https://github.com/zayin-dev/react-project/blob/main/imgs/carrousel.png)

   Este no tiene muchas caracteristicas. Es un carrusel hecho con bootstrap el cual contiene varias fotos de lugares turisticos de Colombia

   Hay un formulario

   ![Formulario](https://github.com/zayin-dev/react-project/blob/main/imgs/form.png)

   Este sirve para que el usuario pueda registrarse al sitio. Este consta de un campo en el que el usuaro puede poner el 'nickname' con el que sera reconocido en el sitio y un boton el cual desplegara dos campos mas, en los cuales el usuario podra ingresar su correo y una contraseña. De momento no tiene ninguna funcionalidad ya que la pagina no esta enlazada a una base de datos.
   
   Se cuenta con un footer

   ![Footer](https://github.com/zayin-dev/react-project/blob/main/imgs/footer.png)

   En este apartado se encuentra informacion extra del proyecto, como copyright y redes sociales y un boton en el cual se encuentra la informacion de los creadores del proyecto.

   Finalmente, esta el chatbot
   
   ![ChatBot](https://github.com/zayin-dev/react-project/blob/main/imgs/chatbot.png)

   Este pretende ser un asistente el cual le brinde informacion a los usuarios que ingresen al sitio. Se activa dando clic en el boton 'Abrir Chat' en la parte inferior derecha de la pantalla. Al abrirlo el usuario en cuentra un area en el cual el chatbot "responde" y debajo de este una serie de botones correspondientes a los departamentos del pais. Al presionar uno de esos botones, el chatbot dara una breve descripcion del departamento seleccionado. Para cerrar el chatbot se debe presionar el boton 'cerrar' el cual se encuentra arriba del chatbot.

2. **Panel** (`/panel`)
   - Requiere autenticación
   - Acceso controlado por el componente PrivateRoute

   ![Interactive Map](https://github.com/zayin-dev/react-project/blob/main/imgs/interactive_map_explanation.png)

   Este corresponde al mapa interactivo mencionado anteriormente. Se puede acceder a este luego de haber iniciado sesion en el sitio. Este consta de un mapa de colombia el cual, al pasar el cursor sobre los departamentos, mostraran su nombre. Al dar clic en algunos de estos departamentos, mostraran un recuadro el cual contiene informacion del sitio. Este contiene el nombre del departamento, una breve descripcion, una imagen del departamento, y algunos datos extra como su capital, altitud y el clima. 

   ![Sites Explanation](https://github.com/zayin-dev/react-project/blob/main/imgs/sites_explanation.png)
   
   Para cerrar el recuadro simplemente basta con dar clic en el boton 'cerrar' o dar clic fuera del recuadro.



3. **Página de Inicio de Sesión** (`/login`)
   - Interfaz de autenticación de usuarios
   - Manejo del estado de inicio de sesión
   - Redirección al panel después de la autenticación exitosa

   ![Auth Failure](https://github.com/zayin-dev/react-project/blob/main/imgs/auth-failure.png)

   Este permite al usuario iniciar sesion en el sitio. Es accesible en el menu principal al presionar el boton 'Login'. Al dar clic en 'Login' en el menu principal, se desplegara un formulario el cual contiene los campos de 'usuario' y contraseña. Si los datos proporcionados con el usuario son correctos, el usuario sera redirigido al mapa interactivo, de lo contrario aparecera un mensaje indicando que el usuario o la contraseña son incorrectos.

## Principios Web Aplicados
1. **Diseño Responsivo**
   - Implementación de Bootstrap para layouts adaptables
   - Diseño mobile-first para óptima experiencia en dispositivos móviles

2. **Experiencia de Usuario**
   - Navegación intuitiva con React Router
   - Modales interactivos para información detallada

3. **Mantenibilidad**
   - Estructura de componentes modular
   - Estilos organizados y reutilizables

4. **Seguridad**
   - Rutas protegidas con el componente PrivateRoute
   - Gestión del estado de autenticación

5. **Aplicación de Página Única (SPA)**
   - Enrutamiento del lado del cliente con React Router
   - Transiciones suaves entre páginas
   - Gestión eficiente del estado

6. **Experiencia de Usuario (UX)**
   - Navegación consistente
   - Jerarquía visual clara
   - Diseño de interfaz intuitivo
   - Elementos de formulario interactivos
   - Transiciones y animaciones suaves

## Tecnologías Utilizadas
- React 
- Bootstrap 
- React Bootstrap
- Vite

## Instalación y Uso
1. Clonar el repositorio

2. En la terminal

   ```bash
   cd explorar_colombia
   ```
3. Instalar dependencias:
   ```bash
   npm i
   ```
4. Instalar paquetes requeridos:
   ```bash
   npm i react-router-dom bootstrap react-bootstrap react-modal

   ```
5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
