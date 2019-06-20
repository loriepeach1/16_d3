//  Set the size of the canvas
var svgWidth = 760;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 100, left: 120 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

d3.csv("assets/data/mydata.csv", function(err, mydata) {
	if (err) throw err;

			mydata.forEach(function(data) {
				//1st Chart - DEFAULT
				// x = poverty and y = healthcareLow
				data.poverty = +data.poverty;
				data.healthcareLow = +data.healthcareLow;

				//2nd_ Chart
				//x = age and y = smokes
				data.age = +data.age
				data.smokes = +data.smokes
				
				//3rd chart
				//x = income and y = obesity
				data.income = +data.income
				data.obesity = +data.obesity

				
			});
			console.log(mydata)

			// Create scale functions
			var yLinearScale = d3.scaleLinear().range([height, 0]);

			var xLinearScale = d3.scaleLinear().range([0, width]);

			// Create axis functions
			var bottomAxis = d3.axisBottom(xLinearScale);
			var leftAxis = d3.axisLeft(yLinearScale);

			 // These variables store the minimum and maximum values in a column in data.csv
			var xMin;
			var xMax;
			var yMax;
			var yMin;

			// These functions identifies the minimum and maximum values in a column in mydata.csv
			// and assign them to xMin and xMax variables, which will define the axis domain
			function findMinAndMax_X(dataColumnX) {
				xMin = d3.min(mydata, function(data) {
					//console.log("WRONG:  last returned value X Min: " + xMin)
					return +data[dataColumnX] * 0.75;
				});

				xMax = d3.max(mydata, function(data) {
					//console.log("WRONG:  last returned value X Max: " + xMax)
					return +data[dataColumnX] * 1.1;
				});

			}
				
			function findMinAndMax_Y(dataColumnY) {
				yMin = d3.min(mydata, function(data) {
					//console.log("'wrong Y Min: " + yMin)
					return +data[dataColumnY] * 0.75;
				});
	
				yMax = d3.max(mydata, function(data) {
					//console.log("WRONG Y Max: " + yMax)
					return +data[dataColumnY] * 1.1;
				});
			}

			// The default x-axis is 'poverty'  
			// Another axis can be assigned to the variable during an onclick event.
			// This variable is key to the ability to change axis/data column
			var currentAxisLabelX = "poverty";
			var currentAxisLabelY = "healthcareLow";

			// Call findMinAndMax() with 'poverty' aka currentAxisLabel as default
			findMinAndMax_X(currentAxisLabelX);
			findMinAndMax_Y(currentAxisLabelY);


			// Scale the domain
			xLinearScale.domain([xMin,xMax]);
			yLinearScale.domain([yMin,yMax]);

		// defining tooltip 
		//2nd chart - age & smokes
		//3rd chart - income & obesity
			var toolTip = d3.tip()
					.attr("class", "tooltip")
					.offset([80, -60])
					.html(function(data) {
						//data points
						var state = data.state;
						var xinfo // x-axis tooltip value
						var yinfo //y-axis tooltip value
						var xdata = +data[currentAxisLabelX];
						var ydata = +data[currentAxisLabelY];

						// 1st chart data fields
						var poverty = +data.poverty;
						var healthcareLow = +data.healthcareLow;
						// 2nd chart data fields
						var age = +data.age
						var smokes = +data.smokes
						// 3rd chart data fields
						var income = +data.income
						var obesity = +data.obesity

						// designing tool tip based on which X-AXIS is active

						if (currentAxisLabelX === 'poverty') {
							xinfo = "In Poverty (%): " + poverty;
						}
						else if (currentAxisLabelX === 'income') {
							xinfo = "Household Income (median): " + income
						}
						else {
							xinfo = "Age (median): " + age
						}
						// return (state + xinfo + xdata);
						// designing tool tip based on which Y-AXIS is active

						if (currentAxisLabelY === 'healthcareLow') {
							yinfo = "Lacking Healthcare (%): " + healthcareLow
						}

						else if (currentAxisLabelY === 'obesity'){
							yinfo = "Obesity (%): " + obesity
						}
						else{
							yinfo = "Smokes (%): " + smokes
						}
							console.log(state,":",xinfo, yinfo)
						return state + "<hr>" + xinfo + "<br>" + yinfo;
					
					});

			chart.call(toolTip);
								
			chart.selectAll("circle")
						.data(mydata)
						.enter().append("circle")
						.attr("cx", function(data, index) {
							// console.log(data.poverty);
							return xLinearScale(+data[currentAxisLabelX]);
						})
						.attr("cy", function(data, index) {
							return yLinearScale(+data[currentAxisLabelY]);
						})
						.attr("r", "15")
						// // or when using calculation for radius
						// .attr("r", function(data, index){
						//   return data.healthcareLow;
						// })
					 	.attr("fill", "orange")
					 	.attr("opacity", 0.45)
						.on("mouseover", function(data) {
							toolTip.show(data);
						})
						// onmouseout event
						.on("mouseout", function(data, index) {
							toolTip.hide(data);
						});

			var text = chart.selectAll("text")
								.data(mydata)
								.enter()
								.append("text")
								.attr("class", "labels")
								.attr("x", function(data, index) {
									return xLinearScale(+data[currentAxisLabelX]-0.01);
									})
								.attr("y", function(data, index) {
									return yLinearScale(+data[currentAxisLabelY]-0.3);
									})
								.text(function(data){
									return data.abbr;
										})
								// .attr("font-family", "sans-serif")
								// .attr("font-size", "10px")
								// .attr("fill", "#12536d");

		// append an SVG group for x-axis and display x-axis
			chart.append("g")
				.attr("transform", `translate(0, ${height})`)
				.attr("class", "x-axis")
				.call(bottomAxis);

		// append a group for y-axis and display y-axis
			chart.append("g")
				.call(leftAxis);

		//append y-axis label for active y-axis
			chart.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - margin.left + 10)
					.attr("x", 0 - (height/1.5))
					.attr("dy", "1em")
					.attr("class", "yaxisText yactive")
					.attr("data-axis-name", "healthcareLow")
					.text("Lacking Healthcare (%)");

		//append y-label for inactive y-axis
		chart.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - margin.left + 30)
					.attr("x", 0 - (height / 1.80))
					.attr("dy", "1em")
					.attr("class", "yaxisText yinactive")
					.attr("data-axis-name", "smokes")
					.text("Smokes (%)");

		//append y-label for inactive y-axis
		 chart.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0 - margin.left + 50)
					.attr("x", 0 - (height / 1.80))
					.attr("dy", "1em")
					.attr("class", "yaxisText yinactive")
					.attr("data-axis-name", "obesity")
					.text("Obesity (%)");

		// Append x-axis labels for default active x-axis
			chart.append("text")
				.attr("transform", "translate(" + (width / 2.95) + " ," + (height + margin.top + 20) + ")")
				.attr("class", "xaxisText xactive")
				.attr("data-axis-name", "poverty")
				.text("In Poverty (%)");
		
		// Append x-axis labels for in-active x-axis
			chart
			.append("text")
			.attr(
				"transform",
				"translate(" + width / 2.90 + " ," + (height + margin.top + 40) + ")")
			// This axis label is inactive by default
			.attr("class", "xaxisText xinactive")
			.attr("data-axis-name", "age")
			.text("Age (median)");
		

		// Append x-axis labels for in-active x-axis
			chart
				.append("text")
				.attr(
					"transform",
					"translate(" + width / 3.75 + " ," + (height + margin.top + 60) + ")")
				.attr("class", "xaxisText xinactive")
				.attr("data-axis-name", "income")
				.text("Household Income (median)");

		//==================================================================================//
			// Change an x-axis's status from inactive to active when clicked (if it was inactive)
			// Change the status of all active axes to inactive otherwise
			function xlabelChange(clickedAxis) {
				d3
					.selectAll(".xaxisText")
					.filter(".xactive")
					// An alternative to .attr("class", <className>) method. Used to toggle classes.
					.classed("xactive", false)	
					.classed("xinactive", true);
					// console.log('hi')
				clickedAxis.classed("xinactive", false).classed("xactive", true);
			}

			d3.selectAll(".xaxisText").on("click", function() {
				// Assign a variable to current axis
				var clickedSelection = d3.select(this);
				// "true" or "false" based on whether the axis is currently selected
				var isClickedSelectionInactive = clickedSelection.classed("xinactive");
				// console.log("this axis is inactive", isClickedSelectionInactive)
				// Grab the data-attribute of the axis and assign it to a variable
				// e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
				var clickedAxis = clickedSelection.attr("data-axis-name");
				console.log("current x-axis: ", clickedAxis);


				// The onclick events below take place only if the x-axis is inactive
				// Clicking on an already active axis will therefore do nothing
				if (isClickedSelectionInactive) {
					// Assign the clicked axis to the variable currentAxisLabelX
					currentAxisLabelX = clickedAxis;
					// Call findMinAndMax() to define the min and max domain values.
					findMinAndMax_X(currentAxisLabelX);

					//determine what values are passed to yLinearScale
					console.log("xMin returned: " +  xMin)
					console.log("xMax returned: " +  xMax)

					// Set the domain for the x-axis
					xLinearScale.domain([xMin, xMax]);
					// Create a transition effect for the x-axis
					svg
						.select(".x-axis")
						.transition()
						.ease(d3.easeElastic)
						.duration(1800)
						.call(bottomAxis);
					}

					d3.selectAll("circle").each(function() {
						d3
							.select(this)
							.transition()
							// .ease(d3.easeBounce)
							.attr("cx", function(data) {
								return xLinearScale(+data[currentAxisLabelX]);
							})
							// .attr("cy", function(data){
							// 	return yLinearScale(+data[currentAxisLabelY]);
							// })
							.duration(1800);
					});

					d3.selectAll(".labels").each(function() {
						d3
							.select(this)
							.transition()
							// .ease(d3.easeBounce)
							.attr("x", function(data) {
								return xLinearScale(+data[currentAxisLabelX]);
							})
							// .attr("y", function(data){
							// 	return yLinearScale(+data[currentAxisLabelY]);
							// })
							.duration(1800);
					});

					// Change the status of the axes. See above for more info on this function.
					xlabelChange(clickedSelection);

			});
		//========== changing y-axis's active/inactive status================================


			function ylabelChange(clickedAxis) {
				d3
					.selectAll(".yaxisText")
					.filter(".yactive")
					// An alternative to .attr("class", <className>) method. Used to toggle classes.
					.classed("yactive", false)
					.classed("yinactive", true);
				
				clickedAxis.classed("yinactive", false).classed("yactive", true);
				console.log('y-axis stuff')
			}

			d3.selectAll(".yaxisText").on("click", function() {
				// Assign a variable to current axis
				var clickedSelection = d3.select(this);
				// "true" or "false" based on whether the axis is currently selected
				var isClickedSelectionInactive = clickedSelection.classed("yinactive");
				// console.log("this axis is inactive", isClickedSelectionInactive)
				// Grab the data-attribute of the axis and assign it to a variable
				// e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
				var clickedAxis = clickedSelection.attr("data-axis-name");
				console.log("current y-axis: ", clickedAxis);

				// The onclick events below take place only if the x-axis is inactive
				// Clicking on an already active axis will therefore do nothing
				if (isClickedSelectionInactive) {
					// Assign the clicked axis to the variable currentAxisLabelX
					currentAxisLabelY = clickedAxis;
					// Call findMinAndMax() to define the min and max domain values.
					findMinAndMax_Y(currentAxisLabelY);
					// Set the domain for the x-axis
					
					//determine what values are passed to yLinearScale
					console.log("yMin returned: " +  yMin)
					console.log("yMax returned: " +  yMax)
					
					yLinearScale.domain([yMin, yMax]);
					console.log("Post yLinearScle yMin returned: " +  yMin)
					console.log("Post yLinearScle yMax returned: " +  yMax)


					// Create a transition effect for the y-axis
					svg
						.select(".y-axis")
						.transition()
						.ease(d3.easeElastic)
						.duration(1800)
						.call(leftAxis);
						//.call(bottomAxis);  LG Change #1, no impact seen
					}

					// Select all circles to create a transition effect, then relocate its horizontal location
					// based on the new axis that was selected/clicked
					d3.selectAll("circle").each(function() {
						d3
							.select(this)
							.transition()
							// .ease(d3.easeBounce)
							// .attr("cx", function(data) {
							// 	return xLinearScale(+data[currentAxisLabelX]);
							// })
							.attr("cy", function(data){
								return yLinearScale(+data[currentAxisLabelY]);
							})
							.duration(1800);
					});

					d3.selectAll(".labels").each(function() {
						d3
							.select(this)
							.transition()
							// .ease(d3.easeBounce)
							// .attr("x", function(data) {
							// 	return xLinearScale(+data[currentAxisLabelX]);
							// })
							.attr("y", function(data){
								return yLinearScale(+data[currentAxisLabelY]);
							})
							.duration(1800);
					});

					// Change the status of the axes. See above for more info on this function.
					ylabelChange(clickedSelection);

			});
});






