import * as Yup from 'yup';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';

import ProductApi from '../api/product';
import ResponsiveDialog from './DialogStatus';
export default function DialogUpdateProduct(props) {
    const [open, setOpen] = useState(props.open);
    const [store, setProduct] = useState(props.stores.find(item => item.id === props.id));
    const [dialog, setDialog] = useState(false);

    const updateProductSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên sản phẩm'),
        price: Yup.number().required('Vui lòng nhập giá tiền sản phẩm').min(0, 'Giá tiền không hợp lệ'),
        quantity: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập số lượng').min(0, 'Số lượng không hợp lệ'),
    });
    const handleClose = () => {
        setOpen(false);
        props.parentCallback(false);
        formik.handleReset();
    };

    const formik = useFormik({
        initialValues: {
            id: store.id,
            name: store.name,
            price: store.price,
            quantity: store.quantity
        },
        validationSchema: updateProductSchema,
        onSubmit: (values) => {
            const productData = values;
            ProductApi.updateProduct(productData, props.id).then(res => {
                props.updateStore(true);
                setProduct(res);
                props.parentCallback(false);
                props.dataFromChild(res);
                setDialog(true);
                setOpen(false);
            }).catch(err => {
                console.log(err);
            });
        },
    });

    return (
        <div>
            {dialog ? <ResponsiveDialog open={dialog} title="Thông báo"
                content="Cập nhật thông tin cho sản phẩm thành công!" /> : null}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Cập nhật thông tin sản phẩm</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Sửa thông tin bên dưới để cập nhật thông tin sản phẩm
                    </DialogContentText>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Tên sản phẩm"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="price"
                                    label="Giá tiền"
                                    type="number"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="quantity"
                                    label="Nhập số lượng"
                                    type="number"
                                    id="quantity"
                                    value={formik.values.quantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                    helperText={formik.touched.quantity && formik.errors.quantity}
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button type="submit" >Cập nhật</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}