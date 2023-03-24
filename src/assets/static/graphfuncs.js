// Give the points a 3D feel by adding a radial gradient
Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map(function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, Highcharts.color(color).brighten(-0.2).get('rgb')]
            ]
        };
    })
});

async function fetchForCombo(tableId, url, callback) {
    //console.log("fetchForCombos: getting database info from ... " + url);
    await fetch(url)
        .then(response => response.json())
        .then(function (response) {
            callback(tableId, {response});
        })
        .catch(function (error) {
            console.log(error);
            callback(null, error);
        });
}

function procesarCombo(tableId, response, error) {
    //console.log("ejecutando funcion procesarCombo...");
    if (response == null) {
        console.log(error);
    } else {
        let list = response.response;
        //console.log("procesarCombo response: " + list);
        crearDynamicTable(tableId, list);
    }
}

function procesarItinerarioIncluded(tableId, response, error) {
    //console.log("ejecutando funcion procesarCombo...");
    if (response == null) {
        console.log(error);
    } else {
        let list = response.response;
        //console.log("procesarCombo response: " + list);
        crearDynamicItinerary(tableId, list, true);
    }
}

function procesarItinerarioExcluded(tableId, response, error) {
    //console.log("ejecutando funcion procesarCombo...");
    if (response == null) {
        console.log(error);
    } else {
        let list = response.response;
        //console.log("procesarCombo response: " + list);
        crearDynamicItinerary(tableId, list, false);
    }
}


function crearDynamicTable(tableId, list) {
    //console.log("crearDynamicTable-->tableId: " + tableId);
    let cols = [];
    for (let i = 0; i < list.length; i++) {
        for (let k in list[i]) {
            if (cols.indexOf(k) === -1) {
                //console.log("Push all keys to the array");
                cols.push(k);
            }
        }
    }
    // Create a table element
    let table = document.createElement("table");
    //console.log("inserting rows...");
    let tr = table.insertRow(-1);
    for (let i = 0; i < cols.length; i++) {
        //console.log("Create the table header th element");
        let theader = document.createElement("th");
        //console.log("Appending columnName " + cols[i] + " to the table header");
        theader.innerHTML = cols[i];
        tr.appendChild(theader);
    }
    //console.log("Adding the data to the table");
    for (let i = 0; i < list.length; i++) {
        let trow = table.insertRow(-1);
        for (let j = 0; j < cols.length; j++) {
            //console.log("Inserting cell of column at " + (j+1) + " position, and named: " + cols[j] );
            let cell = trow.insertCell(-1);
            cell.innerHTML = list[i][cols[j]];
        }
    }
    //console.log("Add the newly created table containing json data");
    let el = document.getElementById(tableId);
    el.innerHTML = "";
    el.appendChild(table);
}

function crearDynamicItinerary(tableId, list, included) {
    //console.log("crearDynamicTable-->tableId: " + tableId);
    let cols = [];
    for (let i = 0; i < list.length; i++) {
        for (let k in list[i]) {
            if (cols.indexOf(k) === -1) {
                //console.log("Push all keys to the array");
                cols.push(k);
            }
        }
    }
    // Create a table element
    let table = document.createElement("table");
    //console.log("inserting rows...");
    let tr = table.insertRow(-1);
    for (let i = 0; i < cols.length; i++) {
        //console.log("Create the table header th element");
        let theader = document.createElement("th");
        //console.log("Appending columnName " + cols[i] + " to the table header");
        if (cols[i] == "stage"){
            theader.innerHTML = "Etapa";
        }else if (cols[i] == "activity"){
            if (!included){
                theader.innerHTML = "Actividad excluida de itinerario";
            }else{
                theader.innerHTML = "Actividad incluida en itinerario";
            }
        }else if (cols[i] == "realization"){
            if (included){
                theader.innerHTML = "Realización recomendada";
            }else{
                theader.innerHTML = "Motivo de exclusión";
            }
        }else if (cols[i] == "included"){
            theader.innerHTML = " ";
        }else{
            theader.innerHTML = cols[i];
        }
        tr.appendChild(theader);
    }
    //console.log("Adding the data to the table");
    let etapaPrev = "";
    let rowWithHr = -1;
    for (let i = 0; i < list.length; i++) {
        let trow = table.insertRow(-1);
        for (let j = 0; j < cols.length; j++) {
           if (j!=3){
             if (j==0){
                 if (list[i][cols[0]] == etapaPrev){
                      rowWithHr = -1;
                 }else {
                      etapaPrev = list[i][cols[j]];
                      rowWithHr = i;
                      let thIntWithRows = document.createElement("th");
                      thIntWithRows.setAttribute('rowspan', getNumberOfRowspan(list, cols,etapaPrev));
                      thIntWithRows.setAttribute('border', 'red 5px solid');
                      thIntWithRows.setAttribute('style', 'background-color: #e5eff2');
                      thIntWithRows.innerHTML = list[i][cols[j]];
                      trow.appendChild(thIntWithRows);
                 }
             }else{
                 let tdCell = document.createElement("td");
                 if (rowWithHr == i && included){
                    tdCell.innerHTML = "<div style='color:black;font-weight:normal'>" + list[i][cols[j]] +"</div>";
                 } else if (rowWithHr != i && included){
                    tdCell.innerHTML = "<div style='color:black;font-weight:normal'>" + list[i][cols[j]] +"</div>";
                 }else if (rowWithHr == i && !included){
                    tdCell.innerHTML = "<div style='color:grey;font-weight:light'>" + list[i][cols[j]] + "</div>";
                 }else if (rowWithHr != i && !included){
                    tdCell.innerHTML = "<div style='color:grey;font-weight:light'>" + list[i][cols[j]] + "</div>";
                 }
                 trow.appendChild(tdCell);
             }
           }
        }
    }
    //console.log("Add the newly created table containing json data");
    let el = document.getElementById(tableId);
    el.innerHTML = "";
    el.appendChild(table);
}

