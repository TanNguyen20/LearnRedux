import React from 'react';
import { Button, Container, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../features/counter/counterSlice'

export default function Counter() {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <Container>
            <Box display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                <Button
                    variant='contained'
                    aria-label='Increment value'
                    onClick={() => dispatch(increment())}
                >
                    increment
                </Button>
                <span style={{ color: "red" }}>{count}</span>
                <Button
                    variant='contained'
                    aria-label='Decrement value'
                    onClick={() => dispatch(decrement())}
                >
                    decrement
                </Button>
            </Box>
        </Container>
    )
};