export async function APILogin(username, hashedPassword) {
    console.log(hashedPassword)
    return fetch("http://localhost:5151/api/users/login", {
        method: "POST",
        body: JSON.stringify({userName: username, password: hashedPassword}),
        headers: {'Content-Type': 'application/json'}
    });
}

export async function APICreateUser(username, hashedPassword) {
    console.log(hashedPassword)
    return fetch("http://localhost:5151/api/users", {
        method: "POST",
        body: JSON.stringify({userName: username, password: hashedPassword}),
        headers: {'Content-Type': 'application/json'}
    });
}

export async function APIGetTodos(userId){
    return fetch("http://localhost:5151/api/tasks", {
        method: "GET",
        headers: {userId: userId}
    });
}

export async function APISetTodoAsDone(userId, taskId) {
    return fetch(`http://localhost:5151/api/tasks/${taskId}/completed`, {
        method: "PATCH",
        headers: {userId: userId}
    });
}

export async function APICreateTodo(userId, title, description) {
    return fetch(`http://localhost:5151/api/tasks/`, {
        method: "POST",
        body: JSON.stringify({title: title, description: description}),
        headers: {userId: userId, 'Content-Type': 'application/json'}
    });
}