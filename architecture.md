



obtaining scryfall data
    reference: scryfall.com/docs/api/cards/search
    example queries you enter into your browser search bar. returns json
        you can copy and paste this json into a .json file
        this json object's 'data' key holds a list of cards :D

        api.scryfall.com/cards/search?q=set:snc
        api.scryfall.com/cards/search?q=set:snc&page=2

main loop in sketch.js
    preload → loadJSON
    setup → 
        load sounds
        cards = getCardData() ← create list of cards with relevant info
            typeText, name, collector_number, normal_uri / art_crop_uri
            you need to figure out how to concatenate parts to make typeText
                nontrivial. how to deal with power/toughness if not a creature?
            image_uris is its own key. normal_uri is inside.
        cards.sort(sortCardsByID) ← sort by 'collector_number'
            see w3schools.com/jsref/jsref_sort.asp on sorting functions
        updateCard() ← selects a new card based on the currentCardIndex
            displays card image. creates Passage object based on its typeText
    keyPressed
        handle - → —, * → •, ENTER → \n
        calls processTypedKey()
    processTypedKey(k) ← check if typed char matches current passage char
        decide what to do if correct vs incorrect

passage.js
    constructor → instance fields
        text: our passage text. in this case, it's the typeText of the card
        passageIndex: index of char we're typing in our passage
        correctList: list of boolean flags marking each char right or wrong
            used for highlightBoxes
        constants ← things like TOP_MARGIN, LINE_WRAP_X_POS
    render → shows passage
        set HIGHLIGHT_BOX_HEIGHT
        char_pos array ← position for every displayed character
            used for current word bar. maybe can be optimized to last word
        keep track of cursor
        iterate through every character of the passage:
            save cursor position in char_pos
            this.#showHighlightBox(i, cursor)
            draw current character
            this.#handleNewLines ← wrap cursor position if over LINE_WRAP_X_POS
        this.#showCurrentWordBar(char_pos)
        this.#showTextCursor(char_pos)
    #wrapCursor ← increase y, reset x
    finished()
    getCurrentChar() ← return this.text[this.index]
    setCorrect() ← this.correctList.push(true); this.advance()
    setIncorrect()
    advance() ← if !this.finished(): this.index+=1
    
            
            
        


