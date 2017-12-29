sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/resource/ResourceModel',
    'sap/ui/base/Object'
], function (jQuery, ResourceModel, Object) {
    "use strict";

    var ResConfigManager = Object.extend("effstd.utils.ResConfigManager", {
        _localeResource: null,
        _resourceBundle: null,
        _colorProperties: null,
        _sLocale: sap.ui.getCore().getConfiguration().getLanguage(),
        getLocale: function () {

            if (this._localeResource === null) {

                this._localeResource = new ResourceModel({
                    bundleUrl: "locales/locale.properties",
                    bundleLocale: this._sLocale
                });

            }

            return this._localeResource;

        },
        getResourceBundle: function () {

            if (this._resourceBundle === null) {

                this._resourceBundle = jQuery.sap.resources({
                    url: "locales/locale.properties",
                    locale: this._sLocale
                });

            }

            return this._resourceBundle;

        },
        getConfColors: function () {

            if (this._colorProperties === null) {
                this._colorProperties = jQuery.sap.properties({url: "locales/colors.properties"});
            }

            return this._colorProperties;

        }

    });

    return ResConfigManager;

});
