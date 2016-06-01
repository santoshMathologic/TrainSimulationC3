
var app = angular.module('mathoApp');
app.service('ChartService', function(){
   /**
     * This function is used to draw Y axis
     * @param graph d3 object to draw
     * @param id of axis
     * @param clas of axis
     * @param x position on x axis
     * @param side of ticks
     * @param height of axis
     * @param ticks on axis
     * @param click function
     * @param mouseOver function
     * @param mouseOut function
     * @param dblCclick function
     * @param noOfDays to display on y axis
     */
    this.drawYAxis = function(graph,axisId,clas,x,side,height,ticks,click,mouseOver,mouseOut,dblClick,noOfDays){
        var y0 = d3.scale.linear()
                .domain([d3.time.day.offset(new Date("Sun Mar 22 2015 24:00:00"), noOfDays-1),new Date("Sun Mar 22 2015 00:00:00")])
                .range([height, 0]);
        var yAxis = d3.svg.axis().scale(y0)
        .orient(side).ticks(ticks)
        .tickFormat(function(d) { return (ticks != 24)?d3.time.format('%H:%M %a')(new Date(d)):d3.time.format('%H:%M')(new Date(d)); }); 
        graph.append("g")
        .attr("class", clas)
        .attr("id", axisId)
        .attr("transform", "translate("+x+")")
        .on("dblclick",dblClick)
        .on("mouseover",mouseOver)
        .on("mouseout",mouseOut)
        .on("click", click)
        .call(yAxis);
    }
    
    /**
     * Function to add text on y axis
     * @param graph d3 object 
     * @param data array
     * @param divClass class name
     * @param id text id
     * @param textClass class name
     * @param x axis position
     * @param y axis position
     * @param text to display
     * @param click function
     * @param mouseOver function
     * @param mouseOut function
     * @param dblCclick function
     */
    this.addContentOnYAxis = function(graph,data,divClass,contentId,textClass,x,y,text,
                            click,mouseOver,mouseOut,dblClick,fillColor){
        var id;
        graph.append("g")
        .attr("class", divClass)
        .selectAll(".text")
        .data(data).enter()
        .append("text")
        .attr("class", textClass)
        .attr("id",contentId)
        .attr("x",x)
        .attr("y", y)
        .attr("fill",fillColor)
        .text(text)
        .on("dblclick",dblClick)
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .on("click", click);
    }
    
    /**
     * Function to add y axis heading
     * @param graph d3 object 
     * @param text to display
     * @param x axis position
     * @param y axis position
     * @param class for text
     */
    this.addYAxisHeading = function(graph,text,x,y,clas){
        graph.append("g").attr("class", clas)
        .append("text").attr("x", x)
        .attr("y", y)
        .text(text);
    }
    
    /**
     * This function is used to generate rectangles
     * @param graph d3 object
     * @param data array
     * @param divClass class name
     * @param rectClass class name
     * @param rectId circle id
     * @param x axis position
     * @param y Axis position
     * @param width 
     * @param height
     * @param fillColor rect color
     * @param strokeWidth
     * @param strokeColor 
     * @param click function
     * @param mouseOver function
     * @param mouseOut function
     * @param dblCclick function
     */
    this.generateRectangles = function(graph,data,divClass,rectClass,rectId,x,y,width,height,
                                fillColor,strokeColor,strokeWidth,click,mouseOver,mouseOut,dblClick){
        graph.append("g")
        .attr("class", divClass)
        .selectAll("path").data(data)
        .enter()
        .append("rect")
            .attr("x",x)
            .attr("y",y)
            .attr("width", width)
            .attr("height", height)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("class",rectClass)
            .attr('id', rectId)
            .attr("fill",fillColor)
            .on("dblclick", dblClick)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .on("click", click);
    }
    
    /**
     * This function is used to generate rectangle
     * @param graph d3 object
     * @param rectClass class name
     * @param rectId circle id
     * @param x axis position
     * @param y Axis position
     * @param width 
     * @param height
     * @param fillColor rect color
     * @param strokeWidth
     * @param strokeColor 
     * @param click function
     * @param mouseOver function
     * @param mouseOut function
     * @param dblCclick function
     */
    this.generateRectangle = function(graph,rectClass,rectId,x,y,width,height,
                                fillColor,strokeColor,strokeWidth,click,mouseOver,mouseOut,dblClick){
        graph.append("g")
        .append("rect")
            .attr("x",x)
            .attr("y",y)
            .attr("width", width)
            .attr("height", height)
            .attr("stroke", strokeColor)
            .attr("stroke-width", strokeWidth)
            .attr("class",rectClass)
            .attr('id', rectId)
            .attr("fill",fillColor)
            .on("dblclick", dblClick)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .on("click", click);
    }
    
    /**
     * This function is used to generate circles
     * @param graph d3 object
     * @param data array
     * @param divClass class name
     * @param circleClass class name
     * @param id circle id
     * @param x axis position
     * @param y Axis position
     * @param r circle radious
     * @param color circle color
     * @param click function
     * @param mouseOver function
     * @param mouseOut function
     * @param dblCclick function
     */
    this.generateCircles = function(graph,data,divClass,circleClass,circleId,x,y,r,
                                color,click,mouseOver,mouseOut,dblClick){
        graph.append("g")
        .attr("class", divClass)
        .selectAll("path").data(data)
        .enter()
        .append("circle")
            .attr("cx",x)
            .attr("cy",y)
            .attr("r", r)
            .attr("class",circleClass)
            .attr('id', circleId)
            .attr("fill",color)
            .on("dblclick", dblClick)
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .on("click", click);
    }
    
    /**
     * Function to generate new circle
     * @param graph d3 object
     * @param id circle id
     * @param clas circle class
     * @param x position
     * @param y position
     * @param color to fill circle
     * @param tickCircleRadious circle radious
     * @param click on dblclick function
     * @param mouseOver on mouseOver function
     * @param mouseOut on mouseOut function
     * @param dblCclick function
     */
    this.generateCircle = function(graph,id,clas,x,y,color,tickCircleRadious,click,mouseOver,mouseOut,dblclick){
        graph.append("g")
        .append("circle")
        .attr("id",id)
        .attr("cx",x)
        .attr("cy",y)
        .attr("r", tickCircleRadious)
        .attr("class",clas)
        .attr("fill",color)
        .on('dblclick', dblclick)
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .on("click", click);
    }
    
    /**
     * This function is used to generate lines given data
     * @param graph d3 object 
     * @param data array
     * @param divClass class name
     * @param lineClass class name 
     * @param id line Id
     * @param dimensions line dimensions 
     * @param stroke color 
     * @param strokeWidth 
     * @param dblCclick function
     * @param click function
     * @param mouseOver function
     * @param mouseOut function
     */
    this.generateLines = function(graph,data,divClass,lineClass,lineId,dimensions,stroke,strokeWidth,
                            dblClick,click,mouseOver,mouseOut){
        var id;
        graph.append("g")
        .attr("class", divClass)
        .selectAll("path").data(data)
        .enter().append("path")
        .attr("class", lineClass)
        .attr("id", lineId)
        .attr("d", dimensions)
        .attr("stroke", stroke)
        .attr("stroke-width",strokeWidth)
        .on("click", click)
        .on("dblclick", dblClick)
        .on("mouseover", mouseOver).on("mouseout", mouseOut);
        
    }
    
    
    /**
     * This function is used to show tooltip and return dom object
     * @param tooltipId div id
     */
    this.showAndGetToolTip = function(tooltipId){
        var tooltip = document.getElementById(tooltipId);
        var style = "display : block;left : "+((d3.event.pageX)) + "px; top : "+(d3.event.pageY) + "px";
        tooltip.setAttribute("style",style);
        return tooltip;
    }
    
    /**
     * This function is used to hide tool tip
     * @param tooltipId div id
     */
    this.hideToolTip = function(tooltipId){
        document.getElementById(tooltipId).setAttribute("style","display : none");
    }
    
    /**
     * This function is used to delete ele by id
     * @param id div id
     */
    this.removeElementById = function(id){
    	var ele = document.getElementById(id);
        if(ele)ele.parentNode.removeChild(ele);
    }
    
    /**
     * This function is used to delete eles by class
     * @param class
     */
    this.removeElementByClassName = function(clas){
    	var eles = document.getElementsByClassName(clas);
    	for(var i=0;i<eles.length;i++){
    	    eles[0].parentNode.removeChild(eles[0]);
    	}
    }
    
    /**
     * Function to generate legend
     * @param graph d3 object 
     * @param data to display
     * @param id circle id
     * @param x position
     * @param y position
     * @param color to fill circle
     * @param tickCircleRadious circle radious
     * @param click on dblclick function
     * @param mouseOver on mouseOver function
     * @param mouseOut on mouseOut function
     * @param dblCclick function
     */
    this.addLegend = function(graph,data,id,x,y,color,tickCircleRadious,click,mouseOver,mouseOut,dblclick){
        //graph d3 object,id circle id,clas circle class,x position,y position,color to fill circle,
        //tickCircleRadious circle radious,dblclick on dblclick function,mouseOver on mouseOver function,
        //mouseOut on mouseOut function
        this.generateCircle(graph,id+"Circle","legendCircle active",x,y,color,tickCircleRadious,
        		click,mouseOver,mouseOut,dblclick);
        
        //graph d3 object,data array,divClass class name,id text id,textClass class name,x axis position,
        //y axis position,text to display,tickCounter to generate unique ids,dblClick function,
        //mouseOver function,mouseOut function
        this.addContentOnYAxis(graph,[data],'legendTexts',id+"Text",'legendText active',x+10,y+5,
            function(d){return d},"NaN",click,mouseOver,mouseOut,dblclick);
    }
    
    /**
     * This function is used to separate from base station and to base station
     * @param duties
     * @param baseStation 
     * @param toStation index
     * @param fromStation index
     * @return from and to stations
     */
    this.separateFromAndToStations = function(duties,baseStation,toStation,fromStation){
        var toStations = [], fromStations = [];
        for(var duty in duties){
            if(duties[duty][toStation] == baseStation){
                if(fromStations.indexOf(duties[duty][fromStation]) == -1){
                    fromStations.push(duties[duty][fromStation]);
                }
            }else if(duties[duty][fromStation] == baseStation){
                if(toStations.indexOf(duties[duty][toStation]) == -1){
                    toStations.push(duties[duty][toStation]);
                }
            }
        }
        return {toStations : toStations, fromStations :fromStations};
    }
    
    /**
     * This function is used to generate tick values for from and to station axis
     * @param ticks
     * @param stations
     */
    this.generateStationsTickValues = function(ticks,stations){
        var length,tick,tickVal;
        length = stations.length;
        tickVal = 0;
        for(var station in stations){
            stations[station] = {id:station,station:stations[station],tickVal:tickVal};
            tickVal += 1;
        }
        return stations;
    }
    
    /**
     * Function to get tick value
     * @param time
     * @param day
     * @param $scope.isDailyTrains
     */
    this.getTickValue = function(time,day,isDailyTrains){
        var tickVal = null;
        time = time.split(":");
        time = parseInt(time[0])+parseFloat(parseInt(time[1])/60);
        if(isDailyTrains)
            tickVal=time;
        else
            tickVal=time+(day*24);
        return tickVal;
    }
    
    /**
     * This function is used to find and return station tick value(dimension)
     * @param station
     * @param stations
     * @returns
     */
    this.getTickValueOfStation = function(station,stations){
        var tick = null;
        for(var st in stations){
            if(stations[st].station == station){
                tick = stations[st].tickVal;break;
            }
        }
        return tick;
    }
});