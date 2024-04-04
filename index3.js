let count = 1;

document.getElementById("radio1").checked = true;

setInterval(function(){
    nextimage();
},5000)

function nextimage(){
    count++;
    if(count>4){
        count = 1;
    }

    document.getElementById("radio"+count).checked = true;
}