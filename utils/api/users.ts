import { apiUrl } from '../routes';
import { createUser } from '../types';

export const getUsers = async () => {
   try {
      const response = await fetch(`${apiUrl}/users`, { cache: 'no-store' });
      const json = await response.json();

      if (response.ok) {
         return json;
      } else {
         return [];
      }
   } catch (err) {
      console.log(err);
   }
};

export const Login = async (username: string, password: string) => {
   try {
      const response = await fetch(`${apiUrl}/users/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ user: username, password }),
      });

      if (!response.ok) {
         throw new Error('Error en la autenticación');
      }
      
      return response;
   } catch (err) {
      console.error('Error en la autenticación:', err);
      throw err;
   }
};

export const getOneUser = async (id: string) => {
   try {
      const response = await fetch(`${apiUrl}/users/${id}`);
      const json = await response.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const userCreate = async (body: createUser) => {
   try {
      const res = await fetch(apiUrl + '/users', {
         method: 'POST',
         body: JSON.stringify(body),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const deleteUser = async (id: string) => {
   try {
      const res = await fetch(apiUrl + '/users/' + id, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok) {
         return json;
      } else {
         throw new Error('Error al eliminar');
      }
   } catch (err) {
      console.log(err);
   }
};

export const updateUser = async (id: string, data: createUser) => {
   try {
      const res = await fetch(apiUrl + '/users/' + id, {
         method: 'PATCH',
         body: JSON.stringify(data),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const json = await res.json();
      console.log(data, json);
      if (res.ok) {
         return json;
      } else {
         throw new Error('Error al actualizar');
      }
   } catch (err) {
      console.log(err);
   }
};

export const recuperarContraseña = async (email: string) => {
   try {
      const response = await fetch(`${apiUrl}/users/recuperar/`, {
         method: 'POST',
         body: JSON.stringify({ data: email }),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await response.json();
      console.log(json);

      return json;
   } catch (err) {
      console.log(err);
   }
};
