"use client";
import { Caso } from "@/utils/types";
import { Card } from "flowbite-react";
import React from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Filler,
  LineElement,
  BarElement,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale/es";

Chart.register(
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Filler
);

const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function ChartsSection({ data }: { data: Caso[] }) {
  console.log(data);
  function contarCasosPorPuebloRegion() {
    const conteo = {} as any;
    data?.map((caso: any) => {
      const key = `${caso?.areaOperacional}`;
      if (!conteo[key]) {
        conteo[key] = 1;
      } else {
        conteo[key]++;
      }
    });
    return conteo;
  }

  function contarCasosPorArea() {
    const conteo = {} as any;
    data?.map((caso: any) => {
      const key = `${caso.region}`;
      if (!conteo[key]) {
        conteo[key] = 1;
      } else {
        conteo[key]++;
      }
    });
    return conteo as number;
  }

  function contarCasosEnProcesoCompletados() {
    let iniciado = 0;
    let verificacion = 0;
    let reporte = 0;
    let asignado = 0;
    let reporteCompletado = 0;
    let cartaRecomendacion = 0;
    let completado = 0;

    data?.forEach((caso) => {
      switch (caso.estatus) {
        case "iniciado":
          return (iniciado += 1);
        case "verificacion":
          return (verificacion += 1);
        case "reporteInicial":
          return (reporte += 1);
        case "asignado":
          return (asignado += 1);
        case "reporteCompletado":
          return (reporteCompletado += 1);
        case "cartaRecomendacion":
          return (cartaRecomendacion += 1);
        case "completado":
          return (completado += 1);

        default:
          break;
      }
    });

    return {
      iniciado,
      verificacion,
      reporte,
      asignado,
      reporteCompletado,
      cartaRecomendacion,
      completado,
    };
  }

  const casosSinCarta = () => {
    const sinCarta = data?.map((e) => {
      if (!e.documento.cartaRecomendacion) {
        return e;
      }
    }).length;

    return { sinCarta };
  };

  const { sinCarta } = casosSinCarta();

  function obtenerCantidadCasosPorMes() {
    const datos = {} as any;

    months.forEach((mes) => {
      datos[mes] = 0;
    });

    data?.forEach((caso: any) => {
      const fechaCreacion = parseISO(caso.createdAt);
      const mes = format(fechaCreacion, "MMMM", { locale: es });
      datos[mes]++;
    });

    const labels: string[] = Object.keys(datos);
    const cantidadMensual: number[] = Object.values(datos);

    return { labels, cantidadMensual };
  }

  const { labels, cantidadMensual } = obtenerCantidadCasosPorMes();

  const {
    iniciado,
    verificacion,
    reporte,
    asignado,
    reporteCompletado,
    cartaRecomendacion,
    completado,
  } = contarCasosEnProcesoCompletados();

  const conteoCasos = contarCasosPorPuebloRegion();

  const casosArea = contarCasosPorArea();

  const cantidadArea = Object.values(casosArea);

  const labelsArea = Object.keys(casosArea);

  const labelsRegion = Object.keys(conteoCasos).map((key) => {
    const [region] = key.split("/");
    return `${region}`;
  });

  const cant = Object.values(conteoCasos);

  const maxLine = Math.max(...cantidadMensual);

  const maxBar = Math.max(...cantidadArea);

  const options = {
    labels: labelsRegion,
    datasets: [
      {
        label: "Casos por Region",
        data: cant,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsLine = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Nro de casos por mes",
      },
    },
    scales: {
      y: {
        display: false,
        min: 0,
        max: maxLine + 10,
      },
      yAxes: {
        min: 0,
        max: maxLine + 10,
      },
    },
  };

  const dataLine = {
    labels: labels?.map((e) => e.slice(0, 3)),
    datasets: [
      {
        tension: 0.5,
        fill: true,
        label: "Casos mensuales",
        data: cantidadMensual,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const dataBar = {
    labels: labelsArea,
    datasets: [
      {
        label: "Cantidad por Area Operacional",
        data: cantidadArea,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Nro de casos por Area Operacional",
      },
    },
    scales: {
      y: {
        display: false,
        min: 0,
        max: maxBar + 10,
      },
      yAxes: {
        min: 0,
        max: maxBar + 10,
      },
    },
  };

  return (
    <section className="grid grid-cols-auto-fit place-content-center gap-2">
      <Card className="w-full !bg-slate-500 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Cantidad de casos total:
            </h2>
            <p className="text-slate-200 font-semibold">{data?.length}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={65}
            height={65}
            src={"/assets/chart.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-slate-600 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos recien creados:
            </h2>
            <p className="text-slate-300 font-semibold">{iniciado}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/process.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-teal-600 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos en verificacion inicial:
            </h2>
            <p className="text-slate-200 font-semibold">{verificacion}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/process.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-teal-500 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos en preparacion de reporte:
            </h2>
            <p className="text-slate-300 font-semibold">{reporte}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/process.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-blue-500 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos asignados a investicación:
            </h2>
            <p className="text-green-100 font-semibold">{asignado}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/process.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-green-400 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos con reporte completado:
            </h2>
            <p className="text-green-100 font-semibold">{reporteCompletado}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={75}
            height={75}
            src={"/assets/success.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-blue-600 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos con carta de recomendación:
            </h2>
            <p className="text-green-100 font-semibold">{cartaRecomendacion}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/process.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-green-500 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos completados:
            </h2>
            <p className="text-green-100 font-semibold">{completado}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={75}
            height={75}
            src={"/assets/success.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-red-500 h-24">
        <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos sin carta de recomendacion:
            </h2>
            <p className="text-green-100 font-semibold">{sinCarta}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/init.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full">
        {
          <React.Suspense fallback={"Cargando tabla..."}>
            <Pie className="m-auto w-full" data={options} />
          </React.Suspense>
        }
      </Card>
      <Card className="w-full">
        {
          <React.Suspense fallback={"Cargando tabla..."}>
            <Line
              className="m-auto w-full"
              options={optionsLine}
              data={dataLine}
            />
          </React.Suspense>
        }
      </Card>
      <Card className="w-full">
        {
          <React.Suspense fallback={"Cargando tabla..."}>
            <Bar
              className="m-auto w-full"
              options={optionsBar}
              data={dataBar}
            />
          </React.Suspense>
        }
      </Card>
    </section>
  );
}

export default ChartsSection;
