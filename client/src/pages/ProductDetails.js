import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Rating,
  Skeleton,
  Stack,
  MenuItem,
  Select,
  Divider,
  Chip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReplayIcon from '@mui/icons-material/Replay';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/${id}`).then((res) => {
      const p = res.data;
      const v = p.variants[0];

      setProduct(p);
      setSelectedColor(v.color);
      setSelectedSize(v.size);
      setSelectedVariant(v);
      setSelectedImage(v.images?.[0]);
      setLoading(false);
    });
  }, [id]);

  /* ================= VARIANT CHANGE ================= */
  useEffect(() => {
    if (!product) return;

    const v = product.variants.find(
      (x) => x.color === selectedColor && x.size === selectedSize
    );

    setSelectedVariant(v);
    setSelectedImage(v?.images?.[0]);
  }, [selectedColor, selectedSize, product]);

  if (loading) {
    return (
      <Container sx={{ py: 10 }}>
        <Skeleton height={500} />
      </Container>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [
    ...new Set(
      product.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size)
    ),
  ];

  const handleAdd = () => {
    if (!selectedVariant) {
      toast.error('Select color & size');
      return;
    }

    addToCart({
      product_id: product.id,
      variant_id: selectedVariant.id,
      name: product.name,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.images?.[0],
      quantity: 1,
    });

    toast.success('Added to cart');
  };

  return (
    <Box sx={{ background: '#fafafa', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          
          {/* ================= IMAGE SECTION (CENTERED) ================= */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 0,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={selectedImage}
                alt={product.name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 420,
                  objectFit: 'contain',
                  background: '#f5f5f5',
                  p: 3,
                }}
              />

              {/* Thumbnails */}
              <Stack direction="row" spacing={1} mt={3}>
                {selectedVariant?.images?.map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      border:
                        selectedImage === img
                          ? '2px solid #111'
                          : '1px solid #ddd',
                      p: 0.5,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img} alt="" width={60} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* ================= DETAILS ================= */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700}>
              {product.name}
            </Typography>

            <Rating value={4.5} readOnly size="small" sx={{ mt: 1 }} />

            <Typography variant="h5" fontWeight={700} mt={2}>
              ₹{selectedVariant?.price}
            </Typography>

            <Typography color="text.secondary" mt={2} lineHeight={1.7}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* ================= COLOR ================= */}
            {colors.length > 1 && (
              <Box mb={3}>
                <Typography fontWeight={600} mb={1}>
                  Color
                </Typography>
                <Stack direction="row" spacing={1}>
                  {colors.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      clickable
                      sx={{
                        borderRadius: 0,
                        bgcolor: selectedColor === c ? '#111' : '#f5f5f5',
                        color: selectedColor === c ? '#fff' : '#111',
                      }}
                      onClick={() => {
                        setSelectedColor(c);
                        setSelectedSize('');
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* ================= SIZE ================= */}
            {sizes.length > 1 && (
              <Box mb={3}>
                <Typography fontWeight={600} mb={1}>
                  Size
                </Typography>
                <Select
                  fullWidth
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {sizes.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* ================= TRUST BADGES (FREE DELIVERY REMOVED) ================= */}
            <Stack spacing={1.2}>
              <Stack direction="row" spacing={1}>
                <ReplayIcon fontSize="small" />
                <Typography>7 Days Replacement</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <VerifiedIcon fontSize="small" />
                <Typography>100% Original Product</Typography>
              </Stack>
            </Stack>

            {/* ================= ACTION BUTTONS ================= */}
            <Stack direction="row" spacing={2} mt={5}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  bgcolor: '#111',
                  borderRadius: 0,
                  '&:hover': { bgcolor: '#000' },
                }}
                startIcon={<ShoppingCartIcon />}
                onClick={handleAdd}
              >
                Add to Cart
              </Button>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  borderRadius: 0,
                  borderColor: '#111',
                  color: '#111',
                }}
                startIcon={<FlashOnIcon />}
                onClick={() => {
                  handleAdd();
                  navigate('/checkout');
                }}
              >
                Buy Now
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetails;
