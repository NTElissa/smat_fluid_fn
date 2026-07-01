# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




smart-iv-monitoring-frontend/
│
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── .env
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   │
│   ├── assets/
│   │   └── images/
│   │       ├── logo.svg
│   │       └── hero-pattern.svg
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MobileNav.jsx
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── AlertCard.jsx
│   │   │   ├── MonitorCard.jsx
│   │   │   └── ActivityFeed.jsx
│   │   │
│   │   ├── Patients/
│   │   │   ├── PatientList.jsx
│   │   │   ├── PatientCard.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   └── PatientDetail.jsx
│   │   │
│   │   ├── Monitors/
│   │   │   ├── MonitorList.jsx
│   │   │   ├── MonitorDetail.jsx
│   │   │   ├── MonitorForm.jsx
│   │   │   └── LevelIndicator.jsx
│   │   │
│   │   ├── Alerts/
│   │   │   ├── AlertList.jsx
│   │   │   ├── AlertBadge.jsx
│   │   │   └── AlertModal.jsx
│   │   │
│   │   ├── Notifications/
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── NotificationList.jsx
│   │   │   └── NotificationItem.jsx
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Spinner.jsx
│   │       └── ErrorBoundary.jsx
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── PatientsPage.jsx
│   │   ├── MonitorsPage.jsx
│   │   ├── AlertsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── LoginPage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── patientService.js
│   │   ├── monitorService.js
│   │   ├── alertService.js
│   │   └── notificationService.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── SocketContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useNotifications.js
│   │   └── useAlerts.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── validators.js
│   │
│   └── router/
│       └── index.jsx
│
└── public/
    └── favicon.ico
