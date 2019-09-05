class Card {
    constructor(suit, value) {
       this.suit = suit;
       this.value = value;
    }
    show() {
       var card_vals = {
          '1' : 'Ace',
          '2' : '2',
          '3' : '3',
          '4' : '4',
          '5' : '5',
          '6' : '6',
          '7' : '7',
          '8' : '8',
          '9' : '9',
          '10' : '10',
          '11' : 'Jack',
          '12' : 'Queen',
          '13' : 'King'
       };
       console.log(`${card_vals[this.value.toString()]} of ${this.suit}`);
    }
 }

 class Deck {
    constructor() {
       this.cards = [];
       this.reset_deck();
    }
    shuffle() {
       for(let i = 0; i < 52; i++) {
          let randomIndex = Math.floor(Math.random() * 52);
          let temp = this.cards[i];
          this.cards[i] = this.cards[randomIndex];
          this.cards[randomIndex] = temp;
       }
    }
    reset_deck(){
       var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
       var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
       this.cards = [];
       for(var value of values) {
          for(var suit of suits) {
             var card = new Card(suit, value);
             this.cards.push(card);
          }
       }
    }
    deal() {
       if(this.cards.length == 0) {
          console.log("There are no cards left to deal!");
       }
       var card = this.cards.pop();
       return card;
    }
 }

 class Player {
    constructor(name) {
       this.name = name;
       this.hand = [];
    }

    draw(deck) {
       var card = deck.deal();
       this.hand.push(card)
    }

    discard(index) {
       if(this.hand.length <= index) {
          console.log("The player does not have this many cards!");
       }
    }

    showHand() {
       for(var card of this.hand) {
          card.show();
       }
    }
 }

var myDeck = new Deck();
var player = new Player('player');
var dealer = new Player('dealer');
var revealCards = false;

function startGame() {
    myDeck.reset_deck();
    myDeck.shuffle();
    dealer.hand = [];
    player.hand = [];
    dealer.draw(myDeck);
    dealer.draw(myDeck);
    player.draw(myDeck);
    player.draw(myDeck);
    displayHand(player);
    displayHand(dealer);
    $('.hit').show();
    $('.stand').show();
    $('.playAgain').hide();
}

function displayHand(player) {
    var hand = player.hand;
    var htmlString = "";
    for(var card of hand){
        if(player.name == 'dealer' && !revealCards) {
            htmlString += `<img src = "cards-png/b1fv.png" alt = "card" height = 150px style = "padding: 10px">`
        }
        else {
            htmlString += `<img src = "cards-png/${card.suit[0].toLowerCase()}${card.value}.png" alt = "card" height = 150px style = "padding: 10px">`
        }
    }
    $(`.${player.name}Cards`).html(htmlString);
    console.log(htmlString);
    $(`.${player.name}Cards`).html(htmlString);
}

function checkBlackJack(hand) {

}

function showPlayAgain() {
    $('.playAgain').show();
    $('.hit').hide();
    $('.stand').hide();
    $('.playAgain').click(function() {
        revealCards = false;
        startGame();
    });
}

function calculateHand(hand) {
    var handValue = 0;
    var aceCount = 0;
    var values = {
        '2' : 2,
        '3' : 3,
        '4': 4, 
        '5' : 5,
        '6' : 6, 
        '7' : 7,
        '8' : 8, 
        '9' : 9, 
        '10' : 10,
        '11' : 10,
        '12' : 10,
        '13' : 10
    }
    for(var card of hand) {
        if(card.value == 1) {
            aceCount++;
        }
        else{
            handValue += values[card.value.toString()];
        }
    }
    while(aceCount > 0) {
        if ((handValue + 11 + (aceCount - 1)) <= 21){
            handValue += 11;
        }
        else {
            handValue += 1;
        }
        aceCount--;
    }
    return handValue;
}

function checkBlackJack(hand) {
    if (hand.length > 2) {
        return false;
    }
    cardVals = [];
    for(var card of hand) {
        cardVals.push(card.value);
    }
    var index = cardVals.indexOf(1);
    if(index != -1) {
        var index2 = 0;
        if (index == 0) {
            index2 = 1;
        }
        if ((cardVals[index2] == 10) || (cardVals[index2] == 11) || (cardVals[index2] == 12) || (cardVals[index2] == 13)){
            return true;
        }
        return false;
    }
    return false;
}

$( document).ready(function() {
    startGame();
    var playerBlackJack = checkBlackJack(player.hand);
    var dealerBlackJack = checkBlackJack(dealer.hand);
    if (playerBlackJack && dealerBlackJack) {
        alert('You tied!')
        revealCards = true;
        showPlayAgain();
        displayHand(dealer);
        displayHand(player);
    
    }
    else if (playerBlackJack) {
        alert('Blackjack!!! You win! :) :) :)')
        revealCards = true;
        displayHand(dealer);
        displayHand(player);
        showPlayAgain();
    }
    else if(dealerBlackJack) {
        alert('You lose :(')
        revealCards = true;
        displayHand(dealer);
        displayHand(player);
        showPlayAgain();
    }
    $('.hit').click(function() {
        player.draw(myDeck);
        var dealerVal = calculateHand(dealer.hand);
        var playerVal = calculateHand(player.hand);
        if(playerVal > 21) {
            alert('You lose! :(')
            revealCards = true;
            showPlayAgain();
        }
        else {
            if(dealerVal < 17) {
                dealer.draw(myDeck);
                dealerVal = calculateHand(dealer.hand);
                if(dealerVal > 21){
                    alert('You win!')
                    revealCards = true;
                    displayHand(dealer);
                    showPlayAgain();
                }
            }
        }
        displayHand(dealer);
        displayHand(player);
    });
    $('.stand').click(function() {
        displayHand(player);
        var playerVal = calculateHand(player.hand);
        var dealerVal = calculateHand(dealer.hand);
        while (dealerVal < 17) {
            dealer.draw(myDeck);
            dealerVal = calculateHand(dealer.hand);
        }
        revealCards = true;
        if(dealerVal > 21){
            alert('You win!')
        }
        else if (dealerVal > playerVal) {
            alert('You lose! :(')
        }
        else if (dealerVal < playerVal) {
            alert('You win! :)')
        }
        else {
            alert('You tied!')
        }
        displayHand(dealer);   
        showPlayAgain(); 
    });
});

