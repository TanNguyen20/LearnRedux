import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

import ConfirmModal from '../DialogConfirm';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: '0 0 0 2px #00bcd4' },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

ProductListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function ProductListToolbar({ numSelected, filterName, onFilterName }) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const handleAccept = (value) => {
    console.log(value)
    setOpen(false);
  }
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'green',
          bgcolor: 'white'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Tìm kiếm sản phẩm"
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton onClick={handleClick}>
              <Icon icon={trash2Fill} />
            </IconButton>
          </Tooltip>
          {open ? < ConfirmModal title="Thông báo" content="Bạn có chắc muốn xóa các sản phẩm đã chọn?"
            cancel="Hủy bỏ" accept="Đồng ý" open={open} handleCloseDialog={handleClose} isAccept={handleAccept} /> : null}
        </>
      ) : (
        <Tooltip title="Lọc theo">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}