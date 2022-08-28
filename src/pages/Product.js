import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// material
import {
	Card,
	Table,
	Stack,
	Checkbox,
	TableRow,
	TableBody,
	TableCell,
	Container,
	Typography,
	TableContainer,
	TablePagination,
	CircularProgress,
} from '@mui/material';
// components
import Dialog from '../components/DialogStatus';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import FormDialog from '../components/DialogCreateProduct';
import {
	ProductListHead,
	ProductListToolbar,
	ProductMoreMenu,
} from '../components/product';
// redux
import { useSelector, useDispatch } from 'react-redux';
import {
	getAllProductError,
	selectAllProduct,
	getAllProductStatus,
	fetchAllProduct,
	allProduct,
	deleteProduct,
	filterProduct,
	updateProduct,
	findProduct,
	addProduct,
} from '../features/product/productSlice';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: 'name', label: 'Tên sản phẩm', alignRight: false },
	{ id: 'price', label: 'Giá tiền', alignRight: false },
	{ id: 'quantity', label: 'Số lượng', alignRight: false },
	{ id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	if (query) {
		return filter(
			array,
			(_product) =>
				_product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
		);
	}
	return stabilizedThis.map((el) => el[0]);
}

export default function StoreList() {
	const [dialog, setDialog] = useState(false);
	const [titleDialog, setTitleDialog] = useState('');
	const [contentDialog, setContentDialog] = useState('');
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState('asc');
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState('name');
	const [filterName, setFilterName] = useState('');
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [emptyRows, setEmptyRows] = useState(0);
	const dispatch = useDispatch();
	const allProduct = useSelector(selectAllProduct);
	const allProductStatus = useSelector(getAllProductStatus);
	const allProductError = useSelector(getAllProductError);

	useEffect(() => {
		if (allProductStatus === 'idle') {
			dispatch(fetchAllProduct());
		}
	}, [allProductStatus, dispatch]);

	useEffect(() => {
		setEmptyRows(
			page > 0
				? Math.max(0, (1 + page) * rowsPerPage - allProduct.length)
				: 0
		);
	}, [allProduct]);

	const getStoreFromChild = async (productChild) => {
		await dispatch(addProduct(productChild));
		setEmptyRows(
			page > 0
				? Math.max(
					0,
					(1 + page) * rowsPerPage -
					[...allProduct, productChild].length
				)
				: 0
		);
	};

	const getStoreFromChildDelete = async (id) => {
		await dispatch(deleteProduct(id));
		setEmptyRows(
			page > 0
				? Math.max(0, (1 + page) * rowsPerPage - allProduct.length)
				: 0
		);
	};

	const getStoreFromChildUpdate = async (productChild) => {
		await dispatch(updateProduct(productChild));
		setEmptyRows(
			page > 0
				? Math.max(0, (1 + page) * rowsPerPage - allProduct.length)
				: 0
		);
	};
	////
	const statusDialogDelete = (status) => {
		setDialog(status);
		setTitleDialog('Thông báo');
		setContentDialog('Xóa sản phẩm thành công !');
	};

	const dialogUpdateStore = (status) => {
		setDialog(status);
		setTitleDialog('Thông báo');
		setContentDialog('Cập nhật thông tin sản phẩm thành công !');
	};

	const handleClose = (value) => {
		setDialog(value);
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		console.log('handle sort', isAsc);
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = allProduct.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleFilterByName = (event) => {
		setFilterName(event.target.value);
	};
	if (allProductStatus === 'loading')
		return (
			<>
				<h2 style={{ textAlign: 'center' }}>
					Đang tải danh sách sản phẩm
				</h2>
				<Stack alignItems="center" mt={10}>
					<CircularProgress size={80} />
				</Stack>
			</>
		);

	const filteredProducts = applySortFilter(
		allProduct,
		getComparator(order, orderBy),
		filterName
	);
	const isUserNotFound = filteredProducts.length === 0;
	return (
		<>
			{dialog ? (
				<Dialog
					open={dialog}
					onClose={handleClose}
					title={titleDialog}
					content={contentDialog}
				/>
			) : null}
			<Container>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					mb={5}
				>
					<Typography variant="h4" gutterBottom>
						Sản phẩm
					</Typography>
					<FormDialog parentCallback={getStoreFromChild} />
				</Stack>

				<Card>
					<ProductListToolbar
						numSelected={selected.length}
						filterName={filterName}
						onFilterName={handleFilterByName}
					/>

					<Scrollbar>
						<TableContainer sx={{ minWidth: 800 }}>
							<Table>
								<ProductListHead
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={allProduct.length}
									numSelected={selected.length}
									onRequestSort={handleRequestSort}
									onSelectAllClick={handleSelectAllClick}
								/>
								<TableBody>
									{filteredProducts
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)
										.map((row) => {
											const {
												id,
												name,
												price,
												quantity,
											} = row;
											const isItemSelected =
												selected.indexOf(name) !== -1;

											return (
												<TableRow
													hover
													key={id}
													tabIndex={-1}
													role="checkbox"
													selected={isItemSelected}
													aria-checked={
														isItemSelected
													}
												>
													<TableCell padding="checkbox">
														<Checkbox
															checked={
																isItemSelected
															}
															onChange={(event) =>
																handleClick(
																	event,
																	name
																)
															}
														/>
													</TableCell>
													<TableCell
														component="th"
														scope="row"
														padding="none"
													>
														<Stack
															direction="row"
															alignItems="center"
															spacing={2}
														>
															<Typography
																variant="subtitle2"
																noWrap
															>
																{name}
															</Typography>
														</Stack>
													</TableCell>
													<TableCell align="left">
														{price}
													</TableCell>
													<TableCell align="left">
														{quantity}
													</TableCell>

													<TableCell align="right">
														<ProductMoreMenu
															idStore={id}
															storeList={
																allProduct
															}
															getStoreFromChildUpdate={
																getStoreFromChildUpdate
															}
															dialogUpdateStore={
																dialogUpdateStore
															}
															statusDialogDelete={
																statusDialogDelete
															}
															parentCallback1={
																getStoreFromChildDelete
															}
														/>
													</TableCell>
												</TableRow>
											);
										})}
									{emptyRows > 0 && (
										<TableRow
											style={{ height: 53 * emptyRows }}
										>
											<TableCell colSpan={6} />
										</TableRow>
									)}
								</TableBody>
								{isUserNotFound && (
									<TableBody>
										<TableRow>
											<TableCell
												align="center"
												colSpan={6}
												sx={{ py: 3 }}
											>
												<SearchNotFound
													searchQuery={filterName}
												/>
											</TableCell>
										</TableRow>
									</TableBody>
								)}
							</Table>
						</TableContainer>
					</Scrollbar>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={allProduct.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						labelDisplayedRows={({ from, to, count }) =>
							`${from}-${to} tổng ${count}`
						}
						labelRowsPerPage="Số dòng mỗi trang"
					/>
				</Card>
			</Container>
		</>
	);
}
