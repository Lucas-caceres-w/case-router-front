"use client";
import { Caso } from "@/utils/types";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { LatLng } from "leaflet";
import { useCallback, useState } from "react";

function GoogleMapComp({ casos }: { casos: Caso[] }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDNwj6MyoQTN9CCOBLWTxh7nk89GjntQWU",
  });
  const center = { lat: 18.251069, lng: -66.470603 };

  const iconSuccess = "/assets/aprobado.png";
  const iconInit = "/assets/rechazado.png";
  const iconProcess = "/assets/proceso.png";

  const MarkerMultiple = () => {
    const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);

    const handleMarkerClick = useCallback((caso: Caso) => {
      setSelectedCaso(caso);
    }, []);
    console.log(casos);
    return casos?.map((e, idx) => {
      const position = { lat: e.latitud, lng: e.longitud } as LatLng;
      const icon =
        e.estatus === "completado" ||
        e.estatus === "Listo para trasferir a PPP" ||
        e.estatus === "cartaRecomendacion" ||
        e.estatus === "Carta de recomendacion completada"
          ? iconSuccess
          : e.estatus === "iniciado"
          ? iconInit
          : iconProcess;
      const image = {
        url: icon,
      };
      return (
        <Marker
          onClick={() => handleMarkerClick(e)}
          key={idx}
          position={position}
          icon={image}
        >
          {selectedCaso === e && (
            <InfoWindow onCloseClick={() => setSelectedCaso(null)}>
              <div>
                <span className="text-xs">
                  Nro. asignado por AAA:
                  <b className="font-semibold">{e.asignadoPor}</b>
                </span>
                <br />
                <span className="text-xs">
                  Nro. catastro:{" "}
                  <b className="font-semibold">{e.nroCatastro}</b>
                </span>
                <br />
                <span className="text-xs">
                  Nro. Ogpe Sbp: <b className="font-semibold">{e.nroOgpeSbp}</b>
                </span>
                <br />
                <span className="text-xs">
                  Estatus: <b className="font-semibold">{e.estatus}</b>
                </span>
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    });
  };

  return (
    isLoaded && (
      <GoogleMap
        mapContainerClassName="w-full h-full"
        zoom={10}
        center={center}
      >
        <MarkerMultiple />
      </GoogleMap>
    )
  );
}

export default GoogleMapComp;
