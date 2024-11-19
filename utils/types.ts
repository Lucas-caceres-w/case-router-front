type Documento = {
   id: number;
   planAsbesto: string;
   planPlomo: string;
   estudioAsbesto: string;
   estudioEnmendado: string;
   estudioPlomo: string;
   estudioPlomoEnmendado: string;
   permisoAsbesto: string;
   permisoPlomo: string;
   cambioOrden: string;
   planosProyectos: string;
   planosProyectosDemolicion: string;
   planosCambioOrden: string;
   documentosCambioOrden: string;
   clearenceAsbesto: string;
   clearencePlomo: string;
   otros: string;
   createdAt: Date;
   updatedAt: Date;
};

type estatus = 'nuevo' | 'adjudicado' | 'inicio' | 'progreso' | 'completado';

export type ShowDoc = Omit<Documento, 'createdAt' | 'updatedAt'>;

export interface Fotos {
   id: number;
   casoId: number;
   fotosGrales: Array<string>;
   createdAt: Date;
   updatedAt: Date;
}

export type Caso = {
   id: number;
   gerenteProyecto: string;
   superintendenteProyecto: string;
   supervisorProyecto: string;
   nombreCliente: string;
   nombreProyecto: string;
   proyecto: string;
   numeroProyecto: string;
   direccionProyecto: string;
   latitud: string;
   longitud: string;
   pueblo: string;
   proyectoCompletados: string;
   estatus: estatus;
   descripcionProyecto: string;
   fechaAdjudicado: Date;
   materialRemovido: string;
   materialARemover: string;
   cantidadDesperdiciadaPlomo: string;
   cantidadEstimadaPlomoYardas: string;
   cantidadEstimadaPlomoPiesCuad: string;
   cantidadEstimadaPlomoPiesLineales: string;
   cantidadDesperdiciadaAsbesto: string;
   cantidadEstimadaAsbestoYardas: string;
   cantidadEstimadaAsbestoPiesCuad: string;
   cantidadEstimadaAsbestoPiesLineales: string;
   fechaRecibido: Date;
   fechaCambioOrden: string;
   diasAdicionales: Date;
   fechaInicio: Date;
   fechaFin: Date;
   observaciones: string;
   documento: Documento;
   Foto: Fotos;
};

export type User = {
   id: number;
   username: string;
   email: string;
   name: string;
   password: string;
   rol: number;
   createdAt: Date;
   updatedAt: Date;
};

export type createUser = Omit<User, 'createdAt' | 'updatedAt' | 'id'>;

export type CreateCaso = Omit<
   Caso,
   | 'id'
   | 'createdAt'
   | 'updatedAt'
   | 'fechaRecibido'
   | 'fechaRevision'
   | 'estatus'
   | 'observaciones'
>;

export type ImportCaso = CreateCaso & ['estatus' | 'pueblo'][];

interface Certificaciones {
   id: number;
   fileName: string;
   fechaInicio: Date;
   fechaExpiracion: Date;
   tipoDocumento: string;
   tipoEvaluacion: string;
   personalId: number;
}

export type Personal = {
   id: number;
   name: string;
   secondName: string;
   apellidoPaterno: string;
   apellidoMaterno: string;
   numContacto: number;
   observaciones: string;
   trabaja: boolean;
   idPersonal: number;
   certificacions: Certificaciones[];
};

export type importPersonal = Omit<Personal, 'id'>;

export type exportPersonal = Personal & ['updatedAt' | 'createdAt'];
