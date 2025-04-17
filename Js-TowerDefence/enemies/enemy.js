import Vector from '../vector.js';

export default class Enemy{
    constructor(canvas, context, waypoints, drawingArea, game){
        this.radius = 15;
        this.position = new Vector(0,0);
        this.colour = 'blue';
        this.canvas = canvas;
        this.c = context;
        this.waypoints = waypoints;
        this.velocity = new Vector(1,0);
        this.target = this.waypoints[1];
        this.waypointIndex = 1;
        this.baseSpeed = 100;
        this.speed = this.baseSpeed;
        this.finalDir = new Vector(1,0);
        this.isDead = false;
        this.drawingArea = drawingArea;
        this.game = game;
        this.health = 3;
        this.bounty = 50;
        this.isSlowed = false;
        this.isInLava = false;
        this.isBurning = false;
        this.damageToPlayer = 1;
        this.slowTimer = 0;
        this.lavaTimer = 0;
        this.burnIntervalTimer = 0;
        this.burnTotalTimer = 0;
        this.burnDamage = 0;
        this.gridPos = new Vector(0,0);
        
        
    }

    takeDamage(damage){
        this.health -= damage;
        if(this.health <= 0){
            this.isDead = true;
            this.game.alterMoney(this.bounty);
        }
    }

    isInDrawingArea(){
        return (
            this.position.x >= this.drawingArea.x && 
            this.position.x < this.drawingArea.x + this.drawingArea.width && 
            this.position.y >= this.drawingArea.y && 
            this.position.y < this.drawingArea.y + this.drawingArea.height);
    }

    draw(){
        if(!this.isDead && this.isInDrawingArea()){

            if(this.isBurning || this.isInLava){
                this.c.fillStyle = 'orange';
            }else{
                this.c.fillStyle = 'blue';
            }

            this.c.beginPath();
            this.c.arc(this.position.x,this.position.y, this.radius, 0, 360, false);
            
            this.c.fill();
        }

    }

    getGridPosition(){
        const gridX = Math.floor((this.position.x - this.game.drawingArea.x) / this.game.squareSize);
        const gridY = Math.floor((this.position.y - this.game.drawingArea.y) / this.game.squareSize);
        return new Vector(gridX, gridY);
    }

    slow(){
        this.speed = this.baseSpeed / 2;

        this.isSlowed = true;
    }

    move(deltaTime){
        if (this.waypoints.length > 0) {
            
            if(this.waypointIndex+1 == this.waypoints.length){
                this.velocity = Vector.Normalize(this.finalDir);
                this.velocity = Vector.Multiply(this.velocity, this.speed * deltaTime);

                this.position = Vector.Add(this.position, this.velocity);
            }else{
                const dir = Vector.Direction(this.position, this.target.getCentrePosition());
            
                this.velocity = Vector.Normalize(dir);
                this.velocity = Vector.Multiply(this.velocity, this.speed * deltaTime);
    
                this.position = Vector.Add(this.position, this.velocity);
        
                if (Vector.Distance(this.position, this.target.getCentrePosition()) <= 1) {
                    this.waypointIndex++;
                    if (this.waypointIndex + 1 < this.waypoints.length) {
                        this.target = this.waypoints[this.waypointIndex];
                    }
                    else
                    {
                        this.finalDir = Vector.Direction(this.position, this.waypoints[this.waypoints.length-1].getCentrePosition())
                    }
                }
            }
        }
    }

    checkGrid(deltaTime){

        if(!this.isInDrawingArea) return;

        this.gridPos = this.getGridPosition();
        if (this.gridPos.x >= 0 && this.gridPos.x < this.game.grid.length &&
            this.gridPos.y >= 0 && this.gridPos.y < this.game.grid[0].length) {
        
            if(this.game.grid[this.gridPos.x][this.gridPos.y].isLava){
                this.isInLava = true;
            }else{

                this.isInLava = false;
                if(this.lavaTimer > 0){
                    this.isBurning = true;
                    this.burnDamage = this.lavaTimer;
                }
                this.lavaTimer = 0;
            }
        }
        
    }

    update(deltaTime){

        if(!this.isDead){
            this.checkGrid(deltaTime);
            this.move(deltaTime);



            if(this.position.x < 0 && this.waypointIndex > 1){
                this.game.damagePlayer(this.damageToPlayer);
                this.isDead = true;
            }

            if(this.isSlowed){
                this.slowTimer += deltaTime;
                if(this.slowTimer >= 3){
                    this.isSlowed = false;
                    this.speed = this.baseSpeed;
                }
            }

            if(this.isInLava){
                this.lavaTimer += deltaTime * 2;
            }

            if(this.isBurning){
                this.burnTotalTimer += deltaTime;
                
                this.burnIntervalTimer += deltaTime;
                if(this.burnIntervalTimer >= 1){
                    this.takeDamage(this.burnDamage);
                    this.burnIntervalTimer = 0;
                }
                if(this.burnTotalTimer >= 5){
                    this.isBurning = false;
                    this.burnDamage = 0;
                    this.burnTotalTimer = 0;
                    this.burnIntervalTimer = 0;
                }
            }
        }

        
    }
}