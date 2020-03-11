export abstract class SocketConfiguration {
    private static defaultHost = "localhost";
    private static defaultPort = 420;

    static defaultURL() {
        return "ws://" + this.defaultHost + ":" + this.defaultPort
    }
}