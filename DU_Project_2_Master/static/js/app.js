

////////////// BUILD DATA FUNCTION HERE //////////////
////////////// Ryan's APP.js File for project ////////


function buildBachelor(respondents) {

    // svg container
  var svgHeight = 400;
  var svgWidth = 1000;

  // margins
  var margin = {
    top: 70,
    right: 50,
    bottom: 70,
    left: 50
  };

  // chart area minus margins
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;

  // create svg container
  var svg = d3.select("#plot").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

  // shift everything over by the margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight - 225)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Marriage Ages of College Grad Respondents")
  
  var url = `/data`

  d3.json(url).then(function(data){

    // console.log(Object.entries(data))

    let total_respondents = data.length;

    // console.log(total_respondents)

    function selectHighSchool(person) {
      return person.education === "12th grade NO DIPLOMA" 
    };
    var highSchool = data.filter(selectHighSchool);

    ///////

    function selectBachelors(person) {
      return person.education === "Bachelors degree"; 
    }
    var Bachelors = data.filter(selectBachelors)

    ///////

    function selectMasters(person) {
      return person.education === "Masters degree"; 
    }
    var Masters = data.filter(selectMasters)

    ///////

    function selectHighSchoolGrad(person) {
      return person.education === "HIGH SCHOOL GRADUATE - high school DIPLOMA or the equivalent (GED)"; 
    }
    var highGrad = data.filter(selectHighSchoolGrad)

    ///////

    function selectAssociates(person) {
      return person.education === "Associate degree"; 
    }
    var Associates = data.filter(selectAssociates)

    ///////

    function selectProfessional(person) {
      return person.education === "Professional or Doctorate degree"; 
    }
    var Professionals = data.filter(selectProfessional)

    ///////

    function selectSomeCollege(person) {
      return person.education === "Some college, no degree"; 
    }
    var someColleges = data.filter(selectSomeCollege)

    ///////

    function select12(person) {
      return person.education === "12th grade NO DIPLOMA"; 
    }
    var high12 = data.filter(select12)

    ///////

    function select9(person) {
      return person.education === "9th grade"; 
    }
    var high9 = data.filter(select9)

    ///////

    function select11(person) {
      return person.education === "11th grade"; 
    }
    var high11 = data.filter(select11)

    ///////

    function select10(person) {
      return person.education === "10th grade"; 
    }
    var high10 = data.filter(select10)

    ///////

    function select78(person) {
      return person.education === "7th or 8th grade"; 
    }
    var high78 = data.filter(select78)

    ///////

    function select56(person) {
      return person.education === "5th or 6th grade"; 
    }
    var high56 = data.filter(select56)

    ///////

    function selectNoEduc(person) {
      return person.education === "No formal education"; 
    }
    var noEducation = data.filter(selectNoEduc)

    ///////

    function selectPre5(person) {
      return person.education === "1st, 2nd, 3rd, or 4th grade"; 
    }
    var highPre5 = data.filter(selectPre5)

    /////// combine all into three groups: advanced, bachelors, highschool

    var totalBachelors = Bachelors.concat(Masters, Professionals)

    // console.log(totalBachelors)

    var totalHighSchool = highSchool.concat(highPre5, noEducation, high56,
      high78, high10, high11, high9, high12, highGrad)

    // console.log(totalHighSchool)

    /////// now pull the dates and counts into variables to plot

    var bachelorAges = totalBachelors.map(function(cGraduate) {
      return cGraduate.age_when_married;
    })
    console.log("here are the bachelor ages ==============================")
    console.log(bachelorAges)


    /////// now count the unique values to put into a bar graph

    // var bachelorCount = {}

    // for (var i = 0; i< bachelorAges.length; i++) {
    //   bachelorCount[bachelorAges[i]] = 1 + (bachelorCount[bachelorAges[i]] || 0);
    // }

    bachelorCount = {}

    for (var i = 0; i < bachelorAges.length; i++) {
      var num = bachelorAges[i]
      bachelorCount[num] = bachelorCount[num] ? bachelorCount[num] + 1 : 1;
    }


    var x_domain = Object.keys(bachelorCount)
    var x_1 = Object.values(bachelorCount)
    console.log("============== bachelor count ===============")
    console.log(bachelorCount)
    console.log("============== x_1 ===============")
    console.log(x_1)
    console.log("============== x_domain ===============")
    console.log(x_domain)


    // get the average of the values in the x_1 array

    var sum = bachelorAges.reduce(function(a, b) {return a + b; }, 0);
    var avg = sum / bachelorAges.length;

    console.log("HERE IS THE AVERAGE")
    console.log(avg)


    /////////// NOW BUILD THE BAR CHART HERE ///////////

    // scale y to chart height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(x_1)])
      .range([chartHeight, 0]);

    // scale x to chart width
    var xScale = d3.scaleBand()
      .domain(x_domain)
      .range([0, chartWidth])
      .padding(0.05);

      // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    // set y to the y axis
    // This syntax allows us to call the axis function
    // and pass in the selector without breaking the chaining
    chartGroup.append("g")
      .call(yAxis);

    // Append Data to chartGroup
    var barsGroup = chartGroup.selectAll(".bar")
      .data(x_1)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", (d, i) => xScale(x_domain[i]))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => chartHeight - yScale(d));

      // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var xLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "hair_length") // value to grab for event listener
      .classed("active", true)
      .text("Age of Marriage");

    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .text("Count of People Married");

    })
};

