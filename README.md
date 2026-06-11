# 🛒 FrontEnd - Sistema de Punto de Venta (POS)

Interfaz gráfica para la gestión de ventas, productos y clientes, construida con Angular, diseñada para integrarse perfectamente con el backend en ASP.NET Core.

---

## 🔗 Integración 

La interfaz está configurada para consumir los servicios desplegados en Microsoft Azure:

🔗 **[Acceder al panel](https://kind-hill-0b1e2fe10.7.azurestaticapps.net/login)**

**Credenciales de prueba:**
* **Usuario:** `cajero`
* **Password:** `cajero123`

> [!WARNING]
> **Nota para usuarios de ESET NOD32 / Antivirus estrictos:** Debido a que está desplegado en un entorno de pruebas de Azure, algunos antivirus podrían marcar la URL temporalmente como un *falso positivo*. El sitio es 100% seguro. Si recibes una alerta, selecciona "Ignorar amenaza" o "Continuar al sitio" para visualizar la documentación de la API.

---

## 🧩 Estructura del Proyecto

El frontend sigue una arquitectura modular enfocada en la reutilización de componentes y la mantenibilidad:

- `src/app/core` → Servicios, interceptores y autenticación.
- `src/app/pages` → Vistas principales (Ventas, Productos, Clientes).
- `src/app/services` → Comunicación con la API REST.

---

## ⚙️ Tecnologías Utilizadas

- **Framework:** Angular (TypeScript)
- **UI:** Angular Material
- **Comunicación:** HTTP Client 
- **Estilos:** CSS / SCSS
- **Despliegue:** Azure App Service (integrado)

---

## 📌 Características Principales

- **Gestión dinámica:** Operaciones CRUD completas para categorías y productos.
- **Arquitectura modular:** Código limpio basado en componentes reutilizables.
- **Seguridad:** Gestión de sesiones y consumo de servicios protegidos mediante JWT.
- **UX/UI:** Diseño administrativo responsivo y optimizado para entornos POS.

---

## 🚀 Instalación y Ejecución

Para ejecutar el proyecto en tu entorno local:

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar el proyecto
ng serve -o


👨‍💻 Autor
Agustin Gonzales
