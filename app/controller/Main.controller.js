sap.ui.define([
    'jquery.sap.global',
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'effstd/utils/ResConfigManager',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History',
    'effstd/utils/ModelManager',
    'sap/ui/core/mvc/Controller'
], function (jQuery, Filter, JSONModel, ResConfigManager, MessageBox, MessageToast, History, ModelManager, Controller) {
    "use strict";

    var MainController = Controller.extend("effstd.controller.Main", {
        resConfigManager: new ResConfigManager(),
        svgChart: null,
        timer: null,
        sfc: null,
        wc: null,
        res: null,
        gingo: new JSONModel({shift: "", datetime: ""}),
        onInit: function () {

            var model = ModelManager.getModel(ModelManager.NAMES.info);
            this.info = model;
            this.getView().setModel(model, "info");

            this.getView().setModel(this.gingo, "gingo");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("main").attachPatternMatched(this.exit, this);

            this.wc = jQuery.sap.getUriParameters().get("WORKCENTER");
            this.res = jQuery.sap.getUriParameters().get("RESOURCE");

            var retrieveResFromServer = false;

            retrieveResFromServer = (this.res && null !== this.res && "" !== this.res) === false;

            if (true === retrieveResFromServer) {
                this.getSfc();
            }

        },
        onAfterRendering: function () {

            this.search();

            this.timer = setInterval(jQuery.proxy(this.search, this), 30 * 1000);

        },
        exit: function () {

            clearInterval(this.timer);
            this.timer = null;

        },
        search: function (event) {
            clearInterval(this.timer);
            this.timer = null;
            this.getData(this.sfc, this.res);

        },
        createChart: function (obj) {
            var time1 = [];
            var qta1 = [];
            time1.push("t1");
            qta1.push("Standard");

            var qta2 = [];
            qta2.push("Effettivo");

            var i = 0;
            for (var time, cobj, len = obj.length; i < len; i++) {
                cobj = obj[i];
                time = new Date(cobj.HOUR + ".000Z").getTime();
                time1.push(Math.round(time / 1000));
                qta1.push(cobj.STANDARD);
                qta2.push(cobj.EFFECTIVE);
            }

            var shift = obj[0].SHIFT;
            this.gingo.setProperty("/shift", shift);


            this.getChart(time1, qta1, qta2, shift);
        },
        _onObjectMatched: function (event) {

        },
        getData: function (sfc, res) {

            try {
                var datetime = this.getFormattedTime();
                this.gingo.setProperty("/datetime", datetime);
            } catch (err) {
                jQuery.sap.log.error(err);
            }


            var site = window.site;

            var that = this;
            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getData.xml",
                    success: function (data, response) {
                        that.getDataSuccess(data, response);
                    },
                    async: true
                });
                return;
            }

            var transactionName = "GET_STANDARD_AND_EFFECTIVE_QTY_BY_RESOURCE";
            var transactionCall = site + "/" + "TRANSACTION" + "/" + transactionName;
            var userId = this.info.getProperty("/user/id");
            var params = {
                "TRANSACTION": transactionCall,
                "SITE": site,
                "RESOURCE": res,
                "SFC": sfc,
                "user_id": userId,
                "OutputParameter": "JSON"
            };
            try {
                var req = jQuery.ajax({
                    url: "/XMII/Runner",
                    data: params,
                    method: "POST",
                    dataType: "xml",
                    async: true
                });
                req.done(jQuery.proxy(that.getDataSuccess, that));
                req.fail(jQuery.proxy(that.getDataError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getDataSuccess: function (data, response) {

            try {
                sap.ui.core.BusyIndicator.hide();
                var jsonObjStr = jQuery(data).find("Row").text();
                var jsonObj = JSON.parse(jsonObjStr.trim());
                if (jsonObj.lenth && jsonObj.lenth === 0) {
                    jQuery.sap.log.error("cannot retrieve resource and sfc");
                }
                this.adjustLocations(jsonObj);

                this.createChart(jsonObj);
            } catch (err) {
                jQuery.sap.log.error(err);
            } finally {
                if (this.timer && this.timer !== null) {
                    clearInterval(this.timer);
                }
                this.timer = setInterval(jQuery.proxy(this.search, this), 30 * 1000);
            }

        },
        getDataError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        getSfc: function () {

            var site = window.site;

            var that = this;
            if (jQuery.sap.getUriParameters().get("localMode") === "true") {
                jQuery.ajax({
                    dataType: "xml",
                    url: "model/getSfc.xml",
                    success: function (data, response) {
                        that.getSfcSuccess(data, response);
                    },
                    async: true
                });
                return;
            }

            var transactionName = "GET_ZME_PARAMETERS_FROM_POD";
            var transactionCall = site + "/" + "TRANSACTION" + "/" + transactionName;
            var userId = this.info.getProperty("/user/id");
            var params = {
                "TRANSACTION": transactionCall,
                "SITE": site,
                "MII_APPL": "EFFSTD",
                "user_id": userId,
                "OutputParameter": "JSON"
            };
            try {
                var req = jQuery.ajax({
                    url: "/XMII/Runner",
                    data: params,
                    method: "POST",
                    dataType: "xml",
                    async: false
                });
                req.done(jQuery.proxy(that.getSfcSuccess, that));
                req.fail(jQuery.proxy(that.getSfcError, that));
            } catch (err) {
                jQuery.sap.log.debug(err.stack);
            }
        },
        getSfcSuccess: function (data, response) {

            var that = this;

            sap.ui.core.BusyIndicator.hide();
            var jsonObjStr = jQuery(data).find("Row").text();
            var jsonObj = eval(jsonObjStr); // jshint ignore:line

            if (jsonObj.length && jsonObj.length > 0) {
                jsonObj = jsonObj[0];
            } else {
                alert("impossibile trovare la risorsa: risposta vuota");
                return;
            }

            if (jsonObj.RESOURCE === undefined || "" === jsonObj.RESOURCE) {
                alert("impossibile trovare la risorsa: object = " + JSON.stringify(jsonObj));
                return;
            }

            this.sfc = jsonObj.SFC;
            this.wc = jsonObj.WORK_CENTER;
            this.res = jsonObj.RESOURCE;

        },
        getSfcError: function (error) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error(error);
        },
        adjustLocations: function (objects) {


        },
        getChart: function (xdata1,
                ydata1, ydata2, shift) {

            var that = this;

            if (null !== this.svgChart) {
                this.svgChart.destroy();
            }
            this.svgChart = window.c3.generate({
                bindto: "div[id$='chartBox']",
                padding: {
                    top: 20,
                    right: 100,
                    bottom: 90,
                    left: 100
                },
                size: {
                    height: 600
                },
                data: {
                    x: 't1',
                    columns: [
                        xdata1,
                        ydata1,
                        ydata2
                    ],
                    labels: {
                        show: true
                    },
                    colors: {
                        Standard: 'rgb(0, 194, 0)',
                        Effettivo: 'royalblue'
                    },
                    types: {
                        Standard: 'line',
                        Effettivo: 'spline'
                    }
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    inset: {
                        anchor: 'top-right',
                        x: 20,
                        y: 40,
                        step: 2
                    }
                },
                axis: {
                    x: {
                        label: {
                            text: shift,
                            position: 'inner-right'

                        },
                        tick: {
                            format: function (d) {
                                return that.toDate(d);
                            },
                            rotate: -10,
                            multiline: true,
                            fit: true,
                            outer: false
                        }
                    },
                    y: {
                        label: {
                            text: 'Qt\u00e0',
                            position: 'outer-top'
                        }
                    }
                },
                grid: {
                    x: {
                        show: true
                    },
                    y: {
                        show: true
                    }
                },
                onrendered: function () {
                    d3.selectAll(".c3-texts text").each(function (v) { // jshint ignore:line
                        var label = d3.select(this); // jshint ignore:line
                        if ("Standard" === v.id) {
                            if (ydata1[v.index + 1] > ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-20, -10)");
                            } else if (ydata1[v.index + 1] < ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-10, +30)");
                            } else {
                                label.attr("transform", "translate(-10, -10)");
                            }
                        }
                        if ("Effettivo" === v.id) {
                            if (ydata1[v.index + 1] > ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-10, +30)");
                            } else if (ydata1[v.index + 1] < ydata2[v.index + 1]) {
                                label.attr("transform", "translate(-10, -10)");
                            } else {
                                label.attr("transform", "translate(-10, +30)");
                            }
                        }
                    });
                }
            });
        },
        onBack: function (event) {

        },
        toDate: function (seconds) {

            var date = new Date(seconds * 1000);

            var str = this.getFormattedTime(date);

            return str;
        },
        getFormattedTime: function (date) {
            if (!date) {
                date = new Date();
            }
            var currentdate = date;
            var datetime = +(currentdate.getDate() < 10) ? "0" + currentdate.getDate() : currentdate.getDate();
            datetime += "-";
            datetime += ((currentdate.getMonth() + 1) < 10) ? "0" + (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1);
            datetime += "-";
            datetime += currentdate.getFullYear();
            datetime += " ";
            datetime += (currentdate.getHours() < 10) ? "0" + currentdate.getHours() : currentdate.getHours();
            datetime += ":";
            datetime += (currentdate.getMinutes() < 10) ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
            datetime += ":";
            datetime += (currentdate.getSeconds() < 10) ? "0" + currentdate.getSeconds() : currentdate.getSeconds();
            return datetime;
        }

    });

    return MainController;

});
