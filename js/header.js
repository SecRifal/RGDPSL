// Function to determine hrefs based on current location
function getHrefs() {
    const pathname = window.location.pathname;

    // Определяем текущую папку
    let currentDir = '';
    if (pathname.includes('/top/lists/')) {
        currentDir = 'lists';
    } else if (pathname.includes('/top/more/')) {
        currentDir = 'more';
    } else {
        currentDir = 'root';
    }

    // Определяем пути в зависимости от текущей папки
    let demonsHref, challengesHref, memoryHref, playersHref, impossibleHref;
    let levelHref, verifHref, victorHref, showcaseHref, impossibleRequestHref, registrationHref;
    let aboutHref, contactHref, changelogHref;

    if (currentDir === 'lists') {
        // Из папки lists/
        demonsHref = 'demons.html';
        challengesHref = 'challenges.html';
        memoryHref = 'memory.html';
        playersHref = 'players.html';
        impossibleHref = 'impossible.html';

        levelHref = '../../level.html';
        verifHref = '../../verif.html';
        victorHref = '../../victor.html';
        showcaseHref = '../../showcase.html';
        impossibleRequestHref = '../../impossible-request.html';
        registrationHref = '../../registration.html';

        aboutHref = '../more/about.html';
        contactHref = '../more/contact.html';
        changelogHref = '../more/changelog.html';

    } else if (currentDir === 'more') {
        // Из папки more/
        demonsHref = '../lists/demons.html';
        challengesHref = '../lists/challenges.html';
        memoryHref = '../lists/memory.html';
        playersHref = '../lists/players.html';
        impossibleHref = '../lists/impossible.html';

        levelHref = '../../level.html';
        verifHref = '../../verif.html';
        victorHref = '../../victor.html';
        showcaseHref = '../../showcase.html';
        impossibleRequestHref = '../../impossible-request.html';
        registrationHref = '../../registration.html';

        aboutHref = 'about.html';
        contactHref = 'contact.html';
        changelogHref = 'changelog.html';

    } else {
        // Из корневой папки
        demonsHref = 'top/lists/demons.html';
        challengesHref = 'top/lists/challenges.html';
        memoryHref = 'top/lists/memory.html';
        playersHref = 'top/lists/players.html';
        impossibleHref = 'top/lists/impossible.html';

        levelHref = 'level.html';
        verifHref = 'verif.html';
        victorHref = 'victor.html';
        showcaseHref = 'showcase.html';
        impossibleRequestHref = 'impossible-request.html';
        registrationHref = 'registration.html';

        aboutHref = 'top/more/about.html';
        contactHref = 'top/more/contact.html';
        changelogHref = 'top/more/changelog.html';
    }

    return {
        demonsHref, challengesHref, memoryHref, playersHref, impossibleHref,
        levelHref, verifHref, victorHref, showcaseHref, impossibleRequestHref, registrationHref,
        aboutHref, contactHref, changelogHref
    };
}

// Function to create and insert header
function insertHeader() {
    const hrefs = getHrefs();

    const headerHTML = `
    <!-- Верхушка -->
    <header class="top">
        <!-- Кнопка смены темы -->
        <div class="theme-toggle" onclick="toggleTheme()" title="Сменить тему">
            <div class="theme-icon">🌙</div>
        </div>

        <!-- Центрированные менюшки -->
        <div class="center-menus">
            <!-- Листы -->
            <div class="menu-item lists">
                <div class="menu-header" onclick="toggleMenu('lists')">Листы</div>
                <div class="submenu" id="lists-submenu">
                    <a href="${hrefs.demonsHref}" class="demons">Демон Лист</a>
                    <a href="${hrefs.challengesHref}" class="challenges">Челлендж Лист</a>
                    <a href="${hrefs.memoryHref}" class="memory">Мемори Челлендж Лист</a>
                    <a href="${hrefs.playersHref}" class="players">Рейтинг Игроков</a>
                    <a href="${hrefs.impossibleHref}" class="impossible">Импосибл Левел Лист</a>
                </div>
            </div>

            <!-- Реквесты -->
            <div class="menu-item requests">
                <div class="menu-header" onclick="toggleMenu('requests')">Реквесты</div>
                <div class="submenu" id="requests-submenu">
                    <a href="${hrefs.levelHref}" class="req-Level">Заявка на уровень</a>
                    <a href="${hrefs.verifHref}" class="req-Verif">Отправить Вериф</a>
                    <a href="${hrefs.victorHref}" class="req-Victor">Отправить Виктор</a>
                    <a href="${hrefs.showcaseHref}" class="req-Showcase">Отправить Шоукейс</a>
                    <a href="${hrefs.impossibleRequestHref}" class="req-Impossible">Заявка на Импосибл</a>
                    <a href="${hrefs.registrationHref}" class="reg">Попасть в топ игроков</a>
                </div>
            </div>

            <!-- Дополнительное -->
            <div class="menu-item more">
                <div class="menu-header" onclick="toggleMenu('more')">Ещё</div>
                <div class="submenu" id="more-submenu">
                    <a href="${hrefs.aboutHref}" class="about">Информация</a>
                    <a href="${hrefs.contactHref}" class="contact">Контакты</a>
                    <a href="${hrefs.changelogHref}" class="changelog">Чейндж-Лог</a>
                </div>
            </div>
        </div>
    </header>
    `;

    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeIcon.textContent = '☀️'; // Show sun for light theme
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeIcon.textContent = '🌙'; // Show moon for dark theme
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-icon');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) themeIcon.textContent = '🌙'; // Show moon for current dark theme
    } else {
        if (themeIcon) themeIcon.textContent = '☀️'; // Show sun for current light theme
    }
}

// Call the function when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    insertHeader();
    loadTheme();
});
