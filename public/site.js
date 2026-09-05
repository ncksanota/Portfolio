document.querySelectorAll('[data-copy-email]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = button.closest('.footer-grid').querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText('nicksanota@gmail.com');
      status.textContent = 'Email copied.';
      button.textContent = 'Copied!';
      setTimeout(() => { button.textContent = 'Copy'; status.textContent = ''; }, 2500);
    } catch {
      status.textContent = 'Please select and copy the email address above.';
    }
  });
});
