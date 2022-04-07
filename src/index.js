import './index.css';
import * as d3 from 'd3';
import {TextBox} from 'd3plus-text'
let height = 700;
let width =1200;
let margin = {"top":20,"bottom":20,"left":50,"right":50};  
let svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
let colorpallet=[...d3.schemeTableau10,...d3.schemeSet2,"#01578c"]
let colorScale = d3.scaleOrdinal().range(colorpallet)
Promise.all([d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"),
             d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"),
            d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")])
            .then((data)=>{mapIt(data[0])}).catch((err)=>console.error(err));
let myTextBox = new TextBox()
function wrapIt(text){
  myTextBox.data([{text:text}])
}

function ready(games,movies,kickstarter){

}
function mapIt(data){
    let root = d3.hierarchy(data);
    let layout = d3.treemap();
    layout.size([width-margin.right-margin.left, height-margin.top-margin.bottom]).padding(0.5)
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
    
    let myG = svg.append("g").attr("transform",`translate(${margin.right},${margin.top})`).selectAll("g").data(root.leaves()).enter().append("g");
    myG.append("rect")
    .attr("x",(d)=>d.x0).attr("y",(d)=>d.y0)
    .attr("width",(d)=>d.x1-d.x0).attr("height",(d)=>d.y1-d.y0)
    .attr("fill",(d)=>colorScale(d.data.category)).attr("id",(d)=>d.data.name)
    myG.append("text").html((d)=>{
      wrapIt(d.data.name)
    })
    .attr("x",(d)=>d.x0).attr("y",(d)=>d.y0).attr("width",(d)=>d.x1-d.x2).attr("height",(d)=>d.y1-d.y0);
  }








if(module.hot){
    module.hot.accept();
}
