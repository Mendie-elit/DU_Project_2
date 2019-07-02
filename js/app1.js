// array of people who met before 2000
let people = {};
// array of people who met ater 2000
let people_2 = {};
let time_so_far = 0;

// Node size and spacing.
let radius = 5,
	  padding = 1, // Space between nodes
      cluster_padding = 5; // Space between nodes in different stages
    
// Dimensions of chart.
let margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 900 - margin.left - margin.right,
      height = 360 - margin.top - margin.bottom; 

// Don't think I need to re-assess later
// const margin_2 = { top: 20, right: 20, bottom: 20, left: 20 },
//       width = 900 - margin.left - margin.right,
//       height = 360 - margin.top - margin.bottom; 




let svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//  adding 2nd SVG for 2nd group of people met before 2000 
// don't think I need this either  
// const svg_2 = d3.select("#chart_2").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.select("#chart").style("width", (width+margin.left+margin.right)+"px");

// d3.select("#chart_2").style("width", (width+margin.left+margin.right)+"px");


// Group coordinates and meta info for group who met after 2000
let groups = {
    "time_from_met_to_rel": { x: width/4, y: height/2, color: "#FAF49A", cnt: 0, fullname: "Met" }, 
	  // "romantic": { x: 2*width/5, y: height/2, color: "#BEE5AA", cnt: 0, fullname: "Romantic" },
    "time_from_rel_to_cohab": { x: 2*width/4, y: height/2, color: "#93D1BA", cnt: 0, fullname: "Lived Together" },
    "time_married_hardcoded": { x: 3*width/4, y: height/2, color: "#79BACE", cnt: 0, fullname: "Married" },
    
};

// set up 2nd group for people met before 2000
let groups_2 = {
  "time_from_met_to_rel": { x: width/4, y: height/2, color: "#FAF49A", cnt: 0, fullname: "Met" }, 
  // "romantic": { x: 2*width/5, y: height/2, color: "#BEE5AA", cnt: 0, fullname: "Romantic" },
  "time_from_rel_to_cohab": { x: 2*width/4, y: height/2, color: "#93D1BA", cnt: 0, fullname: "Lived Together" },
  "time_married_hardcoded": { x: 3*width/4, y: height/2, color: "#79BACE", cnt: 0, fullname: "Married" },
  
};



// Load data.
// const stages = d3.csv("data/test_data_file.csv", d3.autoType);
let stages = d3.csv("data/tall_relationship_data_sample_year_met_melt_year.csv", d3.autoType);

