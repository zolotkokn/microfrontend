import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const { addTodo } = await import('store/Store');

const TodoForm = () => {
    const [task, setTask] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.trim()) {
            dispatch(addTodo(task));
            setTask('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Введите задачу"
            />
            <button type="submit">Добавить</button>
        </form>
    );
};

export default TodoForm;
