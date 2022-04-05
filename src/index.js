import './index.css';
import * as d3 from 'd3';

function draw(){
    d3.json(document.querySelector("[checked]").value)
    .then((data)=>{
        console.log(data+"is clicked")
    })
}


if(module.hot){
    module.hot.accept();
}
