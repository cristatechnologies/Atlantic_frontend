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



library.add(fab);






// export const metadata = {
//   openGraph: {
//     title: "Next.js",
//     description: "The React Framework for the Web",
//     url: "https://nextjs.org",
//     siteName: "Next.js",
//     images: [
//       {
//         url: "https://raw.githubusercontent.com/gitdagray/my-blogposts/main/images/og-card.png",
//         width: 800,
//         height: 600,
//       },
//       {
//         url: "https://raw.githubusercontent.com/gitdagray/my-blogposts/main/images/og-card.png",
//         width: 1800,
//         height: 1600,
//         alt: "My custom alt",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };


export default function RootLayout({ children }) {
  

  return (
    <>
      
      <html lang="en">
        <Providers>
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
