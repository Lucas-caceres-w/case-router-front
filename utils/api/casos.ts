import { apiUrl } from '../routes';
import { CreateCaso, ImportCaso } from '../types';

export const getCasos = async () => {
   try {
      const res = await fetch(apiUrl + '/casos', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok) {
         return json;
      } else {
         return [];
      }
   } catch (err) {
      console.log(err);
   }
};

export const getOne = async (id: string) => {
   try {
      const res = await fetch(apiUrl + '/casos/' + id);
      const json = await res.json();

      if (res.ok) {
         return json;
      } else {
         return null;
      }
   } catch (err) {
      console.log(err);
   }
};

export const getCasosByDate = async (desde: string, hasta: string) => {
   try {
      const res = await fetch(apiUrl + '/casos/dates', {
         method: 'POST',
         body: JSON.stringify({ desde, hasta }),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const updateCaso = async (id: string, body: CreateCaso) => {
   try {
      const res = await fetch(apiUrl + '/casos/' + id, {
         method: 'PATCH',
         body: JSON.stringify(body),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      return json;
   } catch (err) {
      console.log(err);
   }
};

export const deleteCaso = async (id: string) => {
   try {
      const res = await fetch(apiUrl + '/casos/' + id, { method: 'DELETE' });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const createCaso = async (data: CreateCaso) => {
   try {
      const res = await fetch(apiUrl + '/casos', {
         method: 'POST',
         body: JSON.stringify(data),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

export const changeDates = async (
   id: string,
   data: { fechaRecibido: Date | undefined; fechaRevision: Date | undefined }
) => {
   try {
      const res = await fetch(apiUrl + '/casos/' + id, {
         method: 'PATCH',
         body: JSON.stringify(data),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();

      return json;
   } catch (err) {
      return err;
   }
};

export const asignarAreas = async ({
   data,
   id,
}: {
   data: { areaOperacional: string; region: string; pueblo: string };
   id: string;
}) => {
   try {
      const res = await fetch(apiUrl + '/casos/' + id, {
         method: 'PATCH',
         body: JSON.stringify(data),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = res.json();
      if (res.ok) {
         return json;
      } else {
         return null;
      }
   } catch (err) {
      console.log(err);
   }
};

export const cambiarEstatus = async (estatus: string, id: string) => {
   try {
      const res = await fetch(apiUrl + '/casos/estatus/' + id, {
         method: 'PATCH',
         body: JSON.stringify({ estatus: estatus }),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (res.ok) {
         return json;
      } else {
         return null;
      }
   } catch (err) {
      console.log(err);
   }
};

export const cantidadDesperdiciada = async (cantidad: string, id: string) => {
   try {
      const res = await fetch(apiUrl + '/casos/estatus/' + id, {
         method: 'PATCH',
         body: JSON.stringify({ cantidad }),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (res.ok) {
         return json;
      } else {
         return null;
      }
   } catch (err) {
      console.log(err);
   }
};

export const addComents = async (id: string, comentario: string) => {
   try {
      const res = await fetch(apiUrl + '/casos/' + id, {
         method: 'PATCH',
         body: JSON.stringify({ observaciones: comentario }),
         headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (res.ok) {
         return json;
      } else {
         return null;
      }
   } catch (err) {
      console.log(err);
   }
};

export const uploadFile = async (id: string, file: FormData) => {
   try {
      const res = await fetch(apiUrl + '/documentos/' + id, {
         method: 'PATCH',
         body: file,
      });
      const json = await res.json();
      if (res.ok) {
         return json;
      } else {
         return null;
      }
   } catch (err) {
      console.log(err);
   }
};

export const ImportData = async (file: ImportCaso) => {
   try {
      const res = await fetch(apiUrl + '/casos/data-import', {
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

export const uploadImages = async (id: string, file: FormData) => {
   try {
      const res = await fetch(apiUrl + '/fotos/' + id, {
         method: 'POST',
         body: file,
      });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const getImagesById = async (id: string) => {
   try {
      const res = await fetch(apiUrl + '/fotos/' + id);
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const getDocsById = async (id: string) => {
   try {
      const res = await fetch(apiUrl + '/documentos/' + id);
      const json = await res.json();
      return json;
   } catch (err) {
      console.log(err);
   }
};

export const DeleteImage = async (id: string, path: string) => {
   try {
      const res = await fetch(apiUrl + '/fotos/' + id, {
         method: 'DELETE',
         body: JSON.stringify({ path }),
         headers: {
            'Content-Type': 'application/json',
         },
      });
      const json = await res.json();
      //console.log(json);
      return json;
   } catch (err) {
      console.log(err);
   }
};

export const DeleteDoc = async (id: number, key: string, file: string) => {
   try {
      const res = await fetch(apiUrl + '/documentos/' + id, {
         method: 'DELETE',
         body: JSON.stringify({ key, file }),
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

export const getDaysOrder = async (id: number) => {
   console.log(id);
   try {
      const res = await fetch(`${apiUrl}/documentos/order/${id}`);
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};

export const editDaysOrder = async (id: string, value: string) => {
   try {
      const res = await fetch(`${apiUrl}/documentos/order/${id}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id, value }),
      });
      const json = await res.json();

      return json;
   } catch (err) {
      console.log(err);
   }
};
