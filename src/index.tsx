// @ts-ignore
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import ReactDOM from 'react-dom';
import App from './App';

/**
 * Customize form so each control has more space
 */
const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.3em 0',
        },
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&.Mui-disabled': {
            borderBottom: 'none',
            '&&&:before': {
              borderBottom: 'none',
            },
            '&&:after': {
              borderBottom: 'none',
            },
          },
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            display: 'none',
          }
        }
      }
    },
  },
  palette:{
    action: {
      disabled: 'black'
    },
    text: {
      disabled: 'black'
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <App/>
  </ThemeProvider>,
  document.getElementById('root')
);
