"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, Marker, Tooltip, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";


interface MapProps {
    coordinates: LatLngTuple;
    address: string
}

export default function Map({ coordinates, address }: MapProps) {

    return (
        <MapContainer
            center={coordinates}
            zoom={11}
            scrollWheelZoom={true}
            className="w-full h-[300px] rounded-md"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordinates}>
                <Tooltip>
                    {address}
                </Tooltip>
            </Marker>
        </MapContainer>
    );
}