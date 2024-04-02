import ChartsSection from "@/components/charts";
import Tittle from "@/components/title";
import { getCasos } from "@/utils/api/casos";
import { Caso } from "@/utils/types";

export default async function Home() {
  const data: Caso[] = await getCasos();

  return (
    <main className="ml-24 lg:ml-72 mt-10">
      <Tittle>Estadisticas generales</Tittle>
      <div className="w-[95%] mt-6">
        <ChartsSection data={data} />
      </div>
    </main>
  );
}
