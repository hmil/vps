document.body.onload = function() {

    var bundle = loadAppBundle();

    initPage();

    function initPage() {
        const cells = document.getElementsByClassName('cell');
        for (var i = 0 ; i < cells.length ; i++) {
            const cell = cells[i];
            cell.addEventListener('click', onCellClick);
        }
        const backButton = document.getElementById('home-btn');
        if (backButton != null) {
            backButton.addEventListener('click', function(evt) {
                if (history.state != null && history.state.projectPage != null) {
                    evt.preventDefault();
                    history.back();
                }
            });
        }
    }

    function onCellClick(evt) {
        evt.preventDefault();
        const href = evt.currentTarget.href;
        const container = evt.currentTarget.firstElementChild;
        const background = container.getElementsByClassName('background')[0];
        const title = container.getElementsByClassName('title')[0];
        const brect = container.getBoundingClientRect();
        const project = evt.currentTarget.getAttribute('data-project');

        requestAnimationFrame(() => {
            container.style.width = brect.width + 'px';
            container.style.height = brect.height + 'px';
            container.style.position = 'fixed';
            container.style.top = brect.y + 'px';
            container.style.left = brect.x + 'px';
            container.classList.add('clicked');
            container.style.backgroundColor = '#1a2336';
            background.style.transform = 'scale(1.5)';
            background.style.filter = 'blur(3px) grayscale(1)';
            background.style.opacity = 0.2;
            title.style.display = 'none';
            requestAnimationFrame(() => {
                const delayMs = 250;
                const anim = delayMs + 'ms ease-out';
                container.style.transition = ['width', 'height', 'left', 'top'].map(v => v + ' ' + anim).join(', ');
                container.style.width = '100vw';
                container.style.height = '100vh';
                container.style.top = '0';
                container.style.left = '0';
                setTimeout(async () => {
                    navigateTo(project, href);
                }, delayMs);
            });
        });
        console.log(brect);
    }

    window.addEventListener('popstate', (evt) => {
        const page = (evt.state == null || evt.state.projectPage == null) ? 'index' : evt.state.projectPage
        replacePage(page);
    });

    function navigateTo(project, href) {
        replacePage(project);
        history.pushState({ projectPage: project }, 'project', href);
    }

    function replacePage(page) {
        return bundle.then((data) => {
            document.body.removeChild(document.getElementById('content'));
            const newRoot = document.createElement('div');
            newRoot.id = 'content';
            newRoot.innerHTML = data[page];
            document.body.appendChild(newRoot);
            initPage();
        });
    }
}

function loadAppBundle() {
    return new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(JSON.parse(xhr.responseText));
        }
        xhr.open('GET', '/bundle.json');
        xhr.send();
    });
}