class Game {
    constructor(){
        this.name = name;
        this.$zone = $('.elements');            // html-элемент, содержащий игровые объекты
        this.elements = [];
        this.floor = this.spawn(Floor); 
        this.bg = this.spawn(Background);
		
		// Наблюдатели
        /*
		this.watchers = {
			daniil: 0,
			yegor: 0
		}
		this.watchers.daniil = this.spawn(Watcher);
		this.watchers.daniil.sprite = "daniil";
		this.watchers.daniil.x = this.$zone.width() * 0.30631;
		this.watchers.daniil.y = this.$zone.height() * 0.37031;
		this.watchers.daniil.w = 101;
		this.watchers.daniil.h = 192;
		*/
		
        this.p1 = this.spawn_player("zakhar");
        this.hpbar = new HealthBar(this, this.p1);
        this.elements.push(this.hpbar);
        this.hpbar.mirror = true;
        this.hpbar.x = this.$zone.width() - 303;

        this.xrbar = new XRayBar(this, this.p1);
        this.elements.push(this.xrbar);
        this.xrbar.mirror = true;
        this.xrbar.x = this.$zone.width() - 350;

        this.p1.enemy = this.spawn(Dad);
        this.p1.enemy.enemy = this.p1

        this.ehpbar = new HealthBar(this, this.p1.enemy);
        this.elements.push(this.ehpbar);

        this.exrbar = new XRayBar(this, this.p1.enemy);
        this.elements.push(this.exrbar)
		
		
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
        this.showHitboxes = false;
        this.paused = false;
        this.ended = false;
        this.showInfo = false;
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
        //alert("Игра окончена");
        //go('end', 'panel d-flex justify-content-center align-items-center');
        //location.reload();
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
                marginLeft: Math.random()*10-5,
                marginTop: Math.random()*10-5,
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
		//this.gif = new SuperGif({ gif: this.$element });
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
			backgroundImage: `url(img/${this.sprite}.gif)`
        })
	}
    
    isCollision(element){
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

class Watcher extends Drawable{
	constructor(game){
		super(game);
		this.createElement();
	}
}

class Player extends Drawable {
    constructor(game, fighter) {
        super(game);
        this.fighter = fighter  // Имя бойца
        this.sprite = `${fighter}_stand`
        this.hp = 143;
        this.xray = 0;

        // Координаты, скорость
		this.maxw = 279;
		this.maxh = 479;
        this.w = 279;
        this.h = 479;
        this.x = this.game.$zone.width() / 1.2 - this.w / 2;
        this.y = 0;
        this.mirror = false;
        this.speedPerFrame = 5;
        this.va = 0;    // Ускорение по вертикали
        this.gravity = 1;
		this.jumpyty = 40; // Прыгучесть

        // Клавиши
        this.keys = {
            ArrowLeft: 0,
            ArrowRight: 0,
            ArrowUp: 0,
			ArrowDown: 0,
            KeyK: 0,
            KeyL: 0,
			KeyJ: 0
        }; // Вообще говоря, вводить как бы виртуальные флаги для клавиш - хорошая идея. Надо это запомнить
        this.createElement();
        this.bindKeyEvents();

        // Состояние
        this.state = "stand"
        this.cooldown = 0;
		
		this.punchcd = 0;

        // Хитбокс
        this.dhb = { // По дефолту
            x: 117,
            y: 72,
            w: 78,
            h: 407
        };
		
		this.lie_hb = { // Лежить
			x: 0,
			y: 135,
			w: 407,
			h: 78 
		};
		
		this.duck_hb = { // Прижок
			x: 84,
			y: 286,
			w: 133,
			h: 193
		};
        this.hitbox = new Hitbox(this.game, this);
        this.hitbox.setBox(this.dhb.x, this.dhb.y, this.dhb.w, this.dhb.h);

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
			if (value)
				this.keys[code] += 1;
			else
				this.keys[code] = 0;
        }
    }

	isMirrored(){
		if (this.mirror)
			return 1
		else
			return -1
	}

    update(){
        // XRay
        if (this.xray > 100)
            this.xray = 100;
		
		if (this.punchcd > 0)
			this.punchcd -= 1;

        // 1. Определяем спрайт
		if (this.enemy.state == "death")
			this.state = "win";
        if (this.state == "stand") {
            // Проверка отражения
            if (this.hitbox.getX1() + this.hitbox.w / 2 > this.enemy.hitbox.getX1() + this.enemy.hitbox.w / 2){
                this.mirror = false;
            } else if (this.hitbox.getX1() + this.hitbox.w / 2 <= this.enemy.hitbox.getX1() + this.enemy.hitbox.w / 2){
                this.mirror = true;
            }
            this.hitbox.reverse()   // синхронизировать отражение
			
			// Прыжок
            if (this.keys.ArrowUp){
                this.va = -3;
                this.offsets.y = -30;
				if (this.keys.ArrowLeft && this.hitbox.getX1() > 0) {
					this.offsets.x = -this.speedPerFrame;
				} else if (this.keys.ArrowRight && this.hitbox.getX2() < this.game.$zone.width()){
					this.offsets.x = this.speedPerFrame;
				}
				this.state = "jump";
			}
			
			// Ходьба
            else if (this.keys.ArrowLeft && this.hitbox.getX1() > 0) {
                this.offsets.x = -this.speedPerFrame;
				
				if (this.mirror)
                    this.sprite = `${this.fighter}_walk_back`
                else
                    this.sprite = `${this.fighter}_walk`
            } else if (this.keys.ArrowRight && this.hitbox.getX2() < this.game.$zone.width()){
                this.offsets.x = this.speedPerFrame;
				
                if (this.mirror)
                    this.sprite = `${this.fighter}_walk`;
                else
                    this.sprite = `${this.fighter}_walk_back`;
            }
			
			// Удар
			else if (this.keys.KeyK && !this.punchcd){
                this.punch(162, this.dhb.y+67, 215, 35, 12, 24, 3)
				// Кулдаун просчитывается в объекте удара
            }
			
			// Блок
			else if (this.keys.KeyJ){
                this.offsets.x = 0;
                this.state = "block";
				this.cooldown = 36;
            }
			
			// Присяд
			else if (this.keys.ArrowDown){
                this.offsets.x = 0;
                this.state = "sit";
				this.cooldown = 44;
            }
			
			// Стойка
			else {
                this.offsets.x = 0;
				this.sprite = `${this.fighter}_stand`;
			}
				
			// Непрохождение друг сквозь друга
			if (this.hitbox.isCollision(this.enemy.hitbox)){
				if (this.mirror){
					this.offsets.x += -this.speedPerFrame/0.9;
				}
				else
					this.offsets.x += this.speedPerFrame/0.9
			}

            // Спецатака Захара
            if (this.keys.KeyL && this.va == 0){
                this.special();
            }
        } else {
			this.sprite = `${this.fighter}_${this.state}`;	
		}
		if (this.state == "jump") {
			if (this.offsets.x != 0){
				if (this.offsets.x < 0 && !this.mirror || this.offsets.x > 0 && this.mirror)
					this.sprite = `${this.fighter}_duck`;
				else
					this.sprite = `${this.fighter}_duck_back`;
			} else {
				this.sprite = `${this.fighter}_stand`;
			}	
		}
		else if (this.state == "damage"){
			if (this.cooldown == 0) this.state = "stand";
				this.cooldown -= 1;
		}
		else if (this.state == "damage_lie"){
			if (this.cooldown == 44)
				this.sprite = `${this.fighter}_falling`
			if (this.cooldown == 0){
				this.state = "stand";
				this.y = this.game.floor.y-this.h+1;
			}
			if (this.va == 0) {
				this.cooldown -= 1;
				this.sprite = `${this.fighter}_damage_lie`;
			}
		}
		else if (this.state == "punch"){
			this.offsets.x = 0;
		}
		else if (this.state == "fire"){
			if (this.cooldown == 30)
				this.projectile(8, this.dhb.y+165, 35, 35)
			if (this.cooldown == 0) this.state = "stand";
			this.cooldown -= 1;
		}
		else if (this.state == "block"){
			if (this.cooldown == 0){
				this.sprite = `${this.fighter}_block`;
				if (this.keys.KeyJ == 0){
					this.state = "stand";
				}
			}
			else {
				this.sprite = `${this.fighter}_block_start`
				this.cooldown -= 1;
			}
		}
		else if (this.state == "sit"){
			if (this.cooldown == 0){
				this.sprite = `${this.fighter}_sit`;
				if (this.keys.ArrowDown == 0){
					this.state = "stand";
				}
			}
			else {
				this.sprite = `${this.fighter}_sit_start`
				this.cooldown -= 1;
			}
		}
		else if (this.state == "death"){
			this.sprite = `${this.fighter}_damage_lie`;
		}
		// Спецатака Сани
		else if (this.state == "beating"){
			if (this.cooldown > 12){
				this.enemy.mirror = !this.mirror;
			
				if (!this.mirror){
					this.enemy.x = this.shb.getX2() - this.enemy.hitbox.x;
				}
				else {
					this.enemy.x = this.shb.getX1() - this.enemy.hitbox.x/0.75;
				}
				this.enemy.y = this.shb.getY1() - this.enemy.hitbox.y - 100;
				this.enemy.state = "being_beated";
				this.enemy.sprite = `${this.enemy.fighter}_stand`;
				this.enemy.offsets.y = 0;
				this.sprite = `${this.fighter}_beating`;
			}
			
			if (this.cooldown == 77 || this.cooldown == 48){
				this.enemy.takeDamage(5);
			}
			
			else if (this.cooldown == 12){
				this.enemy.state = "stand";
				this.enemy.takeDamage(5);
			}
			
			else if (this.cooldown == 0){
				this.state = "stand";
			}
			this.cooldown -= 1;
		}

		// Столкновение со стеной
        if (this.offsets.y != 0 && this.state == "damage_lie" &&
        (this.hitbox.getX1() < 0 || this.hitbox.getX2() > this.game.$zone.width())){
			this.game.shakeframes += 2;
            this.offsets.x = -this.offsets.x;
			this.takeDamage(1);
		}
		
		if (!(this.hitbox.getX1() <= 0 && this.offsets.x < 0) &&
			!(this.hitbox.getX2() >= this.game.$zone.width() && this.offsets.x > 0))	// Да, дважды проверяю выпадение из арены, а что?
			this.x += this.offsets.x;
    
		
        // Столкновение с полом
        if (this.hitbox.isCollision(this.game.floor.hitbox)){
            //console.log(this)
            if (this.offsets.y > 0){
                this.y = this.game.floor.y-this.hitbox.h-this.hitbox.y+1;
				if (this.state == "jump"){
					this.y = this.game.floor.y-this.h+1;
					this.state = "stand"
				}
				if (this.state == "damage_lie"){
					this.sprite == `${this.fighter}_damage_lie`;
					this.takeDamage(2);   // Ну он же упал, лол, это больно
					this.game.shakeframes += 4;
                }
				if (this.state == "damage_lie" && this.offsets.y >= this.jumpyty){	// Не придумал как по-нормальному условие сделать
					console.log(this.offsets.y);
					this.va = 0// -this.va*(3/this.jumpyty);
					this.offsets.y = 0// -this.offsets.y*(3/this.jumpyty);
					this.offsets.x = 0;
					this.x -= 50 * this.isMirrored();
				} else {
					if (this.state != "stand"){
						this.offsets.x = 0;
					}
				    this.va = 0;
					this.offsets.y = 0;
				}
            }
        } else {
            this.va = this.gravity
        }
	
		// 2. Просчёт комбух (вразработке)
		
		// 3. Определение хитбокса
		if (this.sprite == `${this.fighter}_duck` || this.sprite == `${this.fighter}_sit`)
			this.hitbox.setBox(this.duck_hb.x, this.duck_hb.y, this.duck_hb.w, this.duck_hb.h);
		else if (this.sprite == `${this.fighter}_damage_lie`)
			this.hitbox.setBox(this.lie_hb.x, this.lie_hb.y, this.lie_hb.w, this.lie_hb.h);
		else if (this.sprite == `${this.fighter}_falling`)
			this.hitbox.setBox(this.lie_hb.x, this.lie_hb.y, this.lie_hb.w/2, this.lie_hb.h);
		else
			this.hitbox.setBox(this.dhb.x, this.dhb.y, this.dhb.w, this.dhb.h);

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
		
		// 4. Просчёт элемента
		if (this.sprite == `${this.fighter}_punch` || this.sprite == `${this.fighter}_fire` || this.state == "block"){
			if (this.fighter == "zakhar")
				if (this.mirror)
					this.$element.css({
						left: this.x + 13 + "px",
						width: this.w + 35 + "px"
					})
				else
					this.$element.css({
						left: this.x - 35 + "px",
						width: this.w + 35 + "px"
					})
				else {
					if (this.mirror)
						this.$element.css({
							width: this.w + 40 + "px"
					})
				else
					this.$element.css({
						left: this.x - 35,
						width: this.w + 40 + "px"
					})
			}
		} else if (this.sprite == `${this.fighter}_damage_lie`){
			this.w = this.maxh;
			this.h = this.maxw;
		} else {
			this.$element.css({
				backgroundPositionX: "0px"
			})
			this.h = this.maxh;
			this.w = this.maxw;
		}
    }

    takeDamage(hp){
        if (this.state != "damage" && this.state != "damage_lie"){
			if (this.state == "block"){
				hp *= 0.01;
				this.x -= 0.5 * this.isMirrored();
			}
            else if (this.state != "being_beated"){
				// Проверка отражения
				if (this.hitbox.getX1() + this.hitbox.w / 2 > this.enemy.hitbox.getX1() + this.enemy.hitbox.w / 2){
					this.mirror = false;
				} else if (this.hitbox.getX1() + this.hitbox.w / 2 <= this.enemy.hitbox.getX1() + this.enemy.hitbox.w / 2){
					this.mirror = true;
				}
				this.hitbox.reverse()   // синхронизировать отражение
				this.state = "damage";
				if (this.va != 0){
					this.va = 0;
					this.state = "damage_lie";
					if (this.mirror) this.offsets.x = -15;
						else this.offsets.x = 15;
				} else this.offsets.x = 0;
				this.cooldown = 45;
				this.xray += hp;
			}
			this.hp -= hp*2.5;
        }
        if (this.hp <= 0){
			this.die();
            //this.game.end();
        }
    }

    punch(x, y, w, h, punchtime, lifetime, repeats=1){
        this.state = "punch";
        this.phb = new PunchHitbox(this.game, this, punchtime, lifetime, repeats);
		this.punchcd = lifetime * repeats + 12;

        this.phb.setBox(x, y, 0, h);
        this.phb.punchWidth = w;
        this.game.elements.push(this.phb) // Нужно, чтобы спрайт обновлялся
    }

    projectile(x, y, w, h){
        this.state = "fire";
        let speed;
		speed = -5;
        if (this.mirror) speed = 5
        this.bhb = new ProjectileHitbox(this.game, this, {x: speed, y: 0});
        if (!this.mirror)
			this.bhb.setBox(x, y, w, h);
        else
			this.bhb.setBox(x+235, y, w, h);
		this.game.elements.push(this.bhb) // Нужно, чтобы спрайт обновлялся
    }

	special(){
		if (this.xray >= 50){
			this.xray -= 50;
			this.offsets.x = 0;
			this.state = "fire";
			this.cooldown = 54;
		}
	}
	
	die(){
		this.state = "death";
		this.enemy.offsets.x = 0;
		this.enemy.state = "win";
		this.enemy.cooldown = 360;
	}
}

