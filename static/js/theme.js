function themeToggle() {
    let element = document.documentElement;

    if (!localStorage.dark) {
        localStorage.dark = 'dark';

        element.classList.add('dark');
    } else {
        localStorage.removeItem('dark');
        element.classList.remove('dark');
    }
}

document.addEventListener('DOMContentLoaded', function(event){
    let themeToggle = document.getElementById('theme-choice');
    themeToggle.checked = false;

    if (localStorage.dark) {
        let element = document.documentElement;
        element.classList.add('dark');
        themeToggle.checked = true;
    }
});