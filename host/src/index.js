import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const RemoteButton = React.lazy(() => import('remote/Button'));  // Импорт из remote

const App = () => (
    <div>
        <h1>Host Application</h1>
        <Suspense fallback="Loading Button...">
            <RemoteButton/>
        </Suspense>
    </div>
);

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
