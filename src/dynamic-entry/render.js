
class FileRender {
    constructor() {
        this.render();
        this.didRender();
    }
    setState(newState) {
        this.state = Object.assign({}, this.state, newState);
        this.render();
    }
    render() { }
}

module.exports = FileRender;
