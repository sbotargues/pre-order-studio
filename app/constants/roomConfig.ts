import { Position, RoomColors, Rooms } from "@/app/types/types";

export const roomConfigurations = {
  [Rooms.ONECSTUDIO]: {
    image: "/images/1c-portada.png",
    backgroundColor: RoomColors.ONECSTUDIO,
    position: Position.CENTER,
    imageWidth: 225,
    imageHeight: 225,
  },
  [Rooms.CUBESTUDIO]: {
    image: "/images/cube-portada.png",
    backgroundColor: RoomColors.CUBESTUDIO,
    position: Position.RIGHT,
    imageWidth: 175,
    imageHeight: 175,
  },
  [Rooms.FOURDSTUDIO]: {
    image: "/images/4d-portada.png",
    backgroundColor: RoomColors.FOURDSTUDIO,
    position: Position.LEFT,
    imageWidth: 240,
    imageHeight: 240,
  },
  [Rooms.HOMESTUDIO]: {
    image: "/images/home-portada.png",
    backgroundColor: RoomColors.HOMESTUDIO,
    position: Position.CENTER,
    imageWidth: 200,
    imageHeight: 200,
  },
};
