import { io } from "socket.io-client";

function TestSocket() {
  const socket = io("http://localhost:8080");

  socket.on("location-update", (location) => {
    console.log("📍 Driver's Location:", location);
  });

  return (
    <>
      <button
        className="border"
        onClick={() => socket.emit("driver-join", "route-1")}
      >
        add driver
      </button>
      <button
        className="border"
        onClick={() => socket.emit("student-join", "route-1")}
      >
        add student
      </button>
      <button
        className="border"
        onClick={() =>
          socket.emit("driver-location", {
            routeId: "route-1",
            location: { latitude: 90, longitude: 89 },
          })
        }
      >
        send location
      </button>
      {/* <p>{username}</p> */}
    </>
  );
}

export default TestSocket;
