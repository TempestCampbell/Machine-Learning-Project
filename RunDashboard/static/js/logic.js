// Create init event handler
var form = d3.select(".is-preload");
form.on("keypress", init);

// Get a reference to the table body
var tbody = d3.select("tbody");

// Get a reference to the scatter plot
var scatter = d3.select("plot");

// Country selection variable
let countryIn;


// Create the function for the initial data rendering
function init() {

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 1
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: "pk.eyJ1IjoicmJsZXZpbmUiLCJhIjoiY2tqenlwd2c2MDhxajJ2cGJwZ2w5YWt1eSJ9.CbH0egXe3ybOBDvV6bhVsw"
    }).addTo(myMap);

    // Read the csv file to get data
    d3.json("static/js/GeoCountry.geojson").then(function (data) {

        console.log(data);

        
            // CREATE A NEW CHOROPLETH LAYER
            geojson = L.choropleth(data, {

                // Define what  property in the features to use
                valueProperty: "title",

                // Set color scale
                scale: ["#fff7f3", "#49006a"],

                // Number of breaks in step range
                steps: 10,

                // q for quartile, e for equidistant, k for k-means
                mode: "q",
                style: {
                    // Border color
                    color: "#fff",
                    weight: 1,
                    fillOpacity: 0.8
                },

                // Binding a pop-up to each layer
                onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.name + "<br># of Wines: "
                + feature.properties.title).on('click', function(e) {
                    // Clear out current contents in the table
                    tbody.html("");
                    // Clear out current contents in scatter plot
                    scatter.html("");

                    // countryIn VARIABLE
                    countryIn = feature.properties.name;
                    document.getElementById("countryIn").value = countryIn;

                    console.log("countryIN", countryIn);
                    // Call updateTable function with country selection
                    updateTable(countryIn);
                
            });
            }
            }).addTo(myMap);

            // Set up the legend
            var legend = L.control({ position: "bottomright" });
            legend.onAdd = function () {
                var div = L.DomUtil.create("div", "info legend");
                var limits = geojson.options.limits;
                var colors = geojson.options.colors;
                var labels = [];

                // Add min & max
                var legendInfo = "<h1>Wines by Country</h1>" +
                    "<div class=\"labels\">" +
                    "<div class=\"min\">" + limits[0] + "</div>" +
                    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                    "</div>";

                div.innerHTML = legendInfo;

                limits.forEach(function (limit, index) {
                    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
                });

                div.innerHTML += "<ul>" + labels.join("") + "</ul>";
                return div;
            };

            // Adding legend to the map
            legend.addTo(myMap);

    });
};



// // CREATE CUSTOM SELECT TABLE FILTER
var x, i, j, l, ll, selElmnt, a, b, c;
// Look for any elements with the class "custom-select"
x = document.getElementsByClassName("custom-select");
l = x.length;

for (i = 0; i < l; i++) {
selElmnt = x[i].getElementsByTagName("select")[0];
ll = selElmnt.length;
// For each element, create a new DIV that will act as the selected item
a = document.createElement("DIV");
a.setAttribute("class", "select-selected");
a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
x[i].appendChild(a);

console.log("Maybe it is here", countryIn)
for (i = 0; i < l; i++) {
    console.log ("Try to find I", countryIn)
// For each element, create a new DIV that will contain the option list
b = document.createElement("DIV");
b.setAttribute("class", "select-items select-hide");
for (j = 1; j < ll; j++) {
    console.log("I am really lost now", countryIn)
    // For each option in the original select element, create a new DIV that will act as an option item
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {

        // When an item is clicked, update the original select box, and the selected item
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;

        console.log("here is our S", countryIn);

        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
            console.log("here we are at it again", countryIn)
        if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            
            console.log("countrySelect2", countryIn)
            break;
        }
        }
        h.click();
        updateTable(countryIn);
    });
    b.appendChild(c);
}
x[i].appendChild(b);


