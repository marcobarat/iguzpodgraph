sap.ui.define([
    'jquery.sap.global',
    'sap/m/Button',
    'sap/ui/core/Control'
], function (jQuery, Button, Control) {
    "use strict";

    var PodButton = Button.extend("effstd.component.PodButton", {
        __iconObj: null,
        metadata: {
            properties: {
                "height": {
                    type: "sap.ui.core.CSSSize", defaultValue: null
                },
                "iconSize": {
                    type: "sap.ui.core.CSSSize", defaultValue: "1.8rem"
                },
                "fontSize": {
                    type: "sap.ui.core.CSSSize", defaultValue: null
                },
                "backgroundColor": {
                    type: "string", defaultValue: "#DEDEDE"
                },
                "backgroundImage": {
                    type: "string", defaultValue: null
                },
                "iconImg": {
                    type: "string", defaultValue: null
                },
                "color": {
                    type: "string", defaultValue: "black"
                },
                "sizeType": {
                    type: "string", defaultValue: "normal"
                },
                "fontWeight": {
                    type: "string", defaultValue: "normal"
                },
                "imgAreaSize": {
                    type: "sap.ui.core.CSSSize", defaultValue: null
                }
            }
        },
        renderer: function (oRm, oControl) {

            if (oControl.__iconObj === null && oControl.getIcon()) {
                oControl.__iconObj = new sap.ui.core.Icon();
                oControl.__iconObj.setSrc(oControl.getIcon());
            }

            if (oControl.__iconObj === null && oControl.getIconImg()) {
                oControl.__iconObj = new sap.m.Image();
                oControl.__iconObj.setSrc(oControl.getIconImg());
            }

            var enabled = oControl.getEnabled();
            oRm.write("<div");
            if (enabled === false) {
                oRm.addStyle("pointer-events", "none");
            }
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            if (oControl.getHeight() && oControl.getHeight() !== null) {
                oRm.addStyle("height", oControl.getHeight());
                oRm.addStyle("line-height", oControl.getHeight());
            }
            if (oControl.getFontWeight() && oControl.getFontWeight() !== null) {
                oRm.addStyle("font-weight", oControl.getFontWeight());
            }
            if (oControl.getBackgroundColor() && null !== oControl.getBackgroundColor()) {
                if (enabled === true) {
                    oRm.addStyle("background-color", oControl.getBackgroundColor());
                } else {
                    oRm.addStyle("background-color", "transparent");
                }
            }
            if (oControl.getBackgroundImage() && null !== oControl.getBackgroundImage()) {
                oRm.addStyle("background-image", "url(" + oControl.getBackgroundImage() + ")");
            }
            if (oControl.getColor() && null !== oControl.getColor()) {
                if (enabled === true) {
                    oRm.addStyle("color", oControl.getColor());
                } else {
                    oRm.addStyle("color", "lightgrey");
                }
            }
            if (oControl.getSizeType() && oControl.getSizeType() !== null) {
                if ("big" === oControl.getSizeType()) {
                    oRm.addStyle("margin", "0.4rem");
                    oRm.addStyle("padding", "0.7rem 0.7rem 0.7rem 0.7rem");
                } else if ("normal" === oControl.getSizeType()) {
                    oRm.addStyle("margin", "0.3rem");
                    oRm.addStyle("padding", "0.5rem 0.5rem 0.5rem 0.5rem");
                } else if ("compact" === oControl.getSizeType()) {
                    oRm.addStyle("margin", "0.1rem");
                    oRm.addStyle("padding", "0.5rem 0.5rem 0.5rem 0.5rem");
                } else {
                    oRm.addStyle("margin", "0.3rem");
                    oRm.addStyle("padding", "0.5rem 0.5rem 0.5rem 0.5rem");
                }
            }
            oRm.writeStyles();
            oRm.addClass("materialButton");
            oRm.writeClasses();
            oRm.write(">");

            if (oControl.getText() && "" !== oControl.getText()) {
                oRm.write("<span");

                oRm.writeAttribute("unselectable", "on");
                oRm.writeAttribute("onselectstart", "return false;");
                oRm.writeAttribute("onmousedown", "return false;");

                oRm.addStyle("display", "inline-block");
                oRm.addStyle("vertical-align", "middle");
                oRm.addStyle("line-height", "normal");
                oRm.addStyle("-moz-user-select", "none");
                oRm.addStyle("-webkit-user-select", "none");
                oRm.addStyle("-ms-user-select", "none");
                oRm.addStyle("user-select", "none");
                oRm.addStyle("-o-user-select", "none");
                oRm.addStyle("cursor", "default");
                if (oControl.getFontSize() && null !== oControl.getFontSize()) {
                    oRm.addStyle("font-size", oControl.getFontSize());
                }
                oRm.writeStyles();
                oRm.write(">");
                oRm.write(oControl.getText());
                oRm.write("</span>");
            }

            if (oControl.__iconObj !== null && oControl.getIcon()) {

                oRm.write("<div");
                oRm.addStyle("width", "100%");
                oRm.addStyle("height", "100%");
                if (oControl.getIconSize() && null !== oControl.getIconSize()) {
                    oRm.addStyle("font-size", oControl.getIconSize());
                    oControl.__iconObj.setSize(oControl.getIconSize());
                }
                oRm.writeStyles();
                oRm.write(">");
                oRm.renderControl(oControl.__iconObj);
                oRm.write("</div>");
            } else if (null !== oControl.getIconImg()) {

                oRm.write("<div");
                oRm.addStyle("width", "100%");
                oRm.addStyle("height", "100%");
                if (oControl.getImgAreaSize() && null !== oControl.getImgAreaSize()) {
                    oRm.addStyle("font-size", oControl.getImgAreaSize());
                    oControl.__iconObj.setWidth(oControl.getIconSize());
                }
                oRm.writeStyles();
                oRm.write(">");
                oRm.renderControl(oControl.__iconObj);
                oRm.write("</div>");
            }

            oRm.write("</div>");
        },
        onAfterRendering: function () {
            var that = this;
            jQuery.sap.byId(this.getId()).on("click", function (e) {
                e.stopPropagation();
            });
            jQuery.sap.byId(this.getId()).on("mouseup", jQuery.proxy(this.handleClick, this));
            jQuery.sap.byId(this.getId()).on("mousedown", function (e) {
                e.stopPropagation();
                var target = e.target;
                if (that.getId() !== target.id) {
                    target = target.parentElement;
                    if (that.getId() !== target.id) {
                        target = target.parentElement;
                    }
                }
                var rect = target.getBoundingClientRect();
                var ripple = target.querySelector('.materialRipple');
                jQuery(ripple).remove();
                ripple = document.createElement('span');
                ripple.className = 'materialRipple';
                ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
                target.appendChild(ripple);
                var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
                var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
                ripple.style.top = top + 'px';
                ripple.style.left = left + 'px';

                return false;
            });
        },
        handleClick: function (event) {
            event.stopPropagation();
            this.fireEvent("press");
        }
    });

    return PodButton;
});
