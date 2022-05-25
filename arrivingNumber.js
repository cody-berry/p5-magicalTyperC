

// an arriving number.

class ArrivingNumber {
    // r is the distance at which we slow down. It'll become useful to know
    // that the variable assigned to 'r' has the same purpose, but globally.
    constructor(maxSpeed, r) {
        this.target = 0
        this.yPos = 0
        this.maxSpeed = maxSpeed
        this.slowDownDistance = r
        this.yVel = 0
    }

    // updates the velocity to the position
    update() {
        this.yPos += this.yVel
    }

    // arrives to the current target position
    // Translates to: "Go towards your target as fast as possible until you
    // get close enough to slow down linearly."
    arrive() {
        let distance = abs(this.target - this.yPos)
        this.yVel = map(abs(distance), 0, this.slowDownDistance, 0, this.maxSpeed, true)
        if (this.target < this.yPos) {
            this.yVel = -this.yVel
        }
    }
}





