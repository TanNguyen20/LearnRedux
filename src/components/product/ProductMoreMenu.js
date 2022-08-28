import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import ProductApi from '../../api/product.js';
import Dialog from '../DialogStatus';
import DialogUpdateProduct from '../DialogUpdateProduct';
import DialogConfirm from '../DialogConfirm.js';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProductMoreMenu(props) {
  const ref = useRef(null);
  const [id, setId] = useState(null);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [titleDialog, setTitleDialog] = useState('');
  const [dialog, setDialog] = useState(false);
  const [contentDialog, setContentDialog] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [openUpdateStore, setOpenUpdateStore] = useState(false);

  const dataFromChild = (data) => {
    console.log(data);
    props.getStoreFromChildUpdate(data);
  };
  let statusOpen = (status) => {
    setOpenUpdateStore(status);
  };
  let handleUpdateStore = (id) => {
    setOpenUpdateStore(true);
  };
  const handleClose = (status) => {
    setDialogConfirm(false);
  };
  const handleAfterUpdateStore = (status) => {
    props.dialogUpdateStore(status);
  };
  const handleAccept = (value) => {
    if (value) {
      setTitleDialog('Thông báo');
      props.statusDialogDelete(true);
      ProductApi.deleteProduct(id).then((res) => {
        setDialog(true);
        setContentDialog('Xóa sản phẩm thành công');
        props.parentCallback1(id);
      }).catch((err) => {
        setDialog(true);
        setContentDialog('Xóa sản phẩm thất bại');
        console.log(err);
      });
    }
  }

  return (
    <>
      {
        dialogConfirm ?
          <DialogConfirm title="Thông báo" content="Bạn có chắc muốn xóa sản phẩm này?"
            open={dialogConfirm}
            cancel="Hủy bỏ" accept="Xác nhận" isAccept={handleAccept} handleCloseDialog={handleClose}
          /> : null
      }
      {dialog ? <Dialog open={dialog} title={titleDialog} content={contentDialog} /> : null}
      {openUpdateStore ? <DialogUpdateProduct open={openUpdateStore} parentCallback={statusOpen}
        updateStore={handleAfterUpdateStore}
        dataFromChild={dataFromChild}
        id={props.idStore} stores={props.storeList} /> : null}

      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}
          onClick={() => {
            setDialogConfirm(true)
            setId(props.idStore)
          }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}
          onClick={() => { handleUpdateStore() }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Cập nhật" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}