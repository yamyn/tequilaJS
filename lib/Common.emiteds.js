const Exception = require('./Errors/BaseException');

/** @module CommonEmitteds */
class CommonEmiteds {
    /**
     * event to client, if token invalid or missed
     *
     * @event Emitted: on-auth-error
     * @param {error}  Unautorized error
     */
    sendAuthError(socket, message) {
        socket.emit('on-auth-error', {
            error: new Exception(message, 401),
        });
    }

    /**
     * event to client, if token invalid or missed
     *
     * @event Emitted: on-auth-error
     * @param {error}  Unautorized error
     */
    sendUploadError(socket, message) {
        socket.emit('on-upload-error', {
            error: new Exception(message, 500),
        });
    }
}

module.exports = new CommonEmiteds();
