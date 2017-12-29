sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/Control'
], function (jQuery, Control) {
    "use strict";

    var EmbedComponent = Control.extend("effstd.component.Embed", {
        metadata: {
            properties: {
                "id": {type: "string"},
                "src": {type: "string"},
                "type": {type: "string"},
                "height": {
                    type: "sap.ui.core.CSSSize", defaultValue: "100px"
                },
                "width": {
                    type: "sap.ui.core.CSSSize", defaultValue: "100px"
                }
            }
        },
        renderer: function (oRm, oControl) {
//            oRm.write("<div>");
            oRm.write("<embed");
            oRm.writeControlData(oControl);
            oRm.write("src=" + "'" + oControl.getSrc() + "'");
            oRm.write("type=" + "'" + oControl.getType() + "'");
//            oRm.write("src=" + "'" + oControl.getSrc() + "'");
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeStyles();
            oRm.addClass("customEmbedComp");
            oRm.writeClasses();
            oRm.write("/>");
//            oRm.write("</div>");

        },
        onAfterRendering: function () {

        }
    });

    return EmbedComponent;
});
