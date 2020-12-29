// ==========================================================================
//                          DG.BarChartView
//
//  Author:   William Finzer
//
//  Copyright (c) 2017 by The Concord Consortium, Inc. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// ==========================================================================

sc_require('components/graph/plots/bar_chart_base_view');

/** @class  DG.BarChartView, a plot of rectangles, one for each category. Each rectangle is made of
 * thinner rectangles, one for each case.

 @extends DG.BarChartBaseView
 */
DG.BarChartView = DG.BarChartBaseView.extend(
  /** @scope DG.BarChartView.prototype */
  {
    /**
     * Make sure the count axis has the correct upper bounds
     */
    setupAxes: function () {
      sc_super();
      var tCountAxisView = this.get('secondaryAxisView');
      // Only set the bounds if they aren't already present
      if (tCountAxisView && SC.none( tCountAxisView.getPath('model.lowerBound'))) {
        tCountAxisView.get('model').setLowerAndUpperBounds(0, this.getPath('model.naturalUpperBound'));
      }
    },

    /**
     * Return the class of the count axis with the x or y to put it on.
     * @return {[{}]}
     */
    getAxisViewDescriptions: function () {
      var tDescriptions = sc_super(),
          tCountKey = this.getPath('model.orientation') === DG.GraphTypes.EOrientation.kVertical ? 'y' : 'x';
      tDescriptions.push( {
        axisKey: tCountKey,
        axisClass: DG.CountAxisView
      });
      return tDescriptions;
    }
  }
);
