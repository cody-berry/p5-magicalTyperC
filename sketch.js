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

let data = [] // a variable for just the cards in json. we'll add to it every
// time we get the dominaria united set

let debugCorner // a new class defined in the template


function preload() {
    font = loadFont('data/consola.ttf')
    loadJSON('https://api.scryfall.com/cards/search?q=set:woe', gotWOEJSON)

    correctSound = loadSound('data/correct.wav')
    incorrectSound = loadSound('data/incorrect.wav')
}


// a callback function to loading the set with a code of BRO (The Brother's War)
function gotWOEJSON(json) {
    cards = {
        'object': json['object'],
        'total_cards': json['total_cards']
    }
    for (let card of json['data']) {
        data.push(card)
    }

    cards['data'] = data

    if (json['has_more']) {
        loadJSON(json['next_page'], gotWOEJSON)
    }
}


// returns a dictionary of all the multicolor cards
function filterByMulticolor(cards) {
    // the value we're returning. contains original data.
    let result = {
        'object': cards['object'],
        'total_cards': cards['total_cards']
    }

    if (cards['next_page']) {
        result['next_page'] = cards['next_page']
    }

    let data = cards['data']

    let multicolorCards = []

    for (let card of Object.values(data)) {
        if ((card['rarity'] !== 'rare') && (card['rarity'] !== 'mythic')) {
        }
        if (
            // (card['colors'].length > 1) &&
            (card['rarity'] !== 'rare') &&
            (card['rarity'] !== 'mythic')) {
            multicolorCards.push(card)
        }
    }

    result['data'] = multicolorCards

    return result
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

    cardDataIndex = 30

    updateCard(cardDataIndex)

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

    img = loadImage(randomCard['cardPNG'])

    passage = new Passage(randomCard['typeText'] + "\n")
}


// compares 2 cards by their id
function sortCardsByID(firstCard, secondCard) {
    if (firstCard.collectorID < secondCard.collectorID) {
        return -1
    } if (firstCard.collectorID > secondCard.collectorID) {
        return 1
    }
    return 0
}


// gets the data of the cards in the json file
function getCardData(cards) {
    let listOfCards = filterByMulticolor(cards)['data']

    // the relevant card data
    let cardData = []
    for (let card of listOfCards) {
        let typeText = ""
        if (card["card_faces"]) {
            for (let cardFace of card["card_faces"]) {
                typeText += cardFace['name'] + " " + cardFace['mana_cost'] + "\n" +
                    cardFace['type_line'] + "\n" + cardFace['oracle_text']
                let isThereAPowerAndToughness = new RegExp('[Cc]reature|[Vv]ehicle')
                if (isThereAPowerAndToughness.test(cardFace['type_line'])) {
                    typeText += "\n" + cardFace['power'] + "/" + cardFace['toughness']
                }
                if (cardFace['flavor_text']) {
                    typeText += "\n" + cardFace['flavor_text']
                }
                typeText += "\n"
            }
        } else {
            typeText += card['name'] + " " + card['mana_cost'] + "\n" +
                card['type_line'] + "\n" + card['oracle_text']
            let isThereAPowerAndToughness = new RegExp('[Cc]reature|[Vv]ehicle')
            if (isThereAPowerAndToughness.test(card['type_line'])) {
                typeText += "\n" + card['power'] + "/" + card['toughness']
            }
            if (card['flavor_text']) {
                typeText += "\n" + card['flavor_text']
            }
            typeText += "\n"
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

function draw() {
    background(234, 34, 24)
    textFont(font, 25)

    if (passage.finished()) {
        cardDataIndex = round(random(0, cardData.length-1))
        updateCard(cardDataIndex)
    }

    passage.show()

    image(img, width/2 + 75, 50, width/2 - 150, height-100)
    /* add a slight glow */
    stroke(0, 0, 100, 100)
    strokeWeight(1)
    noFill()
    rect(width/2 + 75, 50, width/2 - 150, height-100, 10)
    stroke(0, 0, 100, 90)
    rect(width/2 + 74, 49, width/2 - 148, height-98, 11)
    stroke(0, 0, 100, 80)
    rect(width/2 + 73, 48, width/2 - 146, height-96, 12)
    stroke(0, 0, 100, 70)
    rect(width/2 + 72, 47, width/2 - 144, height-94, 13)
    stroke(0, 0, 100, 60)
    rect(width/2 + 71, 46, width/2 - 142, height-92, 14)
    stroke(0, 0, 100, 50)
    rect(width/2 + 70, 45, width/2 - 140, height-90, 15)
    stroke(0, 0, 100, 45)
    rect(width/2 + 69, 44, width/2 - 138, height-88, 16)
    stroke(0, 0, 100, 40)
    rect(width/2 + 68, 43, width/2 - 136, height-86, 17)
    stroke(0, 0, 100, 35)
    rect(width/2 + 67, 42, width/2 - 134, height-84, 18)
    stroke(0, 0, 100, 30)
    rect(width/2 + 66, 41, width/2 - 132, height-82, 19)
    stroke(0, 0, 100, 25)
    rect(width/2 + 65, 40, width/2 - 130, height-80, 20)
    stroke(0, 0, 100, 20)
    rect(width/2 + 64, 39, width/2 - 128, height-78, 21)
    stroke(0, 0, 100, 17)
    rect(width/2 + 63, 38, width/2 - 126, height-76, 22)
    stroke(0, 0, 100, 15)
    rect(width/2 + 62, 37, width/2 - 124, height-74, 23)
    stroke(0, 0, 100, 12)
    rect(width/2 + 61, 36, width/2 - 122, height-72, 24)
    stroke(0, 0, 100, 10)
    rect(width/2 + 60, 35, width/2 - 120, height-70, 25)
    stroke(0, 0, 100, 8)
    rect(width/2 + 59, 34, width/2 - 118, height-68, 26)
    stroke(0, 0, 100, 6)
    rect(width/2 + 58, 33, width/2 - 116, height-66, 27)
    stroke(0, 0, 100, 4)
    rect(width/2 + 57, 32, width/2 - 114, height-64, 28)
    stroke(0, 0, 100, 2)
    rect(width/2 + 56, 31, width/2 - 112, height-62, 29)
    stroke(0, 0, 100, 1)
    rect(width/2 + 55, 30, width/2 - 110, height-60, 30)

    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()
}

// *=•
// -=—
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
    if (key.length === 1 || key === "Enter") {
        if (key === correctKey) {
            passage.setCorrect()
            correctSound.play()
        } else {
            passage.setIncorrect()
            incorrectSound.play()
        }
    }
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
