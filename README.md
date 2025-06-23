# 💸 Gestor de Gastos Compartidos Generada al 100% con IA

Una aplicación web que permite a grupos de usuarios registrar, dividir y gestionar gastos de forma sencilla y visual.

---


## ✨ Funcionalidades

- Registro e inicio de sesión con autenticación por token (JWT).
- Crear nuevos gastos con participantes, montos y fecha.
- Divisiones automáticas o personalizadas (por porcentaje o importe).
- Panel con resumen financiero, historial de gastos, deudas y pagos realizados.
- Página de detalle por gasto.
- Gráfico de evolución mensual.
- Interfaz responsive y moderna con Tailwind CSS.

---

## 🧱 Tecnologías utilizadas

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: API Routes de Next.js con Prisma ORM
- **Base de datos**: SQLite (modo desarrollo)
- **Gráficos**: `react-chartjs-2` + `chart.js`
- **Autenticación**: JWT manual con localStorage

---

## 🚀 Instalación

```bash
git clone https://github.com/tuusuario/gestor-gastos.git
cd gestor-gastos 
npm install
npm run dev

//base de datos visual 
npx prisma studio
```

# Testing del Proyecto

Este documento describe cómo ejecutar los tests automáticos del sistema, tanto los **tests unitarios/integración** implementados con **Jest + Testing Library**, como las **pruebas end-to-end (E2E)** desarrolladas con **Cypress**.

---

## 1. Requisitos previos

Asegúrate de tener instaladas todas las dependencias del proyecto:

```bash
npm install
```

> También se recomienda tener el backend en modo `dev` o mockeado según el tipo de prueba a ejecutar.

---

## 2. Tests unitarios y de integración (Jest + Testing Library)

Los tests unitarios cubren funciones auxiliares, hooks y componentes aislados. Se encuentran típicamente bajo la ruta:

```
/__tests__/
/components/Component.test.tsx
/utils/function.test.ts
```

### ✅ Ejecutar todos los tests

```bash
npm run test
```

### ▶️ Ejecutar en modo watch

```bash
npm run test:watch
```

### 🧪 Cubrir el proyecto con reportes

```bash
npm run test:coverage
```

Esto genera una carpeta `/coverage/` con un informe HTML navegable.

---

## 3. Pruebas end-to-end (E2E) con Cypress

Las pruebas E2E simulan el comportamiento completo del usuario (registro, login, creación de gastos, navegación por el dashboard, etc.).

### 🧭 Ubicación

Se encuentran bajo:

```
cypress/e2e/
```

### ▶️ Modo interactivo (GUI de Cypress)

```bash
npm run cypress:open
```

Esto abrirá la interfaz gráfica de Cypress, donde podrás lanzar pruebas y ver el navegador en tiempo real.

### ⚙️ Modo headless (CI/CD o consola)

```bash
npm run cypress:run
```

Este comando ejecuta todas las pruebas de forma automática en segundo plano y muestra un resumen en consola.

---

## 4. Comandos útiles en `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
```

---

## 5. Notas adicionales

- En las pruebas E2E se interceptan peticiones a `/api/*` para evitar dependencias con datos reales de base de datos.
- Se recomienda ejecutar `npm run dev` antes de lanzar Cypress, a menos que las rutas estén totalmente mockeadas.
- Las pruebas pueden requerir valores dinámicos, por ejemplo, para evitar conflictos de emails en el registro (`test-${Date.now()}@mail.com`).
- Algunas pruebas requieren control de redirecciones (`cy.location`) y esperas explícitas (`cy.wait('@alias')`) para garantizar estabilidad.

---

## 🧹 Limpieza y depuración

Para evitar errores por estados persistentes o mocks antiguos:

```bash
rm -rf .next coverage cypress/videos cypress/screenshots
```

---

## 📁 Estructura recomendada

```
.
├── __tests__/           # Tests unitarios
├── cypress/
│   ├── e2e/             # Tests E2E
│   └── support/         # Comandos personalizados
├── components/
├── utils/
├── jest.config.js
└── cypress.config.ts
```

---

## ✅ Recomendaciones

- Automatiza la ejecución en CI (GitHub Actions, GitLab, etc.).
- Mantén el entorno limpio y mockeado para pruebas deterministas.
- Evita pruebas frágiles basadas en texto o tiempos.