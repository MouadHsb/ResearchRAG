import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline,
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  Divider,
  useMediaQuery,
  Tooltip,
  Button,
  Avatar,
  alpha,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MemoryIcon from '@mui/icons-material/Memory';
import TerminalIcon from '@mui/icons-material/Terminal';
import DeleteIcon from '@mui/icons-material/Delete';
import useModels from '../hooks/useModels';
import useRagQuery from '../hooks/useRagQuery';

// Drawer width
const drawerWidth = 280;

// Logo Component
const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <MemoryIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
    {/* <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
    <span style={{ color: '#00ccff' }}>RAG</span> Research <span style={{ color: '#00ccff' }}>Assistant</span>
    </Typography> */}
    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
    RAG Research Assistant
    </Typography>
  </Box>
);

/**
 * Main layout component with responsive drawer
 */
const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [topK, setTopK] = useState(5);
  
  // Custom hooks for chat settings
  const { models, selectedModel, selectModel } = useModels();
  const { reset } = useRagQuery();
  
  // Clear chat function to pass to the settings panel
  const clearChat = () => {
    // You'll need to implement a way to communicate this action to the ChatUI component
    // This could be done via context API or another state management solution
    if (window.clearChatCallback) {
      window.clearChatCallback();
    }
    reset();
  };

  // Make topK accessible to other components like ChatUI
  useEffect(() => {
    window.topKValue = topK;
  }, [topK]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items
  const navItems = [
    { text: 'Search', icon: <SearchIcon sx={{ color: 'primary.light' }} />, path: '/' },
    { text: 'Chat', icon: <SmartToyIcon sx={{ color: 'primary.light' }} />, path: '/chat' },
  ];

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.text : 'ResearchRAG';
  };
  
  // Check if we're on the chat page
  const isChatPage = currentPath === '/chat';

  // Settings panel content for the chat
  const chatSettingsPanel = isChatPage && (
    <Box sx={{ p: 2, mt: -2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: alpha(theme.palette.primary.main, 0.9) }}>
        Chat Settings
      </Typography>
      
      <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.divider, 0.5) }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          LLM Model
        </Typography>
        <FormControl fullWidth size="small" variant="outlined">
          <Select
            value={selectedModel || ''}
            onChange={(e) => selectModel(e.target.value)}
            sx={{ 
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.3),
              }
            }}
          >
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model.split('/')[1] || model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Results to Consider
        </Typography>
        <FormControl fullWidth size="small" variant="outlined">
          <Select
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
            sx={{ 
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.3),
              }
            }}
          >
            {[3, 5, 10, 15, 20].map((value) => (
              <MenuItem key={value} value={value}>
                {value} Documents
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={clearChat}
        sx={{ 
          mt: 2,
          borderColor: alpha(theme.palette.error.main, 0.5),
          color: theme.palette.error.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            borderColor: theme.palette.error.main,
          }
        }}
      >
        Clear Conversation
      </Button>
    </Box>
  );

  // Drawer content
  const drawer = (
    <>
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between', 
          py: 2,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          backgroundImage: 'linear-gradient(rgba(0,204,255,0.05), transparent)'
        }}
      >
        <Logo />
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100% - 64px)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2, flexGrow: 0 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={Link}
                  to={item.path}
                  selected={currentPath === item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.25),
                      },
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: currentPath === item.path ? 600 : 400 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        
        {/* Chat settings panel when on chat page */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {chatSettingsPanel}
        </Box>
        
        {/* GitHub and bottom text section */}
        <Box sx={{ p: 2, mt: 'auto', flexGrow: 0, mb: 2 }}>
          <Divider sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.5) }} />
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            fullWidth
            href="https://github.com/MouadHsb/ResearchRAG"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              borderColor: alpha(theme.palette.primary.main, 0.5),
              mb: 1,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            View Frontend Repository
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            fullWidth
            href="https://huggingface.co/spaces/MouadHSB/ResearchRAG"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              borderColor: alpha(theme.palette.primary.main, 0.5),
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            View Backend Repository
          </Button>
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundImage: 'linear-gradient(to right, #101418, #1a232d)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getCurrentPageTitle()}
          </Typography>
          
          {/* App bar actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="GitHub Repository">
              <IconButton
                color="inherit"
                href="https://github.com/MouadHsb/ResearchRAG"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mx: 1,
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Open Terminal">
              <IconButton
                color="inherit"
                href="https://huggingface.co/spaces/MouadHSB/ResearchRAG"
                sx={{ 
                  mx: 1,
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <TerminalIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer - responsive */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundImage: 'linear-gradient(to bottom, #161c24, #121820)',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundImage: 'linear-gradient(to bottom, #161c24, #121820)',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflowY: 'auto'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 204, 255, 0.03), transparent 65%)',
        }}
      >
        <Toolbar /> {/* This is for spacing below the AppBar */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 