import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  IconButton,
  Alert,
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_BASE_URL } from '../config';

/* ================= CONSTANTS ================= */
const CATEGORIES = ['Electronics', 'Fashion', 'Shoes', 'Accessories'];

const emptyVariant = {
  color: '',
  size: '',
  price: '',
  stock: '',
  images: [],
};

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);

  /* ================= ADD PRODUCT ================= */
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
  });
  const [newVariants, setNewVariants] = useState([{ ...emptyVariant }]);

  /* ================= EDIT PRODUCT ================= */
  const [editProduct, setEditProduct] = useState(null);
  const [editVariants, setEditVariants] = useState([]);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/products`);
    setProducts(res.data || []);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/orders`);
    setOrders(res.data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (variants, setVariants, index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(
      `${API_BASE_URL}/api/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    const copy = [...variants];
    copy[index].images = [...copy[index].images, res.data.url];
    setVariants(copy);
  };

  /* ================= VARIANT HELPERS ================= */
  const updateVariant = (variants, setVariants, i, field, value) => {
    const copy = [...variants];
    copy[i][field] = value;
    setVariants(copy);
  };

  const addVariant = (variants, setVariants) => {
    setVariants([...variants, { ...emptyVariant }]);
  };

  /* ================= ADD PRODUCT ================= */
  const submitNewProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.category) return alert('Select category');

    await axios.post(`${API_BASE_URL}/api/products`, {
      ...newProduct,
      variants: newVariants,
    });

    setMessage({ type: 'success', text: 'Product added successfully' });
    setNewProduct({ name: '', description: '', category: '', brand: '' });
    setNewVariants([{ ...emptyVariant }]);
    fetchProducts();
    setTab(0);
  };

  /* ================= EDIT PRODUCT ================= */
  const startEdit = (p) => {
    setEditProduct(p);
    setEditVariants(p.variants?.length ? p.variants : [{ ...emptyVariant }]);
    setTab(2);
  };

  const submitEditProduct = async (e) => {
    e.preventDefault();

    await axios.post(`${API_BASE_URL}/api/products`, {
      id: editProduct.id,
      ...editProduct,
      variants: editVariants,
    });

    setEditProduct(null);
    setEditVariants([]);
    fetchProducts();
    setTab(0);
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  /* ================= ORDER STATUS ================= */
  const updateOrderStatus = async (order, status) => {
    await axios.put(`/api/orders/${order.id}`, { status });
    fetchOrders();
  };

  return (
    <Container sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h4" fontWeight={800}>
        Seller Hub
      </Typography>

      <Paper sx={{ my: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
          <Tab icon={<DashboardIcon />} label="Products" />
          <Tab icon={<AddBoxIcon />} label="Add Product" />
          <Tab icon={<EditIcon />} label="Edit Product" disabled={!editProduct} />
          <Tab icon={<DashboardIcon />} label="Orders" />
        </Tabs>
      </Paper>

      {message && <Alert severity={message.type}>{message.text}</Alert>}

      {/* ================= PRODUCTS ================= */}
      {tab === 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell><Chip label={p.category} /></TableCell>
                  <TableCell>₹{p.mainVariant?.price}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => startEdit(p)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => deleteProduct(p.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ================= ADD PRODUCT ================= */}
      {tab === 1 && (
        <form onSubmit={submitNewProduct}>
          <Paper sx={{ p: 3 }}>
            <TextField
              select
              fullWidth
              label="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              sx={{ mb: 2 }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Product Name"
              required
              sx={{ mb: 2 }}
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              required
              sx={{ mb: 2 }}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />

            {newVariants.map((v, i) => (
              <Paper key={i} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  {['color','size','price','stock'].map(field => (
                    <Grid item xs={6} key={field}>
                      <TextField
                        fullWidth
                        label={field.toUpperCase()}
                        type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                        value={v[field]}
                        onChange={(e) =>
                          updateVariant(newVariants, setNewVariants, i, field, e.target.value)
                        }
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Button component="label" startIcon={<CloudUploadIcon />}>
                      Upload Image
                      <input
                        hidden
                        type="file"
                        onChange={(e) =>
                          uploadImage(newVariants, setNewVariants, i, e.target.files[0])
                        }
                      />
                    </Button>

                    <Box mt={1} display="flex" gap={1}>
                      {v.images.map((img, idx) => (
                        <img key={idx} src={img} alt="" width={60} />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button onClick={() => addVariant(newVariants, setNewVariants)}>
              + Add Variant
            </Button>
            <Button type="submit" variant="contained" sx={{ ml: 2 }}>
              Publish Product
            </Button>
          </Paper>
        </form>
      )}

      {/* ================= ORDERS ================= */}
      {tab === 3 && orders.map((o) => {
        let addr = {};
        try { addr = JSON.parse(o.address || '{}'); } catch {}

        const paid = o.payment_id && o.payment_id !== 'COD';

        return (
          <Paper key={o.id} sx={{ p: 3, mb: 4 }}>
            <Typography fontWeight={800}>Order #{o.id}</Typography>

            <Chip
              sx={{ my: 1 }}
              color={paid ? 'success' : 'warning'}
              label={paid ? 'PAID (Online)' : 'Cash on Delivery'}
            />

            <Typography><b>Payment ID:</b> {o.payment_id}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography><b>Name:</b> {addr.name}</Typography>
            <Typography><b>Email:</b> {o.user_email}</Typography>
            <Typography><b>Phone:</b> {addr.phone}</Typography>
            <Typography>
              <b>Address:</b> {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {o.items?.map((item, i) => (
              <Typography key={i}>
                {item.product_name} ({item.variant_info}) × {item.quantity} — ₹{item.price}
              </Typography>
            ))}

            <Typography fontWeight={800} sx={{ mt: 2 }}>
              Total: ₹{o.total_amount}
            </Typography>

            <Select
              fullWidth
              sx={{ mt: 2 }}
              value={o.status}
              onChange={(e) => updateOrderStatus(o, e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </Paper>
        );
      })}
    </Container>
  );
};

export default Admin;
