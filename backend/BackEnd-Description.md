
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

### Descripción de los archivos
#### db.config.js: Script para la configuración de la conexión a la base de datos
En este script se encuentran los datos necesarios para la conexión a la base de datos, como el host, el usuario, la contraseña y el nombre de la base de datos. Adicionalmente se encuentra el token para la autenticación de los usuarios. Los valores mencionados anter

#### auth.controller.js: Controlador de autenticación de usuarios
Aquí se encuentra la lógica de autenticación de los usuarios, como el registro y el inicio de sesión. Este script también incluye la lógica para la verificación de los correos electrónicos y la recuperación de contraseñas.

#### user.controller.js: Controlador de usuarios
En este script se encuentra la lógica de los usuarios.

#### db_setup.js: Script para la creación de la base de datos
En este script se encuentra la lógica de la creación de la base de datos.

#### index.js: Script principal
En este script se encuentra la lógica principal de la aplicación.

#### authJwt.js: Middleware de autenticación
En este script se encuentra la lógica de autenticación de los usuarios.

#### auth.routes.js: Rutas de autenticación
En este script se encuentran las rutas de autenticación.

#### user.routes.js: Rutas de usuarios
En este script se encuentran las rutas de los usuarios.

#### mailer.js: Script para el envío de correos electrónicos
En este script se encuentra la lógica de envío de correos electrónicos.

#### seed_users.js: Script para la creación de usuarios
En este script se encuentra la lógica de creación de usuarios.


