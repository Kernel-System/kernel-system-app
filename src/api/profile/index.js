import { http } from 'api';

export const getUserData = async (token) => {
  const {
    data: { data: user },
  } = await http.get(
    '/users/me?fields=id,first_name,last_name,email,role.name,cliente.*,empleado.*',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log(user);
  return {
    id: user.id,
    nombre: user.first_name,
    apellidos: user.last_name,
    correo: user.email,
    rol: user.role.name,
    cliente: user.cliente[0],
    empleado: user.empleado[0],
  };
};

export const changePassword = (token, password) =>
  http.patch(
    '/users/me',
    { password },
    { headers: { Authorization: `Bearer ${token}` } }
  );
