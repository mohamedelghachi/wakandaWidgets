WAF.define('WaGauge', ['waf-core/widget'], function(widget) {

    var WaGauge = widget.create('WaGauge', {


        init: function() {

            this.node.innerHTML = '';
            var waGauge = new JustGage({
                id: this.id,
                value: 20,
                min: 0,//this.min(),
                max: 100,//this.max(),
                title: this.title(),
                label: '%',
                showMinMax: true
            });

            this.title.onChange(function() {
                var title = waGauge.txtTitle[0];
                title.textContent = this.title();
            });

            this.value.onChange(function() {
                var newValue = this.value();
                var myMin = this.min();
                var myMax = this.max();
                var calculatedValue = 0;
                if (newValue >= myMin && newValue <= myMax) {
                    newValue -= myMin;
                    calculatedValue = Math.round(100 * newValue / (myMax - myMin));
                    waGauge.refresh(calculatedValue);
                }
                else {
                    this.fire('overload', {
                        value: newValue
                    })
                }
            });

            this.min.onChange(function() {
                var min = waGauge.txtMin[0];
                if (isNaN(this.min())) {
                    min.textContent = 0;
                    this.min(0);
                }
                else min.textContent = this.min();
                var newValue = this.value();
                var myMin = this.min();
                var myMax = this.max();
                var calculatedValue = 0;
                if (newValue >= myMin && newValue <= myMax) {
                    newValue -= myMin;
                    calculatedValue = Math.round(100 * newValue / (myMax - myMin));
                    waGauge.refresh(calculatedValue);
                }
            });

            this.max.onChange(function() {
                var max = waGauge.txtMax[0];
                if (isNaN(this.max())) {
                    max.textContent = 100;
                    this.max(100);
                }
                else max.textContent = this.max();
                var newValue = this.value();
                var myMin = this.min();
                var myMax = this.max();
                var calculatedValue = 0;
                if (newValue >= myMin && newValue <= myMax) {
                    newValue -= myMin;
                    calculatedValue = Math.round(100 * newValue / (myMax - myMin));
                    waGauge.refresh(calculatedValue);
                }
            });

            this.showMinMax.onChange(function() {
                debugger;
                var emptymin = this.min() + "";
                var emptymax = this.max() + "";
                if (emptymin == "NaN") {
                    var min = waGauge.txtMin[0];
                    min.textContent = 0;
                }
                if (emptymax == "NaN") {
                    var max = waGauge.txtMax[0];
                    max.textContent = 100;
                }
                if (!this.showMinMax()) {
                    var min = waGauge.txtMin[0];
                    min.style.visibility = "hidden";

                    var max = waGauge.txtMax[0];
                    max.style.visibility = "hidden";
                }
                else {
                    var min = waGauge.txtMin[0];
                    min.style.visibility = "visible";
                    var max = waGauge.txtMax[0];
                    max.style.visibility = "visible";
                    max.style.visibility = "visible";
                }
            });

            var $node = $(this.node);
            if (!window.Designer && !this.readOnly()) {
                $node.on('click', function(event) {
                	debugger;
                    if (event.currentTarget.childNodes[0].childNodes[2] == event.target || event.currentTarget.childNodes[0].childNodes[3] == event.target) {
                        var myMin = this.min();
                        var myMax = this.max();
                        var x = event.clientX - $(event.currentTarget).position().left;
                        var y = event.clientY + $(event.currentTarget).position().top;
                        var decalage = $(event.currentTarget.childNodes[0].childNodes[2]).position().left - $(event.currentTarget.childNodes[0]).position().left;
                        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                            decalage = $(event.currentTarget.childNodes[0]).position().left - $(event.currentTarget).position().left;
                        }
                        var pathProperties = event.target.getAttribute("d");
                        pathProperties = pathProperties.split(" ").join(",");
                        var k = 0;
                        if(navigator.userAgent.toLowerCase().indexOf('chrome') == -1 && navigator.userAgent.toLowerCase().indexOf('firefox') == -1) k++;
                        var r2 = parseInt(pathProperties.split("A")[1].split(",")[k+0]);
                        var r1 = parseInt(pathProperties.split("A")[2].split(",")[k+0]);
                        var minY = $(event.currentTarget.childNodes[0].childNodes[2]).position().top + $(event.currentTarget).position().top;
                        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                            minY += $(event.currentTarget).position().top;
                        }
                        var maxY = minY + r2;
                        var r = Math.sqrt(Math.pow(x - 40 - r2, 2) + Math.pow(maxY - y, 2));
                        var angle = Math.atan((maxY - y) / (x - 40 - r2));
                        var ratio = 100 * (angle) / (Math.PI);
                        if (ratio < 0) ratio *= -1;
                        if (x >= r2 + 40) ratio = 100 - ratio;
                        ratio = myMin + ratio * (myMax - myMin) / 100;
                        this.value(Math.round(ratio));
                    }
                }.bind(this));
            }
        },

        //        /* Create a property */
        title: widget.property({
            type: 'string',
            defaultValue: "waGauge"
        }),
        value: widget.property({
            type: 'number',
            defaultValue: 20
        }),
        min: widget.property({
            type: 'number',
            defaultValue: 0
        }),
        max: widget.property({
            type: 'number',
            defaultValue: 100
        }),
        showMinMax: widget.property({
            type: 'boolean'
        }),
        readOnly: widget.property({
            type: 'boolean',
            defaultValue: true,
            bindable: false
        })

    });

    return WaGauge;

});