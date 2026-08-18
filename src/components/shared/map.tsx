"use client";

import { useEffect, useId, useRef } from "react";
import L, { type LatLngTuple, type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  coordinates: LatLngTuple;
  address: string;
  visible?: boolean;
}

export default function Map({
  coordinates,
  address,
  visible = true,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const id = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const leafletEl = el as HTMLDivElement & { _leaflet_id?: number };
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    if (leafletEl._leaflet_id) {
      leafletEl._leaflet_id = undefined;
    }

    const map = L.map(el, {
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView(coordinates, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(coordinates).addTo(map);
    if (address) {
      marker.bindTooltip(address);
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      leafletEl._leaflet_id = undefined;
    };
  }, [address, coordinates, id]);

  useEffect(() => {
    if (!visible || !mapRef.current) return;
    const map = mapRef.current;
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [visible, coordinates]);

  return (
    <div
      ref={containerRef}
      id={`ck-map-${id.replace(/:/g, "")}`}
      className="h-[300px] w-full rounded-md"
    />
  );
}
