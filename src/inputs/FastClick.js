/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    /**
     * FastClick is an override shim which maps event pairs of
     *   'touchstart' and 'touchend' which differ by less than a certain
     *   threshold to the 'click' event.
     *   This is used to speed up clicks on some browsers.
     */
    if (!window.CustomEvent) return;
    var clickThreshold = 300;
    var clickWindow = 500;
    var potentialClicks;
    var recentlyDispatched;
    var _now;

    function touchstartListener(event) {
        var timestamp = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            potentialClicks[touch.identifier] = timestamp;
        }
    }

    function touchmoveListener(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            delete potentialClicks[touch.identifier];
        }
    }

    function touchendListener(event) {
        var currTime = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var startTime = potentialClicks[touch.identifier];
            if (startTime && currTime - startTime < clickThreshold) {
                var clickEvt = new window.CustomEvent('click', {
                    'bubbles': true,
                    'detail': touch
                });
                recentlyDispatched[currTime] = event;
                event.target.dispatchEvent(clickEvt);
            }
            delete potentialClicks[touch.identifier];
        }
    }

    function clickListener(event) {
        var currTime = _now();
        for (var i in recentlyDispatched) {
            var previousEvent = recentlyDispatched[i];
            if (currTime - i < clickWindow) {
                if (event instanceof window.MouseEvent && event.target === previousEvent.target) event.stopPropagation();
            }
            else delete recentlyDispatched[i];
        }
    }

    function enable() {
        potentialClicks = {};
        recentlyDispatched = {};
        _now = Date.now;
        window.addEventListener('touchstart', touchstartListener);
        window.addEventListener('touchmove', touchmoveListener);
        window.addEventListener('touchend', touchendListener);
        window.addEventListener('click', clickListener, true);
    }

    function disable() {
        window.removeEventListener('touchstart', touchstartListener);
        window.removeEventListener('touchmove', touchmoveListener);
        window.removeEventListener('touchend', touchendListener);
        window.removeEventListener('click', clickListener, true);
    }

    module.exports = {
        enable: enable,
        disable: disable
    };

    /* TODO Remove initial enable call when deprecation is complete */
    enable();
});