// Build array for people who bet after 2000
// Once data is loaded...
stages.then(function(data) {

  met_after_2000 = []
// console.log(data);         
//     // Consolidate stages by pid.
//     // The data file is one row per stage change.
    data.forEach(d => {
        d.duration = d.duration * 12;
        
        if(d.w6_q21a_year > 2000) {
          if (d3.keys(people).includes(d.pid+"")) {

          met_after_2000[d.pid+""].push(d);
        }
        else {
          met_after_2000[d.pid+""] = [d];
        }
      }

        if (d3.keys(people).includes(d.pid+"")) {
            people[d.pid+""].push(d);}
       

        else {
            people[d.pid+""] = [d];
        }

                
           });
    people = met_after_2000;

    
    console.log(people);

    
// select people_2 for group met before 2000
stages.then(function(data) {

  met_before_2000 = [] 
  
    data.forEach(d => {
      d.duration = d.duration * 12;

      if(d.w6_q21a_year < 2000) {
        if (d3.keys(people_2).includes(d.pid+"")) {

        met_before_2000[d.pid+""].push(d);
      }
      else {
        met_before_2000[d.pid+""] = [d];
      }
    }

      if (d3.keys(people_2).includes(d.pid+"")) {
        people_2[d.pid+""].push(d);}

        else {
          people_2[d.pid+""] = [d];
      }

              
         });
      
    // });
    people_2 = met_before_2000;

    console.log(people_2);


        
    
    // Create node data.
    var nodes = d3.keys(people).map(function(d) {
        
        // Initialize coount for each group.
        // 
        groups[people[d][0].grp].cnt += 1;
     
        
        return {
            id: "node"+d,
            x: groups[people[d][0].grp].x + Math.random(),
            y: groups[people[d][0].grp].y + Math.random(),
            r: radius,
            color: groups[people[d][0].grp].color,
            group: people[d][0].grp,
            // `duration` is in fraction of years
            // multiply by 12 to get unit of months
            // `timeleft` is in months
            timeleft: people[d][0].duration ,
            istage: 0,
            stages: people[d]
        }
    });


    // Create node data for people_2
    var nodes_2 = d3.keys(people_2).map(function(d) {
        
      // Initialize coount for each group.
      // 
      groups_2[people_2[d][0].grp].cnt += 1;

      return {
        id: "node"+d,
        x: groups_2[people_2[d][0].grp].x + Math.random(),
        y: groups_2[people_2[d][0].grp].y + Math.random(),
        r: radius,
        color: groups_2[people_2[d][0].grp].color,
        group: people_2[d][0].grp,
        // `duration` is in fraction of years
        // multiply by 12 to get unit of months
        // `timeleft` is in months
        timeleft: people_2[d][0].duration ,
        istage: 0,
        stages: people_2[d]
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

    // Circle for each node. People met after 2000 
    let circle_2 = svg.append("g")
        .selectAll("circle")
        .data(nodes_2)
        .join("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("fill", d => d.color);
    
    // Ease in the circles.
    circle_2.transition()
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



    // // Group name labels. People met before 2000 `groups_2`
    svg.selectAll('.grp')
    .data(d3.keys(groups_2))
    .join("text")
        .attr("class", "grp")
        .attr("text-anchor", "middle")
        .attr("x", d => groups_2[d].x)
        .attr("y", d => 50)
        .text(d => groups_2[d].fullname);

    // Group counts. people who met before 2000 `groups_2`
    svg.selectAll('.grpcnt')
      .data(d3.keys(groups_2))
      .join("text")
          .attr("class", "grpcnt")
          .attr("text-anchor", "middle")
          .attr("x", d => groups_2[d].x)
          .attr("y", d => 70)
          .text(d => groups_2[d].cnt);





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



    // Forces `groups_2` met before 2000 
    let simulation_2 = d3.forceSimulation(nodes_2)
        .force("x", d => d3.forceX(d.x))
        .force("y", d => d3.forceY(d.y))
        .force("cluster", forceCluster())
        .force("collide", forceCollide())
        .alpha(.09)
        .alphaDecay(0);

      // Adjust position of circles. For `group_2` met before 2000 
    simulation_2.on("tick", () => { 
      circle
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("fill", d => groups_2[d.group].color);
      });
    




   
//    Note this was causing an error when using map function 
// });

// Make time pass. Adjust node stage as necessary. For `nodes` for `groups`
function timer() {
        
  nodes.forEach(function(o,i) {
      o.timeleft -= 1;
      if (o.timeleft <= 0 && o.istage < o.stages.length-1) {
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
   time_so_far += 1;
  d3.select("#timecount .cnt").text(time_so_far);
  
  // Update counters. for `nodes` and `groups`
  svg.selectAll('.grpcnt').text(d => groups[d].cnt);
  
  // Do it again. for `nodes` and `groups`
  d3.timeout(timer, 900);
  
} // @end timer()


// Start things off after a few seconds. For `nodes` and `groups`
d3.timeout(timer, 2000);

// This ended when only had one node
});


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



// // Make time pass. Adjust node stage as necessary. For `nodes_2` and `groups_2`
function timer() {
// console error that nodes_2 is not defined.  I don't know why
  nodes_2.forEach(function(o,i) {
      o.timeleft -= 1;
      if (o.timeleft <= 0 && o.istage < o.stages.length-1) {
        // Decrease counter for previous group.
        groups_2[o.group].cnt -= 1;
        
        // Update current node to new group.
        o.istage += 1;
        o.group = o.stages[o.istage].grp;
        o.timeleft = o.stages[o.istage].duration;
        
        // Increment counter for new group.
        groups_2[o.group].cnt += 1;
    }
});

// Increment time. For `nodes_2` and `groups_2`
  time_so_far += 1;
d3.select("#timecount .cnt").text(time_so_far);
    
 // Update counters. for `nodes` and `groups`
   svg.selectAll('.grpcnt').text(d => groups_2[d].cnt);

 // Do it again. for `nodes_2` and `groups_2`
 d3.timeout(timer, 900);
  
} // @end timer()

// Start things off after a few seconds. For `nodes` and `groups`
d3.timeout(timer, 2000);


});

// // Force to increment `nodes_2 `to groups_2`.
function forceCluster() {
  let strength_2 = .15;
  // script does not like nodes_2 here
  let nodes_2;

  function force(alpha) {
    let l_2 = alpha * strength_2;
    for (const d of nodes_2) {
      d.vx -= (d.x - groups_2[d.group].x) * l_2;
      d.vy -= (d.y - groups_2[d.group].y) * l_2;
    }
  }
  force.initialize = _ => nodes_2 = _;

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

// Force for collision detection. For `nodes_2` and `groups_2`
// function forceCollide() {
//   let alpha = 0.2; // fixed for greater rigidity!
//   let padding1_2 = padding; // separation between same-color nodes
//   let padding2_2 = cluster_padding; // separation between different-color nodes
//   let nodes_2;
//   let maxRadius_2;

//   function force() {
//     let quadtree_2 = d3.quadtree(nodes_2, d => d.x, d => d.y);
//     for (const d of nodes_2) {
//       const r = d.r + maxRadius_2;
//       const nx1 = d.x - r, ny1 = d.y - r;
//       const nx2 = d.x + r, ny2 = d.y + r;
//       quadtree_2.visit((q, x1, y1, x2, y2) => {
      
//         if (!q.length) do {
//           if (q.data !== d) {
//             const r = d.r + q.data.r + (d.group === q.data.group ? padding1_2 : padding2_2);
//             let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
//             if (l < r) {
//               l = (l - r) / l * alpha;
//               d.x -= x *= l, d.y -= y *= l;
//               q.data.x += x, q.data.y += y;
//             }
//           }
//         } while (q = q.next);
//         return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//       });
//     }
//   }

//   force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1_2, padding2_2);

//   return force;

// }

