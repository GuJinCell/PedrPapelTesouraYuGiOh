const state ={
    score:{
        playerScore: 0,
        cpuScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites:{
        avatar: document.getElementById("card-image"),        
        name: document.getElementById("card-name"),        
        type: document.getElementById("card-type"),        
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        cpu: document.getElementById("cpu-field-card"),
    },
    
    playerSide:{
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        cpu: "cpu-cards",
        cpuBox: document.querySelector("#cpu-cards") 
    },
    button: document.getElementById("next-duel"),

};



const pathImages = "./src/assets/icons/"

const cardData =[
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:"Dark magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:"Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSide.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelecCard(IdCard);
        });
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }
    

    return cardImage;
}

async function setCardsField(cardId){ 
    await removeAllCardsImages();

    let cpuCardId = await getRandomCardId();

    await showFieldCard(true);

    await hiddenCardDetails();
    await drawCardinField(cardId, cpuCardId);

    let duelResults = await checkDuelResults(cardId, cpuCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function showFieldCard(value) {
    if (value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.cpu.style.display = "block";
    }

    if (value === false){
        state.fieldCards.player.style.display ="none"
        state.fieldCards.cpu.style.display ="none"
    }
    
}

async function hiddenCardDetails() {
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
    
}

async function drawCardinField(cardId, cpuCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.cpu.src = cardData[cpuCardId].img;
}

async function drawButton(text) {
    state.button.innerText = text;
    state.button.style.display = "block";
    
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.
    playerScore} | Lose: ${state.score.cpuScore}`
    
}

async function checkDuelResults(playerCardId, cpuCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(cpuCardId)){
        duelResults = "win"
        await playAudio(duelResults)
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(cpuCardId)){
        duelResults = "lose"
        await playAudio(duelResults)
        state.score.cpuScore++;
    }
    return duelResults;
}

async function removeAllCardsImages(){
    let cards = state.playerSide.cpuBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    
    cards = state.playerSide.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelecCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attribute: " + cardData[index].type;
    
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
    
}

async function resetDuel() {
    state.cardsSprites.avatar.src = "";
    state.button.style.display = "none";

    state.fieldCards.player.style.display = "none"
    state.fieldCards.cpu.style.display = "none"

    init()
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try{
        audio.play();
    }catch{}
    
}

function init(){
    showFieldCard(false);

    drawCards(5, state.playerSide.player1);
    drawCards(5, state.playerSide.cpu);

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()