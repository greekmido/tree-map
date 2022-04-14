import './index.css';
import * as d3 from 'd3';
//setting variables 

let height = 700;
let width =1200;
let margin = {"top":10,"bottom":20,"left":70,"right":120};  
let svg = d3.select("body").append("svg").attr("width",width).attr("height",height).attr("id","mainSVG");
let tree = svg.append("g").attr("transform",`translate(${margin.right},${margin.top})`).attr("id","treemap");
let legend = svg.insert("g").attr("id","legend").attr("transform",`translate(0,${margin.top+10})`);
let colorpallet=[...d3.schemeTableau10,...d3.schemeSet2,"#01578c"];
let colorScale = d3.scaleOrdinal().range(colorpallet);
//fetching all 3 data files
Promise.all([d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"),
             d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"),
            d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")])
            .then((data)=>{
                //draw the default value selected
                mapIt(data[0])
              // render the tree map based on the checked radio butto 
              document.getElementById('games').addEventListener("click",(event)=>{
                if(document.getElementById("title").innerHTML==="Video Game Sales Data Top 100"){
                  return;
                }
                if(event.target.checked){
                  mapIt(data[0])
                }
              });
              document.getElementById("movies").addEventListener("click",(event)=>{
                if(document.getElementById("title").innerHTML==="Movies"){
                  return;
                }
                if (event.target.checked){
                  mapIt(data[1])
                } 
              });
              document.getElementById("kickstarters").addEventListener("click",(event)=>{
                if(document.getElementById("title").innerHTML==="Kickstarter"){
                  return;
                }
                if(event.target.checked){
                  mapIt(data[2])
                }
              })              
            }).catch((err)=>console.error(err));
// a method to wrap long text element to fit on small rect elements and returns a <tspan>
function wrapText(string,x,y,x1,y1){
  let splitString = string.split(/(?=[A-Z][^A-Z])/g);
  let spans = ""
  splitString.forEach((e,i)=>{
    spans += `<tspan x='${x+5}' y='${y+(y1-y)/5+(i*((y1-y)/5))}' font-size='${((x1-x)/15)+((y1-y)/15)}px'>${e}</tspan >`})
  return spans
}
// main funtion to draw treemap based on the data
function mapIt(data){
    let root = d3.hierarchy(data);
    let layout = d3.treemap();
    layout.size([width-margin.right-margin.left, height-margin.top-margin.bottom]).padding(1)
    root.sum(function(d) {
        return d.value;
      });
    layout(root.sort((a,b)=>d3.descending(a.value,b.value)));
    document.getElementById("title").innerHTML=root.descendants()[0].data.name
    let catList=[] ;
    root.leaves().forEach((leaf)=>{
      if(leaf.parent.data.name){
        if (!catList.includes(leaf.parent.data.name)){
          catList.push(leaf.parent.data.name);}}});

    colorScale.domain(catList);
    
   let myG =  tree.selectAll("g").data(root.leaves(),(d)=>d.data.name)
    .join("g").on("mousemove",(event,d)=>{
      d3.select(".tooltip").style("opacity","0.8").html(`${d.data.name}<br>value: ${d.value}`)
      .style("left",event.pageX+50+"px").style("top",event.pageY-20+"px")
    }).on("mouseout",(event,d)=>{
      d3.select(".tooltip").style("opacity","0");
      console.log("mouseout")
    })
    myG.append("rect")
    .attr("x",(d)=>d.x0).attr("y",(d)=>d.y0).transition()
    .attr("width",(d)=>d.x1-d.x0).attr("height",(d)=>d.y1-d.y0)
    .attr("fill",(d)=>colorScale(d.data.category));
    myG.insert("text")
    .html((d)=>wrapText(d.data.name,d.x0,d.y0,d.x1,d.y1))

    legend.selectAll("circle").data(catList).join("circle").attr("cx","10").attr("cy",(d,i)=>30*i)
    .attr("r","10").attr("fill",(d)=>colorScale(d));

    legend.selectAll("text").data(catList).join("text").attr("x","20").attr("y",(d,i)=>(30*i)+5).html((d)=>d)
  }





if(module.hot){
    module.hot.accept();
}
