const Uploader = require('./Uploader');

class Socket {
    constructor() {
        this.gateways = [];
    }

    init(server, options) {
        this.server = server;

        if (options.auth) {
            this.auth(options.auth);
        }

        this.onConnection();
    }

    get io() {
        return this.server;
    }

    auth(authenticate) {
        this.server.use((socket, next) => {
            const { error, user } = authenticate(socket);

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

    use(gateway, options) {
        this.gateways.push({ gateway, options });
    }

    initContext(socket) {
        return {
            server: this.server,
            socket,

            get user() {
                return this.socket.user;
            },

            get isAuthenticated() {
                return this.socket.isAuthenticated;
            },

            get authError() {
                return this.socket.authError;
            },

            get uploader() {
                return this.socket.uploader;
            },
        };
    }

    onConnection() {
        this.server.on('connection', socket => {
            const ctx = this.initContext(socket);

            Uploader.join(socket);

            this.gateways.forEach(({ gateway, options }) => {
                gateway.initListeners(ctx, options);
            });
        });
    }
}

module.exports = new Socket();
