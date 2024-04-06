//const host = "http://localhost:3001";
const host = process.env.NEXT_PUBLIC_API;
export const apiUrl = host + "/api";
export const staticsUrl = host + "/fotos_casos/";
export const staticsPdf = host + "/pdf_temp/";
