const Uploader = require('./Uploader');
const SocketContext = require('./SocketContext');

class Socket {
    constructor() {
        this.gateways = [];
    }

    init(server, options = {}) {
        this._server = server;
        this._config = options;

        this.initAuth();

        this.onConnection();
    }

    get io() {
        return this._server;
    }

    initAuth() {
        const { auth } = this._config;
        if (auth) {
            this._server.use((socket, next) => {
                const { error, user } = auth(socket);

                if (error) {
                    socket.authError = error;
                    socket.isAuthenticated = false;
                } else {
                    socket.user = user;
                    socket.isAuthenticated = true;
                }

                next();
            });
        }
    }

    use(gateway, options) {
        this.gateways.push({ gateway, options });
    }

    onConnection() {
        this._server.on('connection', socket => {
            const ctx = new SocketContext(socket);

            Uploader.join(socket);

            this.gateways.forEach(({ gateway, options }) => {
                gateway.initListeners(ctx, options);
            });
        });
    }
}

module.exports = new Socket();
