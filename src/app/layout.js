import "../styles/bootstrap-datetimepicker.min.css";
import "../styles/feather.css";
import "../styles/owl.theme.default.min.css";
import "../styles/slick.css";
import "../styles/bootstrap.min.css";
import "../styles/style.css";
import "nprogress/nprogress.css";
import Header from "@/components/HomePage/header/page";
import Footer from "@/components/HomePage/footer/page";
import ClientWrapper from "./ClientWrapper";
import "../styles/crista.css";
import { Providers } from "@/components/providers";
import "@yaireo/tagify/dist/tagify.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Head } from 'next/head';

library.add(fab);

export const metadata = {
  openGraph: {
    title: "INDOATLANTIC",
    description: "Sharing our culture, respecting your culture",
    url: "https://indoatlantic.ca",
    siteName: "INDOATLANTIC",
    images: [
      {
        url: "./favicon.png",
        width: 800,
        height: 600,
      },
      {
        url: "./favicon.png",
        width: 1800,
        height: 1600,
        alt: "My custom alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "./favicon.png" },
      { url: "./favicon.png", sizes: "32x32", type: "image/png" },
      { url: "./favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "./favicon.png" }],
  },
};

export default function RootLayout({ children }) {
  

  return (
    <>
      <html lang="en">
        <Providers>
          <head>
            <link rel="shortcut icon" href="./favicon.png" />
            <link rel="apple-touch-icon" href="./favicon.png" />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="./favicon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="./favicon.png"
            />
          </head>
          <body>
            <div className="main-wrapper">
              <ClientWrapper>
                <Header />

                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={true}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  stacked
                />
                {children}

                <Footer />
              </ClientWrapper>
            </div>
          </body>
        </Providers>
      </html>
    </>
  );
}
