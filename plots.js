function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  })}
  
  init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");

      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      })
    })
  }

  function buildCharts(sample) {
    d3.json("samples.json").then(receivedData => {
      var samples = receivedData.samples;
      var samplesArray = samples.filter(samplesObj => samplesObj.id == sample);
      var samplesOtuId = samplesArray[0].otu_ids;
      var topTenOtuIds = samplesOtuId.slice(0,10);
      var sample_values = samplesArray[0].sample_values;
      var topTenValues = sample_values.slice(0,10);
      var otu_labels = samplesArray[0].otu_labels;
      var topTenLabels = otu_labels.slice(0,10);

     
      // Build a horizontal bar
      var trace = {
        x: topTenValues,
        y: topTenOtuIds,
        type: "bar",
        orientation: 'h',
        text: topTenLabels,
        marker: {
          color: 'rgb(158,202,225)',
          opacity: 0.6,
          line: {
             color: 'rgb(8,48,107)',
            width: 1.5
        }
        }
      };
        var sample_data = [trace]
    
        var barLayout = {
          title: "Top Ten Bacteria",
          hovermode: "closests",
          yaxis: {
            showticklabels: true
          }
          
        }
        Plotly.newPlot("bar", sample_data, barLayout)

        //Build a bubble graph
        var bubble = [
          {
            x: samplesOtuId,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
              size: sample_values,
              color: samplesOtuId,
              colorscale: "Jet"
            }
          }
        ]
        var bubbleLayout = {
          margin: { t: 0 },
          hovermode: "closests",
          xaxis: { title: "OTU ID"}
        }
    
        Plotly.plot("bubble", bubble, bubbleLayout);
    

    })
  }
  













      
  
