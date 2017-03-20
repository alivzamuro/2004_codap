// ==========================================================================
//                            DG.PlotModel
//
//  Author:   William Finzer
//
//  Copyright (c) 2014 by The Concord Consortium, Inc. All rights reserved.
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

sc_require('alpha/destroyable');

/** @class  DG.PlotModel - The model for a graph's plot.

  @extends SC.Object
*/
DG.PlotModel = SC.Object.extend( DG.Destroyable,
/** @scope DG.PlotModel.prototype */ 
{
  /**
    Assigned by the graph model that owns me.
    @property { DG.GraphDataConfiguration }
  */
  dataConfiguration: null,

  /**
    @property { DG.DataContext }  The data context
   */
  dataContext: function() {
    return this.getPath('dataConfiguration.dataContext');
  }.property(),

  dataContextDidChange: function() {
    this.notifyPropertyChange('dataContext');
  }.observes('*dataConfiguration.dataContext'),
   
  /**
    Note: There is an ambiguity about which is the collection client when
    the plot has attributes from different collections.
    @property { DG.CollectionClient }  The collection client
   */
  collectionClient: function() {
    return this.getPath('dataConfiguration.collectionClient');
  }.property(),

  collectionClientDidChange: function() {
    this.notifyPropertyChange('collectionClient');
  }.observes('*dataConfiguration.collectionClient'),
   
  /**
    @property { SC.Array }
  */
  cases: function() {
    return this.getPath('dataConfiguration.cases');
  }.property(),

  casesDidChange: function() {
    this.notifyPropertyChange('cases');
  }.observes('*dataConfiguration.collectionClient', '*dataConfiguration.cases'),

  /**
    The plot model needs access to the cases controller that is stored in my dataConfiguration's
      collection client.
    @property { SC.ArrayController }
  */
  casesController: function() {
    return this.getPath('dataConfiguration.collectionClient.casesController');
  }.property(),

  casesControllerDidChange: function() {
    this.notifyPropertyChange('casesController');
  }.observes('*dataConfiguration.collectionClient.casesController'),

  /**
    @property { SC.SelectionSet }
  */
  selection: function() {
    return this.getPath('dataConfiguration.selection');
  }.property(),

  selectionDidChange: function() {
    this.notifyPropertyChange('selection');
  }.observes('*dataConfiguration.selection'),

  /**
    @property { Number }
  */
  xVarID: function() {
    return this.getPath('dataConfiguration.xAttributeID');
  }.property(),

  xVarIDDidChange: function() {
    this.notifyPropertyChange('xVarID');
  }.observes('*dataConfiguration.xAttributeID'),
  
  /**
   * A scatterplot may index into an array of attributes held by the y-attribute-description
   */
  yAttributeIndex: 0,

  /**
    @property { Number }
  */
  yVarID: function() {
    var tConfig = this.get('dataConfiguration' );
    return tConfig ? tConfig.yAttributeIDAt( this.yAttributeIndex) : null;
  }.property(),

  yVarIDDidChange: function() {
    this.notifyPropertyChange('yVarID');
  }.observes('*dataConfiguration.yAttributeID'),
  
  /**
    @property { Number }
  */
  y2VarID: function() {
    var tConfig = this.get('dataConfiguration' );
    return tConfig ? tConfig.y2AttributeIDAt( this.yAttributeIndex) : null;
  }.property(),

  y2VarIDDidChange: function() {
    this.notifyPropertyChange('y2VarID');
  }.observes('*dataConfiguration.y2AttributeID'),
  
  /**
    @property { Number }
  */
  legendVarID: function() {
    return this.getPath('dataConfiguration.legendAttributeID');
  }.property(),

  legendVarIDDidChange: function() {
    this.notifyPropertyChange('legendVarID');
  }.observes('*dataConfiguration.legendAttributeID'),
  
  /**
    @property {Number}  The variable ID of the attribute assigned to the numeric axis
  */
  primaryVarID: function() {
    switch( this.get('primaryAxisPlace')) {
      case DG.GraphTypes.EPlace.eX:
        return this.get('xVarID');
      case DG.GraphTypes.EPlace.eY:
        return this.get('yVarID');
      default:
        return null;
    }
  }.property('xVarID', 'yVarID'),

  /**
    @property {Number}  The variable ID of the attribute assigned to the numeric axis
  */
  secondaryVarID: function() {
    switch( this.get('secondaryAxisPlace')) {
      case DG.GraphTypes.EPlace.eX:
        return this.get('xVarID');
      case DG.GraphTypes.EPlace.eY:
        return this.get('yVarID');
      default:
        return null;
    }
  }.property('xVarID', 'yVarID'),

  /**
    @property { DG.AxisModel }
  */
  xAxis: null,

  /**
    @property { DG.AxisModel }
  */
  yAxis: null,
  
  /**
   * True if this plot is using the 2nd vertical axis.
    @property { DG.Boolean }
  */
  verticalAxisIsY2: false,

  autoDestroyProperties: ['plotAnimator','caseValueAnimator'],

  /**
    @property { DG.GraphAnimator }
  */
  plotAnimator: null,

  /**
    @property { DG.CaseValueAnimator }
  */
  caseValueAnimator: null,

  /**
   * This function is set by the graph that owns me.
   * @property{Function}
   */
  getPointColor: null,

  /**
   * This function is set by the graph that owns me.
   * @property{Function}
   */
  getStrokeColor: null,

  strokeColor: function() {
    return this.getStrokeColor();
  }.property(),

  /**
   * This function is set by the graph that owns me.
   * @property{Function}
   */
  getStrokeTransparency: null,

  strokeTransparency: function() {
    return this.getStrokeTransparency();
  }.property(),

  /**
   * This function is set by the graph that owns me.
   * @property{Function}
   */
  getPointSizeMultiplier: null,

  /**
   * This function is set by the graph that owns me.
   * @property{Function}
   */
  getTransparency: null,

  /**
    Key-value pairs for adornment models,
    e.g. _adornmentModels['plottedValue'] = plottedValueModel.
    @property   {Object}
   */
  _adornmentModels: null,

  /**
    @property { DG.PlottedCountModel }
  */
  _plottedCount: null,
  plottedCount: function() {
    if( !this._plottedCount) {
      this._plottedCount = DG.PlottedCountModel.create({plotModel: this});
      this.setAdornmentModel('plottedCount', this._plottedCount); // Add to list of adornments
      this._plottedCount.recomputeValue(); // initialize
    }
    return this._plottedCount;
  }.property(),

  /**
   * May be overridden, e.g. by DotPlotModel
   * @property {Boolean}
   */
  wantsPercentCheckbox: false,

  /**
    @return { Boolean }
  */
  shouldPlottedCountBeChecked: function( iWhat) {
    return this.getPath('plottedCount.isShowing' + iWhat);
  },

  /**
   * If we need to make a plotted Value, do so. In any event toggle its visibility.
   * This method gets used by both DotPlotModel and ScatterPlotModel.
   */
  togglePlotValue: function() {
    var this_ = this;

    function toggle() {
      this_.toggleAdornmentVisibility('plottedValue', 'togglePlotValue');
    }

    var willShow = !this.isAdornmentVisible('plottedValue');
    DG.UndoHistory.execute(DG.Command.create({
      name: "graph.togglePlotValue",
      undoString: (willShow ? 'DG.Undo.graph.showPlotValue' : 'DG.Undo.graph.hidePlotValue'),
      redoString: (willShow ? 'DG.Redo.graph.showPlotValue' : 'DG.Redo.graph.hidePlotValue'),
      log: "togglePlotValue: %@".fmt(willShow ? "show" : "hide"),
      execute: function () {
        toggle();
      },
      undo: function () {
        toggle();
      }
    }));
  },

  /**
    If we need to make a count model, do so. In any event toggle its visibility.
  */
  togglePlottedCount: function( iWhat) {
    var this_ = this;

    function toggle() {
      var tCurrentValue = this_.getPath('plottedCount.isShowing' + iWhat);
      this_.setPath('plottedCount.isShowing' + iWhat, !tCurrentValue);
    }

    var tInitialValue = this_.getPath('plottedCount.isShowing' + iWhat),
        tUndo = tInitialValue ? ('DG.Undo.graph.hide' + iWhat) : ('DG.Undo.graph.show' + iWhat),
        tRedo = tInitialValue ? ('DG.Redo.graph.hide' + iWhat) : ('DG.Redo.graph.show' + iWhat);
    DG.UndoHistory.execute(DG.Command.create({
      name: "graph.toggleCount",
      undoString: tUndo,
      redoString: tRedo,
      log: ("togglePlotted" + iWhat + ": %@").fmt(tInitialValue ? "hide" : "show"),
      execute: function() {
        toggle();
      }.bind(this),
      undo: function() {
        toggle();
      }.bind(this)
    }));
  },

  /**
    Initialization method
   */
  init: function() {
    sc_super();
    
    this._adornmentModels = {};
    
    this.addObserver('dataConfiguration', this, 'dataConfigurationDidChange');
    this.addObserver('xAxis', this, 'xAxisDidChange');
    this.addObserver('yAxis', this, 'yAxisDidChange');

    this.addObserver('dataConfiguration.xAttributeDescription.attribute.colormap',
        this, 'colorMapDidChange');
    this.addObserver('dataConfiguration.yAttributeDescription.attribute.colormap',
        this, 'colorMapDidChange');
  },
  
  /**
    Destruction method
   */
  destroy: function() {
    // Detach the axes
    this.removeObserver('xAxis', this, 'xAxisDidChange');
    this.removeObserver('yAxis', this, 'yAxisDidChange');
    this.removeObserver('dataConfiguration.xAttributeDescription.attribute.colormap',
        this, 'colorMapDidChange');
    this.removeObserver('dataConfiguration.yAttributeDescription.attribute.colormap',
        this, 'colorMapDidChange');
    // Detach the data Configuration
    this.removeObserver('dataConfiguration', this, 'dataConfigurationDidChange');

    // Destroy the adornment models
    DG.ObjectMap.forEach( this._adornmentModels,
                          function( iKey, iModel) {
                            if( iModel && iModel.destroy)
                              iModel.destroy();
                          });
    this._adornmentModels = null;

    sc_super();

    this.set('xAxis', null);
    this.set('yAxis', null);
    this.set('dataConfiguration', null);
  },
  
  _observedXAxis: null,
  _observedYAxis: null,
  
  /**
    Observer function triggered when the 'xAxis' property changes.
   */
  xAxisDidChange: function() {
    if( this._observedXAxis) {
      this._observedXAxis.removeObserver('lowerBound', this, 'axisBoundsDidChange');
      this._observedXAxis.removeObserver('upperBound', this, 'axisBoundsDidChange');
      this._observedXAxis = null;
    }
    
    var xAxis = this.get('xAxis');
    if( xAxis) {
      xAxis.addObserver('lowerBound', this, 'axisBoundsDidChange');
      xAxis.addObserver('upperBound', this, 'axisBoundsDidChange');
      this._observedXAxis = xAxis;
    }
  },

  /**
    Observer function triggered when the 'yAxis' property changes.
   */
  yAxisDidChange: function() {
    if( this._observedYAxis) {
      this._observedYAxis.removeObserver('lowerBound', this, 'axisBoundsDidChange');
      this._observedYAxis.removeObserver('upperBound', this, 'axisBoundsDidChange');
      this._observedYAxis = null;
    }
    
    var yAxis = this.get('yAxis');
    if( yAxis) {
      yAxis.addObserver('lowerBound', this, 'axisBoundsDidChange');
      yAxis.addObserver('upperBound', this, 'axisBoundsDidChange');
      this._observedYAxis = yAxis;
    }
  },

  /**
    @property { SC.Array } of SC.Array
  */
  dataArrays: function() {
    return this.getPath('dataConfiguration.arrangedObjectArrays');
  }.property('dataConfiguration'/*,'dataConfiguration.arrangedObjectArrays'*/),
  // Inexplicably, dependent key seems not to work here.
  // We use explicit observers instead.

  /**
    A view will typically observe this property. When it switches to true, the view should
    animate its elements to the currently computable coordinates, and, until the property
    switches back, it should suspend subsequent computation of coordinates for plotted
    elements.
    @property {Boolean}
  */
  isAnimating: false,
  
  /**
    Return the specified adornment model.
    @param    {String}    iAdornmentKey -- The key for the adornment, e.g. 'plottedValue'
    @returns  {DG.AdornmentModel} Returns the specified adornment model (or undefined).
   */
  getAdornmentModel: function( iAdornmentKey) {
    return iAdornmentKey && this._adornmentModels && this._adornmentModels[ iAdornmentKey];
  },
  
  /**
    Sets the specified adornment model.
    @param    {String}            iAdornmentKey -- The key for the adornment, e.g. 'plottedValue'
    @param    {DG.AdornmentModel} iAdornmentModel -- the specified adornment model
   */
  setAdornmentModel: function( iAdornmentKey, iAdornmentModel) {
    DG.assert( this._adornmentModels);
    DG.assert( iAdornmentKey);
    this._adornmentModels[ iAdornmentKey] = iAdornmentModel;
    this.notifyPropertyChange( iAdornmentKey);
  },
  
  /**
    Return whether the specified adornment is currently visible.
    @param    {String}    iAdornmentKey -- The key for the adornment, e.g. 'plottedValue'
    @returns  {Boolean}   True if the adornment is visible, false otherwise
   */
  isAdornmentVisible: function( iAdornmentKey) {
    var model = this.getAdornmentModel( iAdornmentKey);
    return model ? model.get('isVisible') : false;
  },
  
  /**
    Hides/shows the specified adornment.
    Constructs the adornment model if it doesn't already exist
    If the visibility changes, calls notifyPropertyChange( iAdornmentKey).
    @param    {String}    iAdornmentKey -- e.g. 'plottedValue', 'plottedFunction'
    @param    {Boolean}   iVisibility -- true to show, false to hide
    @return   {DG.PlotAdornmentModel}
   */
  setAdornmentVisibility: function( iAdornmentKey, iVisibility) {
    var model = this.getAdornmentModel( iAdornmentKey);
    if( !model) {
      var modelClass = DG.PlotAdornmentModel.registry[ iAdornmentKey];
      DG.assert( modelClass, "No model class registered for '%@'".fmt( iAdornmentKey));
      model = modelClass && modelClass.create({ plotModel: this, adornmentKey: iAdornmentKey });
      if( model)
        this.setAdornmentModel( iAdornmentKey, model);
    }
    if( model && (this.isAdornmentVisible( iAdornmentKey) !== iVisibility)) {
      model.set('isVisible', iVisibility);
      this.notifyPropertyChange( iAdornmentKey);
    }
    return model;
  },

  /**
    Toggle the visibility of the specified adornment.
    Will create the adornment the first time it's shown.
    @param    {String}    iAdornmentKey -- e.g. 'plottedValue', 'plottedFunction'
    @param    {String}    iToggleLogString -- Name of action logged to server
    @returns  {DG.PlotAdornmentModel}   The specified adornment model
  */
  toggleAdornmentVisibility: function( iAdornmentKey, iToggleLogString) {
    DG.assert( !SC.empty( iAdornmentKey));
    var adornmentModel = this.getAdornmentModel( iAdornmentKey ),
        tIsVisible = adornmentModel && adornmentModel.get('isVisible');
    return this.setAdornmentVisibility( iAdornmentKey, !tIsVisible);
  },

  /**
    @property {DG.AxisModel}
  */
  getAxisForPlace: function( iPlace) {
    switch(iPlace) {
      case DG.GraphTypes.EPlace.eX:
        return this.get('xAxis');
      case DG.GraphTypes.EPlace.eY:
        return this.get('yAxis');
      case DG.GraphTypes.EPlace.eY2:
        return this.get('y2Axis');
      default:
        return null;
    }
  },

  /**
    Subclasses may override
    Called when attribute configuration changes occur, for instance.
  */
  invalidateCaches: function() {
    this.notifyPropertyChange('plotConfiguration');
  },

  /**
    Subclasses may override
  */
  handleDataConfigurationChange: function() {
  },

  /**
    Subclasses may override
  */
  rescaleAxesFromData: function( iAllowScaleShrinkage, iAnimatePoints, iLogIt) {
  },

  invalidateAggregateAdornments: function() {
    // TODO: use more robust ID
    var id = DG.Debug.scObjectID(this),
        depMgr = this.getPath('dataConfiguration.dataContext.dependencyMgr');
    if (depMgr)
      depMgr.invalidateDependentsOf([{ type: DG.DEP_TYPE_PLOT, id: id, name: 'plot-' + id }]);
  },

  /**
    Observer function triggered when the visible bounds of the axes are changed.
   */
  axisBoundsDidChange: function() {
    this.notifyPropertyChange('axisBounds');
  },

  /**
   * For selected cases, the values given by the array of attribute IDs will be animated by the amounts
   * specified in the array of deltas.
   * @param iAttrIDs {[Number]}
   * @param iDeltas {[Number]}
   * @param iDisableAnimation {Boolean} Default is false
   */
  animateSelectionBackToStart: function( iAttrIDs, iDeltas, iDisableAnimation) {
    if( SC.none( this.caseValueAnimator))
      this.caseValueAnimator = DG.CaseValueAnimator.create();
    else  // We must end the animation before setting animator properties
      this.caseValueAnimator.endAnimation();

    this.caseValueAnimator.set( 'dataContext', this.get('dataContext'));
    this.caseValueAnimator.set( 'cases', DG.copy( this.get('selection')));
    this.caseValueAnimator.set( 'attributeIDs', iAttrIDs);
    this.caseValueAnimator.set( 'deltas', iDeltas);
    this.caseValueAnimator.set( 'disableAnimation', iDisableAnimation);

    this.caseValueAnimator.animate();
  },

  checkboxDescriptions: function() {
    var this_ = this,
        tXHasCells = this.get('xAxis').numberOfCells() > 1,
        tYHasCells = this.get('yAxis').numberOfCells() > 1,
        tPlotWantsPercents = this.get('wantsPercentCheckbox'),
        tDescriptions = [
      {
        title: 'DG.Inspector.graphCount',
        value: this_.shouldPlottedCountBeChecked('Count'),
        classNames: 'graph-count-check'.w(),
        valueDidChange: function () {
          this_.togglePlottedCount('Count');
        }.observes('value')
      }
    ];
    if( tPlotWantsPercents || tXHasCells || tYHasCells) {
      tDescriptions.push( {
        title: 'DG.Inspector.graphPercent',
        value: this_.shouldPlottedCountBeChecked('Percent'),
        classNames: 'graph-percent-check'.w(),
        handlingMovableValueChange: false,
        valueDidChange: function () {
          if( !this.handlingMovableValueChange)
            this_.togglePlottedCount('Percent');
        }.observes('value'),
        init: function() {
          sc_super();
          this_.addObserver('movableValueChange', this, 'handleMovableValueChange');
        },
        destroy: function() {
          this_.removeObserver('movableValueChange', this, 'handleMovableValueChange');
          sc_super();
        },
        handleMovableValueChange: function() {
          this.handlingMovableValueChange = true;
          this.set('value', this_.shouldPlottedCountBeChecked('Percent'));
          this.set('isEnabled', this_.get('wantsPercentCheckbox'))
          this.handlingMovableValueChange = false;
        }
      });
    }
    return tDescriptions;
  }.property(),

  lastValueControls: function() {
    return [];
  }.property(),

  /**
    Call the given function once for each case that has a value for each axis.
    Given function should have the signature (iCase, iCaseIndex)
  */
  forEachCaseDo: function( iDoF) {
    var tCases = this.get('cases');
    if( !SC.none( tCases))
      tCases.forEach( iDoF);
  },
  
  /**
    Returns an array of collection IDs corresponding to the collections that
    are currently being plotted by the graph.
    @returns  {Array of {Number}}
   */
  getPlottedCollectionIDs: function() {
    return this.getPath('dataConfiguration.plottedCollectionIDs') || [];
  },

  /**
    Returns an array of attribute IDs corresponding to the attributes that
    are currently being plotted by the graph.
    @returns  {Array of {Number}}
   */
  getPlottedAttributeIDs: function() {
    var plottedAttributeIDs = [],
        dataConfiguration = this.get('dataConfiguration'),
        properties = ['xAttributeID', 'yAttributeID', 'legendAttributeID'];
    if( !dataConfiguration) return plottedAttributeIDs;
    properties.forEach( function( iProperty) {
                          var attrID = dataConfiguration.get( iProperty);
                          if( !SC.none( attrID) && (attrID !== DG.Analysis.kNullAttribute)) {
                            if( plottedAttributeIDs.indexOf( attrID) < 0)
                              plottedAttributeIDs.push( attrID);
                          }
                        });
    return plottedAttributeIDs;
  },
  
  getPlottedAttributesIncludeIDs: function( iAttributeIDs) {
    var plottedAttrIDs = this.getPlottedAttributeIDs(),
        includes = false;
    iAttributeIDs.forEach( function( iAttributeID) {
                              if( plottedAttrIDs.indexOf( iAttributeID) >= 0)
                                 includes = true;
                           });
    return includes;
  },
  
  /**
    Returns true if any of the plotted attributes contain formulas, false otherwise.
    @returns  {Boolean}
   */
  getPlottedAttributesContainFormulas: function() {
    var tDataConfiguration = this.get('dataConfiguration');
    return tDataConfiguration && tDataConfiguration.atLeastOneFormula();
  },
  
  /**
    Returns true if the plot is affected by the specified change such that 
    a redraw is required, false otherwise. Used to avoid redrawing when
    attribute values that aren't being plotted are changed, for instance.
    @param    {Object}    iChange -- The change request to/from the DataContext
    @returns  {Boolean}   True if the plot must redraw, false if it is unaffected
   */
  isAffectedByChange: function( iChange) {
    var isAffected = false;
    if( !iChange || !iChange.operation) return false;
    switch( iChange.operation) {
      case 'dependentCases':
        var i, change, changeCount = (iChange.changes && iChange.changes.length) || 0;
        for (i = 0; i < changeCount; ++i) {
          change = iChange.changes[i];
          if (change.attributeIDs && this.getPlottedAttributesIncludeIDs(change.attributeIDs))
            return true;
        }
        return false;
      case 'updateCases':
        // only if the attributes involved are being plotted OR
        // if there are formulas such that the plotted attributes
        // are affected indirectly.
        var changedAttrIDs = iChange.attributeIDs;
        // If no attributes are listed, then assume all are affected
        if( changedAttrIDs) {
          // identify all of the attributes that are being plotted
          return this.getPlottedAttributesIncludeIDs( changedAttrIDs);
        }
        /* jshint -W086 */  // Expected a 'break' statement before 'case'. (W086)
        // fall through intentional -- w/o attribute IDs, rely on collection
      case 'createCase':
      case 'createCases':
        // Only if the case(s) created are in a collection that is being plotted
        var changedCollectionID = iChange.collection && iChange.collection.get('id'),
            plottedCollectionIDs = this.getPlottedCollectionIDs();
        return !changedCollectionID || (plottedCollectionIDs.indexOf( changedCollectionID) >= 0);
      case 'deleteCases':
      case 'selectCases':
        // We could do a collection test if that information were reliably
        // available in the change request, but that's not currently so.
        return true;
      case 'createAttributes':
      case 'updateAttributes':
        // only if there are formulas such that the plotted attributes
        // are affected indirectly, e.g. a formula written to reference
        // the about-to-be-created attributes.
        if( iChange.result && iChange.result.attrIDs)
          isAffected = this.getPlottedAttributesIncludeIDs( iChange.result.attrIDs);
        return isAffected || this.getPlottedAttributesContainFormulas();
    }
    return true;
  },
  
  /**
    Responder for DataContext notifications. The PlotModel does not
    receive DataContext notifications directly, however. Instead, it
    receives them from the GraphModel, which receives them directly
    from the DataContext.
   */
  handleDataContextNotification: function( iNotifier, iChange) {
    // Currently, much of the handling is in the PlotViews.
    // Some of it would fit better in the model, but for now we
    // leave things the way they are and simply make the change
    // available for the PlotViews to respond to.
    this.set('lastChange', iChange);
  },

  _observedDataConfiguration: null,

  /**
    Responder method for dataConfiguration changes.
   */
  dataConfigurationDidChange: function( iSource, iKey) {
    if( this._observedDataConfiguration && (iKey === 'dataConfiguration')) {
      this._observedDataConfiguration.removeObserver('cases', this, 'dataConfigurationDidChange');
      this._observedDataConfiguration.removeObserver('attributeAssignment', this, 'dataConfigurationDidChange');
      this._observedDataConfiguration.removeObserver('arrangedObjectArrays', this, 'sourceArraysDidChange');
      this._observedDataConfiguration = null;
    }
    
    var dataConfiguration = this.get('dataConfiguration');
    if( dataConfiguration) {
      this.invalidateCaches();
      this.handleDataConfigurationChange();

      if( iKey === 'dataConfiguration') {
        dataConfiguration.addObserver('cases', this, 'dataConfigurationDidChange');
        dataConfiguration.addObserver('attributeAssignment', this, 'dataConfigurationDidChange');
        dataConfiguration.addObserver('arrangedObjectArrays', this, 'sourceArraysDidChange');
        this._observedDataConfiguration = dataConfiguration;
      }
    }
  },

  /**
    Observer function triggered when the underlying arrays are changed.
   */
  sourceArraysDidChange: function( iSource, iKey) {
    this.invalidateCaches();
    this.notifyPropertyChange('dataArrays');
  },

  colorMapDidChange: function() {
    this.invalidateCaches();
  },

  /**
    @param {Number} The index of the case to be selected.
    @param {Boolean} Should the current selection be extended?
  */
  selectCaseByIndex: function( iIndex, iExtend) {
    var tCases = this.get('cases'),
        tCase = tCases[ iIndex],
        tSelection = this.get('selection'),
        tChange = {
          operation: 'selectCases',
          collection: this.get('collectionClient'),
          cases: [ tCase ],
          select: true,
          extend: iExtend
        };
    
    if( tSelection.get('length') !== 0) {
      if( tSelection.contains( tCase)) {  // Case is already selected
        if( iExtend) {
          tChange.select = false;
        }
        // clicking on a selected case leaves it selected
        else return;
      }
      else {
        tChange.select = true;
      }
    }
    
    this.get('dataContext').applyChange( tChange);
    if( tChange.select)
      DG.logUser("caseSelected: %@", iIndex);
    else
      DG.logUser("caseDeselected: %@", iIndex);
  },

  /**
   * If I have an animation, end it.
   */
  stopAnimation: function() {
    var tPlotAnimator = this.get('plotAnimator'),
        tCaseValueAnimator = this.get('caseValueAnimator');
    if( !SC.none( tPlotAnimator))
      tPlotAnimator.endAnimation();
    if( !SC.none( tCaseValueAnimator))
      tCaseValueAnimator.endAnimation();
  },

  /**
   * Create the model data to save with document.
   * Derived plot models will add to this storage.
   * @return {Object} the saved data.
   */
  createStorage: function() {
    var tStorage = { verticalAxisIsY2: this.get('verticalAxisIsY2')};
    
    // Store any adornment models
    if( DG.ObjectMap.length( this._adornmentModels) > 0) {
      tStorage.adornments = {};
      DG.ObjectMap.forEach( this._adornmentModels,
                            function( iAdornmentKey, iAdornmentModel) {
                              var adornmentStorage = iAdornmentModel.createStorage &&
                                                      iAdornmentModel.createStorage();
                              if( DG.ObjectMap.length( adornmentStorage))
                                tStorage.adornments[ iAdornmentKey] = adornmentStorage;
                            });
    }
    return tStorage;
  },
  
  /**
    Utility function for simplified support of adornments in legacy documents.
    Used to move adornment storage objects down into the plot model's 'adornments'
    section, where it can be handled generically by PlotModel's restoreStorage().
    @param    {Object}    iModelStorage -- Storage object passed to plot's restoreStorage()
    @param    {String}    iAdornmentKey -- e.g. 'plottedValue', 'plottedFunction'
    @param    {Object}    iAdornmentStorage -- Storage object for adornment's restoreStorage()
   */
  moveAdornmentStorage: function( iModelStorage, iAdornmentKey, iAdornmentStorage) {
    if( iAdornmentStorage) {
      if( !iModelStorage.adornments) iModelStorage.adornments = {};
      iModelStorage.adornments[ iAdornmentKey] = iAdornmentStorage;
    }
  },

  /**
   * Restore our model after opening document.
   * Derived plot models will also restore plot-specific parameters
   * @param iStorage
   */
  restoreStorage: function( iStorage) {
    // I have my axes, but until now I can't take care of changing my yAxis to the y2Axis
    this.verticalAxisIsY2 = iStorage.verticalAxisIsY2;
    if( this.verticalAxisIsY2) {
      this.set('yAxis', this.get('y2Axis'));
    }

    // Restore any adornment models
    DG.ObjectMap.forEach( iStorage.adornments,
                          function( iAdornmentKey, iAdornmentStorage) {
                            var modelClass = DG.PlotAdornmentModel.registry[ iAdornmentKey],
                                adornmentModel = modelClass && modelClass.create({ plotModel: this });
                            if( adornmentModel) {
                              adornmentModel.restoreStorage( iAdornmentStorage);
                              this.setAdornmentModel( iAdornmentKey, adornmentModel);
                              // TODO: Get rid of this next line
                              this.set( iAdornmentKey, adornmentModel);
                            }
                          }.bind( this));
  },

  /**
   * Create a copy of adornment models to be transferred to a new plot type.
   * We *don't* change the new plot model, but instead return an array of new properties,
   * so that the caller can control when the new plot model is changed, for example
   * inside a beginPropertyChanges()...endPropertyChanges() set.
   * @param {Object} iNewPlotModel
   * @returns {Object} array of properties to use for new model.
   */
  copyAdornmentModels: function( iNewPlotModel ) {
    DG.assert( (typeof iNewPlotModel === "object") && (iNewPlotModel instanceof DG.PlotModel));
    var tAdornmentModels = {},
        tPlottedCount = this.get('plottedCount');

    if( tPlottedCount) {  // copy plottedCount for all PlotModel types
      tAdornmentModels.plottedCount = tPlottedCount;
      tPlottedCount.set('plotModel', iNewPlotModel);
    }

    return tAdornmentModels;
  },

  /**
   * Get an array of non-missing case counts in each axis cell.
   * Also cell index on primary and secondary axis, with primary axis as major axis.
   * @return {Array} [{count, primaryCell, secondaryCell},...] (all values are integers 0+).
   */
  getCellCaseCounts: function() {
    DG.assert( false, "derived classes must override getCellCaseCounts()");
    return [];
  }

});

/**
  class (static) method called before plot creation to make sure roles are correct
  @param {DG.GraphDataConfiguration}
*/
DG.PlotModel.configureRoles = function( iConfig) {

};
