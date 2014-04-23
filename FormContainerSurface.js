define(function(require, exports, module) {
    var ContainerSurface = require('./ContainerSurface');

    function FormContainerSurface() {
        ContainerSurface.apply(this, arguments);
    }

    FormContainerSurface.prototype = Object.create(ContainerSurface.prototype);
    FormContainerSurface.prototype.constructor = FormContainerSurface;

    FormContainerSurface.prototype.elementType = 'form';

    module.exports = FormContainerSurface;
});