const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const md = require('markdown-it')();

const templates = {
    scaffold: loadTemplate('scaffold'),
    project: loadTemplate('project'),
    illustration: loadTemplate('illustration'),
    actions: loadTemplate('actions'),
    index: loadTemplate('index')
}

const projects = fs.readdirSync(path.join(__dirname, "projects"))
    .sort()
    .map(loadProject);

const indexPage = buildIndex();
const projectPages = projects.map(buildProject);

buildAppBundle(indexPage, projectPages);

// Functions

function buildIndex() {
    const content = templates.index({
        projects
    });
    const htmlOutput = templates.scaffold({
        content
    });
    const dest = path.join(__dirname, "../www/index.html");
    fs.writeFileSync(dest, htmlOutput, { encoding: 'utf-8' });
    return content;
}

function buildProject(project) {
    const description = md.render(project.description);

    const actions = project.actions == null ? '' : templates.actions({
        actions: project.actions
    });

    const illustration = templates.illustration({
        ...project
    });

    const projectOutput = templates.project({
        bgImage: project.background,
        title: project.title,
        description,
        actions,
        illustration
    });

    const htmlOutput = templates.scaffold({
        title: project.title,
        content: projectOutput
    });

    const dest = path.join(__dirname, "../www/projects", `${project.name}.html`);

    fs.writeFileSync(dest, htmlOutput, { encoding: 'utf-8' });

    return {
        name: project.name,
        html: projectOutput
    };
}

function cleanProjectName(source) {
    const project = path.basename(source, '.yaml');
    const parts = project.split('_');
    return parts[parts.length - 1];
}

function buildAppBundle(indexPage, projectPages) {
    const pages = { index: indexPage };
    projectPages.forEach(project => {
        pages[project.name] = project.html;
    });

    const dest = path.join(__dirname, "../www/bundle.json");
    fs.writeFileSync(dest, JSON.stringify(pages, null, 4));
}

function loadProject(project) {
    return {
        source: project,
        name: cleanProjectName(project),
        ...yaml.parse(fs.readFileSync(path.join(__dirname, "projects", project), "utf-8"))
    };
}

function loadTemplate(name) {
    return handlebars.compile(fs.readFileSync(path.join(__dirname, `templates/${name}.hbs`), "utf-8"))
}