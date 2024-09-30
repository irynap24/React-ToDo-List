import React, { useReducer, useState } from 'react';
import './App.css';

// Initial state for the reducer
const initialState = [];

// Reducer function to manage todos
const todoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [{ text: action.payload, complete: false, isEditing: false }, ...state];
        case 'TOGGLE_TODO':
            return state.map((todo, index) =>
                index === action.index ? { ...todo, complete: !todo.complete } : todo
            );
        case 'DELETE_TODO':
            return state.filter((_, index) => index !== action.index);
        case 'EDIT_TODO':
            return state.map((todo, index) =>
                index === action.index ? { ...todo, isEditing: true } : todo
            );
        case 'SAVE_TODO':
            return state.map((todo, index) =>
                index === action.index ? { ...todo, text: action.payload, isEditing: false } : todo
            );
        default:
            return state;
    }
};

const App = () => {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const [newTodo, setNewTodo] = useState('');
    // Function to handle adding item to list
    const handleAddTodo = () => {
        if (newTodo.trim()) {
            dispatch({ type: 'ADD_TODO', payload: newTodo });
            setNewTodo('');
        }
    };

    // Function to handle pressing enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    return (
        <div className="container">
            <h1>Todo List</h1>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown} // allows for list item to be added by pressing enter key
                placeholder="Add a new todo"
            />
            <button onClick={handleAddTodo}>Add</button>
            <ul className="todo-list">
                {state.map((todo, index) => (
                    <li key={index} className="todo-item">
                        {todo.isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={todo.text}
                                    onChange={(e) => dispatch({ type: 'SAVE_TODO', index, payload: e.target.value })}
                                />
                                <button onClick={() => dispatch({ type: 'SAVE_TODO', index, payload: todo.text })}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="checkbox"
                                    checked={todo.complete}
                                    onChange={() => dispatch({ type: 'TOGGLE_TODO', index })}
                                />
                                <span className={todo.complete ? 'todo-text completed' : 'todo-text'}>
                                    {todo.text}
                                </span>
                                <button onClick={() => dispatch({ type: 'EDIT_TODO', index })}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => dispatch({ type: 'DELETE_TODO', index })}
                                    disabled={!todo.complete}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
