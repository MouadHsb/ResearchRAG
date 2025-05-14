import { createTheme } from '@mui/material/styles';

// Create a dark cyberpunk theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ccff',
      light: '#33d6ff',
      dark: '#0099cc',
      contrastText: '#000',
    },
    secondary: {
      main: '#ff33cc',
      light: '#ff66d9',
      dark: '#cc0099',
      contrastText: '#000',
    },
    background: {
      default: '#0c1117',
      paper: '#161c24',
    },
    text: {
      primary: '#e6e6e6',
      secondary: '#b3b3b3',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    error: {
      main: '#ff3d71',
    },
    success: {
      main: '#00e096',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.7)',
          backgroundImage: 'linear-gradient(to right, #161c24, #1f262e)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'linear-gradient(to bottom, #161c24, #1a232d)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
  },
});

export default theme; 