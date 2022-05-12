
class Passage {
    constructor(text) {
        this.TOP_MARGIN = 100
        this.LEFT_MARGIN = 64
        this.RIGHT_MARGIN = 440


        this.text = text
        this.index = 0 // what index are we currently typing?
        this.correctList = [] // a list of booleans determining if we've
        // gotten our characters correct/incorrect

        // where are we going to wrap our line?
        this.lineWrapXpos = width - this.RIGHT_MARGIN
    }

    show() {
        let cursor = new p5.Vector(this.LEFT_MARGIN, this.TOP_MARGIN)
        let charPos = [] // a list of character positions
        for (let i = 0; i < this.text.length; i++) {
            charPos.push(cursor.copy())

            let char = this.text.charAt(i)
            text(char, cursor.x, cursor.y)

            cursor.x += textWidth(char)
        }
    }
}




