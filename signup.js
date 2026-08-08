document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const toggleButtons = document.querySelectorAll('.input-icon .icon');

  // ==========================================
  // 1. PASSWORD VISIBILITY TOGGLE
  // ==========================================
  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Find the associated input field inside the same wrapper
      const input = button.parentElement.querySelector('input');
      
      if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈'; // Switch icon to hidden state
        button.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        button.textContent = '👁'; // Switch back to eye
        button.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // ==========================================
  // 2. FORM VALIDATION & SUBMISSION
  // ==========================================
  signupForm.addEventListener('submit', (e) => {
    // Clear any previous custom validity messages
    confirmPasswordInput.setCustomValidity('');

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
      e.preventDefault(); // Stop form submission
      confirmPasswordInput.setCustomValidity('Passwords do not match.');
      confirmPasswordInput.reportValidity(); // Show native browser alert tooltip
      return;
    }

    // Minimum password length validation (e.g., at least 8 characters)
    if (passwordInput.value.length < 8) {
      e.preventDefault();
      passwordInput.setCustomValidity('Password must be at least 8 characters long.');
      passwordInput.reportValidity();
      return;
    }

    // Optional: Log data or trigger custom AJAX/Fetch API submission here
    console.log('Form is valid! Submitting signup request...');
  });

  // Reset custom validity when user starts typing again
  [passwordInput, confirmPasswordInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.setCustomValidity('');
    });
  });
});