/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: peter@appmachine.com
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    /**
     * ClickFix is an shim that stops 'click' event when there is movement between mousedown
     * and mouseup is more then the clickTolerance. This enables to let user scroll with mouse
     * through scrollbar without triggering click.
     */
    var clickTolerance = 5;
    var potentialClick = null;

    window.addEventListener('mousedown', function(event) {
        potentialClick = {
            position: [event.clientX, event.clientY],
            target: event.target
        };

        event.target.addEventListener('mousemove', _handleMove, true);
        event.target.addEventListener('mouseup', _handleEnd, true);
    }, true);

    function _handleMove(event) {
        if (potentialClick) {
            if (Math.abs(potentialClick.position[0] - event.clientX) > clickTolerance || Math.abs(potentialClick.position[1] - event.clientY) > clickTolerance)
                potentialClick.cancel = true;
        }
    }

    function _handleEnd(event) {
        event.target.removeEventListener('mousemove', _handleMove);
        event.target.removeEventListener('mouseup', _handleEnd);
    }

    window.addEventListener('click', function(event) {
        if (potentialClick && potentialClick.cancel && potentialClick.target === event.target) event.stopPropagation();
        potentialClick = null;
    }, true);
});
