sap.ui.define([
    'jquery.sap.global',
    'sap/ui/core/Control'
], function (jQuery, Control) {
    "use strict";

    var GanttComponent = Control.extend("effstd.component.Gantt", {
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

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeStyles();
            oRm.addClass("ganttComp");
            oRm.writeClasses();
            oRm.write("/>");
        },
        onAfterRendering: function () {

            var contId = this.getId();
            
            var r1 = new Date();
            r1.setHours(r1.getHours() - 6);

            var r2 = new Date();
            r2.setHours(r2.getHours() - 4);

            var r3 = new Date();

            var r4 = new Date();
            r4.setHours(r3.getHours() + 4);

            var r5 = new Date();
            r5.setHours(r4.getHours() + 4);

            var r6 = new Date();
            r6.setHours(r5.getHours() + 4);

            var r7 = new Date();
            r7.setHours(r6.getHours() + 4);

            var rs1 = new Date();
            var rs2 = new Date();
            rs1.setHours(r2.getHours() + 1);
            rs2.setHours(r2.getHours() + 3);

            var rs11 = new Date();
            var rs21 = new Date();
            rs11.setHours(rs1.getHours() - 1);
            rs21.setHours(rs1.getHours() + 1);

            var rsa = new Date(rs21.getTime());
            var rsb = new Date();
            rsa.setMinutes(rsa.getMinutes());
            rsb = new Date(rsa.getTime());
            rsb.setMinutes(rsa.getMinutes() + 30);
            var rsc = new Date(rsb.getTime());
            rsc.setHours(rsc.getHours() + 2);

            var point = new Date(rs2.getTime());
            point.setMinutes(point.getMinutes() - 10);


            var rst11 = new Date();
            var rst21 = new Date();
            rst11.setHours(rs1.getHours() + 5);
            rst21.setHours(rs1.getHours() + 8);

            var rsta = new Date(rst21.getTime());
            var rstb = new Date();
            rsta.setMinutes(rsta.getMinutes());
            rstb = new Date(rsta.getTime());
            rstb.setMinutes(rsta.getMinutes() + 30);
            var rstc = new Date(rstb.getTime());
            rstc.setHours(rstc.getHours() + 2);

            var items = new window.vis.DataSet([
                {id: 'N', content: '', start: r1, end: r2, type: 'background', className: 'ignored'},
                {id: 'A', content: 'Turno 1', start: r2, end: r3, type: 'background'},
                {id: 'B', content: 'Turno 2', start: r3, end: r4, type: 'background', className: 'negative'},
                {id: 'C', content: 'Turno 3', start: r4, end: r5, type: 'background'},
                {id: 1, content: '135716', start: rs1, end: rs2, group: 1, className: 'sfccol1'},
                {id: 2, content: '135708', start: rs11, end: rs21, group: 2, className: 'sfccol2'},
                {id: 3, content: 'A', start: rsa, end: rsb, group: 2, className: 'sfccolblack'},
                {id: 4, content: '135708', start: rsb, end: rsc, group: 2, className: 'sfccol2'},
                {id: 5, content: '', start: point, type: 'point', group: 1},
                {id: 6, content: '135708', start: rst11, end: rst21, group: 3, className: 'sfccol2'},
                {id: 7, content: 'A', start: rsta, end: rstb, group: 3, className: 'sfccolred'},
                {id: 8, content: '135708', start: rstb, end: rstc, group: 3, className: 'sfccol2'}
            ]);

            var groups = new window.vis.DataSet([
                {id: 1, content: '<span>Rep: <b>s</b> </span><br/><span>CdL: <b>01PG2</b> </span><br/><span>Macchina: <b>01992</b></span>'},
                {id: 2, content: '<span>Rep: <b>s</b> </span><br/><span>CdL: <b>01PC6</b> </span><br/><span>Macchina: <b>01923</b></span>'},
                {id: 3, content: '<span>Rep: <b>s</b> </span><br/><span>CdL: <b>SCP01</b> </span><br/><span>Macchina: <b>01924</b></span>'}
            ]);

            var container = jQuery.sap.byId(contId)[0];
            
            var options = {
                locale: "it",
                start: new Date(),
                end: new Date(1000 * 60 * 60 * 24 + (new Date()).valueOf()),
                orientation: {axis: "bottom", item: "bottom"},
                rollingMode: true,
                editable: false,
                stack: false,
                margin: {
                    item: 10, // minimal margin between items
                    axis: 5   // minimal margin between items and the axis
                }
            };

            var timeline = new window.vis.Timeline(container, items, groups, options);
            
        }
    });

    return GanttComponent;
});
