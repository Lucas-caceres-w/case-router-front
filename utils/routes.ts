//const host = "http://localhost:3001";
const host = process.env.NEXT_PUBLIC_API;
export const apiUrl = host + "/backend";
export const staticsUrl = host + "/backend/fotos_casos/";
export const staticsPdf = host + "/backend/pdf_temp/";
