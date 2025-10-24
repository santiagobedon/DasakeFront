// src/routes/navigationMap.ts

export const navigationMap = {
  public: [
    { path: "/login", name: "iniciar sesion" },
    { path: "/register", name: "registrarse" },
    { path: "/recover", name: "recuperar contraseña" },
    
  ],
  private: [
    { path: "/dashboard", name: "panel principal" },
    { path: "/dashboard/profile", name: "perfil" },
    { path: "/aboutus", name: "Sobre Nosotros" },
  
    {
      path: "/dashboard/reports",
      name: "reportes",
      children: [
        { path: "/dashboard/reports/daily", name: "reporte diario" },
        { path: "/dashboard/reports/weekly", name: "reporte semanal" },
        { path: "/dashboard/reports/monthly", name: "reporte mensual" },
      ],
    },
    { path: "/dashboard/settings", name: "configuracion" },
  ],
};
