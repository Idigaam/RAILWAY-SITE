document.addEventListener("DOMContentLoaded", () => {
    const loggedIn = localStorage.getItem("voya_logged_in");

    if (loggedIn !== "true") {
        window.location.href = "login.html";
    }
});