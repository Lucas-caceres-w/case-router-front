"use client";
import { getCasos } from "@/utils/api/casos";
import { Caso } from "@/utils/types";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import GoogleMapComp from "./MapGoogle";

export default function MapCasie() {
  const Map = dynamic(() => import("./MapComponent"), { ssr: false });
  const [casos, setCasos] = useState<Caso[] | []>([]);

  const handleGetCasos = async () => {
    const data = await getCasos();
    setCasos(data);
  };
  useEffect(() => {
    handleGetCasos();
  }, []);

  return (
    <main className="ml-24 lg:ml-52 mt-24 grid place-items-center w-[85%] h-full overflow-hidden">
      {/* <Map casos={casos ?? []} /> */}
      <div style={{ height: "75vh", width: "70vw", borderRadius: "5px" }}>
        <GoogleMapComp casos={casos ?? []} />
      </div>
    </main>
  );
}
