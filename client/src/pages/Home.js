import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Skeleton,
  Chip,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

/* ✅ GUARANTEED WORKING FASHION IMAGE */
const HERO_BG =
  'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg';

const categories = ['All', 'Fashion', 'Electronics', 'Shoes', 'Accessories'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get('/api/products')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts =
    activeCategory === 'All'
      ? products
      : products.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === activeCategory.toLowerCase()
        );

  const handleAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.mainVariant?.price,
      image: product.mainVariant?.images?.[0],
    });
    toast.success('Added to cart');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* ================= HERO ================= */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 420, md: 540 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* IMAGE LAYER */}
        <Box
          component="img"
          src={HERO_BG}
          alt="Fashion background"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* LIGHT OVERLAY (NOT GRAY!) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.25)',
          }}
        />

        {/* TEXT CONTENT */}
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            fontWeight={700}
            lineHeight={1.15}
            maxWidth={720}
            color="white"
          >
            Premium fashion
            <br />
            made effortless.
          </Typography>

          <Typography
            mt={3}
            maxWidth={520}
            fontSize="1.05rem"
            color="rgba(255,255,255,0.9)"
          >
            Elevated essentials, modern silhouettes, and timeless pieces
            designed for confident everyday wear.
          </Typography>

          <Button
            component={Link}
            to="/home"
            sx={{
              mt: 4,
              px: 4,
              py: 1.4,
              borderRadius: 0,
              fontWeight: 600,
              bgcolor: 'white',
              color: '#111',
              '&:hover': { bgcolor: '#f2f2f2' },
            }}
          >
            Explore Collection
          </Button>
        </Container>
      </Box>

      {/* ================= CATEGORY NAV ================= */}
      <Container sx={{ py: 5 }}>
        <Stack direction="row" spacing={3} sx={{ overflowX: 'auto' }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              clickable
              sx={{
                borderRadius: 0,
                fontWeight: 500,
                bgcolor: 'transparent',
                borderBottom:
                  activeCategory === cat
                    ? '2px solid #111'
                    : '2px solid transparent',
              }}
            />
          ))}
        </Stack>
      </Container>

      {/* ================= PRODUCTS (OFF-WHITE) ================= */}
      <Box sx={{ background: '#fafaf6', py: 8 }}>
        <Container>
          <Grid container spacing={{ xs: 3, md: 5 }}>
            {loading
              ? Array.from(new Array(6)).map((_, i) => (
                  <Grid item xs={6} md={4} key={i}>
                    <Skeleton height={280} />
                  </Grid>
                ))
              : visibleProducts.map((product) => (
                  <Grid item xs={6} md={4} key={product.id}>
                    <Box>
                      <Link
                        to={`/product/${product.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Box
                          component="img"
                          src={
                            product.mainVariant?.images?.[0] ||
                            'https://via.placeholder.com/400'
                          }
                          alt={product.name}
                          sx={{
                            width: '100%',
                            height: { xs: 200, md: 280 },
                            objectFit: 'contain',
                            background: '#f3f3f3',
                          }}
                        />
                      </Link>

                      <Box mt={2}>
                        <Typography fontWeight={500} noWrap>
                          {product.name}
                        </Typography>

                        <Typography fontWeight={600} mt={0.5}>
                          ₹{product.mainVariant?.price}
                        </Typography>

                        <Button
                          onClick={() => handleAdd(product)}
                          sx={{
                            mt: 1,
                            px: 0,
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            color: '#111',
                          }}
                        >
                          Add to cart →
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ height: 60 }} />
    </Box>
  );
};

export default Home;
