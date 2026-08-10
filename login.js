document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = loginForm.querySelectorAll("input");
    const email = inputs[0]?.value.trim();
    const password = inputs[1]?.value.trim();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    localStorage.setItem("voya_logged_in", "true");
    localStorage.setItem("voya_user_email", email);

    alert("Login successful! Welcome to VOYA.");

    window.location.href = "index.html";
  });
});
