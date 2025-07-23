
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-ant-path';

const AnimatedPath = ({ positions, color = '#f50808ff', pulseColor = '#FFFFFF' }) => {
    const map = useMap();

    useEffect(() => {
        const antPath = L.polyline.antPath(positions, {
            delay: 400,
            dashArray: [10, 20],
            weight: 5,
            color: color,
            pulseColor: pulseColor,
            paused: false,
            reverse: false,
            hardwareAccelerated: true
        });

        antPath.addTo(map);

        return () => {
            map.removeLayer(antPath);
        };
    }, [positions, color, pulseColor, map]);

    return null;
};

export default AnimatedPath;