buildBachelor()

// build high school data here

function buildHighSchool(respondents) {

  // svg container
var svgHeight = 400;
var svgWidth = 1000;

// margins
var margin = {
  top: 70,
  right: 50,
  bottom: 70,
  left: 50
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#plot_2").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

svg.append("text")
  .attr("x", chartWidth / 2)
  .attr("y", chartHeight - 225)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Marriage Ages of High School Grad Respondents")

var url = `/data`

d3.json(url).then(function(data){

  // console.log(Object.entries(data))

  let total_respondents = data.length;

  // console.log(total_respondents)

  function selectHighSchool(person) {
    return person.education === "12th grade NO DIPLOMA" 
  };
  var highSchool = data.filter(selectHighSchool);

  ///////

  function selectBachelors(person) {
    return person.education === "Bachelors degree"; 
  }
  var Bachelors = data.filter(selectBachelors)

  ///////

  function selectMasters(person) {
    return person.education === "Masters degree"; 
  }
  var Masters = data.filter(selectMasters)

  ///////

  function selectHighSchoolGrad(person) {
    return person.education === "HIGH SCHOOL GRADUATE - high school DIPLOMA or the equivalent (GED)"; 
  }
  var highGrad = data.filter(selectHighSchoolGrad)

  ///////

  function selectAssociates(person) {
    return person.education === "Associate degree"; 
  }
  var Associates = data.filter(selectAssociates)

  ///////

  function selectProfessional(person) {
    return person.education === "Professional or Doctorate degree"; 
  }
  var Professionals = data.filter(selectProfessional)

  ///////

  function selectSomeCollege(person) {
    return person.education === "Some college, no degree"; 
  }
  var someColleges = data.filter(selectSomeCollege)

  ///////

  function select12(person) {
    return person.education === "12th grade NO DIPLOMA"; 
  }
  var high12 = data.filter(select12)

  ///////

  function select9(person) {
    return person.education === "9th grade"; 
  }
  var high9 = data.filter(select9)

  ///////

  function select11(person) {
    return person.education === "11th grade"; 
  }
  var high11 = data.filter(select11)

  ///////

  function select10(person) {
    return person.education === "10th grade"; 
  }
  var high10 = data.filter(select10)

  ///////

  function select78(person) {
    return person.education === "7th or 8th grade"; 
  }
  var high78 = data.filter(select78)

  ///////

  function select56(person) {
    return person.education === "5th or 6th grade"; 
  }
  var high56 = data.filter(select56)

  ///////

  function selectNoEduc(person) {
    return person.education === "No formal education"; 
  }
  var noEducation = data.filter(selectNoEduc)

  ///////

  function selectPre5(person) {
    return person.education === "1st, 2nd, 3rd, or 4th grade"; 
  }
  var highPre5 = data.filter(selectPre5)

  /////// combine all into three groups: advanced, bachelors, highschool

  var totalBachelors = Bachelors.concat(Associates, Masters, Professionals)

  // console.log(totalBachelors)

  var totalHighSchool = highSchool.concat(highPre5, noEducation, high56,
    high78, high10, high11, high9, high12, highGrad)

  // console.log(totalHighSchool)

  /////// now pull the dates and counts into variables to plot

  var bachelorAges = totalBachelors.map(function(cGraduate) {
    return cGraduate.age_when_married;
  })

  // console.log(bachelorAges)

  var highSchoolAges = totalHighSchool.map(function(hsGraduate) {
    return hsGraduate.age_when_married;
  })

  // console.log(highSchoolAges)

  /////// now count the unique values to put into a bar graph

  var highCount = {}

  // for (var i = 0; i< highSchoolAges.length; i++) {
  //   highSchoolCount[highSchoolAges[i]] = 1 + (highSchoolCount[highSchoolAges[i]] || 0);

  for (var i = 0; i < highSchoolAges.length; i++) {
    var num = highSchoolAges[i]
    highCount[num] = highCount[num] ? highCount[num] + 1 : 1;
  }

  var x_domain = Object.keys(highCount)
  var x_1 = Object.values(highCount)

  console.log(" HIGH SCHOOL COUNTS")
  console.log("this is the x_domain")
  console.log(x_domain)
  console.log("this is the x_1")
  console.log(x_1)
  console.log(highCount)

  // console.log(highSchoolCount)

  /////////// NOW BUILD THE BAR CHART HERE ///////////

  // scale y to chart height
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(x_1)])
    .range([chartHeight, 0]);

  // scale x to chart width
  var xScale = d3.scaleBand()
    .domain(x_domain)
    .range([0, chartWidth])
    .padding(0.05);

    // create axes
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

  // set x to the bottom of the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  // set y to the y axis
  // This syntax allows us to call the axis function
  // and pass in the selector without breaking the chaining
  chartGroup.append("g")
    .call(yAxis);

      // Append Data to chartGroup
  var barsGroup = chartGroup.selectAll(".bar")
    .data(x_1)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("x", (d, i) => xScale(x_domain[i]))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartHeight - yScale(d));

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var xLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "hair_length") // value to grab for event listener
    .classed("active", true)
    .text("Age of Marriage");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .text("Count of People Married");




  barsGroup.on("mouseover", function() {
    d3.select(this)
      .transition()
      .duration(500)
      .attr("fill", "grey");
  })
    .on("mouseout", function() {
    d3.select(this)
      .transition()
      .duration(500)
      .attr("fill", "black")
    })
})
};

