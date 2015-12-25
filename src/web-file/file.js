
export default class WebFile {
    constructor (options = {}) {
        this._fileName = options.fileName;
        this._maxSize = options.maxSize;
        this._messagesQueue = [];
        this._isRunning = false;
        this._fsLink = null;
    }

    push (string) {
        this._messagesQueue.push(string);
        if (!this._isRunning) {
            this._isRunning = true;
            this._writeAttempt();
        }
    }

    _writeAttempt () {
        this._requestFile((windowFsLink, fileEntry, fileWriter) => {
            fileWriter.onwriteend = this._onWriteEnd.bind(this);
            if (fileWriter.length > this._maxSize) {
                this._rotateLogs(windowFsLink, fileEntry, fileWriter);
            } else {
                this._appendQueueData(fileWriter);
                this._messagesQueue = [];
            }
        });
    }

    _onWriteEnd () {
        if (this._messagesQueue.length) {
            this._writeAttempt();
        } else {
            this._isRunning = false;
        }
    }

    _requestFile (callback) {
        this._requestFileSystem(fsLink => this._requestFileWriter(fsLink, callback));
    }

    _requestFileSystem (callback) {
        if (this._fsLink) {
            callback(this._fsLink);
            return;
        }
        try {
            var requestFs = window.webkitRequestFileSystem || window.requestFileSystem;
            requestFs(window.PERSISTENT, 0, callback);
        } catch (e) {
            // FIXME
        }
    }

    _requestFileWriter (windowFsLink, callback) {
        windowFsLink.root.getFile(
            this._fileName,
            {create: true, exclusive: false},
            fileEntry => fileEntry.createWriter(
                fileWriter => callback(fileEntry, fileWriter)
            )
        );
    }

    _rotateLogs (windowFsLink, fileEntry, fileWriter) {
        this._copy(
            windowFsLink.root,
            fileEntry,
            'debug-old.log',
            () => fileWriter.truncate(0)
        );
    }

    _copy (cwd, fileEntry, newPath, callback) {
        fileEntry.copyTo(
            cwd, newPath,
            error => callback(null, error),
            result => callback(result)
        );
    }

    _appendQueueData (fileWriter) {
        fileWriter.seek(fileWriter.length);
        fileWriter.write(
            new Blob(
                ['\n' + this._messagesQueue.join('\n')],
                {type: 'text/plain'}
            )
        );
    }
}
