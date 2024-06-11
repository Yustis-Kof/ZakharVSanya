class Game {
    constructor(){
        this.name = name;
        this.$zone = $('.elements');            // html-элемент, содержащий игровые объекты
        this.elements = [];
        this.floor = this.spawn(Floor); 
        this.bg = this.spawn(Background);
        this.p1 = this.spawn_player("zakhar");
        this.p1.enemy = this.spawn(TestEnemy);
        this.p1.enemy.enemy = this.p1
        //this.p1.enemy = ...
        this.counterForTimer = 0;
        this.points = 0;
        this.hp = 3;
        this.time = {
            m1: 0,
            m2: 0,
            s1: 0,
            s2: 0,
        }
        this.showHitboxes = true;
        this.paused = false;
        this.ended = false;
        this.showInfo = true;
        this.keyEvents();
        this.shakeframes = 0;   // Кадры землетрясения

        this.info = this.spawn(Info);
    }

    start(){
        console.log(game.game.floor)
        this.loop();
    }

    loop(){
        requestAnimationFrame(() => {
            if (!this.paused){
            this.counterForTimer++;
            if (this.counterForTimer % 60 === 0){
                this.timer();
            }
            if (this.hp <= 0){
                this.end();
            }
            this.updateElements();
            this.setParams();
            this.shake();
            }
            if (!this.ended) {
                this.loop();
            }
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

    shake(){
        if (this.shakeframes > 0){
            this.$zone.css({
                marginLeft: Math.random()*8-4,
                marginTop: Math.random()*8-4,
            })
            this.shakeframes -= 1;
        } else this.$zone.css({
            marginLeft: 0,
            marginTop: 0,
        })
    }
    
    spawn(className) {
        let element = new className(this);
        this.elements.push(element);
        return element;
    }

    spawn_player(fighter){
        let element = new Player(this, fighter);
        this.elements.push(element);
        return element;
    }
    
    remove(el) {
        let idx = this.elements.indexOf(el);
        el.removeElement();
        if (idx !== -1) {
            this.elements.splice(idx, 1);
            return true;
        }
        return false;
    }

    keyEvents() {
        addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                this.paused = !this.paused;
            } else if (e.key == "h"){
                this.showHitboxes = !this.showHitboxes
            } else if (e.key == "s"){
                this.shakeframes += 4;
            } else if (e.key == "i"){
                this.showInfo = !this.showInfo;
            }
        })
    }
}

class Drawable {
    constructor(game){
        this.sprite = "apple"
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
        this.$element.css({
            backgroundImage: `url("img/${this.sprite}.gif")`
        })
        this.game.$zone.append(this.$element);
        return this.$element;
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
            height: this.h + "px",
            backgroundImage: `url("img/${this.sprite}.gif")`
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

    changeSprite(sprite){
        this.$element.attr('background', sprite)
    } // Вроде не надо
}

class Player extends Drawable {
    constructor(game, fighter) {
        super(game);
        this.fighter = fighter  // Имя бойца
        this.sprite = `${fighter}_stand`
        
        // Координаты, скорость
        this.w = 279;
        this.h = 479;
        this.x = 20;
        this.y = 0;
        this.mirror = false;
        this.speedPerFrame = 5;
        this.va = 0;    // Ускорение по вертикали
        this.gravity = 1;

        // Клавиши
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            KeyK: false,
        }; // Вообще говоря, вводить как бы виртуальные флаги для клавиш - хорошая идея. Надо это запомнить
        this.createElement();
        this.bindKeyEvents();

        // Состояние
        this.state = "stand"

        // Хитбокс
        this.hitbox = new Hitbox(this.game, this);
        this.hitbox.setBox(117, 72, 78, 407);

        // Противник
        this.enemy = this.game.floor;
        //if (this.mirror) this.hitbox.reverse();
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
        // Определяем спрайт
        if (this.state == "stand") {
            if (this.keys.ArrowLeft && this.hitbox.getX1() > 0) {
                this.offsets.x = -this.speedPerFrame;
                if (this.mirror)
                    this.sprite = `${this.fighter}_walk_back`
                else
                    this.sprite = `${this.fighter}_walk`
            } else if (this.keys.ArrowRight && this.hitbox.getX2() < this.game.$zone.width()){
                this.offsets.x = this.speedPerFrame;
                if (this.mirror)
                    this.sprite = `${this.fighter}_walk`
                else
                    this.sprite = `${this.fighter}_walk_back`
            } else {
                this.offsets.x = 0;
                this.sprite = `${this.fighter}_stand`
            }
            if (this.keys.ArrowUp && this.va == 0){
                this.va = -2;
                this.offsets.y = -20;
            }

            if (this.keys.KeyK && this.va == 0){
                // Удар Захара
                this.offsets.x = 0;
                this.punch(162, 300, 115, 35, 30, 60)
            }
        }
        else {
            this.sprite = `${this.fighter}_${this.state}`
        }



