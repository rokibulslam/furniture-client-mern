import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';

const HomePageProduct = () => {
    const [products, setProducts] = useState([])
    useEffect(() => {
        fetch("http://localhost:5000/apartments/regular")
          .then((res) => res.json())
          .then((data) => setProducts(data));
    }, [])
    console.log(products)
    return (
        <div>
            <div className='row'>
                {
                    products?.map(product=><ProductCard key={product._id} product={product} className='col-md-6 col-sm-12' />)
                }
            </div>
        </div>
    );
};

export default HomePageProduct;