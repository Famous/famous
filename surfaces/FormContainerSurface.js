define(function(require, exports, module) {
    var ContainerSurface = require('./ContainerSurface');

    function FormContainerSurface(options) {
        if (options) this._method = options.method || '';
        ContainerSurface.apply(this, arguments);
    }

    FormContainerSurface.prototype = Object.create(ContainerSurface.prototype);
    FormContainerSurface.prototype.constructor = FormContainerSurface;

    FormContainerSurface.prototype.elementType = 'form';

    FormContainerSurface.prototype.deploy = function deploy(target) {
        if (this._method) target.method = this._method;
        return ContainerSurface.prototype.deploy.apply(this, arguments);
    };

    module.exports = FormContainerSurface;
});