a.addEventListener("click", function(e) {

    // When the select box is clicked, close any other select boxes, and open/close the current select box
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
    });
};
};
function closeAllSelect(elmnt) {

// Function that will close all select boxes in the document, except the current select box
var x, y, i, xl, yl, arrNo = [];
x = document.getElementsByClassName("select-items");
y = document.getElementsByClassName("select-selected");
xl = x.length;
yl = y.length;
for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
    arrNo.push(i)
    } else {
    y[i].classList.remove("select-arrow-active");
    }
}
for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
    x[i].classList.add("select-hide");
    }
}
}
// If the user clicks anywhere outside the select box, then close all select boxes
document.addEventListener("click", closeAllSelect);


// Function to update table with selection data
function updateTable(countryIn) {

    console.log("here again", countryIn)

    // Get a reference to the table body
    var tbody = d3.select("tbody");

    // Clear out current contents in the table
    tbody.html("");

    // Get a reference to the scatter plot
    var scatter = d3.select("plot");

    // Clear out current contents in scatter plot
    scatter.html("");

    // // dropDown selection variable
    var dropDown = d3.select('select').property('value');

    console.log("selection", dropDown);

        fetch(`http://127.0.0.1:5000/api/v1.0/buildtable/${countryIn}/${dropDown}`, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin":"*",
        },
        })
        .then(response => response.json())
        .then(function (tableData) {

            console.log(tableData);

            // CREATE SCATTER PLOT
            temp = tableData
            temp = temp.filter(c => c.country == countryIn)
            xx = []
            temp.forEach(function (d) {
                xx.push(parseFloat(d.price))
            })
            yy = []
            temp.forEach(function (d) {
                yy.push(parseFloat(d.points))
            })

            hovertext = []
            temp.forEach(function (d) {
                string = `${d.title}<br> Price:$${d.price} <br> Points: ${d.points}`
                hovertext.push(string)
            })

            console.log(xx)

            var trace1 = {
                type: "scatter",
                mode: "markers",
                text: hovertext,
                x: xx,
                y: yy,
                line: {
                    color: "#380059"
                }
            };

            var data = [trace1];
            var layout = {
                title: {
                    text: `Wine`,
                    font: {
                        family: 'Times',
                        size: 25
                    }
                },
                hovermode: "closest",
                hoverlabel: { bgcolor: "#380059" },
                xaxis: {
                    title: {
                        text: "Price($)",
                        font: {
                            family: 'Times',
                            size: 20
                        }
                    },
                    //Attempt at slider
                    automargin: true,
                    showticklabels: true,
                    rangeslider: {
                    },
                },
                yaxis: {
                    autorange: true,
                    title: {
                        text: 'Points',
                        font: {
                            family: 'Times',
                            size: 20
                        }
                    },
                    // type: "linear"
                },
                showlegend: false
            };
            Plotly.newPlot("plot", data, layout);

            // CREATE WINE DATA TABLE

            // Loop through each wine object in the data array
            tableData.forEach((wineObject) => {


                // Append one table row for each wine object
                var row = tbody.append("tr");

                // Use `Object.entries` and forEach to iterate through keys and values of wine object
                Object.entries(wineObject).forEach(([key, value]) => {

                    // Append one cell per wine object value 
                    var cell = row.append("td")
                    cell.text(value);
                });
            });
        });

    console.log("before doc.ready")
    $(document).ready(function () {
        //
        console.log("after doc.ready")
        // click on table body
        $(document.body).on('click', 'tr', function () {
            // get row contents into an array
            var tblData = $(this).children("td").map(function () {
                return $(this).text();
            }).get();
            var wineTitle = tblData[3];
            var wineVariety= tblData[4];
            
            fetch(`http://127.0.0.1:5000/api/v1.0/cheesepair/${wineVariety}`, {
                method: 'GET',
                // mode: 'cors',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    //     'Accept': 'application/json',
                    // 'Content-Type': 'application/json;charset=utf-8'
                },
                // body: JSON.stringify({countryIn:countryIn, dropDown:dropDown})
            })
                .then(response => response.json())
                .then(function (cheeseData) {
                    console.log(cheeseData);
                    var cheeseNames=[];
                    // Loop through each cheese object in the data array
                    cheeseData.forEach((cheeseObject) => {
                        console.log(cheeseObject["name"]);
                        cheeseNames.push(cheeseObject["name"]);
                    });

                    console.log("THE CHEESE RECS ARE:");
                    console.log(cheeseNames);
                    
                    fetch(`http://127.0.0.1:5000/api/v1.0/meatpair/${countryIn}`, {
                        method: 'GET',
                        // mode: 'cors',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            //     'Accept': 'application/json',
                            // 'Content-Type': 'application/json;charset=utf-8'
                        },
                        // body: JSON.stringify({countryIn:countryIn, dropDown:dropDown})
                    })
                        .then(response => response.json())
                        .then(function (meatData) {
                            console.log(meatData);
                            var meatNames=[];
                            // Loop through each meat object in the data array
                            meatData.forEach((meatObject) => {
                                console.log(meatObject["name"]);
                                meatNames.push(meatObject["name"]);
                            });

                            console.log("THE MEAT RECS ARE:");
                            console.log(meatNames);
                        
                            // Build a nice Modal popup message
                            var newLine = "<br/>";
                            var message = `The wine you selected is a ${wineVariety} varietal.`;
                            message += newLine;
                            
                            // Check if we have information for both wine and cheese
                            if (cheeseNames.length && meatNames.length){
                                message += "Here are some cheese pairing suggestions:";
                                message += newLine;
                                // Add cheese suggestions in a list
                                for (var i = 0; i < cheeseNames.length; i++){
                                    var cheese = cheeseNames[i];
                                    cheese=cheese.replace(/-/g, ' ');
                                    message += `${i+1}. ${cheese}`;
                                    message += newLine
                                };
                                message += "For more information on these cheeses, check out cheese.com."
                                message += newLine;
                                // Add meat suggestions in a list
                                message += "Here are some meats that are from this country:";
                                message += newLine;
                                for (var x = 0; x < meatNames.length; x++){
                                    var meat = meatNames[x];
                                    meat=meat.replace(/-/g, ' ');
                                    message += `${x+1}. ${meat}`;
                                    message += newLine;
                                };
                            }

                            // If there is only information for cheese
                            else if(cheeseNames.length && meatNames.length<1){
                                    message += "Here are some cheese pairing suggestions:";
                                    message += newLine;
                                    // Add cheese suggestions in a list
                                    for (var i = 0; i < cheeseNames.length; i++) {
                                        var cheese = cheeseNames[i];
                                        cheese = cheese.replace(/-/g, ' ');
                                        message += `${i + 1}. ${cheese}`;
                                        message += newLine
                                    };
                                    message += "For more information on these cheeses, check out cheese.com.";
                            }
                            
                            // If there is only information for meats
                            else if(meatNames.length && cheeseNames.length<1){
                                message += "Here are some meats that are from this country:";
                                message += newLine;
                                for (var x = 0; x < meatNames.length; x++) {
                                    var meat = meatNames[x];
                                    meat = meat.replace(/-/g, ' ');
                                    message += `${x + 1}. ${meat}`;
                                    message += newLine;
                                };
                            }

                            // There is no information for meats OR cheeses
                            else{
                                message += "Unfortunately, we do not have any meat or cheese suggestions at this time.";
                            };
                            

                            // // Get the modal
                            var modal = document.getElementById("myModal");

                            var modalContent = document.getElementsByClassName("modal-content")[0];
                            modalContent.innerHTML = message;

                            // open the modal
                            modal.style.display = "block";
                            
                        });
            
            });
        });

        // // Get the modal
        var modal = document.getElementById("myModal");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
            }
    });
        
};


