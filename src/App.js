import React, { useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      if (!action.payload.trim()) return state;
      return [
        ...state,
        { id: Date.now(), text: action.payload, done: false, editing: false },
      ];

    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );

    case "START_EDIT":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, editing: true } : todo
      );

    case "UPDATE_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text, editing: false }
          : todo
      );

    case "CLEAR_ALL":
      return [];

    default:
      return state;
  }
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, []);
  const [text, setText] = useState("");
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    dispatch({ type: "ADD_TODO", payload: text });
    setText("");
  };

  const handleUpdate = (todo) => {
    dispatch({ type: "UPDATE_TODO", payload: { id: todo.id, text: editText } });
    setEditText("");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 todo-card">
        <h2 className="text-center mb-4 title">🌸 Ma Todo List Glamour 🌸</h2>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control input-style"
            placeholder="Ajouter une tâche..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-pink" onClick={handleAdd}>
            Ajouter 💖
          </button>
        </div>

        <ul className="list-group">
          {todos.length === 0 && (
            <li className="list-group-item text-center text-muted">
              🌷 Aucune tâche pour le moment 🌷
            </li>
          )}

          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`list-group-item d-flex justify-content-between align-items-center todo-item ${
                todo.done ? "done" : ""
              }`}
            >
              {todo.editing ? (
                <>
                  <input
                    type="text"
                    className="form-control me-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleUpdate(todo)}
                  >
                    ✅
                  </button>
                </>
              ) : (
                <>
                  <span
                    onClick={() =>
                      dispatch({ type: "TOGGLE_TODO", payload: todo.id })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {todo.text}
                  </span>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => {
                        dispatch({ type: "START_EDIT", payload: todo.id });
                        setEditText(todo.text);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        dispatch({ type: "DELETE_TODO", payload: todo.id })
                      }
                    >
                      ❌
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <div className="text-center mt-3">
            <button
              className="btn btn-outline-light clear-btn"
              onClick={() => dispatch({ type: "CLEAR_ALL" })}
            >
              Tout effacer 💅
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
