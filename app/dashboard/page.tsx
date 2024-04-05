"use client";
import ChartsSection from "@/components/charts";
import Tittle from "@/components/title";
import { getCasos } from "@/utils/api/casos";
import { Caso } from "@/utils/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [casos, setCasos] = useState<Caso[]>();

  const obtainCasos = async () => {
    const data: Caso[] = await getCasos();
    setCasos(data);
  };

  useEffect(() => {
    obtainCasos();
  }, []);

  return (
    <main className="ml-24 lg:ml-52 py-4">
      <Tittle>Estadisticas generales</Tittle>
      <div className="w-[95%] mt-4">
        <ChartsSection data={casos ?? []} />
      </div>
    </main>
  );
}
