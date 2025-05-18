
# Gestor de Gastos Compartidos

**Última actualización:** 2025-05-18 17:38

---

## Descripción del proyecto

Este es un proyecto construido con Next.js 14 que permite a múltiples usuarios registrar, dividir y gestionar gastos comunes. La lógica de reparto es flexible y visual, y el enfoque del diseño es minimalista y claro, adaptado a pantallas grandes.

---

## Tecnologías utilizadas

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Prisma + SQLite**
- **JWT manual (localStorage)**
- **Chart.js + react-chartjs-2**

---

## Autenticación

- Registro (`/api/auth/register`)
- Inicio de sesión (`/api/auth/login`)
- Logout (`/api/auth/logout`)
- Obtener usuario (`/api/auth/me`)

### Comportamiento

- Si hay token: se muestra nombre del usuario, opción de cerrar sesión y navegación completa.
- Si no hay token: se ofrecen enlaces a login y registro.
- Después de registrar, el sistema detecta automáticamente al usuario y actualiza el menú.

---

## Creación de gasto (`/expenses/new`)

Formulario para registrar un nuevo gasto:

**Campos:**
- Descripción
- Importe total
- Fecha
- Usuario que pagó
- Participantes
- Tipo de división:
  - A partes iguales (equal)
  - Por porcentaje (percentage)
  - Importe personalizado (custom)

**Validaciones y comportamientos implementados:**
- No se pueden añadir más participantes que usuarios disponibles.
- No se pueden seleccionar participantes duplicados.
- En modo `equal`, los valores se calculan automáticamente y los inputs se desactivan.
- En modo `percentage` la suma debe ser 100%.
- En modo `custom` la suma debe ser igual al total.

---

## Dashboard (`/dashboard`)

**Contenido:**
- Tarjetas con total pagado, consumido y saldo.
- Gráfico de evolución mensual.
- Secciones de:
  - Gastos creados por el usuario
  - Deudas pendientes
  - Pagos realizados

**Diseño:**
- Distribución en 2 columnas
- Tarjetas visuales centradas
- Estilo limpio sin bordes, con sombras suaves y colores degradados

---

## 📄 Detalle de gasto (`/expenses/:id`)

- Muestra:
  - Descripción, fecha y pagador
  - Lista de participantes y estado de pago
  - Si el usuario debe → botón para pagar

**Lógica implementada:**
- `POST /api/debts/:divisionId/pay`

---

## 🧩 Componentes reutilizables

### `PageHeader`
- Muestra el nombre del usuario y navegación contextual.
- Aparece un botón de volver si no estamos en `/dashboard`.
- Cambia dinámicamente según la ruta.

---

## ✅ Estado actual

- [x] Registro e inicio de sesión funcional
- [x] Creación de gastos
- [x] Modos de división totalmente operativos
- [x] Validaciones automáticas y campos reactivos
- [x] Dashboard completo y visual
- [x] Vista de detalle con estado de pagos
- [x] Gráfico mensual con Chart.js
- [x] Header dinámico con nombre del usuario
- [x] Prevención de duplicados y límites en participantes

---

## 🔄 Por implementar o extender

- Responsive completo para mobile (opcional)
- Soporte para añadir saldo a cartera
- Mejor UX / UI 
- Bugs Formulario añadir gasto (mostrar errores reactivos al pasar 100% o de un gasto superior al total en la UI) 
- Mejoras como Grupos (no en el alcance)

---

Este documento resume todo lo implementado en esta conversación para permitir continuar sin perder contexto.