class TestEnemy extends Player{
    constructor(game){
        super(game);
        this.w = 200;
        this.h = 200;
        this.x = 20;
        this.y = 500;
        this.keyBinds = {   // Костыль для замены стрелочек на WASD у второго противника
            KeyA: "ArrowLeft",
            KeyD: "ArrowRight",
            KeyW: "ArrowUp",
            KeyE: "KeyK",
            KeyQ: "KeyL",
        }
        
        // Хитбокс
        this.dhb = { // По дефолту
            x: 0,
            y: 0,
            w: 200,
            h: 200,
        }

		this.lie_hb = { // Лежить
			x: 0,
			y: 0,
			w: 200,
			h: 200
		};
		
        this.hitbox.setBox(this.dhb.x, this.dhb.y, this.dhb.w, this.dhb.h);
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

    punch(x, y, w, h, punchtime, lifetime){
        super.punch(200, 0, 115, 35, 30, 60);
    }
}

class Dad extends Player{
    constructor(game){
        super(game);
		this.fighter = "sanya";
        this.speedPerFrame = 4;
        this.w = 279;
        this.h = 479;
        this.x = 20;
        this.y = 0;
        this.keyBinds = {   // Костыль для замены стрелочек на WASD у второго противника
            KeyA: "ArrowLeft",
            KeyD: "ArrowRight",
            //KeyW: "ArrowUp",
            KeyE: "KeyK",
            KeyQ: "KeyL",
			KeyF: "KeyJ"
        }
        
        // Хитбокс
        this.dhb = { // По дефолту
            x: 123,
            y: 57,
            w: 65,
            h: 422,
        }

		this.lie_hb = { // Лежить
			x: 0,
			y: 0,
			w: 200,
			h: 200
		};
		
		this.shb = new Hitbox(this.game, this);
		this.shb.setBox(8, 137, 118, 151);
		
		
        this.hitbox.setBox(this.dhb.x, this.dhb.y, this.dhb.w, this.dhb.h);
        this.bindKeyEvents();
    }
	
