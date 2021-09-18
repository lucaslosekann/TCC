import '../styles/globals.scss'
import { createTheme, ThemeProvider  } from '@material-ui/core/styles';
import Head from 'next/head';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

// You should do that in a Layout file or in `gatsby-browser.js`.
config.autoAddCss = false;


const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(66, 170, 255)",

    },
    secondary: {
      main: "#000",
    }
  },
});

function MyApp({ Component, pageProps }) {//ignora
  
  return <>
    <ThemeProvider theme={theme}>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}

export default MyApp
