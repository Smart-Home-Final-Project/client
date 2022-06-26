import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AddAndDeleteButtons({ arrExist, setExist, index, setSelected, deleteSelected }) {
  const handleClickAdd = async () => {
    let t = arrExist;
    arrExist[index] = true;
    setExist(t);
    setSelected(index)
  }

  const handelClickDelete = async () => {
    let t = arrExist;
    arrExist[index] = false;
    setExist(t);
    deleteSelected(index)
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" endIcon={<RemoveCircleOutlineIcon />} onClick={handelClickDelete}>
        הסר
      </Button>
      <Button variant="outlined" endIcon={<AddCircleOutlineIcon />} onClick={handleClickAdd}>
        הוסף
      </Button>
    </Stack>
  );
}
