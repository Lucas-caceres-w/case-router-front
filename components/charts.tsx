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
  function contarCasosPorPuebloRegion() {
    const conteo = {} as any;
    data?.map((caso: any) => {
      const key = `${caso.areaOperacional}`;
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
    let enProceso = 0;
    let completados = 0;

    data?.forEach((caso) => {
      if (caso.estatus === "en proceso") {
        enProceso++;
      } else if (caso.estatus === "completados") {
        completados++;
      }
    });

    return { enProceso, completados };
  }

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

  const { enProceso, completados } = contarCasosEnProcesoCompletados();

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
    labels: labels.map((e) => e.slice(0, 3)),
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
      <Card className="w-full !bg-slate-600">
        <div className="flex flex-row items-center justify-around">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Cantidad de casos total:
            </h2>
            <p className="text-slate-200 font-semibold">{data?.length}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={70}
            height={60}
            src={"/assets/chart.png"}
            alt="icon"
          />
        </div>
      </Card>
      <Card className="w-full !bg-blue-600/80">
        <div className="flex flex-row items-center justify-around">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos en procesos:
            </h2>
            <p className="text-slate-300 font-semibold">{enProceso}</p>
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
      <Card className="w-full !bg-green-500">
        <div className="flex flex-row items-center justify-around">
          <div className="flex flex-col justify-between gap-6">
            <h2 className="text-slate-200 font-semibold text-lg">
              Casos completados:
            </h2>
            <p className="text-green-100 font-semibold">{completados}</p>
          </div>
          <Image
            className="filter backdrop:blur-sm p-1"
            width={80}
            height={80}
            src={"/assets/success.png"}
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
