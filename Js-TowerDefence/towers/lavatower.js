import Vector from "../vector.js";
import Tower from "./tower.js";

export default class LavaTower extends Tower{
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
        this.name = "Lava Tower";
        this.damage = 0;
        this.cost = 250;
        this.description = `picks a random path square around the tower and covers it in lava. Lava will set the enemy on fire and deal damage based on how long they were in the lava for`;

        this.dirOptions = [
            new Vector(-1, 0),
            new Vector(1, 0),
            new Vector(0, -1),
            new Vector(0, 1),
            new Vector(-1, -1),
            new Vector(-1, 1),
            new Vector(1, -1),
            new Vector(1, 1)
        ];

        this.gridPos = new Vector(0,0);

    }

        clone() {
            const clone = new LavaTower(this.canvas, this.c, this.game);
    
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

    getGridPosition(){
        return super.getGridPosition();
    }

    update(){
        if(!this.isActive) return;

        const currentTime = Date.now();
        if(currentTime - this.lastfireTime >= this.fireRate){
            let randomDir = this.dirOptions[Math.floor(Math.random() * this.dirOptions.length)];
            let gridX = this.gridPos.x + randomDir.x;
            let gridY = this.gridPos.y + randomDir.y;
            if (gridX >= 0 && gridX < this.game.grid.length &&
                gridY >= 0 && gridY < this.game.grid[0].length) {
                
                if (this.game.grid[gridX][gridY].isPath) {
                    this.game.grid[gridX][gridY].isLava = true;
                }
            }
            this.lastfireTime = currentTime;
        }

    }

    onPlaced(){
        this.gridPos = this.getGridPosition();
    }
}