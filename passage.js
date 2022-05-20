
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

        // how many lines it takes to display the current passage. It'll be
        // useful for showing the bounding box.
        this.linesDisplayed = 0
    }

    show() {
        fill(0, 0, 100, 3)
        this.#showBoundingBox()

        this.linesDisplayed = 0

        let cursor = new p5.Vector(this.LEFT_MARGIN, this.TOP_MARGIN)
        let charPos = [] // a list of character positions
        for (let i = 0; i < this.text.length; i++) {
            fill(0, 0, 100)
            charPos.push(cursor.copy())

            let char = this.text.charAt(i)
            text(char, cursor.x, cursor.y)

            if (i < this.index) {
                this.#drawHighlightBox(i, cursor)
            }

            cursor.x += textWidth(char)

            this.#handleNewLines(i, cursor)
        }

        this.#drawCurrentWordBar(charPos)

        stroke(0, 0, 100)
        strokeWeight(2)
        this.#drawTextCursor(charPos)
    }

    // shows the bounding box
    #showBoundingBox() {
        // the top-left corner of our bounding box
        let boundingBoxTL = new p5.Vector(this.LEFT_MARGIN-10, this.TOP_MARGIN - textAscent() - this.LINE_SPACING)

        // the top-right corner of our bounding box
        let boundingBoxTR = new p5.Vector(this.lineWrapXpos+10, this.TOP_MARGIN - textAscent() - this.LINE_SPACING)

        // the y-coordinate of the bottom of our bounding box
        let boxBottomY = this.linesDisplayed*(this.LINE_SPACING + textAscent() + textDescent())

        // the bottom-left corner of our bounding box. We don't need the
        // bottom-right corner because since we only need the width and the
        // height, we only need the vertices of the rectangle that are
        // horizontally or vertically connected to the top-left corner.
        let boundingBoxBL = new p5.Vector(this.LEFT_MARGIN-10, this.TOP_MARGIN + boxBottomY)

        rect(boundingBoxTL.x, boundingBoxTL.y, boundingBoxTR.x - boundingBoxTL.x, boundingBoxBL.y - boundingBoxTL.y)
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
        }
        if (this.text.substring(i, i+1) === "\n") { // next two letters
            this.#drawReturn(textWidth(' '), textAscent(), 3, new p5.Vector(cursor.x - textWidth(' ') + 2, cursor.y))
            this.#wrapCursorPosition(cursor)
        }
    }

    #wrapCursorPosition(cursor) {
        cursor.x = this.LEFT_MARGIN
        cursor.y += textAscent() + textDescent() + this.LINE_SPACING
        this.linesDisplayed += 1
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
        if (!this.finished()) {
            this.index++
        }
    }

    // are we done with the passage?
    finished() {
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

        if (!(ndPosition.equals(pdPosition) || this.text.substring(previousDelimiter, nextDelimiter) === ' ')) {
            // draw a gray line above the two positions in the padding
            stroke(0, 0, 50)
            strokeWeight(2)
            line(ndPosition.x, ndPosition.y - textAscent() - this.LINE_SPACING / 2,
                pdPosition.x, pdPosition.y - textAscent() - this.LINE_SPACING / 2)
        }
    }

    #drawTextCursor(charPos) {
        let cursor = charPos[this.index]
        cursor.y += textDescent() + this.LINE_SPACING/2
        line(cursor.x, cursor.y, cursor.x + textWidth(' '), cursor.y)
    }

    #drawHighlightBox(i, cursor) {
        // we fill the correct color, and if the correct list shows that
        // it's incorrect at index i, we fill the incorrect color. Also, we
        // noStroke().
        noStroke()
        fill(90, 100, 70, 46)

        if (this.correctList[i] === false) {
            fill(0, 100, 70, 46)
        }

        // draw a rectangle that starts at the most definite top-left corner
        // of the character. Its height is the difference between the
        // top-left corner of the box and the lowest point the text could
        // ever get.
        rect(cursor.x, cursor.y-textAscent(), textWidth(' '), textAscent()+textDescent(), 2)
    }

    #drawReturn(w, h, r, cursor) {
        push()
        translate(cursor.x, cursor.y)
        // the top right corner of the arrow
        let TR = new p5.Vector(3*w/4, -7*h/8)

        // the bottom right corner of the arrow
        let BR = new p5.Vector(3*w/4, -h/4)

        // the bottom left corner of the arrow, also the triangle tip
        let BL = new p5.Vector(w/4, -h/4)

        // our line
        stroke(0, 0, 50)
        strokeWeight(2)
        strokeJoin(ROUND)
        noFill()
        beginShape()
        vertex(TR.x, TR.y)
        vertex(BR.x, BR.y)
        vertex(BL.x+1, BL.y) // move the bottom-left vertex right so that it
        // doesn't show up when we draw our triangle
        endShape()

        // our triangle
        strokeWeight(1)
        fill(0, 0, 50)
        translate(-r/2, 0)
        triangle(BL.x, BL.y, BL.x + r, BL.y + sqrt(3)*r/3, BL.x + r, BL.y - sqrt(3)*r/3)

        pop()
    }
}




