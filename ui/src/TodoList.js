import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const { toggleTodo, removeTodo } = await import('store/Store');

const TodoList = () => {
    const todos = useSelector((state) => state.todos) || [];
    const dispatch = useDispatch();

    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
          <span
              onClick={() => dispatch(toggleTodo(todo.id))}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </span>
                    <button onClick={() => dispatch(removeTodo(todo.id))}>Удалить</button>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
