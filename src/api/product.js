import axiosClient from './axiosClient';
const productApi={
    getAllProduct:function(){
        const url ='/products';
        return axiosClient.get(url);
    },
    getProductById:function(id){
        const url =`/products/${id}`;
        return axiosClient.get(url);
    },
    createProduct:function(product){
        const url ='/addProduct';
        return axiosClient.post(url,product);
    },
    updateProduct: function(product){
        const url ='/updateProduct';
        return axiosClient.put(url,product);
    },
    deleteProduct:function(id){
        const url =`/deleteProduct/${id}`;
        return axiosClient.delete(url);
    }
}
export default productApi;