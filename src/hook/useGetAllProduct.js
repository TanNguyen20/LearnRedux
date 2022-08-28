import ProductApi from '../api/product';
import { useState, useEffect } from 'react';

function useGetAllProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const getListProduct = () => {
        ProductApi.getAllProduct().then((productsRes) => {
            setProducts(productsRes);
            setLoading(false)
        })
        .catch((error) => {
            ProductApi.getAllProduct().then((productsRes) => {
                setProducts(productsRes);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
            });
        });
    };
    useEffect(() => {
        getListProduct();
    }, []);
    return [loading, products];
}
export default useGetAllProduct;