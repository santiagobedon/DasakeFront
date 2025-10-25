// src/routes/navigationMap.ts

export const navigationMap = {
  public: [
    { path: "/login", name: "iniciar sesión" },
    { path: "/register", name: "registrarse" },
    { path: "/recover", name: "recuperar contraseña" },
  ],

  private: [
    { path: "/profile", name: "perfil" },
    { path: "/edit-profile", name: "editar perfil" },
    { path: "/about-us", name: "sobre nosotros" },
    { path: "/change-password", name: "cambiar contraseña" },
    { path: "/dashboard", name: "panel de peliculas" },
  ],
};
