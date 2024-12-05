import { apiUrl } from '../routes';
import { importPersonal } from '../types';

const getPersonal = async (estatus: string) => {
   try {
      const res = await fetch(`${apiUrl}/personal?estatus=${estatus}`);
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const getOnePersonal = async (
   estatus: string | null,
   paramId: string | null
) => {
   try {
      const res = await fetch(
         `${apiUrl}/personal/${paramId}?estatus=${estatus}`
      );
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const addPersonal = async (data: any, estatus: string) => {
   try {
      const res = await fetch(`${apiUrl}/personal?estatus=${estatus}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const getCertificaciones = async (id: string) => {
   try {
      const res = await fetch(`${apiUrl}/personal/certificaciones/${id}`);
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const updatePersonal = async (
   data: any,
   estatus: string | null,
   id: string | null
) => {
   try {
      const res = await fetch(`${apiUrl}/personal/${id}?estatus=${estatus}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const deletePersonal = async (estatus: string | null, id: string | null) => {
   try {
      const res = await fetch(`${apiUrl}/personal/${id}?estatus=${estatus}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const uploadCertification = async (body: any) => {
   const { formData, idParam, inicio, expiracion, tipo, tipoEvaluacion } = body;
   try {
      const res = await fetch(
         `${apiUrl}/personal/documento/${idParam}?tipo=${tipo}&inicio=${inicio}&exp=${expiracion}&tipoEvaluacion=${tipoEvaluacion}`,
         {
            method: 'POST',
            body: formData,
         }
      );
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

export const getPersonalByDate = async (
   desde: string,
   hasta: string,
   estatus: string | null
) => {
   try {
      const res = await fetch(apiUrl + '/personal/dates', {
         method: 'POST',
         body: JSON.stringify({ desde, hasta, estatus }),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

const ImportPersonal = async (file: importPersonal[]) => {
   try {
      const res = await fetch(apiUrl + '/personal/data-import', {
         method: 'POST',
         body: JSON.stringify(file),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

const deleteCertificacion = async (idCert: string) => {
   try {
      const res = await fetch(`${apiUrl}/personal/certificacion/${idCert}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const getOneCertificacion = async (id: string) => {
   try {
      const res = await fetch(`${apiUrl}/personal/certificacion/${id}`);
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

const editCertificacion = async (id: string, data: any) => {
   try {
      const res = await fetch(`${apiUrl}/personal/certificacion/${id}`, {
         method: 'PATCH',
         body: JSON.stringify({ data }),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

export {
   getPersonal,
   getOnePersonal,
   addPersonal,
   updatePersonal,
   deletePersonal,
   uploadCertification,
   ImportPersonal,
   getCertificaciones,
   deleteCertificacion,
   getOneCertificacion,
   editCertificacion,
};
