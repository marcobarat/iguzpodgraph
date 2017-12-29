sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Control'
], function (jQuery, JSONModel, Control) {
    "use strict";

    var clockStrMinTemp = "<span id=\"hours\" class=\"hour\">${hours}</span>:<span id=\"minutes\" class=\"minute\">${minutes}</span>";
    var clockStrSecTemp = "<span id=\"hours\" class=\"hour\">${hours}</span>:<span id=\"minutes\" class=\"minute\">${minutes}</span>:<span id=\"seconds\" class=\"second\">${seconds}</span>";

    var Timer = Control.extend("effstd.component.Timer", {
        model: new JSONModel({timeStr: "00:00:00", dateStr: "01/12/1970"}),
        date: null,
        metadata: {
            properties: {
                "height": {
                    type: "sap.ui.core.CSSSize"
                },
                "width": {
                    type: "sap.ui.core.CSSSize"
                },
                "showSeconds": {
                    type: "boolean", defaultValue: false
                },
                "hours": {
                    type: "string", defaultValue: "00"
                },
                "minutes": {
                    type: "string", defaultValue: "00"
                },
                "seconds": {
                    type: "string", defaultValue: "00"
                },
                "showDate": {
                    type: "boolean", defaultValue: false
                },
                "formatDate": {
                    type: "string", defaultValue: "{day}/{month}/{year}"
                }
            }
        },
        renderer: function (oRm, oControl) {

            if (!oControl.getModel()) {
                oControl.setModel(oControl.model);
            }

            oRm.write("<div class=\"customClock1\"");
            oRm.writeControlData(oControl);
            oRm.write(">");

            var clockStrSec = clockStrSecTemp;
            var clockStrMin = clockStrMinTemp;

            if (oControl.getShowSeconds() === true) {
                clockStrSec = clockStrSec.replace("${hours}", oControl.getHours());
                clockStrSec = clockStrSec.replace("${minutes}", oControl.getMinutes());
                clockStrSec = clockStrSec.replace("${seconds}", oControl.getSeconds());
                oRm.write(clockStrSec);
            } else {
                clockStrMin = clockStrMin.replace("${hours}", oControl.getHours());
                clockStrMin = clockStrMin.replace("${minutes}", oControl.getMinutes());
                oRm.write(clockStrMin);
            }

            if (oControl.getShowDate() === true) {
                oRm.write("<div class=\"customClockDate1\">");

                var dateObj = new Date();
                var month = dateObj.getMonth() + 1; //months from 1-12
                var day = dateObj.getDate();
                var year = dateObj.getFullYear();

                var dstr = oControl.getFormatDate().replace("{day}", day).replace("{month}", month).replace("{year}", year);
                oRm.write(dstr);

                oRm.write("</div>");
            }

            oRm.write("</div>");
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
        },
        onAfterRendering: function () {

            this.setModel(this.model);

            if (!this.timeout) {
                if (this.getShowSeconds() === true) {
                    this.timeout = setInterval(jQuery.proxy(this.startTimer, this), 500);
                } else {
                    this.startTimer();
                    this.timeout = setInterval(jQuery.proxy(this.startTimer, this), 20000);
                }
            }

        },
        startTimer: function () {

            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            h = this.formatTime(h);
            m = this.formatTime(m);
            s = this.formatTime(s);

            this.setHours(h);
            this.setMinutes(m);
            this.setSeconds(s);

            jQuery.sap.byId(this.getId()).find("#hours").text(h);
            jQuery.sap.byId(this.getId()).find("#minutes").text(m);
            jQuery.sap.byId(this.getId()).find("#seconds").text(s);

        },
        formatTime: function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    });

    return Timer;
});
