sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/base/Object'
], function (jQuery, JSONModel, Object) {
    "use strict";

    var instance = null;

    var EventManager = Object.extend("effstd.utils.EventManager", {
        __mainComponent: null,
        openDialogListeners: [],
        closeDialogListeners: [],
        constructor: function () {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one ModelManager, use EventManager.getInstance()");
            }
        },
        __initialize: function (mainComponent) {

            this.__mainComponent = mainComponent;

        },
        openDialog: function (dialog) {
            for (var i in this.openDialogListeners) {
                this.openDialogListeners[i].call();
            }
        },
        closeDialog: function (dialog) {
            for (var i in this.closeDialogListeners) {
                this.closeDialogListeners[i].call();
            }
        }

    });

    EventManager.getInstance = function () {

        if (instance === null) {
            instance = new EventManager();
        }
        return instance;
    };

    return EventManager.getInstance();

}, /* bExport= */ true);
