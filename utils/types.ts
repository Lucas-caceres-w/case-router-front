type Documento = {
  id: number;
  casoId: number;
  AAA1190: string;
  cartaRecomendacion: string;
  credencialIngArq: string;
  crtAut: string;
  escrituras: string;
  evidenciaServicio: string;
  evidenciaTitularidad: string;
  fotoPredio: string;
  fotoArea: string;
  mapaEsquematico: string;
  memoExplicativo: string;
  memorialSubsanacion: string;
  plano: string;
  planoInscripcion: string;
  planoSituacion: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Fotos {
  id: number;
  casoId: number;
  fotosGrales: Array<string>;
  fotoAreaSistemaAgua: string;
  fotoAreaAlcantarillado: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Caso = {
  id: number;
  latitud: number | string;
  longitud: number | string;
  nroCatastro: string;
  nroOgpeSbp: string;
  fechaRecibido: Date;
  fechaRevision: Date;
  asignadoPor: string;
  areaOperacional: string;
  estatus: string;
  nombreInspector: string;
  pueblo: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
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

export type createUser = Omit<User, "createdAt" | "updatedAt" | "id">;

export type CreateCaso = Omit<
  Caso,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "fechaRecibido"
  | "fechaRevision"
  | "estatus"
  | "areaOperacional"
  | "region"
  | "pueblo"
  | "documento"
  | "observaciones"
>;

export type ImportCaso = CreateCaso &
  ["estatus" | "region" | "areaOperacional" | "pueblo"][];
