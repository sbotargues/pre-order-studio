import type { Metadata } from "next";
import "./styles/_globals.scss";
import { RoomProvider } from "./context/RoomProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Myfuckingstudio PRE-ORDER",
  description: "PRE-ORDER",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RoomProvider>{children}</RoomProvider>
      </body>
    </html>
  );
}
