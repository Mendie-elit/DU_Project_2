// make a responsive chart
function makeResponsive(){

    var svgArea = d3.select("body").select("svg")

    // clear svg
    if(!svgArea.empty()){
        svgArea.remove()
    }

    // Make a SVG wrapper that will adjust the chart to the browser window size
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top:40,
        bottom:40,
        right: 40,
        left:40
    };

    // setting the wrapper
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append 1st group element
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read the relationship data .csv
    d3.csv("relationship_data.csv")
    .then(function(relationshipData) {

    // create a data parcer
    var yearParce = d3.yearParce("%y")

    // parse data married year 
    var relationshipMarData = relationshipMarData.forEach(function(rData) {
        rData.w6_q21d_year = yearParce(w6_q21d_year);
        data.yearofmarriage = +data.yearofmarriage;
        console.log(relationshipMarData)
    });
    
        // parse data break up year 
    var relationshipBUData = relationshipBUData.forEach(function(rData) {
        rData.w6_q21e_year = yearParce(rData.w6_q21e_year);
        data.yearofbreakup = +data.yearofbreakup;
    });
// ASK NATE ON MONDAY:  HOW DO I CREATE A x-AXIS FROM 1944 - 2017?
    // create scales
    var xYearScale = d3.scaleYear()
        .domain(d3.extent(relationshipMarData, d => d.w6_q21e_year))
        .range([75, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(relationshipMarData, d => d.CASEID)])
        .range([height, 0]);

// LEAVING OFF HERE:  GO TO C:\Users\Dawn's New Computer\Desktop\UDEN201902DATA4\16-D3\Day_3_Activities\08-Ins_D3_Tip

    }





}