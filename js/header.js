// Function to determine hrefs based on current location
function getHrefs() {
    const pathname = window.location.pathname;
    const isInSubDir = pathname.includes('lists');

    const demonsHref = isInSubDir ? 'demons.html' : 'top/lists/demons.html';
    const challengesHref = isInSubDir ? 'challenges.html' : 'top/lists/challenges.html';
    const memoryHref = isInSubDir ? 'memory.html' : 'top/lists/memory.html';
    const playersHref = isInSubDir ? 'players.html' : 'top/lists/players.html';
    const impossibleHref = isInSubDir ? 'impossible.html' : 'top/lists/impossible.html';

    const levelHref = isInSubDir ? '../../level.html' : 'level.html';
    const verifHref = isInSubDir ? '../../verif.html' : 'verif.html';
    const victorHref = isInSubDir ? '../../victor.html' : 'victor.html';
    const showcaseHref = isInSubDir ? '../../showcase.html' : 'showcase.html';
    const impossibleRequestHref = isInSubDir ? '../../impossible-request.html' : 'impossible-request.html';
    const registrationHref = isInSubDir ? '../../registration.html' : 'registration.html';

    const aboutHref = isInSubDir ? '../more/about.html' : 'top/more/about.html';
    const contactHref = isInSubDir ? '../more/contact.html' : 'top/more/contact.html';
    const changelogHref = isInSubDir ? '../more/changelog.html' : 'top/more/changelog.html';

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

// Call the function when DOM is ready
document.addEventListener('DOMContentLoaded', insertHeader);