function getNumberOfRowspan(list, cols, etapa ){
    let contadorFilasEtapa = 0;
    //console.log("etapa: "+ etapa);
    for (let i = 0; i < list.length; i++) {
        //console.log("list[i][cols[0]]:" + list[i][cols[0]]);
        if (list[i][cols[0]] == etapa){
            contadorFilasEtapa++;
        }
    }
    return contadorFilasEtapa;
}

async function fetchOHLC(tipoElementoCatId, containerId, url, callback) {

    //console.log("fetchOHLC-->tipoElementoCatId: " + tipoElementoCatId);
    let urlMapping = url + tipoElementoCatId;
    //console.log("fetchOHLC: getting database info from ... " + urlMapping);
    fetch(urlMapping)
        .then(response => response.json())
        .then(function (response) {
            callback(containerId, {response});
        })
        .catch(function (error) {
            console.log(error);
            callback(null, error);
        });
}

function procesarPesos(containerId, response, error) {    
    if (response == null) {
        console.log(error);
    } else {
        let pesosResponse = response.response;
        //console.log("pesosResponse es un objeto JSON Array en este caso " + pesosResponse);
        //var pesosResponseSample = [{"activity_id": 1, "axis_attribute_id": 11, "weight_value": 25}, {"activity_id": 2, "axis_attribute_id": 14, "weight_value": 31}];
        const arrayOfPesos = [];
        for (let i in pesosResponse) {
            arrayOfPesos[i] = [];
            let j = 0;
            Object.entries(pesosResponse[i]).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                arrayOfPesos[i][j++] = value;
                //console.log(key, value);
            });
        }

        // Set up the chart
        let chart = new Highcharts.Chart({
            chart: {
                renderTo: containerId,
                margin: 70,
                type: 'scatter3d',
                styledMode: true,
                animation: false,
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 20,
                    depth: 300,
                    viewDistance: 5,
                    fitToPlot: false,
                    frame: {
                        bottom: {size: 1, color: 'rgba(0,0,0,0.02)'},
                        back: {size: 1, color: 'rgba(0,0,0,0.04)'},
                        side: {size: 1, color: 'rgba(0,0,0,0.06)'}
                    }
                }
            },
            title: {
                text: 'Peso/valorDominio de ActividadQA y Eje'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                min: 1,
                max: 32,
                title: {
                    enabled: true,
                    text: 'Actividades (x)'
                },
                tickInterval: 1,
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                tickmarkPlacement: 'on'
            },
            yAxis: {
                min: 1,
                max: 22,
                title: {
                    text: 'Ejes QA (y)'
                }
            },
            zAxis: {
                min: 0,
                max: 180,
                title: {
                    text: 'Pesos (z)'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                scatter: {
                    pointPlacement: 'on',
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            /*alert(
                                this.name + '\n'+ event.point.x + '\n' + event.point.y
                            );*/
                            getPointValue(event);
                        }
                    },
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            let s = "$" + this.z;
                            return s
                        },
                        y: -10
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'x:Actividad QA, y:Eje QA, z: Peso',
                colorByPoint: true,
                accessibility: {
                    exposeAsGroupOnly: true
                },
                data: arrayOfPesos
            }],
            exporting:{
                scale:0.5
            }
        });

        // Add mouse and touch events for rotation
        (function (H) {
            function dragStart(eStart) {
                eStart = chart.pointer.normalize(eStart);

                var posX = eStart.chartX,
                    posY = eStart.chartY,
                    alpha = chart.options.chart.options3d.alpha,
                    beta = chart.options.chart.options3d.beta,
                    sensitivity = 5,  // lower is more sensitive
                    handlers = [];

                function drag(e) {
                    // Get e.chartX and e.chartY
                    e = chart.pointer.normalize(e);

                    chart.update({
                        chart: {
                            options3d: {
                                alpha: alpha + (e.chartY - posY) / sensitivity,
                                beta: beta + (posX - e.chartX) / sensitivity
                            }
                        }
                    }, undefined, undefined, false);
                }

                function unbindAll() {
                    handlers.forEach(function (unbind) {
                        if (unbind) {
                            unbind();
                        }
                    });
                    handlers.length = 0;
                }

                handlers.push(H.addEvent(document, 'mousemove', drag));
                handlers.push(H.addEvent(document, 'touchmove', drag));


                handlers.push(H.addEvent(document, 'mouseup', unbindAll));
                handlers.push(H.addEvent(document, 'touchend', unbindAll));
            }

            H.addEvent(chart.container, 'mousedown', dragStart);
            H.addEvent(chart.container, 'touchstart', dragStart);
        }(Highcharts));

    }
}

