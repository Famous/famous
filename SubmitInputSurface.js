define(function(require, exports, module) {
    var InputSurface = require('./InputSurface');

    function SubmitInputSurface(options) {
        InputSurface.apply(this, arguments);
        this._type = 'submit';
        if (options && options.onclick) this.onclick = options.onclick;
    }

    SubmitInputSurface.prototype = Object.create( InputSurface.prototype );
    SubmitInputSurface.prototype.constructor = SubmitInputSurface;

    SubmitInputSurface.prototype.setOnClick = function(onclick){
        this.onclick = onclick;
    };

    SubmitInputSurface.prototype.deploy = function deploy(target) {
        if (this.onclick) target.onclick = this.onclick;
        InputSurface.prototype.deploy.apply(this, arguments);
    };

    module.exports = SubmitInputSurface;
});