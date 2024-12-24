import React, { Suspense } from 'react';
import { Provider } from 'react-redux';

const { store } = await import('store/Store');
const TodoList = React.lazy(() => import('ui/TodoList'));
const TodoForm = React.lazy(() => import('ui/TodoForm'));
const RemoteButton = React.lazy(() => import('remote/Button'));

const App = () => {
    return (
        <div>
            <h1>Host Application</h1>
            <Suspense fallback="Loading Button...">
                <RemoteButton/>
            </Suspense>

            <h1>ToDo List</h1>
            <Provider store={store}>
                <TodoForm />
                <TodoList />
            </Provider>
        </div>
    );
};

export default App;
