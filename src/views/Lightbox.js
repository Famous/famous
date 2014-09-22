define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Modifier = require('../core/Modifier');
    var RenderNode = require('../core/RenderNode');
    var Utility = require('../utilities/Utility');
    var OptionsManager = require('../core/OptionsManager');
    var Transitionable = require('../transitions/Transitionable');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    /**
     * Lightbox, using transitions, shows and hides different renderables. Lightbox can essentially be
     * thought of as RenderController with a stateful implementation and interface.
     *
     * @class Lightbox
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Transform} [options.inTransform] The transform at the start of transitioning in a shown renderable.
     * @param {Transform} [options.outTransform] The transform at the end of transitioning out a renderable.
     * @param {Transform} [options.showTransform] The transform applied to your shown renderable in its state of equilibrium.
     * @param {Number} [options.inOpacity] A number between one and zero that defines the state of a shown renderables opacity upon initially
     * being transitioned in.
     * @param {Number} [options.outOpacity] A number between one and zero that defines the state of a shown renderables opacity upon being
     * fully transitioned out.
     * @param {Number} [options.showOpacity] A number between one and zero that defines the state of a shown renderables opacity
     * once succesfully transitioned in.
     * @param {Array<Number>} [options.inOrigin] A two value array of numbers between one and zero that defines the state of a shown renderables
     * origin upon intially being transitioned in.
     * @param {Array<Number>} [options.outOrigin] A two value array of numbers between one and zero that defines the state of a shown renderable
     * origin once fully hidden.
     * @param {Array<Number>} [options.showOrigin] A two value array of numbers between one and zero that defines the state of a shown renderables
     * origin upon succesfully being shown.
     * @param {Array<Number>} [options.inAlign] A two value array of numbers between one and zero that defines the state of a shown renderables
     * align upon intially being transitioned in.
     * @param {Array<Number>} [options.outAlign] A two value array of numbers between one and zero that defines the state of a shown renderable
     * align once fully hidden.
     * @param {Array<Number>} [options.showAlign] A two value array of numbers between one and zero that defines the state of a shown renderables
     * align upon succesfully being shown.
     * @param {Transition} [options.inTransition=true] The transition in charge of showing a renderable.
     * @param {Transition} [options.outTransition=true]  The transition in charge of removing your previous renderable when
     * you show a new one, or hiding your current renderable.
     * @param {Boolean} [options.overlap=false] When showing a new renderable, overlap determines if the
     *   out transition of the old one executes concurrently with the in transition of the new one,
      *  or synchronously beforehand.
     */
    function Lightbox(options) {
        this.options = Object.create(Lightbox.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this._showing = false;
        this.nodes = [];
        this.transforms = [];
        this.states = [];
    }

    Lightbox.DEFAULT_OPTIONS = {
        inTransform: Transform.scale(0.001, 0.001, 0.001),
        inOpacity: 0,
        inOrigin: [0.5, 0.5],
        inAlign: [0.5, 0.5],
        outTransform: Transform.scale(0.001, 0.001, 0.001),
        outOpacity: 0,
        outOrigin: [0.5, 0.5],
        outAlign: [0.5, 0.5],
        showTransform: Transform.identity,
        showOpacity: 1,
        showOrigin: [0.5, 0.5],
        showAlign: [0.5, 0.5],
        inTransition: true,
        outTransition: true,
        overlap: false
    };

    /**
     * Patches the Lightbox instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Lightbox instance.
     */
    Lightbox.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

   /**
     * Show displays the targeted renderable with a transition and an optional callback to
     *  execute afterwards.
     * @method show
     * @param {Object} renderable The renderable you want to show.
     * @param {Transition} [transition] Overwrites the default transition in to display the
     * passed-in renderable.
     * @param {function} [callback] Executes after transitioning in the renderable.
     */
    Lightbox.prototype.show = function show(renderable, transition, callback) {
        if (!renderable) {
            return this.hide(callback);
        }

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        if (this._showing) {
            if (this.options.overlap) this.hide();
            else {
                return this.hide(this.show.bind(this, renderable, transition, callback));
            }
        }
        this._showing = true;

        var stateItem = {
            transform: new TransitionableTransform(this.options.inTransform),
            origin: new Transitionable(this.options.inOrigin),
            align: new Transitionable(this.options.inAlign),
            opacity: new Transitionable(this.options.inOpacity)
        };

        var transform = new Modifier({
            transform: stateItem.transform,
            opacity: stateItem.opacity,
            origin: stateItem.origin,
            align: stateItem.align
        });
        var node = new RenderNode();
        node.add(transform).add(renderable);
        this.nodes.push(node);
        this.states.push(stateItem);
        this.transforms.push(transform);

        var _cb = callback ? Utility.after(3, callback) : undefined;

        if (!transition) transition = this.options.inTransition;
        stateItem.transform.set(this.options.showTransform, transition, _cb);
        stateItem.opacity.set(this.options.showOpacity, transition, _cb);
        stateItem.origin.set(this.options.showOrigin, transition, _cb);
        stateItem.align.set(this.options.showAlign, transition, _cb);
    };

    /**
     * Hide hides the currently displayed renderable with an out transition.
     * @method hide
     * @param {Transition} [transition] Overwrites the default transition in to hide the
     * currently controlled renderable.
     * @param {function} [callback] Executes after transitioning out the renderable.
     */
    Lightbox.prototype.hide = function hide(transition, callback) {
        if (!this._showing) return;
        this._showing = false;

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        var node = this.nodes[this.nodes.length - 1];
        var transform = this.transforms[this.transforms.length - 1];
        var stateItem = this.states[this.states.length - 1];
        var _cb = Utility.after(3, function() {
            this.nodes.splice(this.nodes.indexOf(node), 1);
            this.states.splice(this.states.indexOf(stateItem), 1);
            this.transforms.splice(this.transforms.indexOf(transform), 1);
            if (callback) callback.call(this);
        }.bind(this));

        if (!transition) transition = this.options.outTransition;
        stateItem.transform.set(this.options.outTransform, transition, _cb);
        stateItem.opacity.set(this.options.outOpacity, transition, _cb);
        stateItem.origin.set(this.options.outOrigin, transition, _cb);
        stateItem.align.set(this.options.outAlign, transition, _cb);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Lightbox.prototype.render = function render() {
        var result = [];
        for (var i = 0; i < this.nodes.length; i++) {
            result.push(this.nodes[i].render());
        }
        return result;
    };

    module.exports = Lightbox;
});
