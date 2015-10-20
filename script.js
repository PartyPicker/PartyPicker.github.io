
//var a=$(".policybutton")[0] //get a policutton
//a.parentNode.getElementsByClassName("party-info") //get its parents node which we want to control

var pbuttons = $(".policybutton");
for (pbi in pbuttons){
	if (isNaN(pbi))break;
	var pb = pbuttons[pbi];
	var collapser = pb.parentNode.getElementsByClassName("party-info")[0];
	var qid = "questionid-"+parseInt(pbi);
	pb.setAttribute("data-target", "#"+qid);
	collapser.id=qid;
}

//for each topic
function tallySupport() {
	var classes = ["green-support", "tory-support", "labour-support", "ukip-support", "libdem-support", "snp-support"];
	var limits = {"green-support":0, "tory-support":0, "labour-support":0, "ukip-support":0, "libdem-support":0, "snp-support":0};
	var results = {"green-support":0, "tory-support":0, "labour-support":0, "ukip-support":0, "libdem-support":0, "snp-support":0};

	for (var c in classes){
		var thisclass = classes[c];
		console.log(thisclass);
		var divs = document.getElementsByClassName(thisclass);
		for(var i = 0; i < divs.length; i++){
		//do something to each div like
		//divs[i].innerHTML = "something new...";
		//	count number of agreeing partys
			console.log(divs[i]);
			limits[thisclass]+=1
			 if(divs[i].parentElement.classList.contains("in"))
				results[thisclass]+=1
			/*var expanded = divs[i].getElementsByClassName("in");
			for(var j = 0; j < expanded.length; j++){
				console.log(expanded[j]);
				return expanded[j];		
			}*/
		//	update barchrt
		}
	}
	for (r in results){
		results[r]=results[r]/limits[r]*100.;
		}
	return results;
}
tallySupport();


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("1s"));

var svg = d3.select("body").append("svg")
//var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
function makechart(data) {
	svg[0][0].innerHTML="";
	
	//if (data==undefined){
		data=[tallySupport()];
	//	}
	console.log("data is:");
	console.log(data)
  var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Party"; });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  console.log(x0());
  x0.domain(data.map(function(d) { return d.Party; }));
  console.log(x0());
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Agreement%");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

};

$("button").click(function(){setTimeout(function(){ makechart(); }, 500);})