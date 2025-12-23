import "./App.css";
import { LoginFormPage } from "./login/loginFormPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoListPage } from "./todoList/todoListPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginFormPage />} />
          <Route path="/todos" element={<TodoListPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
