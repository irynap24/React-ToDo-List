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
    const [editText, setEditText] = useState(''); // Local state for edited text
    const [editingIndex, setEditingIndex] = useState(null); // Track the index of the todo being edited

    const handleAddTodo = () => {
        if (newTodo.trim()) {
            dispatch({ type: 'ADD_TODO', payload: newTodo });
            setNewTodo('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handleEditChange = (index, value) => {
        setEditText(value);
        setEditingIndex(index);
    };

    const handleSaveEdit = (index) => {
        dispatch({ type: 'SAVE_TODO', index, payload: editText });
        setEditText('');
        setEditingIndex(null);
    };

    return (
        <div className="container">
            <h1>Todo List</h1>
            <input
                className='addInput'
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a new todo"
            />
            <button className="add" onClick={handleAddTodo}>Add</button>
            <ul className="todo-list">
                {state.map((todo, index) => (
                    <li key={index} className="todo-item">
                        {todo.isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={editText} // Use local editText state
                                    onChange={(e) => handleEditChange(index, e.target.value)}
                                />
                                <button onClick={() => handleSaveEdit(index)}>
                                    <i className="fas fa-save"></i>
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
                                <button className='edit' onClick={() => {
                                    setEditText(todo.text); // Set the current text to editText
                                    dispatch({ type: 'EDIT_TODO', index }); // Mark as editing
                                }}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className='delete' onClick={() => dispatch({ type: 'DELETE_TODO', index })} disabled={!todo.complete}>
                                    <i className="fas fa-trash-alt"></i>
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
