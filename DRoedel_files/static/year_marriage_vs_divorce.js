// make a responsive chart


function makeResponsive() {

    var svgArea = d3.select("body")
        .select("svg")
        // .attr("height", 200)
        // .style("border", "1px solid black");

    // clear svg
    if (!svgArea.empty()) {
        svgArea.remove()

    }

    // Make a SVG wrapper that will adjust the chart to the browser window size
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    // setting the wrapper
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    var svg = d3
        .select(".married_chart")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);


    // Append 1st group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Read the relationship data from flask/csv

    d3.csv("relationship_data_file.csv")
        .then(function(relationshipData) {

            console.log(relationshipData)



            // create a data parcer
            // var yearParse = d3.yearParse("%y")

            // Create a variable that brings in the year of marriage 
            var relationshipMarData = [];
            relationshipData.forEach(function(data) {
                newdata = {}
                newdata.w6_q21d_year = +data.w6_q21d_year;
                newdata.yearofmarriage = +data.yearofmarriage;
                relationshipMarData.push(newdata)
            });
            console.log(relationshipMarData)

            var relationship_data = relationshipData
                .map(relationship => ({
                    married_year: +relationship.w6_q21d_year,
                    divorced_year: +relationship.w6_q21e_year,
                    type: relationship.w6_identity_all
                }));

            var married_data = relationship_data
                .filter(_ => _.married_year);
            //TODO:
            var divorced_data = relationship_data
                .filter(_ => _.divorced_year);

            var married_traces = d3
                .nest()
                .key(_ => _.type)
                .key(_ => _.married_year)
                .entries(married_data)
                .map(d3_agg => {
                    sorted_values = d3_agg.values.sort((a, b) => +a.key - (+b.key))
                    return ({
                        name: d3_agg.key,
                        x: sorted_values.map(_ => _.key),
                        y: sorted_values.map(_ => _.values.length)
                    })
                })

            var divorced_traces = d3
                .nest()
                .key(_ => _.type)
                .key(_ => _.divorced_year)
                .entries(divorced_data)
                .map(d3_agg => {
                    sorted_values = d3_agg.values.sort((a, b) => +a.key - (+b.key))
                    return ({
                        name: d3_agg.key,
                        x: sorted_values.map(_ => _.key),
                        y: sorted_values.map(_ => _.values.length)
                    })
                })

            Plotly.newPlot('married_chart', married_traces, {});
            Plotly.newPlot('divorced_chart', divorced_traces, {});
        });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);