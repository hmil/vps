var imageSizes = {};

document.body.onload = function() {

    var bundle = loadAppBundle();


    initPage();

    function initPage() {
        const cells = document.getElementsByClassName('cell');
        for (var i = 0 ; i < cells.length ; i++) {
            const cell = cells[i];
            const container = cell.firstElementChild;
            const background = container.getElementsByClassName('background')[0];
            loadImageSize(cell.getAttribute('data-project'), background.style.backgroundImage);
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
        if (evt.button !== 0 || evt.ctrlKey || evt.metaKey) {
            return; // Only handle regular clicks
        }
        evt.preventDefault();
        const href = evt.currentTarget.href;
        const container = evt.currentTarget.firstElementChild;
        const background = container.getElementsByClassName('background')[0];
        const title = container.getElementsByClassName('title')[0];
        const brect = container.getBoundingClientRect();
        const project = evt.currentTarget.getAttribute('data-project');

        requestAnimationFrame(() => {
            const delayMs = 350;
            const anim = delayMs + 'ms ease-in-out';
            container.style.transition = 'transform ' + anim;
            background.style.transition = 'transform ' + anim;
            container.style.width = brect.width + 'px';
            container.style.height = brect.height + 'px';
            container.style.position = 'fixed';
            container.style.top = brect.y + 'px';
            container.style.left = brect.x + 'px';
            container.classList.add('clicked');
            container.style.backgroundColor = '#1a2336';
            // background.style.transform = 'scale(1.5)';
            // background.style.filter = 'blur(3px) grayscale(1)';
            background.style.filter = 'grayscale(1)';
            background.style.opacity = 0.2;
            title.style.display = 'none';

            
            requestAnimationFrame(() => {
                const trnsf = computeTransformToFullscreen(brect);
                const bgTrnsf = computeBackgroundTransform(brect, project);
                container.style.transform = transformToCSS(trnsf);
                background.style.transform = transformToCSS(bgTrnsf);
                // container.style.transition = ['width', 'height', 'left', 'top'].map(v => v + ' ' + anim).join(', ');
                // container.style.width = '100vw';
                // container.style.height = '100vh';
                // container.style.top = '0';
                // container.style.left = '0';
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


    function loadImageSize(project, url) {
        const src = url.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
        var image = new Image();
        image.onload = function() {
            imageSizes[project] = { width: image.width, height: image.height};
        }
        image.src = src;
    }
}

function transformToCSS(trnsf) {
    return `translate(${trnsf.dx}px, ${trnsf.dy}px) scale(${trnsf.sx}, ${trnsf.sy})`;
}

function computeTransformToFullscreen(brect) {
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

    return {
        sx: width / brect.width,
        sy: yScale = height / brect.height,
        dx: -brect.x + width / 2 - brect.width / 2,
        dy: -brect.y + height / 2 - brect.height / 2
    }; 
}

// Prevents the background from getting squished by the transform of the container
function computeBackgroundTransform(brect, project) {
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    const imageAspectRatio = imageSizes[project] ? (imageSizes[project].width / imageSizes[project].height) : 1;
    const beginAspectRatio = brect.width / brect.height;
    const endAspectRatio = width / height;

    if (imageAspectRatio < beginAspectRatio) {
        const squishFactor = endAspectRatio / beginAspectRatio;
        if (imageAspectRatio < endAspectRatio) {
            return {
                dx: 0,
                dy: 0,
                sx: 1.5,
                sy: 1.5 * squishFactor
            };
        } else {
            const scaleFactor = imageAspectRatio / endAspectRatio;
            return {
                dx: 0,
                dy: 0,
                sx: 1.5 * scaleFactor,
                sy: 1.5 * squishFactor * scaleFactor
            };
        }
    } else {
        const squishFactor = beginAspectRatio / endAspectRatio;
        if (imageAspectRatio > endAspectRatio) {
            return {
                dx: 0,
                dy: 0,
                sx: 1.5 * beginAspectRatio / endAspectRatio,
                sy: 1.5
            };
        } else {
            const scaleFactor = endAspectRatio / imageAspectRatio;
            return {
                dx: 0,
                dy: 0,
                sx: 1.5 * squishFactor * scaleFactor,
                sy: 1.5 * scaleFactor
            };
        }
    }
}

function loadAppBundle() {
    return new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(JSON.parse(xhr.responseText));
        }
        xhr.open('GET', `/bundle-${version}.json`);
        xhr.send();
    });
}