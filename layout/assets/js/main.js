let name = '';

let game = {
    game: []
}   

let panel = "start"
let nav = () => {               
    document.onclick = (e) => {
        e.preventDefault();
        switch (e.target.id) {
        case "startGame":
            go('game', 'd-block');
            break;
        case "restart":
            go('game', 'd-block');
            $('.elements').remove();
            $('#game').append(`<div class="elements"></div>`)
            break;
        }
    }
}

let go = (page, attribute) => {
    let pages = ['start', 'game', 'end'];
    panel = page;
    $(`#${page}`).attr('class', attribute);
    pages.forEach(e => {
        if (page != e)
            $(`#${e}`).attr('class', 'd-none');
    })
}

let checkName = () => {
    name = $(`#nameInput`).val().trim();
    if (name != ""){
        localStorage.setItem('userName', name)
        $(`#startGame`).attr('disabled', false);
    } else {
        $(`#startGame`).attr('disabled', true)
    }
}

let startLoop = () => {
    let inter = setInterval(()=>{
        if(panel !== "start"){
            clearInterval(inter);
        }
        checkName();
    }, 100);
}

let checkStorage = () => {
    if(localStorage.getItem('userName') != null){
        $(`#nameInput`).val(localStorage.getItem('userName'));
    }
}

/*

gravity = 0.02
difficulty = 10;
spawncd = 24
let fruits = [];


let bucket = document.createElement("img");
bucket.left = 45;
bucket.top = 35;
bucket.dirrection = 0;	// Как я мог написать dirrection с двумя r?
bucket.setAttribute("width", 200);
bucket.setAttribute("height", 200);
bucket.setAttribute("src", "pngwing.com.png");
bucket.style.position = "absolute";
bucket.style.marginLeft = bucket.left+"%";
bucket.style.marginTop = bucket.top+"%";
document.body.append(bucket)

addEvent(document, "keydown", function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 37) bucket.dirrection = -1;
    else if (e.keyCode == 39) bucket.dirrection = 1;
});
addEvent(document, "keyup", function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 37 && bucket.dirrection == -1 || e.keyCode == 39 && bucket.dirrection == 1)    // Чтобы не было резких остановок
		bucket.dirrection = 0;
});


function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}

function Spawn(){
    let fruit = document.createElement("img");
    fruit.speed = -0.4;
    fruit.top = 5;
    fruit.className = "fruit";
    fruit.setAttribute("src", "pngimg.com%20-%20apple_PNG12423.png");
    fruit.setAttribute("width", 30);
    fruit.setAttribute("height", 30);
    fruit.style.position = "absolute";
    fruit.style.marginLeft = Math.round(97*Math.random())+"%";
    fruit.style.marginTop = fruit.top+"%";
    document.body.append(fruit)
    fruits[fruits.length] = fruit
}

function Tick(){
    spawncd -= difficulty/10;
    difficulty += 0.001;

    if(spawncd <= 0){
        if (fruits.length < difficulty)
            Spawn()
        spawncd = 48;
    }

    if (bucket.dirrection != 0) {
        bucket.left += bucket.dirrection;
        bucket.style.marginLeft = bucket.left+"%";
    }

    fruits.forEach(element => {
        element.speed += gravity
        element.top += element.speed
        element.style.marginTop = element.top+"%"
        if (element.top >= 47){
            fruits.shift(fruits.indexOf(element))
            element.remove()
        }
    });
    setTimeout(Tick, 17)
}

//Tick()

*/
