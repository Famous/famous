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
    var clickTolerance = 5;
    var clickThreshold = 300;
    var clickWindow = 500;
    var potentialClicks = {};
    var recentlyDispatched = {};
    var _now = Date.now;

    window.addEventListener('touchstart', function(event) {
        var timestamp = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            potentialClicks[touch.identifier] = timestamp;
        }
    });

    window.addEventListener('touchmove', function(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            delete potentialClicks[touch.identifier];
        }
    });

    window.addEventListener('touchend', function(event) {
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
    });

    window.addEventListener('click', function(event) {
        if (!(event instanceof window.MouseEvent)) return;

        var currTime = _now();
        for (var i in recentlyDispatched) {
            if (currTime - i < clickWindow) {
                var previousEvent = recentlyDispatched[i];

                if (event.target === previousEvent.target) {
                    event.stopPropagation();
                    return;
                }

                for (var j = 0; j < previousEvent.changedTouches.length; j++) {
                    var touch = previousEvent.changedTouches[j];
                    if (Math.abs(event.clientX - touch.clientX) < clickTolerance || Math.abs(event.clientY - touch.clientY) < clickTolerance) {
                        event.stopPropagation();
                        return;
                    }
                }

                delete recentlyDispatched[i];
            }
        }
    }, true);
});
