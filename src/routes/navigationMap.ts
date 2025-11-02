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
    { path: "/login", name: "Iniciar Sesión" },
    { path: "/register", name: "Registrarse" },
    { path: "/recover", name: "Recuperar Contraseña" },
  ],

  private: [
    { path: "/profile", name: "Perfil" },
    { path: "/profile/edit", name: "Editar Perfil" },
    { path: "/aboutus", name: "Sobre Nosotros" },
    { path: "/change-password", name: "Cambiar Contraseña" },
    { path: "/dashboard", name: "Panel de Películas" },
  ],
};

