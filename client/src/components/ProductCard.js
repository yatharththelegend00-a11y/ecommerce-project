import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ product, addToCart }) => {
  const variant = product.mainVariant || {};
  const hasStock = variant.stock > 0;
  const discount = variant.discount || 0;

  const originalPrice =
    discount > 0
      ? Math.round(variant.price * (100 / (100 - discount)))
      : null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        background: 'linear-gradient(180deg,#ffffff,#f9fafb)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        transition: '0.35s',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* CLICKABLE AREA */}
      <Box
        component={Link}
        to={`/product/${product.id}`}
        sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
      >
        {/* IMAGE */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f9fafb',
          }}
        >
          <CardMedia
            component="img"
            image={
              variant.images?.[0] ||
              'https://via.placeholder.com/300'
            }
            alt={product.name}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />

          {/* BADGES */}
          {!hasStock && (
            <Chip
              label="Out of Stock"
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 12, left: 12 }}
            />
          )}

          {hasStock && discount > 0 && (
            <Chip
              label={`${discount}% OFF`}
              color="success"
              size="small"
              sx={{ position: 'absolute', top: 12, left: 12 }}
            />
          )}
        </Box>

        {/* INFO */}
        <CardContent sx={{ px: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#777',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {product.brand || 'Brand'}
          </Typography>

          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              mt: 0.5,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>

          {/* RATING */}
          <Box display="flex" alignItems="center" gap={0.5} mt={1}>
            <Rating
              value={4.5}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              (120)
            </Typography>
          </Box>

          {/* PRICE */}
          <Box display="flex" alignItems="baseline" gap={1} mt={1}>
            <Typography variant="h6" fontWeight={700}>
              ₹{variant.price}
            </Typography>
            {originalPrice && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: '#999',
                }}
              >
                ₹{originalPrice}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Box>

      {/* FOOTER CTA */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          disabled={!hasStock}
          onClick={(e) => {
            e.preventDefault();
            addToCart({ ...product, ...variant });
          }}
          sx={{
            borderRadius: 3,
            py: 1.1,
            fontWeight: 700,
            background:
              hasStock
                ? 'linear-gradient(90deg,#3f51b5,#9c27b0)'
                : '#ccc',
            '&:hover': {
              opacity: hasStock ? 0.9 : 1,
            },
          }}
        >
          {hasStock ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
