function aviso(){
    alert("Quer café :) ?");
}

let count = 1;

document.getElementById("radio1").checked = true;

setInterval(function(){
    nextimage();
},4000)

function nextimage(){
    count++;
    if(count>5){
        count = 1;
    }

    document.getElementById("radio"+count).checked = true;
}