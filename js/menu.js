function toggleMenu(menuId) {
    const submenu = document.getElementById(menuId + '-submenu');

    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
    } else {
        // Закрываем другие подменю
        document.querySelectorAll('.submenu').forEach(sub => {
            sub.style.display = 'none';
        });

        submenu.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const centerMenus = document.querySelector('.center-menus');

    // Закрывать меню при клике вне
    document.addEventListener('click', (e) => {
        if (!centerMenus.contains(e.target)) {
            document.querySelectorAll('.submenu').forEach(sub => {
                sub.style.display = 'none';
            });
        }
    });
});
