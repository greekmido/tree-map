import './index.css';
import * as d3 from 'd3';
import { select } from 'd3';
import { map } from 'd3';
let height = 700;
let width =1200;
let margin = {"top":20,"bottom":20,"left":50,"right":50};  
let svg = d3.select("body").append("svg").attr("width",width).attr("height",height).attr("id","mainSVG")
.append("g").attr("transform",`translate(${margin.right},${margin.top})`);
let colorpallet=[...d3.schemeTableau10,...d3.schemeSet2,"#01578c"]
let colorScale = d3.scaleOrdinal().range(colorpallet)
Promise.all([d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"),
             d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"),
            d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")])
            .then((data)=>{
              if(document.getElementById("games").checked){
                mapIt(data[0])
              }
              document.getElementById('games').addEventListener("click",(event)=>{
                if(event.target.checked){
                  mapIt(data[0])
                }
              });
              document.getElementById("movies").addEventListener("click",(event)=>{
                if (event.target.checked){
                  mapIt(data[1])
                } 
              });
              document.getElementById("kickstarters").addEventListener("click",(event)=>{
                if(event.target.checked){
                  mapIt(data[2])
                }
              })              
            }).catch((err)=>console.error(err));

function wrapText(string,x,y,x1,y1){
  let splitString = string.split(/(?=[A-Z][^A-Z])/g);
  let spans = ""
  splitString.forEach((e,i)=>{
    spans += `<tspan x='${x+5}' y='${y+(y1-y)/5+(i*((y1-y)/5))}' font-size='${((x1-x)/15)+((y1-y)/15)}px'>${e}</tspan >`})
  return spans
}

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
    
   let myG =  svg.selectAll("g").data(root.leaves(),(d)=>d.data.name)
    .join("g")
    myG.append("rect")
    .attr("x",(d)=>d.x0).attr("y",(d)=>d.y0)
    .attr("width",(d)=>d.x1-d.x0).attr("height",(d)=>d.y1-d.y0)
    .attr("fill",(d)=>colorScale(d.data.category));
    myG.insert("text")
    .html((d)=>wrapText(d.data.name,d.x0,d.y0,d.x1,d.y1))
  }







if(module.hot){
    module.hot.accept();
}
