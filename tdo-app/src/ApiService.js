export async function APILogin(username, hashedPassword) {
    console.log(hashedPassword)
    return fetch("http://localhost:5151/api/users/login", {
        method: "POST",
        body: JSON.stringify({userName: username, password: hashedPassword}),
        headers: {'Content-Type': 'application/json'}
    });
}