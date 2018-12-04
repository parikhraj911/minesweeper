//Submit Button
$(document).ready(() => {
 var canvas = $('#canvas');
 var time = 0;
 var on = 0;
 var sw = document.getElementById('time');
 var str = [];
 var sh;
 var mr = document.getElementById('mR');
 var n;
 
 $('#submit').click((e) => {
   
    canvas.empty();
    var num = 0;
    
    time = 0;
    n=0;
    
     r = $("#row").val();
     c = $("#col").val();
     m = $('#mine').val();
     let arra = [];
    var maxI = ((r*c)-1);

    //check if the imputs are allowed
    if (r < 8 || c <8){
        window.confirm('You need to have more than 7 rows and columns.');
        throw new Error();
    }
    if (r > 40 || c > 30){
        window.confirm('You need to have less than 40 rows and 30 columns.');
        throw new Error();
    }
    if( m > ((r*c)-1)){
        window.confirm('The max amount of mines you can have is ' + ((r*c)-1));
        throw new Error();
    }
    if( m < 1){
        window.confirm('The min amount of mines you can have is ' + (1));
        throw new Error();
    }
   
    
    establishMines(m);
   
   //make array of random numbers
function establishMines(m){
    for(i = 0; i < m; i++){
        let ran = getRandomInt(0,maxI);
        while(arra.includes(ran) === true){
            ran = getRandomInt(0,maxI);
        }
        arra.push(ran);
    }
}
    //make board
    for (var i = 0; i < r; i++){
    //add rows with their own class
    var row = $('<div>').addClass('row');
    for (var j = 0; j < c; j++){
        //add columns to those rows (2d) and give them arrtibutes
        var col = $('<div>')
        .addClass('col dev')
        .attr('data-row',i)
        .attr('data-col',j)
        .attr('data-num',num)
        .attr('data-flag', 0);
        //got through random array and create mine if spots num is in array
        for(var b = 0; b<arra.length;){
        if(arra[b] == num){
            col.addClass('bomb');
            n++;
        }
            b++;
        }
        
        num++;
        row.append(col);
    }
    canvas.append(row);
   }
    //Random number generator function between a min and max
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        random =  Math.floor(Math.random() * (max - min + 1)) + min;
        return random;
       
    }


mr.innerHTML = 'Number of Mines Remaining: '+ n;
});

var r = $("#row").val();
var c = $("#col").val();


//click on board

canvas.on('click', '.col.dev', function() {
    on = 1;
    stopwatch();
    const cell = $(this);
    if (event.shiftKey){
      
        //if the cell isnt flagged
        if(cell.data('flag') == 0){
            cell.css({'background-color': "blue"});
            cell.data('flag', 1);
            n--;
            
            mr.innerHTML = 'Number of Mines Remaining: '+ n;
        }else{
        //if the cell is flagged
            cell.data('flag', '0');
            cell.css({'background-color': "lightskyblue"});
            n++;
            mr.innerHTML = 'Number of Mines Remaining: '+ n;
        }
    }else{
    //if you regular click
    if(cell.data('flag')==0){
    cell.css({'background-color': "white"});
    const rowData = cell.data('row');
    const colData = cell.data('col');
    //loss if bomb is clicked
    if (cell.hasClass('bomb')){
        on = 0;
        finish(false);
    }else{
        //to show method and if you win
        show(rowData,colData);
        if($('.col.dev').length==$('.col.bomb').length){
            on=0;     
            finish(true);
        }
    }
}
    }
   });
 

//show spaces
function show(l,p){
    const seen = {};
   
  function show2(i, j) {
    //to make sure they are inbounds
    if (i >= r || j >= c || i < 0 || j < 0) {
    return;
    }
    //to make sure the same spot isnt checked
    const cor = `${i} ${j}`
    if (seen[cor]) {
    return;
    }
    //to use the key to check the tiles themselves
    const tile = $(`.col.dev[data-row=${i}][data-col=${j}]`);
    const mineCount = mineCountFunc(i,j);
    //to make sure you dont go passed the board itself
    if (!tile.hasClass('dev') || tile.hasClass('bomb')) {
      return;
    }
    //allows it to show/removes upper element
    tile.removeClass('dev');
    if (mineCount) {
      tile.text(mineCount);
      return;
    }
    //keeps moving outwards
    for (let k = -1; k <= 1; k++) {
      for (let s = -1; s <= 1; s++) {
        show2((i + k), (j + s));
      }      
    }
}
//calls to the helper function in order to move outwards and check until it cant
 show2(l, p);
}
//counts the mines in the in the vicinity
function mineCountFunc(i, j){
    let mc = 0;
    //double for loop to check/count for mines in the vicinity
    for (let k = -1; k <= 1; k++) {
        for (let s = -1; s <= 1; s++) {
            if ((i + k) >= r || (j + s) >= c || (i + k) < 0 || (j + s) < 0) {
            continue;
            }
        const tile = $(`.col.dev[data-row=${(i + k)}][data-col=${(j + s)}]`);
         if (tile.hasClass('bomb')){
            mc++;
            }
    }      
  }
  return mc;

}

 //game is finished
 function finish(win){
    let message = null;
    //what happens when you win
    if (win){
        $('.col.dev.bomb').css({'background-color': "gold"});
        message = "Congrats, You Won!";
        var num = new Array(str.length);
        if(sh < 1){
            sh = 0;
        }
        str.push(sh);
        str.sort(function(a, b){return a-b});
        for(var v = 0; v<str.length; v++){
            num[v] = str[v];
        }
        for(var i = 0; i<num.length; i++){
            var b = num[i];
            if (b<10){
                var s = b.toString();
                num[i] = "00:" + "0" + s;
            }
            if(b>=10 && b<60){
                var s = b.toString();
                num[i] = "00:" + s;
            }
            if(b>=60){
                var f = Math.floor(b/60);
                var e = b % 60;
                var g = f.toString();
                var h = e.toString();
                if(f<10){
                    if(e<10){
                        num[i] = "0" + g +":" + "0" +h;
                    }
                    if(e>=10){
                        num[i] = "0" + g +":" + h;
                    }
                }
                if(f>=10){
                    if(e<10){
                        num[i] = g +":" + "0" +h;
                    }
                    if(e>=10){
                        num[i] = g +":"+ h;
                    }
                }
               
            }
        }
       $('.highscores').empty();
       for(var w = 0; w<num.length; w++){
           $('.highscores').append('<p>' + num[w] + '</p>');
       }
       //what happens when you lose
    }else{
        $('.col.dev.bomb').css({'background-color': "red"});
        message = "Boo Hoo, You Lost!";
        
    }
    //one of the messages pop up and everything else resets
    setTimeout(function(){
    alert(message);
    canvas.empty();
    sw.innerHTML = '00:00';  
    time = 0;
},1000);
}
//creates the stopwatvch
function stopwatch(){
    if (on == 1) {
        setTimeout(function() {
            time++;
            var min = Math.floor(time/100/60);
            var sec = Math.floor(time/100);
            if (min < 10) {
                min = "0" + min;
            }
            if (sec >= 60){
                 sec = sec % 60;
            }
            if (sec < 10){

             sec = "0" + sec;
            }
            sw.innerHTML = min + ":" + sec;
            sh = ((min*60) + sec)*100/100;
            stopwatch();
        }, 10);
    }
}

  


   
    
  
});

