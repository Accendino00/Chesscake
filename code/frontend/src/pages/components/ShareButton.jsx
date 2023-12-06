import React from 'react';
import Button from '@mui/material/Button';
import { Share } from '@mui/icons-material/';
import SharePaper from './SharePaper';

export default function ShareButton({ text }) {
    const handleShare = () => {
        // Open the modal by setting the state in the parent component
        setModalIsOpen(true);
    };

    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    return (
        <>
            <Button variant="contained" onClick={handleShare}>
                <Share />
            </Button>
            {/* Render the SharePaper component conditionally based on modalIsOpen */}
            {modalIsOpen && <SharePaper text={text} onClose={() => setModalIsOpen(false)} />}
        </>
    );
}