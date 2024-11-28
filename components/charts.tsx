'use client';
import { Caso, Personal } from '@/utils/types';
import { Card } from 'flowbite-react';
import React from 'react';
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
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
   CalendarCheck,
   CarIcon,
   Hash,
   Loader,
   Play,
   ShieldOff,
   SquareCheck,
} from 'lucide-react';

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

function ChartsSection({
   proyectos,
   personal,
}: {
   proyectos: Caso[];
   personal: Personal[];
}) {
   const Meses = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
   ];

   const Años = [
      2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
   ];

   const newProyects = proyectos.filter(
      (item) => item.estatus.toLowerCase() === 'nuevo'
   );

   const Adjudicado = proyectos.filter(
      (item) => item.estatus.toLowerCase() === 'adjudicado'
   );

   const Iniciado = proyectos.filter(
      (item) => item.estatus.toLowerCase() === 'inicio'
   );

   const EnProgreso = proyectos.filter(
      (item) => item.estatus.toLowerCase() === 'progreso'
   );

   const Completado = proyectos.filter(
      (item) => item.estatus.toLowerCase() === 'completado'
   );

   const porcentajeCompletados =
      proyectos.length > 0 ? (Completado.length / proyectos.length) * 100 : 0;

   const vencidasPorTipo = () => {
      const resultado = {
         asbesto: 0,
         plomo: 0,
         fitTest: 0,
         evaluacionMedica: 0,
         licencia: 0,
      };
      personal.forEach((persona) => {
         persona.certificacions.forEach((certificacion) => {
            const hoy = new Date();
            const fechaExpiracion = new Date(certificacion.fechaExpiracion);

            if (fechaExpiracion < hoy) {
               switch (certificacion.tipoDocumento) {
                  case 'asbesto':
                     resultado.asbesto += 1;
                     break;
                  case 'plomo':
                     resultado.plomo += 1;
                     break;
                  case 'fitTest':
                     resultado.fitTest += 1;
                     break;
                  case 'evaluacionMedica':
                     resultado.evaluacionMedica += 1;
                     break;
                  case 'licencia':
                     resultado.licencia += 1;
                     break;
               }
            }
         });
      });

      return resultado;
   };

   Chart.defaults.color = '#ededed';

   const cantidadPorPueblo = proyectos.reduce((acc: any, proyecto) => {
      const pueblo = proyecto.pueblo;
      if (!acc[pueblo]) {
         acc[pueblo] = 0;
      }
      acc[pueblo]++;
      return acc;
   }, {});

   const labels = Object.keys(cantidadPorPueblo);

   const dataValues = Object.values(cantidadPorPueblo);

   const data = {
      labels: labels,
      datasets: [
         {
            label: 'Cantidad por Pueblo',
            data: dataValues,
            backgroundColor: [
               'rgb(255, 99, 132)',
               'rgb(54, 162, 235)',
               'rgb(255, 205, 86)',
               'rgb(75, 192, 192)',
               'rgb(153, 102, 255)',
               'rgb(255, 159, 64)',
               'rgb(201, 203, 207)',
               'rgb(255, 193, 7)',
               'rgb(40, 167, 69)',
               'rgb(23, 162, 184)',
               'rgb(220, 53, 69)',
               'rgb(108, 117, 125)',
               'rgb(111, 66, 193)',
               'rgb(0, 123, 255)',
               'rgb(232, 62, 140)',
               'rgb(52, 58, 64)',
               'rgb(111, 207, 151)',
               'rgb(255, 87, 51)',
            ],
            hoverOffset: 4,
         },
      ],
   };

   const fechasFin = proyectos
      .filter((proyecto) => proyecto.estatus.toLowerCase() === 'completado')
      .map((proyecto) => new Date(proyecto.fechaFin));

   const fechasAsbesto = proyectos
      .filter(
         (proyecto) =>
            proyecto.estatus.toLowerCase() === 'completado' &&
            proyecto.materialARemover.toLowerCase() === 'asbesto' ||
            proyecto.materialARemover.toLowerCase() === 'asbesto/plomo'
      )
      .map((proyecto) => new Date(proyecto.fechaFin));

   const fechasPlomo = proyectos
      .filter(
         (proyecto) =>
            proyecto.estatus.toLowerCase() === 'completado' &&
            proyecto.materialARemover.toLowerCase() === 'plomo' ||
            proyecto.materialARemover.toLowerCase() === 'asbesto/plomo'
      )
      .map((proyecto) => new Date(proyecto.fechaFin));

   const cantidadPorMes = fechasFin.reduce((acc: any, fecha) => {
      const mes = fecha
         .toLocaleString('default', {
            month: 'short',
         })
         .toLowerCase();
      if (!acc[mes]) {
         acc[mes] = 0;
      }
      acc[mes]++;
      return acc;
   }, {});

   const cantidadPorAño = fechasFin.reduce((acc: any, fecha) => {
      const año = fecha
         .toLocaleString('default', {
            year: 'numeric',
         })
         .toLowerCase();
      if (!acc[año]) {
         acc[año] = 0;
      }
      acc[año]++;
      return acc;
   }, {});
   
   const cantidadPorAñoAsbesto = fechasAsbesto.reduce((acc: any, fecha) => {
      const año = fecha
         .toLocaleString('default', {
            year: 'numeric',
         })
         .toLowerCase();
      if (!acc[año]) {
         acc[año] = 0;
      }
      acc[año]++;
      return acc;
   }, {});

   const cantidadPorAñoPlomo = fechasPlomo.reduce((acc: any, fecha) => {
      const año = fecha
         .toLocaleString('default', {
            year: 'numeric',
         })
         .toLowerCase();
      if (!acc[año]) {
         acc[año] = 0;
      }
      acc[año]++;
      return acc;
   }, {});

   const cantidadPorMesAsbesto = fechasAsbesto.reduce((acc: any, fecha) => {
      const mes = fecha
         .toLocaleString('default', {
            month: 'short',
         })
         .toLowerCase();
      if (!acc[mes]) {
         acc[mes] = 0;
      }
      acc[mes]++;
      return acc;
   }, {});

   const cantidadPorMesPlomo = fechasPlomo.reduce((acc: any, fecha) => {
      const mes = fecha
         .toLocaleString('default', {
            month: 'short',
         })
         .toLowerCase();
      if (!acc[mes]) {
         acc[mes] = 0;
      }
      acc[mes]++;
      return acc;
   }, {});

   const labels2 = Object.values(Meses);

   const labels3 = Object.values(Años);

   const dataValues2 = Meses.map(
      (mes) => cantidadPorMes[mes.toLowerCase()] || 0
   );

   const dataValues3 = Años.map((año) => cantidadPorAño[año] || 0);

   const dataValuesAbs = Años.map((año) => cantidadPorAñoAsbesto[año] || 0);

   const dataValuesPLP = Años.map((año) => cantidadPorAñoPlomo[año] || 0);

   const dataValuesAsbesto = Meses.map(
      (mes) => cantidadPorMesAsbesto[mes.toLowerCase()] || 0
   );

   const dataValuesPlomo = Meses.map(
      (mes) => cantidadPorMesPlomo[mes.toLowerCase()] || 0
   );

   const maxData = Math.max(...dataValues2) + 5;

   const maxData2 = Math.max(...dataValues3) + 5;

   const maxDataAbs = Math.max(...dataValues2) + 5;

   const maxDataPlp = Math.max(...dataValues2) + 5;

   const options = {
      scales: {
         y: {
            min: 0,
            max: maxData,
         },
      },
   };

   const options2 = {
      scales: {
         y: {
            min: 0,
            max: maxData2,
         },
      },
   };

   const optionsABS = {
      scales: {
         y: {
            min: 0,
            max: maxDataAbs,
         },
      },
   };

   const optionsPLP = {
      scales: {
         y: {
            min: 0,
            max: maxDataPlp,
         },
      },
   };

   const dataPorMes = {
      labels: labels2,
      datasets: [
         {
            label: 'Proyectos Completados por Mes',
            data: dataValues2,
            fill: true,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.3,
         },
         {
            label: 'Proyectos de Asbesto por Mes',
            data: dataValuesAsbesto,
            fill: true,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.3,
         },
         {
            label: 'Proyectos de Plomo por Mes',
            data: dataValuesPlomo,
            fill: true,
            borderColor: 'rgb(23, 162, 184)',
            tension: 0.3,
         },
      ],
   };

   const dataPorAño = {
      labels: labels3,
      datasets: [
         {
            label: 'Proyectos Completados por Año',
            data: dataValues3,
            fill: true,
            borderColor: 'rgb(15, 140, 12)',
            tension: 0.3,
         },
         {
            label: 'Proyectos de ABS por Año',
            data: dataValuesAbs,
            fill: true,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.3,
         },
         {
            label: 'Proyectos de LBL por Año',
            data: dataValuesPLP,
            fill: true,
            borderColor: 'rgb(23, 162, 184)',
            tension: 0.3,
         },
      ],
   };

   const dataAsbesto = {
      labels: labels2,
      datasets: [
         {
            label: 'Proyectos de Asbesto por Mes',
            data: dataValuesAsbesto,
            fill: true,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.3,
         },
         {
            label: 'Proyectos de Plomo por Mes',
            data: dataValuesPlomo,
            fill: true,
            borderColor: 'rgb(23, 162, 184)',
            tension: 0.3,
         },
      ],
   };

   const dataPlomo = {
      labels: labels2,
      datasets: [
         {
            label: 'Proyectos de Plomo por Mes',
            data: dataValuesPlomo,
            fill: true,
            borderColor: 'rgb(23, 162, 184)',
            tension: 0.3,
         },
      ],
   };

   return (
      <section className="grid grid-cols-auto-fit place-content-center gap-2">
         <Card className="w-full !bg-slate-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Cantidad de proyectos:
                  </h2>
                  <p className="text-slate-200 font-semibold">
                     {proyectos?.length}
                  </p>
               </div>
               <Hash className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-slate-600 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Nuevos proyectos:
                  </h2>
                  <p className="text-slate-300 font-semibold">
                     {newProyects.length}
                  </p>
               </div>
               <SquareCheck className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-teal-600 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Proyectos Adjudicados:
                  </h2>
                  <p className="text-slate-200 font-semibold">
                     {Adjudicado.length}
                  </p>
               </div>
               <CalendarCheck className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-teal-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Proyectos iniciados:
                  </h2>
                  <p className="text-slate-300 font-semibold">
                     {Iniciado.length}
                  </p>
               </div>
               <Play className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-blue-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Proyectos en progreso:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {EnProgreso.length}
                  </p>
               </div>
               <Loader className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-green-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Proyectos completados:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {Completado.length}
                  </p>
               </div>
               <SquareCheck className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-blue-600 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     % de proyectos completados:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {porcentajeCompletados.toFixed(2)} %
                  </p>
               </div>
               <SquareCheck className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-green-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Certificación de asbesto vencidas:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {vencidasPorTipo().asbesto}
                  </p>
               </div>
               <ShieldOff className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-yellow-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Certificación de plomo vencidas:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {vencidasPorTipo().plomo}
                  </p>
               </div>
               <ShieldOff className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-sky-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Fit Test vencidos:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {vencidasPorTipo().fitTest}
                  </p>
               </div>
               <ShieldOff className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-violet-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Examenes Médicos vencidos:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {vencidasPorTipo().evaluacionMedica}
                  </p>
               </div>
               <ShieldOff className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-red-500 h-24">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     Licencias de conducir vencidas:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {vencidasPorTipo().licencia}
                  </p>
               </div>
               <CarIcon className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full flex items-center justify-center !bg-slate-400 dark:!bg-slate-600 h-96">
            <Pie className="w-full h-full" data={data} />
         </Card>
         <Card className="w-full flex items-center justify-center !bg-slate-400 dark:!bg-slate-600 h-96">
            <Line
               className="w-full h-full"
               data={dataPorMes}
               options={options}
            />
         </Card>
         <Card className="w-full flex items-center justify-center !bg-slate-400 dark:!bg-slate-600 h-96">
            <Line
               className="w-full h-full"
               data={dataPorAño}
               options={options2}
            />
         </Card>
         {/* <Card className="w-full flex items-center justify-center !bg-slate-400 dark:!bg-slate-600 h-96">
            <Line
               className="w-full h-full"
               data={dataAsbesto}
               options={optionsABS}
            />
         </Card> */}
         {/* <Card className="w-full flex items-center justify-center !bg-slate-400 dark:!bg-slate-600 h-96">
            <Line
               className="w-full h-full"
               data={dataPlomo}
               options={optionsPLP}
            />
         </Card> */}
      </section>
   );
}

export default ChartsSection;
