import FileRender from './file-render';

function render(Render) {
    if (
        typeof Render !== 'function' ||
        !(Render.prototype instanceof FileRender)
    ) {
        throw Error('invalidate Render!');
    }
    const instance = new Render();
    instance.render();
    instance.didRender();
}

module.exports = render;
