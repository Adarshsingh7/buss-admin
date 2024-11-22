import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  position: "relative" as const,
};

const smallMapStyle = {
  width: "200px",
  height: "200px",
  position: "absolute" as const,
  top: "10px",
  right: "10px",
  border: "2px solid white",
  borderRadius: "4px",
  overflow: "hidden",
  zIndex: 1000,
};

const crosshairStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none" as const,
  zIndex: 1001,
};

interface AddressType {
  latitude: number;
  longitude: number;
  address: string;
}

interface InteractiveMapProps {
  onAddressChange?: (address: AddressType) => void;
  lat?: number;
  lng?: number;
  address?: string;
}

export default function InteractiveMap({
  onAddressChange,
  lat,
  lng,
  address: initialAddress,
}: InteractiveMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });
  const defaultCenter = {
    lat: lat ?? 0,
    lng: lng ?? 0,
  };

  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [inputLat, setInputLat] = useState(defaultCenter.lat.toString());
  const [inputLng, setInputLng] = useState(defaultCenter.lng.toString());
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState(initialAddress || "");
  const [elevation, setElevation] = useState<number | null>(null);
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [customMarkerIcon, setCustomMarkerIcon] =
    useState<google.maps.Symbol | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const smallMapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setMarkerPosition(userLocation);
          setInputLat(userLocation.lat.toFixed(6));
          setInputLng(userLocation.lng.toFixed(6));
        },
        () => {
          console.log("Unable to retrieve your location");
        },
      );
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setCustomMarkerIcon({
        path: "M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
        fillColor: "#18181b",
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: "#ffffff",
        scale: 1.5,
        anchor: new google.maps.Point(10, 20),
      });
    }
  }, [isLoaded]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPosition);
      setInputLat(newPosition.lat.toFixed(6));
      setInputLng(newPosition.lng.toFixed(6));
      updateAddressAndElevation(newPosition);
    }
  };

  const handleCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const newPosition = { lat: newCenter.lat(), lng: newCenter.lng() };
        setMarkerPosition(newPosition);
        setInputLat(newPosition.lat.toFixed(6));
        setInputLng(newPosition.lng.toFixed(6));

        // Update small map center
        if (smallMapRef.current) {
          smallMapRef.current.setCenter(newPosition);
        }
      }
    }
  };

  const handleDragEnd = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const newPosition = { lat: newCenter.lat(), lng: newCenter.lng() };
        updateAddressAndElevation(newPosition);
      }
      setIsMapDragging(false);
    }
  };

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      setter(e.target.value);
    },
    [],
  );

  const handleGoToCoordinates = useCallback(() => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
      const newPosition = { lat, lng };
      setMarkerPosition(newPosition);
      mapRef.current.panTo(newPosition);
      updateAddressAndElevation(newPosition);
    }
  }, [inputLat, inputLng]);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const searchBox = new window.google.maps.places.SearchBox(
        document.getElementById("search-box") as HTMLInputElement,
      );
      searchBoxRef.current = searchBox;

      mapRef.current.addListener("bounds_changed", () => {
        searchBox.setBounds(
          mapRef.current!.getBounds() as google.maps.LatLngBounds,
        );
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry && place.geometry.location) {
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setMarkerPosition(newPosition);
            setInputLat(newPosition.lat.toFixed(6));
            setInputLng(newPosition.lng.toFixed(6));
            mapRef.current?.panTo(newPosition);
            updateAddressAndElevation(newPosition);
          }
        }
      });
    }
  }, [isLoaded]);

  const updateAddressAndElevation = (position: google.maps.LatLngLiteral) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });

    const elevator = new window.google.maps.ElevationService();
    elevator.getElevationForLocations(
      {
        locations: [position],
      },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          setElevation(results[0].elevation);
        }
      },
    );
  };

  const handleAddRecord = useCallback(() => {
    console.log(
      `Added record at: Lat ${markerPosition.lat}, Lng ${markerPosition.lng}, Address: ${address}, Elevation: ${elevation}m`,
    );
    if (onAddressChange)
      onAddressChange({
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        address,
      });
  }, [markerPosition, address, elevation, onAddressChange]);

  const Crosshair = () => (
    <div style={crosshairStyle}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="black"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="black"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  );

  if (loadError) {
    return (
      <>
        <div>Error loading maps</div>
      </>
    );
  }

  return isLoaded ? (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={inputLat}
            onChange={(e) => handleInputChange(e, setInputLat)}
            placeholder="Latitude"
          />
          <Input
            type="text"
            value={inputLng}
            onChange={(e) => handleInputChange(e, setInputLng)}
            placeholder="Longitude"
          />
          <Button onClick={handleGoToCoordinates} size="sm" className="px-6">
            Go
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("form submitted");
          }}
        >
          <div className="flex space-x-2">
            <Input
              id="search-box"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location"
            />
          </div>
        </form>
        <div style={mapContainerStyle}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            onCenterChanged={handleCenterChanged}
            onDragStart={() => setIsMapDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {customMarkerIcon && (
              <Marker position={markerPosition} icon={customMarkerIcon} />
            )}
            {/* <Crosshair /> */}
            {isMapDragging && (
              <div style={smallMapStyle}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={markerPosition}
                  zoom={18}
                  options={{
                    disableDefaultUI: true,
                    draggable: false,
                    zoomControl: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: true,
                  }}
                >
                  {customMarkerIcon && (
                    <Marker
                      position={markerPosition}
                      icon={{
                        ...customMarkerIcon,
                        scale: customMarkerIcon?.scale
                          ? customMarkerIcon.scale * 2
                          : 1,
                      }}
                    />
                  )}
                  <Crosshair />
                </GoogleMap>
              </div>
            )}
          </GoogleMap>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Elevation:</strong>{" "}
            {elevation !== null ? `${elevation.toFixed(2)}m` : "N/A"}
          </p>
        </div>
        <Button onClick={handleAddRecord} size="sm" className="w-full">
          Add Record
        </Button>
      </CardContent>
    </Card>
  ) : (
    <></>
  );
}
