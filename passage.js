
class Passage {
    constructor(text) {
        this.TOP_MARGIN = 100
        this.LEFT_MARGIN = 64
        this.RIGHT_MARGIN = 500


        this.text = text
        this.index = 0 // what index are we currently typing?
        this.correctList = [] // a list of booleans determining if we've
        // gotten our characters correct/incorrect

        // where are we going to wrap our line?
        this.lineWrapXpos = width - this.RIGHT_MARGIN

        // what is the space between each line?
        this.LINE_SPACING = 3
    }

    show() {
        let cursor = new p5.Vector(this.LEFT_MARGIN, this.TOP_MARGIN)
        let charPos = [] // a list of character positions
        for (let i = 0; i < this.text.length; i++) {
            charPos.push(cursor.copy())

            let char = this.text.charAt(i)
            text(char, cursor.x, cursor.y)

            cursor.x += textWidth(char)

            this.#handleNewLines(i, cursor)
        }

        fill(240, 100, 100)
        line(this.lineWrapXpos, 0, this.lineWrapXpos, height)
    }

    getCurrentChar(i) {
        return this.text.charAt(i)
    }

    #handleNewLines(i, cursor) {
        if (this.getCurrentChar(i) === " ") {
            let restOfPassage = this.text.substring(i+1) // the text not shown
            let nextDelimiter = restOfPassage.indexOf(" ") + i // the next
                // space
            let currentWord = this.text.substring(i+1, nextDelimiter+1) // the
            // current word
            if (cursor.x + textWidth(currentWord) > this.lineWrapXpos) {
                this.#wrapCursorPosition(cursor)
            }

            if (frameCount === 100) {
                console.log(restOfPassage)
                console.log(nextDelimiter)
                console.log(currentWord)
            }

        }
        if (this.text.substring(i, i+1) === "\n") { // next two letters
            this.#wrapCursorPosition(cursor)
        }
    }

    #wrapCursorPosition(cursor) {
        cursor.x = this.LEFT_MARGIN
        cursor.y += textAscent() + textDescent() + this.LINE_SPACING
    }

    // sets the next character's correct status to 'true'.
    setCorrect() {
        this.correctList.push(true)
        this.#advance()
    }

    // sets the next character's correct status to 'false'.
    setIncorrect() {
        this.correctList.push(false)
        this.#advance()
    }

    // advances to the next character.
    #advance() {
        if (!this.#finished()) {
            this.index++
        }
    }

    // are we done with the passage?
    #finished() {
        return this.index >= this.text.length
    }
}




