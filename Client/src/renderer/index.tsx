import { createRoot } from 'react-dom/client';
import { ChakraProvider, ColorModeScript, ThemeProvider, extendTheme } from '@chakra-ui/react';
import App from './App';
import { AuthProvider } from './Contexts/AuthProvider';

// eslint-disable-next-line prettier/prettier
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
// const customTheme = extendTheme({
//   config: {
//     initialColorMode: 'light',
//   },
//   styles: {
//     global: (props) => ({
//       body: {
//         bg: props.colorMode === 'dark' ? '#00364c' : 'white', 
//         color: props.colorMode === 'dark' ? 'white' : 'black',
//         transition: 'background-color 2s, color 0.3s'
//       },
//     }),
//   },
//   // colors: {
//   //   light: {
//   //     primaryText: '#e6e6fa',
//   //     secondaryText: 'your_light_mode_secondary_text_color_here',
//   //   },
//   //   dark: {
//   //     primaryText: 'red',
//   //     secondaryText: '#aaffaa',
//   //   },
//   // },
// });
root.render(
  // <ChakraProvider theme={customTheme}>
  <ChakraProvider>
    {/* <AuthProvider> */}
      {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
      <App />
    {/* </AuthProvider> */}
  </ChakraProvider>,
);

// // calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
