import ChartsSection from "@/components/charts";
import Tittle from "@/components/title";
import { getCasos } from "@/utils/api/casos";
import { Caso } from "@/utils/types";

export default async function Home() {
  const data: Caso[] = await getCasos();
  
  return (
    <main className="ml-24 lg:ml-72 py-4">
      <Tittle>Estadisticas generales</Tittle>
      <div className="w-[95%] mt-4">
        <ChartsSection data={data ?? []} />
      </div>
    </main>
  );
}
