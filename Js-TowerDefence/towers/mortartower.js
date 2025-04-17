import Colours from "../colours.js";
import Vector from "../vector.js";
import Tower from "./tower.js";

export default class MortarTower extends Tower{
    constructor(canvas, context, game){
        super(canvas, context, game);
        this.canvas = canvas;
        this.c = context;
        this.game = game;
        this.lastfireTime = 0;
        this.baseFireRate = 3000;
        this.baseRadius = 50;
        this.fireRate = this.baseFireRate;
        this.radius = this.baseRadius;
        this.name = "Mortar Tower";
        this.damage = 100;
        this.cost = 250;
        this.description = `Picks a random path square and does ${this.damage} damage after 1 second in a 50 unit radius`;

        this.pathsquares = [];

        this.gridPos = new Vector(0,0);

        this.getPathSquares();

    }

    clone() {
        const clone = new MortarTower(this.canvas, this.c, this.game);

        clone.position = new Vector(this.position.x, this.position.y);
        clone.width = this.width;
        clone.height = this.height;
        clone.lastfireTime = this.lastfireTime;
        clone.fireRate = this.fireRate;
        clone.damage = this.damage;
        clone.range = this.range;
        clone.radius = this.radius;

        clone.enemies = [];
        clone.target = null;
        clone.projeciles = [];

        return clone;
    }

    getPathSquares(){
        this.game.grid.flat().forEach(element => {
            if (element.isPath) {
                this.pathsquares.push(element);
            }
        });
    }

    getGridPosition(){
        return super.getGridPosition();
    }

    doAoeDamage(square){
        var enemies = this.game.enemies;
        console.log(square.position);
        for (let i = 0; i < enemies.length; i++) {
            var distance = Vector.Distance(square.position, enemies[i].position);
            if(distance <= 50){
                enemies[i].takeDamage(this.damage);
            }
            
        }  
        //square.colour = Colours.pathColour;      
    }

    update(){
        if(!this.isActive) return;

        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){
            let square = this.pathsquares[(Math.floor(Math.random() * this.pathsquares.length))];
            square.colour = 'red';
            square.isMortard = true;
            setTimeout(() => {
                this.doAoeDamage(square);
            }, 1000);
            this.lastfireTime = currentTime;
        }

    }

    onPlaced(){
        this.gridPos = this.getGridPosition();
    }
}