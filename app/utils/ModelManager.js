sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/base/Object'
], function (jQuery, JSONModel, Object) {
    "use strict";

    var instance = null;

    var ModelManager = Object.extend("effstd.utils.ModelManager", {
        NAMES: {
            info: "info",
            plant: "plant"
        },
        _myModels: {},
        createNewInfoModel: function () {

            this._myModels[this.NAMES.info] = new JSONModel(
                    {
                        "user": {"name": "", "id": "", "handle": ""}
                    }
            );

            this._myModels[this.NAMES.plant] = new JSONModel({info: {}, presses: []});

        },
        getModel: function (modelName) {

            return this._myModels[modelName];

        },
        assignModelToView: function (view, obj, modelName) {

            if (undefined === modelName || null === modelName) {
                if (view.getModel() === undefined || null === view.getModel()) {
                    view.setModel(new JSONModel(obj));
                } else {
                    view.getModel().setData(obj);
                }
                view.getModel().refresh(true);
            } else {
                if (view.getModel(modelName) === undefined || null === view.getModel(modelName)) {
                    view.setModel(new JSONModel(obj), modelName);
                } else {
                    view.getModel(modelName).setData(obj);
                }
                view.getModel(modelName).refresh(true);
            }
        },
        __mainComponent: null,
        constructor: function () {
            if (instance !== null) {
                throw new Error("Cannot instantiate more than one ModelManager, use ModelManager.getInstance()");
            }
        },
        __initialize: function (mainComponent) {

            this.__mainComponent = mainComponent;
            this.createNewInfoModel();
        }
    });

    ModelManager.getInstance = function () {

        if (instance === null) {
            instance = new ModelManager();
        }
        return instance;
    };

    return ModelManager.getInstance();

}, /* bExport= */ true);
