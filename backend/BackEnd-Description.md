
# Descripción del backend

## Estructura del backend
```
backend
├── BackEnd-Description.md
├── config
│   └── db.config.js
├── controllers
│   ├── auth.controller.js
│   └── user.controller.js
├── db_setup.js
├── index.js
├── middleware
│   └── authJwt.js
├── package-lock.json
├── package.json
├── routes
│   ├── auth.routes.js
│   └── user.routes.js
├── seed_users.js
└── utils
    └── mailer.js
```

## Descripción del backend

Para esta ocación se implemento un backend utilizando principalmente Node.js, Express.js como framework y de XAMPP se utiliza MariaDB como base de datos. En este proyecto se utilizaron algunas dependencias adicionales para el manejo de la base de datos, gestion de usuarios, y algunas funcionalidades adicionales, de las que se hablara luego.

### Archivos principales

#### `db.config.js`: Script para la configuración de la conexión a la base de datos

En este script se encuentran los datos necesarios para la conexión a la base de datos de MariaDB utilizada en XAMPP. Estos datos son: el host, el usuario, la contraseña y el nombre de la base de datos. Adicionalmente se encuentra un token, el cual sirve para la autenticación de los usuarios en el sitio web. Los datos mencionados anteriores se extraen de un archivo .env, el cual debe crearse en ./backend/.env. Se decidio utilizar este archivo para almacenar la configuración de la base de datos y el token de autenticación en lugar de usar directamente el archivo .env, ya que, en principio, el archivo .env no se sube al repositorio de GitHub. De este modo quien decida clonar el repositorio podra generar su propio archivo .env y configurar su base de datos de manera personalizada.

#### `auth.controller.js`: Controlador de autenticación de usuarios

Contiene la lógica de autenticación de los usuarios, como el registro y el inicio de sesión. Este script también incluye la lógica para la recuperación de contraseñas de los usuarios.

#### `user.controller.js`: Controlador de usuarios

Aqui se encuentra la lógica de los usuarios.

#### `db_setup.js`: Script para la creación de la base de datos
En este script se encuentra la lógica de la creación de la base de datos.

#### `index.js`: Script principal
En este script se encuentra la lógica principal de la aplicación.

#### `authJwt.js`: Middleware de autenticación
En este script se encuentra la lógica de autenticación de los usuarios.

#### `auth.routes.js`: Rutas de autenticación
En este script se encuentran las rutas de autenticación.

#### user.routes.js: Rutas de usuarios
En este script se encuentran las rutas de los usuarios.

#### `mailer.js`: Script para el envío de correos electrónicos
En este script se encuentra la lógica de envío de correos electrónicos.

#### `seed_users.js`: Script para la creación de usuarios
En este script se encuentra la lógica de creación de usuarios.


