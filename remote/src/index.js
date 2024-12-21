import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from './Button';

const root = createRoot(document.getElementById('remote-root'));
root.render(
    <React.StrictMode>
        <Button />
    </React.StrictMode>
);
