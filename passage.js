
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

        this.#drawCurrentWordBar(charPos)
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

    // draw a bar on the word that we're typing
    #drawCurrentWordBar(charPos) {
        // the characters we haven't already typed
        let restOfPassage = this.text.substring(this.index)

        // the next space (newline later)
        let nextDelimiter = restOfPassage.indexOf(" ") + this.index
        let nextNewline = restOfPassage.indexOf("\n") + this.index
        if (nextNewline < nextDelimiter) {
            nextDelimiter = nextNewline
        }

        // the last space we typed
        let previousDelimiter = 0

        for (let i=0; i<this.index; i++) {
            if (this.getCurrentChar(i) === ' ' || this.text.substring(i, i+1) === '\n') {
                previousDelimiter = i+1
            }
        }

        // the position of the next space
        let ndPosition = charPos[nextDelimiter]

        // the position of the previous space
        let pdPosition = charPos[previousDelimiter]

        if (!(ndPosition.equals(pdPosition) || this.text.substring(previousDelimiter, nextDelimiter))) {
            // draw a gray line above the two positions in the padding
            stroke(0, 0, 100)
            strokeWeight(2)
            line(ndPosition.x, ndPosition.y - textAscent() - this.LINE_SPACING / 2,
                pdPosition.x, pdPosition.y - textAscent() - this.LINE_SPACING / 2)
        }
    }
}




