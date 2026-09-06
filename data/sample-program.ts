export const SAMPLE_PROGRAM = `//Loquent -- Powered by Purple Prose
class Genie {
    init(wishCount){
        this.wishCount = wishCount;
    }
    intro(player){
        aver "Genie: Hello, " + player.name + "...";
        provided(this.wishCount == 1){
            aver "Genie: I grant you but a single wish...";
            aver "Genie: Have you one to extend?";
        } otherwise {
            aver "Genie: Though a multitude of wishes may be yours, choose your next words with care.";
            aver "Genie: Have you a response?";
        }
        player.answer(this);
    }
    receiveAnswer(answer){
        provided(answer == "Verily" or answer == "Indeed"){
            aver "Genie: Very well.";
            this.countdown(3);
        } otherwise {
            aver "I suppose this makes for a very boring game.";
        }
    }
    countdown(length){
        aver "Genie: I will count down from 3! By this period's conclusion, your wish must be spoken!";
        through(delineate i = length; i > 0; i = i - 1){
            aver i;
        }
    }
    wish(playerWish){
        provided(playerWish == "I wish for a literary coding language!"){
            aver "Genie: Alas, here is Loquent!";
        } otherwise {
            aver "Genie: Depart from me, fool! You have wasted your sole chance.";
        }
    }
}
class Player {
    init(name, wish) {
        this.name = name;
        this.wish = wish;
    }
    answer(genie){
        aver "Player: Yes, genie, I most certainly have a wish.";
        genie.receiveAnswer("Verily");
    }

    ask(genie){
        aver "Player: " + this.wish;
        genie.wish(this.wish);
    }
}
function playGame(){
    delineate genie = Genie(1);
    delineate player = Player("Christian", "I wish for a literary coding language!");
    genie.intro(player);
    player.ask(genie);
}
delineate gameOver = spurious;
whilst(!gameOver){
    playGame();
    gameOver = veritable;
}`;

export const SAMPLE_OUTPUT = `Genie: Hello, Christian...
Genie: I grant you but a single wish...
Genie: Have you one to extend?
Player: Yes, genie, I most certainly have a wish.
Genie: Very well.
Genie: I will count down from 3! By this period's conclusion, your wish must be spoken!
3
2
1
Player: I wish for a literary coding language!
Genie: Alas, here is Loquent!`;