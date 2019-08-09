'use strict';

/* eslint-disable class-methods-use-this */
class FileRender {
    setState(newState) {
        this.state = Object.assign({}, this.state, newState);
        this.render();
    }

    didRender() {}

    render() {}
}

module.exports = FileRender;
