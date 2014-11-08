/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    module.exports = {
        getTimeHistoryPosition: function getTimeHistoryPosition(history, timeSampleDuration) {
            var len = history.length - 1;
            var index = len;
            var searching = true;
            var timeSearched = 0;

            var lastHist;
            var hist;
            var diffTime;

            while (searching) {
                hist = history[index];
                if (index < 0) return lastHist;

                if (hist && lastHist) {
                    diffTime = lastHist.timestamp - hist.timestamp;
                    timeSearched += diffTime;
                    if (timeSearched >= timeSampleDuration) {
                        searching = false;
                        return hist;
                    }
                }

                index--;
                lastHist = hist;
            }
        }
    };
});