	update(){
		this.shb.reverse();
		super.update();
	}

    changeKeyStatus(code, value){
        if(code in this.keyBinds){
            this.keys[this.keyBinds[code]] = value;
            console.log(code);
        }
    }
	
    punch(x, y, w, h, punchtime, lifetime){
        super.punch(156, 156, 185, 36, 18, 36);
    }
    
    takeDamage(hp){
        hp *= 0.4 // Сопротивляемость
        super.takeDamage(hp);
    }
	
	special(){
		if (this.xray == 100 && this.shb.isCollision(this.enemy.hitbox)){
			this.xray -= 100;
			
			this.offsets.x = 0;
			this.state = "beating";
			this.cooldown = 108;
		}
	}
	
	draw(){
		super.draw();
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
    constructor(game, owner, punchtime, lifetime, repeats){
        super(game, owner)
		this.repeats = repeats	// Повторение удара
        this.punchtime = punchtime // Время достижения максимальной длины хитбокса
        this.lifetime = lifetime // Время жизни удара
		this.maxlifetime = lifetime
    }

    update(){
        this.reverse();
        //console.log(this.w, this.punchWidth, this.lifetime, this.mirror);
        // Коллизия
        if (this.isCollision(this.owner.enemy.hitbox)){
            if (this.owner.enemy.state != "damage" && this.owner.enemy.state != "damage_lie" && this.owner.enemy.state != "block")
                this.owner.xray += 15;
            this.owner.enemy.takeDamage(5);
        }
        // Длина хитбокса сначала увеличивается, потом уменьшается.
        if (this.lifetime > this.punchtime){
            this.w = (this.punchWidth / (2 * this.punchtime)) * (2 * this.punchtime - this.lifetime);
        } else if (this.lifetime < this.punchtime){
            this.w = (this.punchWidth / (2 * this.punchtime)) * this.lifetime;
        }
        if (this.lifetime == 0){
			if (this.repeats <= 1){
				this.game.remove(this)
				this.owner.state = "stand"
			} else {
				this.lifetime = this.maxlifetime;
				this.repeats -= 1;
			}
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

class ProjectileHitbox extends Hitbox{
    constructor(game, owner, _offsets){
        super(game, owner);
        this.sprite = "fireball";
        this._offsets = _offsets;
    }

    setBox(x, y, w, h){ // x, y - АБСОЛЮТНЫЕ!
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
		this.x = super.getX1();
		this.y = super.getY1();
    }

    getX1(){
		return this.x
    }
    
    getY1(){
		return this.y
    }

    getX2(){
        return this.x + this.w
    }

    getY2(){
        return this.y + this.h
    }

    update(){
        this.x += this._offsets.x;
        if (this.isCollision(this.owner.enemy.hitbox)){
            if (this.owner.enemy.state != "damage" && this.owner.enemy.state != "damage_lie")
                this.owner.xray += 1;
            this.owner.enemy.takeDamage(10);
            this.game.remove(this)
        }
    }

    draw(){
        super.draw();
        this.$element.css({
            backgroundImage: `url("img/${this.sprite}.gif")`,
            backgroundSize: `${this.w}px ${this.h}px`
        });
        if (!this.owner.game.showHitboxes) this.$element.css({
            backgroundColor: "transparent",
            opacity: "100%"
        });
    }
}

class Floor extends Drawable{
    constructor(game){
        super(game);
		this.sprite = "nevidimy";
        this.w = this.game.$zone.width();
        this.h = 10;
        this.x = this.game.$zone.width() / 2 - this.w / 2;
        this.y = this.game.$zone.height() - this.h;
        this.hitbox = new Hitbox(this.game, this);
        this.hitbox.setBox(0, 0, this.w, this.h);
        this.createElement();
    }
}

class Background extends Drawable{
    constructor(game){
        super(game);
		this.sprite = "background";
        /* this.w = this.game.$zone.width()+1400;
        this.h = 40;
        this.x = 10;
        this.y = this.game.$zone.height() - this.game.floor.h - this.h; */
		this.x = 0;
		this.y = 0;
		this.w = this.game.$zone.width();
		this.h = this.game.$zone.height();
        this.createElement();
    }
}

class HealthBar extends Drawable{
    constructor(game, owner){
        super(game);
        this.owner = owner;
        this.x = 20;
        this.y = 20;
        this.h = 24;
        this.w = this.owner.hp*2;
		this.maxw = this.w;
        this.mirror = false;
        this.createElement();
    }

    update(){
        if (this.mirror){
			this.x += this.w - this.owner.hp*2;
		}
        this.w = this.owner.hp*2;
    }

    draw(){
        if (this.mirror){
            this.$inner.css({
                left: this.x + "px",
                top: this.y + "px",
                width: this.w + "px",
                height: this.h + "px",
                backgroundPositionX: this.w
            });

			this.$outer.css({
				left: this.x-4 - (this.maxw - this.w) + "px",
				top: this.y-6 + "px",
				width: this.maxw+9 + "px",
				height: this.h*1.5 + "px",
			})
        }
		else {
            this.$inner.css({
                left: this.x + "px",
                top: this.y + "px",
                width: this.w + "px",
                height: this.h + "px"
            });
			this.$outer.css({
				left: this.x-4 + "px",
				top: this.y-6 + "px",
				width: this.maxw+9 + "px",
				height: this.h*1.5 + "px",
			})
        }
    }
	
	createElement(){
		this.$outer = $(`<div class="element outer-${this.constructor.name.toLowerCase()}"></div>`);
		this.$inner = $(`<div class="element ${this.constructor.name.toLowerCase()}"></div>`);
        this.game.$zone.append(this.$inner);
		this.game.$zone.append(this.$outer);
    }
}

class XRayBar extends HealthBar{
    constructor(game, owner){
        super(game, owner);
		this.x = 45;
        this.y = 65;
        this.h = 17;
        this.w = 301;
		this.maxw = this.w;
    }

    update(){
        if (this.mirror)
            this.x += this.w - this.owner.xray*3;
        this.w = this.owner.xray*3;
    }
	
	    draw(){
        this.$inner.css({
            left: this.x + "px",
            top: this.y + "px",
            width: this.w + "px",
            height: this.h + "px",
			backgroundPositionX: this.ox - this.maxw - this.w
        });
		if (this.mirror)
			this.$outer.css({
				left: this.x-40 - (this.maxw - this.w) + "px",
				top: this.y-13 + "px",
				width: this.maxw+81 + "px",
				height: this.h+21 + "px",
			})
		else
			this.$outer.css({
				left: this.x-40 + "px",
				top: this.y-13 + "px",
				width: this.maxw+81 + "px",
				height: this.h+21 + "px",
			})
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