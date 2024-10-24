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
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';
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
   const newProyects = proyectos.filter((item) => item.estatus === 'nuevo');

   const Adjudicado = proyectos.filter((item) => item.estatus === 'adjudicado');

   const Iniciado = proyectos.filter((item) => item.estatus === 'inicio');

   const EnProgreso = proyectos.filter((item) => item.estatus === 'progreso');

   const Completado = proyectos.filter((item) => item.estatus === 'completado');

   const porcentajeCompletados =
      proyectos.length > 0 ? (Completado.length / proyectos.length) * 100 : 0;

   const vencidasPorTipo = () => {
      const resultado = {
         asbesto: 0,
         plomo: 0,
         fitTest: 0,
         evaluacionMedica: 0,
         licencia: 0
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

   return (
      <section className="grid grid-cols-auto-fit place-content-center gap-2">
         <Card className="w-full !bg-slate-500 h-36">
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
         <Card className="w-full !bg-slate-600 h-36">
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
         <Card className="w-full !bg-teal-600 h-36">
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
         <Card className="w-full !bg-teal-500 h-36">
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
         <Card className="w-full !bg-blue-500 h-36">
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
         <Card className="w-full !bg-green-500 h-36">
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
         <Card className="w-full !bg-blue-600 h-36">
            <div className="flex flex-row items-center justify-between w-11/12 lg:w-10/12 m-auto">
               <div className="flex flex-col justify-between gap-6">
                  <h2 className="text-slate-200 font-semibold text-lg">
                     % de proyectos completados:
                  </h2>
                  <p className="text-green-100 font-semibold">
                     {porcentajeCompletados} %
                  </p>
               </div>
               <SquareCheck className="text-white" size={32} />
            </div>
         </Card>
         <Card className="w-full !bg-green-500 h-36">
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
         <Card className="w-full !bg-yellow-500 h-36">
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
         <Card className="w-full !bg-sky-500 h-36">
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
         <Card className="w-full !bg-violet-500 h-36">
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
         <Card className="w-full !bg-red-500 h-36">
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
      </section>
   );
}

export default ChartsSection;