        this.x += this.offsets.x;
        
        if (this.hitbox.getX1() + this.hitbox.w / 2 > this.enemy.hitbox.getX1() + this.enemy.hitbox.w / 2){
            this.mirror = false;
        } else if (this.hitbox.getX1() + this.hitbox.w / 2 <= this.enemy.hitbox.getX1() + this.enemy.hitbox.w / 2){
            this.mirror = true;
        }
        this.hitbox.reverse()   // синхронизировать отражение
        
        // Столкновение с полом просчитывается по самому элементу;
        // Тем не менее, в остальных столкновениях будет использоваться хитбокс
        if (this.isCollision(this.game.floor)){
            if (this.offsets.y > 0){
                this.va = 0;
                this.offsets.y = 0;
                this.y = this.game.floor.y-this.h+1;
            }
        } else {
            this.va = this.gravity
        }
        this.offsets.y += this.va;
        this.y += this.offsets.y;
    }

    draw(){
        super.draw();
        if (this.mirror)
            this.$element.css({transform: "scaleX(-1)"})
        else
            this.$element.css({transform: "scaleX(1)"})
            this.hitbox.draw();
    }

    punch(x, y, w, h, punchtime, lifetime){
        this.state = "punch";
        this.phb = new PunchHitbox(this.game, this, punchtime, lifetime);

        this.phb.setBox(x, y, 0, h);
        this.phb.punchWidth = w;
        this.game.elements.push(this.phb) // Нужно, чтобы спрайт обновлялся
    }
}

class TestEnemy extends Player{
    constructor(game){
        super(game);
        this.w = 200;
        this.h = 200;
        this.x = this.game.$zone.width() / 2 - this.w / 2;
        this.y = 500;
        this.keyBinds = {   // Костыль для замены стрелочек на WASD у второго противника
            KeyA: "ArrowLeft",
            KeyD: "ArrowRight",
            KeyW: "ArrowUp",
        }
        this.hitbox.setBox(0, 0, 200, 200);
        this.bindKeyEvents();
    }

    changeKeyStatus(code, value){
        if(code in this.keyBinds){
            this.keys[this.keyBinds[code]] = value;
            console.log(code);
        }
    }

    draw(){
        this.$element.css({
            left: this.x + "px",
            top: this.y + "px",
            width: this.w + "px",
            height: this.h + "px",
            backgroundImage: `url("img/apple.gif")`
        })
        if (this.mirror)
            this.$element.css({transform: "scaleX(-1)"})
        else
            this.$element.css({transform: "scaleX(1)"})
        this.hitbox.draw();     // Нужно, чтобы хитбоксы обновляли координаты. В принципе этого не нужно
                                // так как при вычислениях координаты берутся через getX getY, но пусть
    }
}

class Hitbox extends Drawable{
    constructor(game, owner){
        super(game);
        this.owner = owner;
        this.mirror = false;
        this.$element = this.createElement();
    }

    setBox(x, y, w, h){ // x, y - относительные
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
    }

    getX1(){
        if (this.mirror)
            return this.owner.x + this.owner.w - this.x - this.w
        else
            return this.owner.x + this.x
    }
    
    getY1(){
        return this.owner.y + this.y
    }

    getX2(){
        if (this.mirror)
            return this.owner.x + this.owner.w - this.x
        else
            return this.owner.x + this.x + this.w
    }

    getY2(){
        return this.owner.y + this.y + this.h
    }

    draw(){
        // Положение хитбокса относительно
        this.$element.css({
                left: this.getX1() + "px",
                top: this.getY1() + "px",
                width: this.w + "px",
                height: this.h + "px",
                opacity: "50%"
        })
        /*if (this.mirror)
            this.$element.css({left: this.owner.x + this.x - this.w + "px"})*/
        if (!this.owner.game.showHitboxes) this.$element.css({opacity: "0%"});
    }
    
