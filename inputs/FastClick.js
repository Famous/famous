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
    if (!window.CustomEvent || !('ontouchstart' in window)) return;
    var clickThreshold = 300;
    var clickWindow = 500;
    // MouseEvent and CustomEvent deliver sometimes slightly different coordinates
    var positionThreshold = 5;
    var potentialClicks = {};
    var recentlyDispatched = {};
    var _now = Date.now;

    window.addEventListener('touchstart', function(event) {
        // multiple touches should not lead to a click
        if (event.changedTouches.length > 1) return;
        var timestamp = _now();
        var touch = event.changedTouches[0];
        potentialClicks[touch.identifier] = timestamp;
    });

    window.addEventListener('touchmove', function(event) {
        if (event.changedTouches.length > 1) return;
        var touch = event.changedTouches[0];
        delete potentialClicks[touch.identifier];
    });

    window.addEventListener('touchend', function(event) {
        if (event.changedTouches.length > 1) return;
        var currTime = _now();
        var touch = event.changedTouches[0];
        var startTime = potentialClicks[touch.identifier];
        if (startTime && currTime - startTime < clickThreshold) {
            var clickEvt = new window.CustomEvent('click', {
                bubbles: true,
                cancelable: true,
                detail: event
            });
            recentlyDispatched[currTime] = clickEvt;
            event.target.dispatchEvent(clickEvt);
        }
        delete potentialClicks[touch.identifier];
    });

    window.addEventListener('click', function(event) {
        var currTime = _now();
        for (var i in recentlyDispatched) {
            var previousEvent = recentlyDispatched[i];
            if (currTime - i < clickWindow) {
                if (event instanceof window.MouseEvent && _sameTarget(event, previousEvent)) {
                    if (previousEvent.defaultPrevented) event.preventDefault();
                    event.stopPropagation();
                }
            }
            else delete recentlyDispatched[i];
        }
    }, true);

    function _sameTarget(event, previousEvent) {
        if (previousEvent.detail.changedTouches.length > 1) return false;
        if (event.target === previousEvent.target) return true;

        var touch = previousEvent.detail.changedTouches[0];
        if (event.screenX - touch.screenX < positionThreshold &&
            event.screenY - touch.screenY < positionThreshold) {
            return true;
        }
        return false;
    }
});
