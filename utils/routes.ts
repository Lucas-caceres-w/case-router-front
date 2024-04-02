const isDev = process.env.NODE_ENV === "development";
const host = isDev ? "http://localhost:3001" : "";
export const apiUrl = host + "/api";
export const staticsUrl = host + "/fotos_casos/";
export const staticsPdf = host + "/pdf_temp/";
