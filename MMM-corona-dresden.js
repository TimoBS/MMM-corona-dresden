function resolve(obj, path){
    var r=path.split(".");
    if(path){return resolve(obj[r.shift()], r.join("."));}
   return obj
  }

Module.register("MMM-corona-dresden", {

    // Module config defaults.
    defaults: {
        useHeader: true,
        header: "Corona Braunschweig",
        cityID: ["17"], // City ID from  https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0/data
        updateInterval: 60 * 60 * 1000, // 1 hour = 100 clues per call
        //url: "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=&objectIds=17&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=OBJECTID%2CGEN%2Ccases7_per_100k%2Ccases_per_population%2Ccases%2Cdeath_rate%2Clast_update&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token="
    	  url: "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=&objectIds=17&outFields=OBJECTID,death_rate,cases,deaths,cases_per_100k,cases_per_population,county,last_update,cases7_per_100k,recovered,cases7_bl_per_100k&outSR=4326&f=json"
    },

    getStyles: function() {
        return ["MMM-corona-dresden.css"];
    },

    getScripts: function () {
        return [
            this.file("js/lodash.min.js"),
            this.file("js/gauge.min.js"),
        ];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        this.url = this.config.url;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Lade...";
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        if (!this.data){
            var error = document.createElement("div");
            error.innerHTML = "Es konnten keine Daten geladen werden";
            wrapper.appendChild(error);
        }else {

            const rows = [
                {
                    keypath: 'features[0].attributes.cases',
                    text: 'Fälle insgesamt: {{value}}',
                    default: 0,
                    custom: (el, value) => {
                         return el;
                    }
                },
                {
                    keypath: 'features[0].attributes.cases_per_100k',
                    text: 'Aktuell: {{value}}',
                    default: 0,
                    custom: (el, value) => {
                        const cases_rounded = window._.get(this.data,'features[0].attributes.cases_per_100k');
                        const cases_rounded2 = (Math.round(cases_rounded * 100) / 100  ).toFixed(0);
                        el.innerHTML = `Infiziert: ${cases_rounded2}`;
                        return el;
                    }
                },
                {
                    keypath: 'features[0].attributes.deaths',
                    text: 'Tote: {{value}}',
                    default: 0,
                    custom: (el, value) => {
                         return el;
                    }
                },
                //{
                //    keypath: 'features[0].attributes.Zuwachs_Fallzahl',
                //    text: 'Zuwachs: {{value}}',
                //    default: 0,
                //    custom: (el, value) => {
                //        if (value < 2){
                //            el.classList.add("green-dark");
                //        } else if (value < 5){
                //            el.classList.add("green");
                //        }else if (value < 12){
                //            el.classList.add("green-light");
                //        } else if (value < 20){
                //            el.classList.add("yellow");
                //        } else if (value < 30){
                //            el.classList.add("orange");
                //        } else if (value < 40){
                //            el.classList.add("orangered");
                //        } else {
                //            el.classList.add("red");
                //        }
                //        return el;
                //    }
                //},
                {
                    keypath: 'features[0].attributes.cases7_per_100k',
                    text: 'Inzidenz: {{value}}',
                    default: 0,
                    custom: (el, value) => {
                        if (value < 10){
                            el.classList.add("green-dark");
                        } else if (value < 20){
                            el.classList.add("green");
                        }else if (value < 25){
                            el.classList.add("green-light");
                        } else if (value < 35){
                            el.classList.add("yellow");
                        } else if (value < 50){
                            el.classList.add("orange");
                        } else if (value < 60){
                            el.classList.add("orangered");
                        } else {
                            el.classList.add("red");
                        }
                        const inz_rounded = window._.get(this.data,'features[0].attributes.cases7_per_100k');
                        const inz_rounded2 = (Math.round(inz_rounded * 100) / 100  ).toFixed(2);
                        el.innerHTML = `Inzidenz: ${inz_rounded2}`;
                        return el;
                    }

                },
                {
                    keypath: 'features[0].attributes.cases7_per_100k',
                    text: 'Inzidenz: {{value}}',
                    default: 0,
                    custom: (el, value) => {
                        var target = document.createElement("canvas");
                        var opts = {
                            angle: 0.1, // The span of the gauge arc
                            lineWidth: 0.55, // The line thickness
                            radiusScale: 1, // Relative radius
                            pointer: {
                              length: 0.67, // // Relative to gauge radius
                              strokeWidth: 0.035, // The thickness
                              color: '#FFFFFF' // Fill color
                            },
                            staticZones: [
                                {strokeStyle: "#004e1c", min: 0, max: 5}, // Red from 100 to 130
                                {strokeStyle: "#008000", min: 5, max: 20}, // Red from 100 to 130
                                {strokeStyle: "#9bff00", min: 20, max: 25},
                                {strokeStyle: "#ffff00", min: 25, max: 35},
                                {strokeStyle: "#ffa500", min: 35, max: 50},
                                {strokeStyle: "#ff0000", min: 50, max: 80},
                                {strokeStyle: "#770000", min: 80, max: 120}
                             ],
                            limitMax: false,     // If false, max value increases automatically if value > maxValue
                            limitMin: false,     // If true, the min value of the gauge will be fixed
                            colorStart: '#6FADCF',   // Colors
                            colorStop: '#8FC0DA',    // just experiment with them
                            strokeColor: '#E0E0E0',  // to see which ones work best for you
                            generateGradient: true,
                            highDpiSupport: true,     // High resolution support

                          };
                          setTimeout(() => {
                            var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                            gauge.maxValue = 60; // set max gauge value
                            gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
                            gauge.animationSpeed = 32; // set animation speed (32 is default value)
                            gauge.set(value); // set actual value
                          }, 0)

                        return target;
                    }

                }
            ]

            rows.forEach((item) => {
                const value = window._.get(this.data,item.keypath,item.default)
                var valueDiv = document.createElement("div");

                valueDiv.innerHTML = item.text.replace("{{value}}",value);
                if (item.custom){
                    valueDiv = item.custom(valueDiv, value, this.data)
                }

                wrapper.appendChild(valueDiv);
            })


        }


        return wrapper;
    },


    processData: function(data) {
        this.data = data;
        console.log("processData",this.data);
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.fetchData();
        }, this.config.updateInterval);
        this.fetchData(this.config.initialLoadDelay);
        var self = this;
    },

    fetchData: function() {
        console.log("fetchData");
        this.sendSocketNotification('FETCH_CORONA_DRESDEN', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CORONA_DRESDEN_RESULT") {
            console.log(payload);
            this.processData(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
