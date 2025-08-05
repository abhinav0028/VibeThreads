import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import './Section.css';

const categories = [
  { label: "LONG SLEEVE'S", value: '1', query: 'Full Sleeves T-Shirts' },
  { label: "T-SHIRT'S", value: '2', query: 'T-Shirts' },
  { label: "PANT'S", value: '3', query: 'Pants' },
  { label: "VEST'S", value: '4', query: 'Vests' },
];

export function Section() {
  const [value, setValue] = useState('1');
  const [products, setProducts] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRedirect = (id) => {
    window.location.href = `/product/${id}`;
  };

  const fetchProducts = async (categoryQuery, tabValue) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/products/random?category=${encodeURIComponent(categoryQuery)}&limit=4`
      );
      setProducts((prev) => ({ ...prev, [tabValue]: res.data }));
    } catch (err) {
      console.error(`❌ Error fetching ${categoryQuery} products:`, err);
    }
  };

  useEffect(() => {
    const currentCategory = categories.find((cat) => cat.value === value);
    if (currentCategory && !products[value]) {
      fetchProducts(currentCategory.query, value);
    }
  }, [value]);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, mb: 2 }}>
          <TabList
            onChange={handleChange}
            aria-label="product categories"
            TabIndicatorProps={{ style: { backgroundColor: 'black', height: '2px' } }}
            sx={{
              justifyContent: 'center',
              '& .MuiTab-root': {
                fontSize: '18px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.2rem',
                color: '#111',
                px: 3,
                py: 1,
                minWidth: 'auto',
              },
              '& .Mui-selected': {
                color: '#000',
                fontWeight: 500,
              },
              '& .MuiTab-root:hover': {
                color: '#000',
                opacity: 0.8,
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </TabList>
        </Box>

        {categories.map((cat) => (
          <TabPanel key={cat.value} value={cat.value}>
            <div className="product-row">
              {products[cat.value]?.length > 0 ? (
                products[cat.value].map((product) => (
                  <div className="product-card" key={product._id}>
                    <div
                      className="product-image-container"
                      onClick={() => handleRedirect(product._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="discount-badge">SAVE 47%</div>
                    </div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">
                      <span className="current-price">Rs. {product.price}</span>
                      <span className="original-price">Rs. 3,199.00</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading products...</p>
              )}
            </div>
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}

export default Section;
