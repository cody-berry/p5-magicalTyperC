/**
 *  @author
 *  @date 2022.05.
 *
 *
 */
let font
let instructions
let cards
let passage // a passage that we're going to type
let correctSound // the sound that we're going to play when we get a correct key
let incorrectSound // the sound that we're going to play when we get an
// incorrect key
let img // the image of the randomly-selected card in setup() or the updated
// card in updateCard()
let cardData // the useful data in the cards
let cardDataIndex // what index of the cardData list is the actual card
// that we're typing

let debugCorner // a new class defined in the template


function preload() {
    font = loadFont('data/consola.ttf')
    cards = loadJSON('scryfall-snc.json')
    correctSound = loadSound('data/correct.wav')
    incorrectSound = loadSound('data/incorrect.wav')
}


function setup() {
    let cnv = createCanvas(960, 540)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    background(234, 34, 24)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        z → freeze sketch</pre>`)

    cardData = getCardData(cards)

    cardData.sort(sortCardsByID)

    cardDataIndex = round(random(0, cardData.length-1))

    updateCard(cardDataIndex)

    console.log(cardDataIndex)

    debugCorner = new CanvasDebugCorner(6)
}


// selects the card with the given collector number, given that the card
// data is sorted by the collector number
function updateCard() {
    textFont(font, 25)

    if (cardDataIndex < 0) {
        cardDataIndex = cardData.length + cardDataIndex
    } if (cardDataIndex >= cardData.length) {
        cardDataIndex = cardDataIndex - cardData.length
    }

    let randomCard = cardData[cardDataIndex]

    console.log(randomCard)

    img = loadImage(randomCard['cardPNG'])

    passage = new Passage(randomCard['typeText'] + " \n")
}


// compares 2 cards by their id
function sortCardsByID(firstCard, secondCard) {
    if (firstCard.collectorID === secondCard.collectorID) {
        return 0
    } if (firstCard.collectorID < secondCard.collectorID) {
        return -1
    } if (firstCard.collectorID > secondCard.collectorID) {
        return 1
    }
}


// gets the data of the cards in the json file
function getCardData(cards) {
    let listOfCards = cards.data

    // the relevant card data
    let cardData = []
    for (let card of listOfCards) {
        let typeText = card['name'] + " " + card['mana_cost'] + "\n" +
            card['type_line'] + "\n" + card['oracle_text']
        let isThereAPowerAndToughness = new RegExp('[Cc]reature|[Vv]ehicle')
        if (isThereAPowerAndToughness.test(card['type_line'])) {
            typeText += "\n" + card['power'] + "/" + card['toughness']
        }
        if (card['flavor_text']) {
            typeText += "\n" + card['flavor_text']
        }

        cardData.push({
            'typeText': typeText,
            'name': card['name'],
            'manaCost': int(card['cmc']),
            'collectorID': int(card['collector_number']),
            'artCropPNG': card['image_uris']['art_crop'],
            'cardPNG': card['image_uris']['png']
        })
    }




    return cardData
}

// *=•
// -=—

function draw() {
    background(234, 34, 24)
    textFont(font, 25)

    if (passage.finished()) {
        cardDataIndex = round(random(0, cardData.length-1))
        updateCard(cardDataIndex)
    }

    passage.show()

    image(img, width/2 + 75, 50, width/2 - 150, height-100)

    debugCorner.setText(`card data index: ${cardDataIndex}`, 5)
    debugCorner.setText(`scroll target: ${passage.yOffset.target.toFixed(5)}`, 4)
    debugCorner.setText(`scroll position: ${passage.yOffset.yPos.toFixed(5)}`, 3)
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()
}


/** 🧹 shows debugging info using text() 🧹 */
function displayDebugCorner() {
    const LEFT_MARGIN = 10
    const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
    const LINE_SPACING = 2
    const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
    fill(0, 0, 100, 100) /* white */
    strokeWeight(0)

    text(`card data index: ${cardDataIndex}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT*4)
    text(`scroll target: ${passage.yOffset.target.toFixed(5)}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT*3)
    text(`scroll position: ${passage.yOffset.yPos.toFixed(5)}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT*2)
    text(`frameCount: ${frameCount}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT)
    text(`frameRate: ${frameRate().toFixed(1)}`,
        LEFT_MARGIN, DEBUG_Y_OFFSET)
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { // 97 is the keycode for numpad 1
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    } if (keyCode === 98) { // 98 is the keycode for numpad 2
        cardDataIndex -= 10
        updateCard(cardDataIndex)
    } if (keyCode === 100) { // 100 is the keycode for numpad 4
        cardDataIndex--
        updateCard(cardDataIndex)
    } if (keyCode === 101) { // 101 is the keycode for numpad 5
        cardDataIndex = round(random(0, cardData.length-1))
        updateCard(cardDataIndex)
    } if (keyCode === 102) { // 102 is the keycode for numpad 6
        cardDataIndex++
        updateCard(cardDataIndex)
    } if (keyCode === 104) { // 104 is the keycode for numpad 8
        cardDataIndex += 10
        updateCard(cardDataIndex)
    }
    /* a key has been typed! */
    else {
        // otherwise....
        processKeyTyped(key)
    }
}

// processes given key
function processKeyTyped(key) {
    // asterisk (*) = bullet point (•), and dash (-) = emdash (—). This is
    // the key that needs to be typed in order to get the character correct.
    let correctKey = passage.getCurrentChar(passage.index)
    if (correctKey === "•") {
        correctKey = "*"
    } else if (correctKey === "—") {
        correctKey = "-"
    } if (passage.text.substring(passage.index, passage.index + 1) === "\n") {
        correctKey = "Enter"
    }
    if (key !== "Shift" && key !== "Tab" && key !== "CapsLock" && key !== "Alt" && key !== "Control") {
        if (key === correctKey) {
            passage.setCorrect()
            correctSound.play()
        } else {
            passage.setIncorrect()
            incorrectSound.play()
        }
    }

    print(key + "🆚" + correctKey + ", " + passage.index)
}

/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)
        strokeWeight(1)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}
