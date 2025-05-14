import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Tooltip,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import MemoryIcon from '@mui/icons-material/Memory';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import useRagQuery from '../hooks/useRagQuery';

const SearchUI = () => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(10);
  const [searchResults, setSearchResults] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  
  // Custom hooks
  const { loading, error, searchPapers } = useRagQuery();
  
  // Category options for ArXiv
  const categoryOptions = [
    { value: 'cs.AI', label: 'Artificial Intelligence' },
    { value: 'cs.CL', label: 'Computation and Language' },
    { value: 'cs.CV', label: 'Computer Vision' },
    { value: 'cs.LG', label: 'Machine Learning' },
    { value: 'cs.NE', label: 'Neural and Evolutionary Computing' },
    { value: 'cs.RO', label: 'Robotics' },
  ];
  
  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Execute search
    try {
      const categories = selectedCategories.length > 0 ? selectedCategories : null;
      const results = await searchPapers(query, topK, categories);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };
  
  // Handle category selection change
  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // Clear search results
  const clearResults = () => {
    setSearchResults(null);
    setQuery('');
  };

  return (
    <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
      {/* Left search panel */}
      <Grid item xs={12} md={5} lg={4} sx={{ height: '100%', display: 'flex' }}>
        <Paper
          elevation={2}
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
                <SearchIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={600}>
                Research Search
              </Typography>
            </Box>
            
            <Tooltip title="Search Options">
              <IconButton 
                onClick={() => setShowOptions(!showOptions)} 
                size="small"
                color={showOptions ? "primary" : "default"}
                sx={{ 
                  border: showOptions ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
                  backgroundColor: showOptions ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                }}
              >
                <TuneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Search form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              borderBottom: showOptions ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search research papers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              sx={{ 
                mb: 2,
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
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              type="submit"
              disabled={loading || !query.trim()}
              fullWidth
              sx={{ 
                py: 1,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              {loading ? 'Searching...' : 'Search Papers'}
            </Button>
          </Box>
          
          {/* Search options - collapsible */}
          {showOptions && (
            <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Categories
              </Typography>
              <FormControl fullWidth size="small" variant="outlined" sx={{ mb: 3 }}>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  disabled={loading}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, 
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.3),
                    }
                  }}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label} ({category.value})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Results Count
              </Typography>
              <FormControl fullWidth size="small" variant="outlined" sx={{ mb: 3 }}>
                <Select
                  value={topK}
                  onChange={(e) => setTopK(e.target.value)}
                  disabled={loading}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.3),
                    }
                  }}
                >
                  {[5, 10, 15, 20, 25].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value} Results
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.background.paper, 0.3),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}>
                <Typography variant="caption" color="text.secondary">
                  Search directly in the ArXiv database for research papers. 
                  Filter by categories to narrow down your search results.
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Expanded area when options are hidden */}
          {!showOptions && (
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0, 204, 255, 0.05), transparent 70%)',
            }}>
              <MemoryIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7, mb: 2 }} />
              <Typography variant="h6" align="center" fontWeight={600}>
                RAG Search
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1, maxWidth: 300 }}>
                Use intelligent search to find relevant research papers from ArXiv
              </Typography>
              
              {selectedCategories.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Selected Categories:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, justifyContent: 'center' }}>
                    {selectedCategories.map((cat) => (
                      <Chip 
                        key={cat} 
                        label={cat} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Results panel */}
      <Grid item xs={12} md={7} lg={8} sx={{ height: '100%', display: 'flex' }}>
        <Paper
          elevation={2}
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
          }}
        >
          {/* Results header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ArticleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" fontWeight={600}>
                {searchResults ? 'Search Results' : 'Results'}
              </Typography>
              {searchResults && (
                <Chip 
                  label={`Top ${topK}`} 
                  size="small" 
                  sx={{ 
                    ml: 1.5, 
                    fontSize: '0.7rem',
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  }} 
                />
              )}
            </Box>
            
            {searchResults && (
              <Tooltip title="Clear Results">
                <IconButton 
                  onClick={clearResults} 
                  size="small" 
                  color="default"
                  sx={{ opacity: 0.7 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {/* Results content */}
          <Box
            sx={{
              p: 2,
              flexGrow: 1,
              overflow: 'auto',
              backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0, 204, 255, 0.03), transparent 70%)',
            }}
          >
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                }}
              >
                {error}
              </Alert>
            )}
            
            {!searchResults && !loading && !error && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  opacity: 0.7,
                  p: 4,
                }}
              >
                <ArticleIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
                <Typography variant="h5" align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  No Results Yet
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 1 }}>
                  Enter a query to search for relevant academic papers.
                </Typography>
              </Box>
            )}
            
            {searchResults && (
              <Card
                variant="outlined"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: 'blur(4px)',
                }}
              >
                <CardContent>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {searchResults}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SearchUI; 