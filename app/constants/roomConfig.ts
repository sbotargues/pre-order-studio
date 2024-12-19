import { RoomColors, Rooms } from "@/app/types/types";

export const roomConfigurations = {
  [Rooms.ONECSTUDIO]: {
    image: "/images/1c-portada.png",
    backgroundColor: RoomColors.ONECSTUDIO,
    position: "center",
    imageWidth: 210,
    imageHeight: 210,
  },
  [Rooms.CUBESTUDIO]: {
    image: "/images/cube-portada.png",
    backgroundColor: RoomColors.CUBESTUDIO,
    position: "right",
    imageWidth: 175,
    imageHeight: 175,
  },
  [Rooms.FOURDSTUDIO]: {
    image: "/images/4d-portada.png",
    backgroundColor: RoomColors.FOURDSTUDIO,
    position: "left",
    imageWidth: 240,
    imageHeight: 240,
  },
  [Rooms.HOMESTUDIO]: {
    image: "/images/home-portada.png",
    backgroundColor: RoomColors.HOMESTUDIO,
    position: "center",
    imageWidth: 200,
    imageHeight: 200,
  },
};
