
const modeBtn = document.querySelector('.header-btn');

const toggleTheme = () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  document.querySelectorAll('.containers, .search-bar-form-input, .filter, .navbar, .country-btn, .country-details-btn, .header-btn')
    .forEach(element => {
      element.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  });

  document.body.classList.toggle('dark-mode', newTheme === 'dark');
  document.querySelectorAll('.containers, .search-bar-form-input, .filter, .navbar, .country-btn, .country-details-btn, .header-btn')
    .forEach(element => {
      element.classList.toggle('dark-mode', newTheme === 'dark');
  });

  updateCardsTheme(newTheme === 'dark');
  
  localStorage.setItem('theme', newTheme);
};

const updateCardsTheme = (isDark) => {
  document.querySelectorAll('.card, .card-description').forEach(card => {
    card.classList.toggle('dark-card', isDark);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light'; 
  const isDark = savedTheme === 'dark';

  document.body.style.transition = 'none';
  document.querySelectorAll('.containers, .search-bar-form-input, .filter, .navbar, .country-btn, .country-details-btn, .header-btn')
    .forEach(element => {
      element.style.transition = 'none';
  });

  document.body.classList.toggle('dark-mode', isDark);
  document.querySelectorAll('.containers, .search-bar-form-input, .filter, .navbar, .country-btn, .country-details-btn, .header-btn')
    .forEach(element => {
      element.classList.toggle('dark-mode', isDark);
  });

  updateCardsTheme(isDark);

  setTimeout(() => {
    document.body.style.transition = '';  
    document.querySelectorAll('.containers, .search-bar-form-input, .filter, .navbar, .country-btn, .country-details-btn, .header-btn')
      .forEach(element => {
        element.style.transition = ''; 
    });
  }, 10); 
});

modeBtn.addEventListener('click', toggleTheme);
