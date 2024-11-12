'use client';
import { Caso } from '@/utils/types';
import {
   GoogleMap,
   InfoWindow,
   Marker,
   useJsApiLoader,
} from '@react-google-maps/api';
import { differenceInDays } from 'date-fns';
import { LatLng } from 'leaflet';
import { useCallback, useState } from 'react';

function GoogleMapComp({ casos }: { casos: Caso[] }) {
   const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: 'AIzaSyDNwj6MyoQTN9CCOBLWTxh7nk89GjntQWU',
   });
   const center = { lat: 18.251069, lng: -66.470603 };

   const MarkerMultiple = () => {
      const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);

      const calcularProgreso = (fechaInicio: Date, fechaFin: Date) => {
         const fechaActual = new Date();
         const totalDias = differenceInDays(
            new Date(fechaFin),
            new Date(fechaInicio)
         );
         const diasTranscurridos = differenceInDays(
            fechaActual,
            new Date(fechaInicio)
         );
         const progreso = Math.min((diasTranscurridos / totalDias) * 100, 100);

         return progreso.toFixed(2);
      };

      const handleMarkerClick = useCallback((caso: Caso) => {
         setSelectedCaso(caso);
      }, []);
      
      return casos?.map((e, idx) => {
         const position = {
            lat: e.latitud,
            lng: e.longitud,
         } as unknown as LatLng;

         let iconColor;
         switch (e.estatus.toLowerCase()) {
            case 'nuevo':
               iconColor = '#8338ec'; // Violeta
               break;
            case 'adjudicado':
               iconColor = '#3a86ff'; // Azul
               break;
            case 'inicio':
               iconColor = '#dc3545'; // Rojo
               break;
            case 'progreso':
               iconColor = '#ffbe0b'; // Amarillo
               break;
            case 'completado':
               iconColor = '#70e000'; // Verde
               break;
         }

         const image = {
            path: google?.maps?.SymbolPath.CIRCLE,
            fillColor: iconColor,
            fillOpacity: 1,
            strokeWeight: 1,
            scale: 7, // Tamaño del marcador
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
                           Nro de proyecto:
                           <b className="font-semibold">{e?.numeroProyecto}</b>
                        </span>
                        <br />
                        <span className="text-xs">
                           Material a remover:{' '}
                           <b className="font-semibold">
                              {e?.materialARemover}
                           </b>
                        </span>
                        <br />
                        <span className="text-xs">
                           Supervisor de proyecto:{' '}
                           <b className="font-semibold">
                              {e?.supervisorProyecto}
                           </b>
                        </span>
                        <br />
                        <span className="text-xs">
                           Nombre de cliente:{' '}
                           <b className="font-semibold">{e?.nombreCliente}</b>
                        </span>
                        <br />
                        <span className="text-xs">
                           Nombre del proyecto:{' '}
                           <b className="font-semibold">{e?.nombreProyecto}</b>
                        </span>
                        <br />
                        <span className="text-xs">
                           Pueblo: <b className="font-semibold">{e?.pueblo}</b>
                        </span>
                        <br />
                        <span className="text-xs">
                           % Completado del proyecto:{' '}
                           <b className="font-semibold">
                              {calcularProgreso(e?.fechaInicio, e?.fechaFin)}
                           </b>
                        </span>
                        <br />
                        <span className="text-xs">
                           Estatus:{' '}
                           <b className="font-semibold">{e?.estatus}</b>
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
