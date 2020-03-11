export abstract class SocketConfiguration {
    private static defaultUrl = "http://localhost";
    private static defaultPort = 420;

    static default() {
        return this.defaultUrl + ":" + this.defaultPort
    }
}