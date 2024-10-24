'use client';
import ChartsSection from '@/components/charts';
import Tittle from '@/components/title';
import { getCasos } from '@/utils/api/casos';
import { getPersonal } from '@/utils/api/personal';
import { Caso, Personal } from '@/utils/types';
import { useEffect, useState } from 'react';

export default function Home() {
   const [casos, setCasos] = useState<Caso[]>();
   const [personal, setPersonal] = useState<Personal[]>();

   const obtainCasos = async () => {
      const data: Caso[] = await getCasos();
      setCasos(data);
   };

   const obtainPersonal = async () => {
      const data: Personal[] = await getPersonal('all');
      setPersonal(data);
   };

   useEffect(() => {
      obtainCasos();
      obtainPersonal();
   }, []);

   return (
      <main className="ml-24 lg:ml-56 py-4">
         <Tittle>Estadisticas generales</Tittle>
         <div className="w-[95%] mt-4">
            <ChartsSection proyectos={casos ?? []} personal={personal ?? []} />
         </div>
      </main>
   );
}