    hide(){
        this.$element.css({
            opacity: "0"
        })
    }

    reverse(){
        // Проверка на поворот
        if (this.owner.mirror != this.mirror){
            //this.x = this.owner.w - this.x - this.w;
            // ВОБЩЕМ !!!!!!!
            // Здесь координаты автоматически меняются при повороте
            // я кажеццо переделал так, чтобы координаты не менялись
            // но менялись значения getX1 getX2
            // но я всё сломал (((((
            // upd: починил !!
            this.mirror = !this.mirror;
        }
    }

    isCollision(enemyhb){
        let a = {
            x1: this.getX1(),
            x2: this.getX2(),
            y1: this.getY1(),
            y2: this.getY2(),        
        }

        let b = {
            x1: enemyhb.getX1(),
            x2: enemyhb.getX2(),
            y1: enemyhb.getY1(),
            y2: enemyhb.getY2(),        
        }
        return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
    }
}

class PunchHitbox extends Hitbox{
    constructor(game, owner, punchtime, lifetime){
        super(game, owner)
        this.punchtime = punchtime // Время достижения максимальной длины хитбокса
        this.lifetime = lifetime // Время жизни удара
    }

    update(){
        this.reverse();
        console.log(this.w, this.punchWidth, this.lifetime, this.mirror);
        if (this.isCollision(this.owner.enemy.hitbox)){
            console.log("захар")
        }
        // Длина хитбокса сначала увеличивается, потом уменьшается.
        if (this.lifetime > this.punchtime){
            this.w = (this.punchWidth / (2 * this.punchtime)) * (2 * this.punchtime - this.lifetime);
        } else if (this.lifetime < this.punchtime){
            this.w = (this.punchWidth / (2 * this.punchtime)) * this.lifetime;
        }
        if (this.lifetime == 0){
            this.game.remove(this)
            this.owner.state = "stand"
        }
        this.lifetime -= 1;
    }

    draw(){
        super.draw();
        if (!this.mirror)
            this.$element.css({left: this.getX1() + "px"});
        if (!this.owner.game.showHitboxes) this.$element.css({opacity: "0%"});
    }

    reverse(){
        // Он типо зеркален относительно игрока
        if (this.owner.mirror == this.mirror){
            this.mirror = !this.mirror;
        }
    }
}

class Floor extends Drawable{
    constructor(game){
        super(game);
        this.w = this.game.$zone.width();
        this.h = 200;
        this.x = this.game.$zone.width() / 2 - this.w / 2;
        this.y = this.game.$zone.height() - this.h;
        this.createElement();
    }
}

class Background extends Drawable{
    constructor(game){
        super(game);
        this.w = this.game.$zone.width()+1400;
        this.h = 40;
        this.x = 10;
        this.y = this.game.$zone.height() - this.game.floor.h - this.h;
        this.createElement();
    }
}

class Info extends Drawable{
    constructor(game){
        super(game);
        this.w = 250;
        this.h = 250;
        this.createElement();
    }

    update(){
        if (!this.game.showInfo) this.$element.css({visibility: "hidden"})
        else {this.$element.css({visibility: "visible"})
        let showstr =             `
        <div>p1<br>
        x1 ${this.game.p1.x}<br>y1 ${this.game.p1.y}<br>
        x2 ${this.game.p1.x + this.game.p1.w}<br>y2 ${this.game.p1.y + this.game.p1.h}</div>
        <div>p1 hb<br>
        x1 ${this.game.p1.hitbox.getX1()}<br>y1 ${this.game.p1.hitbox.getY1()}<br>
        x2 ${this.game.p1.hitbox.getX2()}<br>y2 ${this.game.p1.hitbox.getY2()}</div>
        `
        if (this.game.p1.state == "punch"){
            showstr += `
            <div>p1 phb<br>
            x1 ${Math.floor(this.game.p1.phb.getX1())}<br>y1 ${this.game.p1.phb.getY1()}<br>
            x2 ${Math.floor(this.game.p1.phb.getX2())}<br>y2 ${this.game.p1.phb.getY2()}</div>
            `
        }
        this.$element.html(
            showstr
        )

        }
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
        if (panel === "fight") {
            game.game = new Game();
            game.game.start();
            panel = "game process";
        }
    }, 500)
}