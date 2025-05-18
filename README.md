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