buildHighSchool()

// build advanced here

function buildAdvanced(respondents) {

  // svg container
var svgHeight = 400;
var svgWidth = 1000;

// margins
var margin = {
  top: 70,
  right: 50,
  bottom: 70,
  left: 50
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#plot_2").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

svg.append("text")
  .attr("x", chartWidth / 2)
  .attr("y", chartHeight - 235)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Marriage Ages of Professional Grad Respondents")

var url = `/data`

d3.json(url).then(function(data){

  // console.log(Object.entries(data))

  let total_respondents = data.length;

  // console.log(total_respondents)

  function selectHighSchool(person) {
    return person.education === "12th grade NO DIPLOMA" 
  };
  var highSchool = data.filter(selectHighSchool);

  ///////

  function selectBachelors(person) {
    return person.education === "Bachelors degree"; 
  }
  var Bachelors = data.filter(selectBachelors)

  ///////

  function selectMasters(person) {
    return person.education === "Masters degree"; 
  }
  var Masters = data.filter(selectMasters)

  ///////

  function selectHighSchoolGrad(person) {
    return person.education === "HIGH SCHOOL GRADUATE - high school DIPLOMA or the equivalent (GED)"; 
  }
  var highGrad = data.filter(selectHighSchoolGrad)

  ///////

  function selectAssociates(person) {
    return person.education === "Associate degree"; 
  }
  var Associates = data.filter(selectAssociates)

  ///////

  function selectProfessional(person) {
    return person.education === "Professional or Doctorate degree"; 
  }
  var Professionals = data.filter(selectProfessional)

  ///////

  function selectSomeCollege(person) {
    return person.education === "Some college, no degree"; 
  }
  var someColleges = data.filter(selectSomeCollege)

  ///////

  function select12(person) {
    return person.education === "12th grade NO DIPLOMA"; 
  }
  var high12 = data.filter(select12)

  ///////

  function select9(person) {
    return person.education === "9th grade"; 
  }
  var high9 = data.filter(select9)

  ///////

  function select11(person) {
    return person.education === "11th grade"; 
  }
  var high11 = data.filter(select11)

  ///////

  function select10(person) {
    return person.education === "10th grade"; 
  }
  var high10 = data.filter(select10)

  ///////

  function select78(person) {
    return person.education === "7th or 8th grade"; 
  }
  var high78 = data.filter(select78)

  ///////

  function select56(person) {
    return person.education === "5th or 6th grade"; 
  }
  var high56 = data.filter(select56)

  ///////

  function selectNoEduc(person) {
    return person.education === "No formal education"; 
  }
  var noEducation = data.filter(selectNoEduc)

  ///////

  function selectPre5(person) {
    return person.education === "1st, 2nd, 3rd, or 4th grade"; 
  }
  var highPre5 = data.filter(selectPre5)

  /////// combine all into three groups: advanced, bachelors, highschool

  var totalAdvanced = Masters.concat(Professionals)

  console.log('this is the total advanced object')
  console.log(totalAdvanced)

  // console.log(totalHighSchool)

  /////// now pull the dates and counts into variables to plot

  var advancedAges = totalAdvanced.map(function(advancedGrad) {
    return advancedGrad.age_when_married;
  })

  

  /////// now count the unique values to put into a bar graph

  var advancedCount = {}

  for (var i = 0; i< advancedAges.length; i++) {
    advancedCount[advancedAges[i]] = 1 + (advancedCount[advancedAges[i]] || 0);
  }

  var x_domain = Object.keys(advancedCount)
  var x_1 = Object.values(advancedCount)

  console.log("this is the x_domain")
  console.log(x_domain)
  console.log("this is the x_1")
  console.log(x_1)
  console.log(advancedCount)

  // console.log(highSchoolCount)

  /////////// NOW BUILD THE BAR CHART HERE ///////////

  // scale y to chart height
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(x_1)])
    .range([chartHeight, 0]);

  // scale x to chart width
  var xScale = d3.scaleBand()
    .domain(x_domain)
    .range([0, chartWidth])
    .padding(0.05);

    // create axes
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

  // set x to the bottom of the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  // set y to the y axis
  // This syntax allows us to call the axis function
  // and pass in the selector without breaking the chaining
  chartGroup.append("g")
    .call(yAxis);

      // Append Data to chartGroup
  var barsGroup = chartGroup.selectAll(".bar")
    .data(x_1)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("x", (d, i) => xScale(x_domain[i]))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => chartHeight - yScale(d));

    // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var xLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "hair_length") // value to grab for event listener
    .classed("active", true)
    .text("Age of Marriage");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .text("Count of People Married");

  barsGroup.on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "grey");
    })
      .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(500)
        .attr("fill", "black")
      })

})
};

buildAdvanced()



