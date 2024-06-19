class Game {
    constructor(){
        this.name = name;
        this.$zone = $('.elements');
        this.elements = [];
        this.player = this.generate(Player);
        this.fruits = [Apple, Banana, Orange]
        this.counterForTimer = 0;
        this.points = 0;
        this.hp = 3;
        this.time = {
            m1: 0,
            m2: 0,
            s1: 0,
            s2: 0,
        }
        this.ended = false;
    }

    start(){
        console.log("Я был здесь")
        this.loop();
    }

    loop(){
        requestAnimationFrame(() => {
            this.counterForTimer++;
            if (this.counterForTimer % 60 === 0){
                console.log('сарделька');
                this.timer();
                this.randomFruitGenerate();
            }
            if (this.hp <= 0){
                this.end();
            }
            if (!this.ended) {
                this.loop();
            }
            this.updateElements();
            this.setParams();
            //this.loop();
        })
    }

    end() {
        this.ended = true;
        let time = this.time;
        if (time.s1 >= 1 || time.m2 >= 1 || time.m1 >= 1){
            $('#playerName').html(`Поздравляем, ${this.name}!`);
            $('#endTime').html(`Ваше время: ${time.m1}${time.m2}:${time.s1}${time.s2}`);
            $('#collectedFruits').html(`Вы собрали ${this.points} фруктов`);
            $('#congratulation').html(`Вы выиграли!`);
        } else {
            $('#playerName').html(`Жаль, ${this.name}`);
            $('#endTime').html(`Ваше время: ${time.m1}${time.m2}:${time.s1}${time.s2}`)
            $('#collectedFruits').html(`Вы собрали ${this.points} фруктов`);
            $('#congratulation').html(`Вы проиграли!`);
        }
        go('end', 'panel d-flex justify-content-center align-items-center');
    }

    timer() {
        let time = this.time;
        time.s2++;
        if (time.s2 >= 10) {
            time.s2 = 0;
            time.s1++;
        }
        if (time.s1 >= 6) {
            time.s1 = 0;
            time.m2++;
        }
        if (time.m2 >= 10) {
            time.m2 = 0;
            time.m1++;
        }
        let str = `${time.m1}${time.m2}:${time.s1}${time.s2}`;
        //console.log('сосиска');
        $("#timer").html(str);
    }

    randomFruitGenerate(){
        let ranFruit = random(0, this.fruits.length-1);
        this.generate(this.fruits[ranFruit]);
    }

    setParams(){
        let params = ['name', 'points', 'hp'];
        let value = [this.name, this.points, this.hp];

        params.forEach((e, i) => {
            $(`#${e}`).html(value[i]);
        })
    }

    updateElements(){
        this.elements.forEach(e => {
            e.update();
            e.draw();
        })
    }
    
    generate(className) {
        let element = new className(this);
        this.elements.push(element);
        return element;
    }
    
    remove(el) {
        let idx = this.elements.indexOf(el);
        if (idx !== -1) {
            this.elements.splice(idx, 1);
            return true;
        }
        return false;
    }
}

class Drawable {
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.h = 0;
        this.w = 0;
        this.offsets = {
            x: 0,
            y: 0
        }
    }

    createElement(){
        this.$element = $(`<div class="element ${this.constructor.name.toLowerCase()}"></div>`);
        this.game.$zone.append(this.$element);
    }

    update(){
        this.x += this.offsets.x;
        this.y += this.offsets.y;
    }

    draw(){
        this.$element.css({
            left: this.x + "px",
            top: this.y + "px",
            width: this.w + "px",
            height: this.h + "px"
        })
    }
    
    isCollision(element) {
        let a = {
            x1: this.x,
            x2: this.x + this.w,
            y1: this.y,
            y2: this.y + this.h,
        }
        
        let b = {
            x1: element.x,
            x2: element.x + element.w,
            y1: element.y,
            y2: element.y + element.h,
        }
        return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    }
    
    removeElement() {
        this.$element.remove();
    }
}

class Player extends Drawable {
    constructor(game) {
        super(game);
        this.w = 244;
        this.h = 109;
        this.x = this.game.$zone.width() / 2 - this.w / 2;
        this.y = this.game.$zone.height() - this.h;
        this.speedPerFrame = 20;
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false
        }; // Вообще говоря, вводить как бы виртуальные флаги для клавиш - хорошая идея. Надо это запомнить
        this.createElement();
        this.bindKeyEvents();
    }

    bindKeyEvents(){
        document.addEventListener("keydown", ev => this.changeKeyStatus(ev.code, true));
        document.addEventListener("keyup", ev => this.changeKeyStatus(ev.code, false));
    }

    changeKeyStatus(code, value){
        if(code in this.keys){
            this.keys[code] = value;
        }
    }

    update(){
        if (this.keys.ArrowLeft && this.x > 0) {
            this.offsets.x = -this.speedPerFrame;
        } else if (this.keys.ArrowRight && this.x < this.game.$zone.width() - this.w){
            this.offsets.x = this.speedPerFrame;
        } else {
            this.offsets.x = 0;
        }
        super.update();
    }
}

class Fruits extends Drawable{
    constructor(game) {
        super(game);
        this.w = 70;
        this.h = 70;
        this.x = random(0, this.game.$zone.width() - this.w);
        this.y = 60;
        this.offsets.y = 3;
        this.createElement();
    }

    update(){
        if (this.isCollision(this.game.player) && this.offsets.y > 0){
            this.takePoint(this.game.element);
        }
        if (this.y > this.game.$zone.height()) {
            this.takeDamage(this.game.element);
        }
        super.update();
    }

    takePoint() {
        if (this.game.remove(this)) {
            this.removeElement();
            this.game.points++;
        }
    }

    takeDamage() {
        if (this.game.remove(this)){
            this.removeElement();
            this.game.hp--;
        }
    }
}

class Apple extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 5;
    }
}

class Banana extends Fruits {
    constructor(game) {
        super(game);
    }
}

class Orange extends Fruits {
    constructor(game) {
        super(game);
        this.offsets.y = 7;
    }
}


let random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.onload = () => {
    checkStorage();
    nav();
    startLoop();
    setInterval(() => {
        if (panel === "game") {
            game.game = new Game();
            game.game.start();
            panel = "game process";
        }
    }, 500)
}