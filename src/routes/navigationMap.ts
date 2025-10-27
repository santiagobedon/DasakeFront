/**
 * navigationMap
 *
 * Maps application routes to their display names.
 * - `public`: routes accessible without authentication.
 * - `private`: routes that require authentication.
 * 
 * All display names are kept in Spanish as per UI requirements.
 */
export const navigationMap = {
  public: [
    { path: "/login", name: "iniciar sesión" },
    { path: "/register", name: "registrarse" },
    { path: "/recover", name: "recuperar contraseña" },
  ],

  private: [
    { path: "/profile", name: "perfil" },
    { path: "/profile/edit", name: "editar perfil" },
    { path: "/aboutus", name: "sobre nosotros" },
    { path: "/change-password", name: "cambiar contraseña" },
    { path: "/dashboard", name: "panel de peliculas" },
  ],
};

