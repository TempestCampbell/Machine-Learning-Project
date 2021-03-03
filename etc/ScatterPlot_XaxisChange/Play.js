//PLOTLY version of scatter with x-axis slider

//Set up SelectorOptions
var selectorOptions = {
  buttons: [ {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD'
  }, {
      step: 'year',
      stepmode: 'backward',
      count: 10,
      label: '10y'
  }, {
      step: 'all',
  }],
};


function setBarPlot(chosents) {
    // this function sets up the x-y plot for plotly
          currentData = getCountryData(chosents);
          if (type == 1) {  // this is x-y plot for storm types by year
            var trace1 = {
                x: years,
                y: currentData,
                width: 400,
                height: 500,
                mode: 'lines+markers',
                marker: {
                    size: 12,
                    opacity: 0.5
                }
            }
            var layout = {
                  xaxis: { rangeselector: selectorOptions,
                  rangeslider: {}
                },
                  title: `${chosents} per Year`,
                  yaxis: {range: [0, 30]} 
            };

          } else {  // this is for pie chart counts for entere period of record by saffier-simpson scale
            var trace1 = {
               values: pie,
               labels: ['Cat 1', 'Cat 2', 'Cat 3','Cat 4','Cat 5'],
               marker: {
               colors: ["#66FF33","#FF99FF","#FF9900","#CC6600","#FF0000"]},
               type: 'pie',
               height: 500,
               width: 400
            } 
            var layout = {
              height: 400,
              width: 400,
              title: `Total Storm Counts by Category for 1851-2018`,     
        };
          }
          var data = [trace1];
          Plotly.newPlot('stats', data, layout);  //plot data
      };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    