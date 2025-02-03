import "../styles/globals.css";  // This assumes 'styles' is at the root level of 'src'
import { FormProvider } from "../context/FormContext";

function MyApp({ Component, pageProps }) {
  return (
    <FormProvider>
      <Component {...pageProps} />
    </FormProvider>
  );
}

export default MyApp;
