let resetTimer;

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const status = button.closest('.site-footer')?.querySelector('.copy-status');
    if (!status) return;

    clearTimeout(resetTimer);

    try {
      await navigator.clipboard.writeText('nicksanota@gmail.com');
      status.textContent = 'Email copied.';
      button.textContent = 'Copied!';
      resetTimer = setTimeout(() => {
        button.textContent = 'Copy';
        status.textContent = '';
      }, 2500);
    } catch {
      status.textContent = 'Please select and copy the email address above.';
    }
  });
});
