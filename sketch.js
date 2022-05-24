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
    textFont(font, 20)
    background(234, 34, 24)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        [1,2,3,4,5] → no function
        z → freeze sketch</pre>`)

    cardData = getCardData(cards)

    cardData.sort(sortCardsByID)

    updateCard(round(random(0, cardData.length-1)))
}


// selects the card with the given collector number, given that the card
// data is sorted by the collector number
function updateCard(collectorID) {
    let randomCard = cardData[collectorID]

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

    if (passage.finished()) {
        updateCard(round(random(0, cardData.length - 1)))
    }

    passage.show()

    image(img, width/2 + 75, 50, width/2 - 150, height-100)

    displayDebugCorner()
}


/** 🧹 shows debugging info using text() 🧹 */
function displayDebugCorner() {
    const LEFT_MARGIN = 10
    const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
    const LINE_SPACING = 2
    const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
    fill(0, 0, 100, 100) /* white */
    strokeWeight(0)

    text(`frameRate: ${passage.yOffset.yPos.toFixed(5)}`,
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
    if (key !== "Shift" && key !== "Tab" && key !== "CapsLock") {
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
