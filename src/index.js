let numOfStrokes;
let writer;
let nextStroke = 0;
let strokeNumList = [];
let coreDiv = document.getElementById('core-div')

let charList = [];
let charInput = document.getElementById('character-input');
let charListDisplay = document.getElementById('character-list-display');
let charInputButton = document.getElementById('enter-character');

/****
CORE
****/

async function loadCore(char){
    writer = HanziWriter.create('character-display', char, {
        width: 100,
        height: 100,
        padding: 5,
        showCharacter: false,
        showOutline: false,
        strokeAnimationSpeed: 5
    });

    numOfStrokes = await HanziWriter.loadCharacterData(char);

    numOfStrokes = numOfStrokes['strokes'].length;

    for (let strokeNum = 0; strokeNum < numOfStrokes; strokeNum++) {
        strokeNumList.push(strokeNum);
    }

    shuffle(strokeNumList);

    for (let strokeNum of strokeNumList) {
        // Create the button
        let button = document.createElement('button');
        button.addEventListener('click', strokeButtonClicked);
        button.id = strokeNum;
        coreDiv.appendChild(button);

        let buttonWriter = HanziWriter.create(button, char, {
            width: 50,
            height: 50,
            padding: 2.5,
            showCharacter: false,
            showOutline: false
        })

        buttonWriter.animateStroke(strokeNum);
    }
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function strokeButtonClicked(event) {
    let button = event.currentTarget
    let strokeNum = button.id;

    if (strokeNum == nextStroke) {
        writer.animateStroke(strokeNum);
        nextStroke++;
        button.style.visibility = 'hidden';

        if (nextStroke >= numOfStrokes) {
            alert('You did everything right!')
        }
    } else {
        alert('Wrong stroke!');
    }
}

/***
LIST
***/

async function addCharacter(event) {
    let char = charInput.value;

    charInput.value = '';

    if (charList.includes(char)) {
        return;
    }

    // Make sure the character exists
    response = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`);

    if (response.status == 404) {
        alert('Character not found!');
        return;
    }
    else if (response.status != 200) {
        alert('Something went wrong. Please try again later.');
        return;
    }

    charList.push(char);

    let listItem = document.createElement('li');
    listItem.innerHTML = char + ' ';
    listItem.className = char;
    let removeButton = document.createElement('button');
    removeButton.addEventListener('click', deleteButtonHandler);
    removeButton.innerHTML = 'Remove';
    removeButton.className = char;
    listItem.appendChild(removeButton);
    
    charListDisplay.appendChild(listItem);
}

function deleteButtonHandler(event) {
    let elements = document.getElementsByClassName(event.currentTarget.className);
    for (let elem of elements) {
        elem.remove();
    }
}

charInputButton.addEventListener('click', addCharacter);