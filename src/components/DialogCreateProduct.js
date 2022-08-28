import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';

import ProductApi from '../api/product';
import * as Yup from 'yup';
import ResponsiveDialog from './DialogStatus';
export default function FormDialog(props) {

    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [dialog, setDialog] = useState(false);
    const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = (value) => {
        setDialog(value);
    }
    const createProductSchema = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên sản phẩm'),
        price: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập giá tiền sản phẩm').min(1, 'Giá tiền không hợp lệ'),
        quantity: Yup.number().typeError('Vui lòng nhập số').required('Vui lòng nhập số lượng').min(1, 'Số lượng không hợp lệ'),
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        expireDate: Yup.date().required('Vui lòng nhập ngày hết hạn'),
    });
    const handleClose = () => {
        setOpen(false);
        formik.handleReset();
    };
    const formik = useFormik({
        initialValues: {
            name: '',
            price: 0,
            quantity: 0,
            address: '',
            expireDate: new Date('2014-08-18T21:11:54'),
        },
        validationSchema: createProductSchema,
        onSubmit: (values) => {
            console.log(values);
            alert(JSON.stringify(values, null, 2));
            ProductApi.createProduct(values).then(res => {
                props.parentCallback(values);
                setTitle('Thông báo');
                setContent('Thêm sản phẩm thành công');
                setDialog(true);
                setOpen(false);
            })
            .catch(err => {
                setTitle('Thông báo');
                setContent('Thêm sản phẩm thẩt bại');
                setDialog(true);
                setOpen(false);
                console.log(err);
            })
        },
    });
    return (
        <div>
            {dialog ? <ResponsiveDialog open={dialog} title={title} onClose={handleCloseDialog}
                content={content} /> : null}
            <Button
                variant="contained"
                component={RouterLink}
                to="#"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleClickOpen}
            >
                Thêm sản phẩm mới
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={4} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Điền các thông tin bên dưới để thêm sản phẩm mới
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
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Ngày hết hạn"
                                        inputFormat="MM/dd/yyyy"
                                        value={value}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="address"
                                    label="Nhập địa chỉ sản xuất"
                                    id="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy bỏ</Button>
                            <Button type="submit" >Thêm sản phẩm</Button>
                        </DialogActions>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}