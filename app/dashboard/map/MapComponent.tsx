"use client";
import { Caso } from "@/utils/types";
import Leaflet, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function MapComponent({ casos }: { casos: Caso[] | [] }) {
  const iconSuccess = Leaflet.icon({
    iconSize: [35, 35],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl:
      "https://static.vecteezy.com/system/resources/previews/017/350/123/original/green-check-mark-icon-in-round-shape-design-png.png",
  });

  const iconInit = Leaflet.icon({
    iconSize: [28, 28],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3686/3686918.png",
  });

  const center = [18.251069, -66.470603] as LatLngExpression;
  /* const layer =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"; */
  const layer2 = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const MarkerMultiple = () => {
    return casos?.map((e, idx) => {
      const position = [e.latitud, e.longitud] as LatLngExpression;
      const icon = e.estatus !== "completado" ? iconInit : iconSuccess;
      return (
        <Marker key={idx} position={position} icon={icon}>
          <Popup>
            <span className="text-xs">
              Nro. asignado por AAA:
              <b className="font-semibold">{e.asignadoPor}</b>
            </span>
            <br />
            <span className="text-xs">
              Nro. catastro:<b className="font-semibold">{e.nroCatastro}</b>
            </span>
            <br />
            <span className="text-xs">
              Nro. Ogpe Sbp:<b className="font-semibold">{e.nroOgpeSbp}</b>
            </span>
            <br />
            <span className="text-xs">
              Estatus:<b className="font-semibold">{e.estatus}</b>
            </span>
          </Popup>
        </Marker>
      );
    });
  };

  return (
    <MapContainer
      zoom={10}
      center={center}
      style={{ height: "75vh", width: "70vw", borderRadius: "5px" }}
    >
      <TileLayer url={layer2} />
      <MarkerMultiple />
    </MapContainer>
  );
}

export default MapComponent;
