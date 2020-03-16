class SocketConfiguration {
    url = `ws://${this._host}:${this._port}`

    constructor(public _host, public _port) {}
}

const defaultSocketConfiguration = new SocketConfiguration("localhost", "420");

export { SocketConfiguration, defaultSocketConfiguration };