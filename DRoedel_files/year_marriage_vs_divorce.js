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
        .select(".chart")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);


    // Append 1st group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read the relationship data from flask
    d3.csv("relationship_data_file.csv")
        .then(function (relationshipData) {


            // create a data parcer
            var yearParce = d3.yearParce("%y")

            // parse data married year 
            var relationshipMarData = relationshipMarData.forEach(function (Data) {
                Data.w6_q21d_year = yearParce(w6_q21d_year);
                data.yearofmarriage = +data.yearofmarriage;
                console.log(relationshipMarData)
            });

            // parse data break up year 
            var relationshipBUData = relationshipBUData.forEach(function (Data) {
                Data.w6_q21e_year = yearParce(Data.w6_q21e_year);
                data.yearofbreakup = +data.yearofbreakup;
            });
            // ASK NATE ON MONDAY:  HOW DO I CREATE A x-AXIS FROM 1944 - 2017?
            // create scales
            var xYearScale = d3.scaleYear()
                .domain(d3.extent(relationshipMarData, d => w6_q21d_year))
                .range([75, width]);

            var yLinearScale = d3.scaleLinear()
                .domain([0, d3.max(relationshipData, d => d.CASEID.count)])
                .range([height, 0]);

            // create axes
            var xAxis = d3.axisBottom(xYearScale).tickFormat(d3.timeFormat("%y"));
            var yAxis = d3.axisLeft(yLinearScale).ticks(6);

            // append axes
            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            chartGroup.append("g")
                .call(yAxis);

            // line generator
            var line = d3.line()
                .x(d => xYearScale(d.relationshipMarData))
                .y(d => yLinearScale(d.CASEID));

            // append marrage year line
            chartGroupMar.append("path")
                .data([relationshipMarData])
                .attr("d", line)
                .attr("fill", "blue")
                .attr("stroke", "blue");

            // append divorse year line
            chartGroupBU.append("path")
                .data([relationshipBUData])
                .attr("d", line)
                .attr("fill", "red")
                .attr("stroke", "red");

            // append Marriage circles
            var circlesGroupMar = chartGroupMar.selectAll("circle")
                .data(relationshipMarData)
                .enter()
                .append("circle")
                .attr("cx", d => xYearScale(d.w6_q21d_year))
                .attr("cy", d => yLinearScale(d.CASEID))
                .attr("r", "10")
                .attr("fill", "gold")
                .attr("stroke-width", "1")
                .attr("stroke", "black");

            var circlesGroupBU = chartGroupBU.selectAll("circle")
                .data(relationshipBUData)
                .enter()
                .append("circle")
                .attr("cx", d => xYearScale(d.ww6_q21e_year))
                .attr("cy", d => yLinearScale(d.CASEID))
                .attr("r", "10")
                .attr("fill", "silver")
                .attr("stroke-width", "1")
                .attr("stroke", "black");

            // Date formatter to display dates nicely
            var dateFormatter = d3.timeFormat("%y");

            /// Step 1: Initialize Tooltip for Marriage data
            var toolTipMar = d3.tip()
                .attr("class", "tooltip")
                .offset([80, -60])
                .html(function (d) {
                    return (`<strong>${dateFormatter(d.date)}<strong><hr>${d.circlesGroupMar}
        medal(s) won`);
                });

            // Initialize Tooltip for breakup data
            var toolTipBU = d3.tip()
                .attr("class", "tooltip")
                .offset([70, -70])
                .html(function (d) {
                    return (`<strong>${dateFormatter(d.date)}<strong><hr>${d.circlesGroupBU}
          medal(s) won`);
                });

            //  Create the tooltip in chartGroupMar.
            chartGroupMar.call(toolTip);

            //  Create the tooltip in chartGroupBU.
            chartGroupBU.call(toolTip);

            //Create "mouseover" event listener to display each tooltip
            circlesGroupMar.on("mouseover", function (d) {
                toolTipMar.show(d, this);

                circlesGroupBU.on("mouseover", function (d) {
                    toolTipBU.show(d, this);
                })
                    // Create "mouseout" event listener to hide tooltip
                    .on("mouseout", function (d) {
                        toolTip.hide(d);
                    });
            });
        });

    // When the browser loads, makeResponsive() is called.
    makeResponsive();

    // When the browser window is resized, makeResponsive() is called.
    d3.select(window).on("resize", makeResponsive)};