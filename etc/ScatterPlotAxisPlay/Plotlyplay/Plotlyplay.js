function buildPlot(country) {
    d3.csv("globalWinePoints.csv").then(function(globalWinePoints) {

        temp=globalWinePoints
        temp=temp.filter(c=>c.country==countryIn)
        xx=[]
        temp.forEach(function(d){
            xx.push(parseFloat(d.price))
        })
        yy=[]
        temp.forEach(function(d){
            yy.push(parseFloat(d.points))
        })
    
        hovertext=[]
        // layout = {
        //     hovermode:'closest',
        //     title:'Hover on Points'
        // };
        temp.forEach(function(d){
            string=`${d.title}<br> Price:$${d.price} <br> Points: ${d.points}`
            hovertext.push(string)
            
        })
        
        console.log(xx)

    //ORIGINAL XAXIS***************************************************************************************************8
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
        title: `Wine`,

        xaxis: {
            title: "Price($)",
            //Attempt at slider
            automargin: true,
            showticklabels: true,
            rangeslider:{
            },
        },
        yaxis: {
        autorange: true,
        title: "Points",
        type: "linear"
        },
        showlegend: false
    };
    Plotly.newPlot("plot", data, layout);
    });

  }

  buildPlot("Germany")
