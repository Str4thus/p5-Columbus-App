/**
 * Represents a configuration for the web socket connection.
 */
class SocketConfiguration {
    url = `ws://${this._host}:${this._port}`

    constructor(public _host, public _port) {}
}

const defaultSocketConfiguration = new SocketConfiguration("42.13.37.1", "420");

export { SocketConfiguration, defaultSocketConfiguration };