import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Typography, 
  Divider,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
  Tooltip,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import useRagQuery from '../hooks/useRagQuery';
import useModels from '../hooks/useModels';

// Chat message types
const MessageType = {
  USER: 'user',
  ASSISTANT: 'assistant',
  ERROR: 'error',
  SEARCH_RESULTS: 'search_results'
};

const ChatUI = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [currentSearchResults, setCurrentSearchResults] = useState(null);
  
  // Custom hooks
  const { loading, error, result, executeQuery, reset } = useRagQuery();
  const { models, selectedModel } = useModels();
  
  // Make clearChat accessible to the Layout component
  useEffect(() => {
    window.clearChatCallback = clearChat;
    return () => {
      window.clearChatCallback = null;
    };
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Add message to chat
  const addMessage = (text, type) => {
    setMessages(prev => [...prev, { text, type, timestamp: new Date() }]);
    
    // Store search results separately for the sidebar
    if (type === MessageType.SEARCH_RESULTS) {
      setCurrentSearchResults(text);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message
    addMessage(query, MessageType.USER);
    
    // Execute query
    try {
      // Get topK from the Layout component through window object
      const topK = window.topKValue || 5; // Default to 5 if not set
      const response = await executeQuery(query, topK, selectedModel);
      
      if (response) {
        // Add assistant response
        addMessage(response.answer, MessageType.ASSISTANT);
        
        // Add search results as a special message type
        addMessage(response.search_results_markdown, MessageType.SEARCH_RESULTS);
      }
    } catch (err) {
      addMessage(err.message || 'An error occurred', MessageType.ERROR);
    }
    
    // Clear input
    setQuery('');
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setCurrentSearchResults(null);
    reset();
  };
  
  // Render message based on type
  const renderMessage = (message, index) => {
    switch (message.type) {
      case MessageType.USER:
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 2,
              px: { xs: 2, md: 4 },
              width: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                p: 2,
                pt: 1,
                pb: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography variant="body1" color="text.primary">{message.text}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, alignSelf: 'flex-end' }}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
        
      case MessageType.ASSISTANT:
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 2,
              px: { xs: 2, md: 4 },
              width: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                p: 2,
                pt: 1,
                pb: 1,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        );
        
      case MessageType.ERROR:
        return (
          <Box key={index} sx={{ mb: 3, px: { xs: 2, md: 4 } }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                backgroundColor: alpha(theme.palette.error.main, 0.1)
              }}
            >
              {message.text}
            </Alert>
          </Box>
        );
        
      // We don't render search results in the chat anymore
      case MessageType.SEARCH_RESULTS:
        return null;
        
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
      {/* Main chat area */}
      <Grid item xs={12} md={currentSearchResults ? 7 : 12} sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        display: 'flex'
      }}>
        <Paper
          elevation={2}
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1.5, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <SmartToyIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={600}>
                Research Assistant
              </Typography>
              {selectedModel && (
                <Chip 
                  label={selectedModel.split('/')[1] || selectedModel} 
                  size="small" 
                  sx={{ 
                    ml: 1.5, 
                    fontSize: '0.7rem',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    color: theme.palette.primary.main
                  }} 
                />
              )}
            </Box>
            
            <Box>
              {messages.length > 0 && (
                <Tooltip title="Clear Chat">
                  <IconButton 
                    onClick={clearChat} 
                    size="small" 
                    color="error"
                    sx={{ ml: 1 }}
                    disabled={loading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          
          {/* Chat messages container */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              bgcolor: 'transparent',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 204, 255, 0.03), transparent 70%)',
              py: 2,
            }}
          >
            {/* Loading state */}
            {loading && messages.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.7,
                }}
              >
                <CircularProgress size={40} sx={{ mb: 2, color: theme.palette.primary.main }} />
                <Typography variant="body2" color="text.secondary">
                  Initializing chat...
                </Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  opacity: 0.7,
                  px: 3,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7, mb: 2 }} />
                <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 1 }}>
                  RAG Research Assistant
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
                  Ask any question about research papers or academic topics. The assistant will search relevant documents to provide accurate answers.
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, maxWidth: 600 }}>
                  {[
                    "Explain quantum computing in simple terms",
                    "What are the latest developments in computer vision?",
                    "Summarize research on GANs",
                    "Compare transformer models with CNNs"
                  ].map((suggestion) => (
                    <Chip
                      key={suggestion} 
                      label={suggestion}
                      onClick={() => setQuery(suggestion)}
                      clickable
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <>
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>
          
          {/* Input form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.3),
              display: 'flex',
              alignItems: 'center',
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              flexShrink: 0,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: alpha(theme.palette.divider, 0.3),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="submit"
                    disabled={loading || !query.trim()}
                    color="primary"
                    sx={{
                      bgcolor: loading ? 'transparent' : alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : <SendIcon />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Right panel for search results only */}
      {currentSearchResults && (
        <Grid 
          item 
          xs={12} 
          md={5} 
          sx={{ 
            height: '100%',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            {/* Search results */}
            <Paper
              elevation={2}
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 3,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  flexShrink: 0
                }}
              >
                <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Search Results
                </Typography>
              </Box>

              <Box 
                className="markdown" 
                sx={{ 
                  p: 3, 
                  pt: 0,
                  overflowY: 'auto',
                  flexGrow: 1
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentSearchResults}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ChatUI; 