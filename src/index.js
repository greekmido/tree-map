import './index.css';
import * as d3 from 'd3';

let height = 700;
let width =900;
let margin = {"top":20,"bottom":20,"left":50,"right":50};  
let svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
let colorpallet=[...d3.schemeTableau10,...d3.schemeSet2,"#01578c"]
let colorScale = d3.scaleOrdinal().range(colorpallet)
Promise.all([d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"),
             d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"),
            d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")])
            .then((data)=>{mapIt(data[0])}).catch((err)=>console.error(err));


function ready(games,movies,kickstarter){

}
function mapIt(data){
    let root = d3.hierarchy(data);
    let layout = d3.treemap();
    layout.size([width-margin.right-margin.left, height-margin.top-margin.bottom])
    root.sum(function(d) {
        return d.value;
      });
    layout(root);
    let catList = root.ancestors().map((cat)=>{if(cat.data.name){return cat.data.name}});
      console.log(catList)
    //colorScale.domain([])
    svg.append("g").selectAll("rect").data(root.leaves()).enter().append("rect")
    .attr("x",(d)=>d.x0).attr("y",(d)=>d.y0)
    .attr("width",(d)=>d.x1-d.x0).attr("height",(d)=>d.y1-d.y0)
    .attr("fill","black").style("opacity","0.2").attr("stroke","black")
}








if(module.hot){
    module.hot.accept();
}