function procesarUmbrales3DBubles(containerId, response, error) {

    //console.log("ejecutando funcion procesarUmbrales3DBubles...");
    if (response == null) {
        console.log(error);
    } else {
        let pesosUmbrales = response.response;
        Highcharts.chart(containerId, {
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: {
            text: 'Umbrales de actividades QA'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.actividad} </b> => <b>{point.name}</b> <br>' +
                         'Recomendación: {point.recomen}'
        },
        plotOptions: {
            packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'bold',
                        fontSize: 14
                    }
                }
            }
        },

        series: pesosUmbrales

    });
 }

}

function procesarItinerario3DBubles(containerId, response, error) {

    //console.log("ejecutando funcion procesarItinerario3DBubles...");
    if (response == null) {
        console.log(error);
    } else {
        let itinerario = response.response;
        Highcharts.chart(containerId, {
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: {
            text: 'Actividades QA incluidas en el itinerario obtenido'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.actividad} </b> => <b>{point.name}</b> <br>' +
                         'Recomendación: {point.recomen}'
        },
        plotOptions: {
            packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'bold',
                        fontSize: 14
                    }
                }
            }
        },

        series: itinerario

    });
 }

}

function procesarUmbrales(containerId, response, error) {
       // console.log("procesarUmbrales executed!");
       if (response == null) {
           console.log(error);
       } else {
           let varDataBubles = response.response;
        //console.log(pesosResponse);
        //mostramos el diagrama de Umbrales
        let chart = new Highcharts.Chart({
            chart: {
               renderTo: containerId,
               type: 'bubble',
               plotBorderWidth: 1,
               zoomType: 'xy'
            },
            legend: {
                enabled: false
            },

            title: {
                text: ''
            },

            subtitle: {
                text: 'Umbrales definidos para cada Actividad QA'
            },

            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. <h3>{point.name}</h3>, actividad: {point.x}g, umbral: {point.y}g, <br> Recomendacion: {point.z}%.'
                }
            },

            xAxis: {
                gridLineWidth: 1,
                title: {
                    text: 'Actividades (numeradas)'
                },
                labels: {
                    format: '{value}'
                },
                /*plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 65,
                    label: {
                        rotation: 0,
                        y: 15,
                        style: {
                            fontStyle: 'italic'
                        },
                        text: 'Safe fat intake 65g/day'
                    },
                    zIndex: 3
                }],*/
                accessibility: {
                    rangeDescription: 'De 1 a 32 actividades'
                }
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Umbrales (rangos de sumatorios pesos actividad)'
                },
                labels: {
                    format: '{value}'
                },
                maxPadding: 0.2,
                /*plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 50,
                    label: {
                        align: 'right',
                        style: {
                            fontStyle: 'italic'
                        },
                        text: 'Safe sugar intake 50g/day',
                        x: -10
                    },
                    zIndex: 3
                }],*/
                accessibility: {
                    rangeDescription: 'Límite  inferior de rango: 0, límite superior: 500 '
                }
            },

            tooltip: {
                useHTML: true,
                headerFormat: '<table style="background:darkgrey;color: #dddddd">',
                pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
                    '<tr><th>{point.actividad}</th><td>{point.recomen}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                },
                bubble:{
                     minSize:20,
                    maxSize:40
                    //minSIze:'50%',
                    //maxSize:'75%'
                }
            },

            series: [{
                data: varDataBubles
            }]

        });
    }
}