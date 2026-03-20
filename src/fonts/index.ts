import {
  Poppins,
  Roboto,
  Montserrat,
  Oswald,
  Exo,
  Nabla,
  Geist,
} from "next/font/google";
// Define Poppins font
export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400"],
});

export const exo = Exo({
  subsets: ["latin"],
  weight: ["400"],
});

export const nabla = Nabla({
  subsets: ["latin"],
  weight: ["400"],
});

export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});