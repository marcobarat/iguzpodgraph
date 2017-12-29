sap.ui.define(['jquery.sap.global', 'effstd/utils/ModelManager', 'effstd/utils/EventManager', 'sap/ui/core/mvc/Controller'
], function (jQuery, ModelManager, EventManager, Controller) {
    "use strict";

    return Controller.extend("effstd.controller.App", {
        onInit: function () {

            if (!String.prototype.startsWith) {
                String.prototype.startsWith = function (searchString, position) {
                    position = position || 0;
                    return this.substr(position, searchString.length) === searchString;
                };
            }

            ModelManager.__initialize(this.getOwnerComponent());

            var params = {
                "Service": "Admin",
                "Mode": "UserAttribList",
                "content-Type": "text/xml"
            };

            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/handle", "UserBO:8800,VJTZU15");
                ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/name", "VJTZU15");
                ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/id", "VJTZU15");
                window.site = "8800";
            } else {

                try {
                    var req = jQuery.ajax({
                        url: "/XMII/Illuminator",
                        dataType: "xml",
                        data: params,
                        method: "GET",
                        async: false
                    });
                    req.done(function (data, reponse) {
                        var site = jQuery(data).find("DEFAULT_SITE").text();
                        window.site = site;

                        var fullname = jQuery(data).find("FullName").text();
                        var userId = jQuery(data).find("User").text();
                        var userHandle = "UserBO:" + site + "," + userId;

                        ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/handle", userHandle);
                        ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/name", fullname);
                        ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/id", userId);

                    });
                    req.fail(function (error) {

                        ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/handle", "TMP");
                        ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/name", "TMP");
                        ModelManager.getModel(ModelManager.NAMES.info).setProperty("/user/id", "TMP");

                    });
                } catch (err) {
                    jQuery.sap.log.debug(err.stack);
                }
            }

        },
        onAfterRendering: function () {

        }
    });

}, /* bExport= */ true);
