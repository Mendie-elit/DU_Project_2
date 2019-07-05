
let time_so_far = 0;

// Node size and spacing.
let radius = 5,
  padding = 1, // Space between nodes
  cluster_padding = 5; // Space between nodes in different stages

// Dimensions of chart.
let margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 900 - margin.left - margin.right,
  height = 180 - margin.top - margin.bottom;




let svg_1 = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let svg_2 = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//  adding 2nd SVG for 2nd group of people met before 2000 

svg_1.append("text")
  // .attr("class", "x label")
  // .style("middle")
  .attr("x", "10")
  .attr("y", "90")
  .text("Met after 2005")
  .style("font-size", "20")

svg_2.append("text")
  .attr("x", "10")
  .attr("y", "80")
  .text("Met before 1980")
  .style("font-size", "20")


 


d3.select("#chart").style("width", (width + margin.left + margin.right) + "px");




// Load data.

let stages = d3.csv("static/tall_relationship_data_sample_year_met_melt_year.csv", d3.autoType);

// Build array for people who bet after 2000
// Once data is loaded...
stages.then(function (data) {


  var make_chart = function (data, svg) {

    // d3.select("#chart_2").style("width", (width+margin.left+margin.right)+"px");
    // array of people who met before 2000
    let people = {};
    // let people = {};
    // array of people who met ater 2000


    // Group coordinates and meta info for group who met after 2000
    let groups = {
      // "romantic": { x: 2*width/5, y: height/2, color: "#BEE5AA", fullname: "Met after 2005" },
      "time_from_met_to_rel": { x: width / 4, y: height / 2, color: "#FAF49A", cnt: 0, fullname: "Met", size: 50 },
      // "romantic": { x: 2*width/5, y: height/2, color: "#BEE5AA", cnt: 0, fullname: "Romantic" },
      "time_from_rel_to_cohab": { x: 2 * width / 4, y: height / 2, color: "#93D1BA", cnt: 0, fullname: "Relationship" },
      "time_married_hardcoded": { x: 3 * width / 4, y: height / 2, color: "#79BACE", cnt: 0, fullname: "Cohabitate/Married" },

    };


    data.forEach(d => {
      d.duration = d.duration * 12;

      if (d3.keys(people).includes(d.pid + "")) {
        people[d.pid + ""].push(d);
      }

      else {
        people[d.pid + ""] = [d];
      }

    });

    console.log(people);




    // Create node data.
    var nodes = d3.keys(people).map(function (d) {

      // Initialize coount for each group.
      // 
      groups[people[d][0].grp].cnt += 1;


      return {
        id: "node" + d,
        x: groups[people[d][0].grp].x + Math.random(),
        y: groups[people[d][0].grp].y + Math.random(),
        r: radius,
        color: groups[people[d][0].grp].color,
        group: people[d][0].grp,
        // `duration` is in fraction of years
        // multiply by 12 to get unit of months
        // `timeleft` is in months
        timeleft: people[d][0].duration,
        istage: 0,
        stages: people[d]
      }
    });





    // Circle for each node. People met after 2000 
    let circle = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", d => d.color);

    // Ease in the circles.
    circle.transition()
      .delay((d, i) => i * 5)
      .duration(800)
      .attrTween("r", d => {
        const i = d3.interpolate(0, d.r);
        return t => d.r = i(t);
      });



    // Group name labels. People met after 2000 
    svg.selectAll('.grp')
      .data(d3.keys(groups))
      .join("text")
      .attr("class", "grp")
      .attr("text-anchor", "middle")
      .attr("x", d => groups[d].x)
      .attr("y", d => 50)
      .text(d => groups[d].fullname);

    // Group counts. people who met after 2000 `groups`
    svg.selectAll('.grpcnt')
      .data(d3.keys(groups))
      .join("text")
      .attr("class", "grpcnt")
      .attr("text-anchor", "middle")
      .attr("x", d => groups[d].x)
      .attr("y", d => 70)
      .text(d => groups[d].cnt);








    // Forces `groups` met after 2000 
    let simulation = d3.forceSimulation(nodes)
      .force("x", d => d3.forceX(d.x))
      .force("y", d => d3.forceY(d.y))
      .force("cluster", forceCluster())
      .force("collide", forceCollide())
      .alpha(.09)
      .alphaDecay(0);

    // Adjust position of circles. For `group` met after 2000 
    simulation.on("tick", () => {
      circle
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => groups[d.group].color);
    });









    //    Note this was causing an error when using map function 
    // });

    // Make time pass. Adjust node stage as necessary. For `nodes` for `groups`
    function timer() {

      nodes.forEach(function (o, i) {
        o.timeleft -= 1;
        if (o.timeleft <= 0 && o.istage < o.stages.length - 1) {
          // Decrease counter for previous group.
          groups[o.group].cnt -= 1;

          // Update current node to new group.
          o.istage += 1;
          o.group = o.stages[o.istage].grp;
          o.timeleft = o.stages[o.istage].duration;

          // Increment counter for new group.
          groups[o.group].cnt += 1;
        }
      });

      // Increment time. For `nodes` and `groups`
      time_so_far += 1/12;

      function indexToTime(i) {
    
        var months = 1 % 12;
        var years = Math.floor(1 / 12);
        
        var time_string = '';
        
        if (time_so_far == .96) {
            time_string += years + " year";
        } else if (time_so_far > .96) {
            time_string += parseInt(time_so_far) + " years";
        }
        
        if (years > .96) {
            time_string += ", ";
        }

        if (time_so_far < .96) {
              time_string += months += " < 12 months";
          } 
          // else {
          //     time_string += months += " months";
          // }
        
        // if (time_so_far == .08) {
        //     time_string += "1 month";
        // } else {
        //     time_string += months += " months";
        // }
        
        return time_string;
      };

      // time_so_far += 1;
      // d3.select("#timecount .cnt").text(time_so_far);
      d3.select("#timecount .cnt").text(indexToTime);


      // Update counters. for `nodes` and `groups`
      svg.selectAll('.grpcnt').text(d => groups[d].cnt);

      // Do it again. for `nodes` and `groups`
      d3.timeout(timer, 300);

    } // @end timer()


    // Start things off after a few seconds. For `nodes` and `groups`
    d3.timeout(timer, 300);

    // Force to increment `nodes `to groups`.
    function forceCluster() {
      let strength = .15;
      let nodes;

      function force(alpha) {
        let l = alpha * strength;
        for (const d of nodes) {
          d.vx -= (d.x - groups[d.group].x) * l;
          d.vy -= (d.y - groups[d.group].y) * l;
        }
      }
      force.initialize = _ => nodes = _;

      return force;
    }




    // Force for collision detection. For `nodes` and `groups`
    function forceCollide() {
      const alpha = 0.2; // fixed for greater rigidity!
      const padding1 = padding; // separation between same-color nodes
      const padding2 = cluster_padding; // separation between different-color nodes
      let nodes;
      let maxRadius;

      function force() {
        const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
        for (const d of nodes) {
          const r = d.r + maxRadius;
          const nx1 = d.x - r, ny1 = d.y - r;
          const nx2 = d.x + r, ny2 = d.y + r;
          quadtree.visit((q, x1, y1, x2, y2) => {

            if (!q.length) do {
              if (q.data !== d) {
                const r = d.r + q.data.r + (d.group === q.data.group ? padding1 : padding2);
                let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l, d.y -= y *= l;
                  q.data.x += x, q.data.y += y;
                }
              }
            } while (q = q.next);
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        }
      }

      force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);

      return force;

    }


  }

  var data_1 = data.filter(function(i) {
    return i.w6_q21a_year > 2005;
  });

  console.log(data_1);

  var data_2 = data.filter(function(i) {
    return i.w6_q21a_year < 1980;
  });


  // For MENDIE TODO: 
  // Instead of passing in *all* the user data
  // make two separate data arrays;
  // var data_1 = data.filter(...)
  // var data_2 = data.filter(...)
  // filter each dataset appropriately,
  // then pass data_1 into the first, below, and data_2 into the second, below
  make_chart(data_1, svg_1);
  make_chart(data_2, svg_2);
  // This ended when only had one node
});

