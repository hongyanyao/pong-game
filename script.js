$(document).ready(function(){

var comScore = $('.comScore');//computer controlled paddle score
var keyScore = $('.keyScore');//keyboard-controlled paddle score
var winLeft = 0;//times of wins for the computer controlled paddle
var winRight = 0;//times of wins for keyboard-controlled paddle
var sec = 0;//start second for the timer 
var roundScores = []; //the score(seconds) of your win

// timer setup and display 
function timerDisplay(){

    function pad ( val ) { return val > 9 ? val : "0" + val; }
        setInterval(function(){
            $("#seconds").html(pad(++sec%60));
            $("#minutes").html(pad(parseInt(sec/60,10)));
        }, 1000);
};

timerDisplay();//display timer for each round 


// computer-controlled paddle creation and movement 

var c = {
    x:0,
    y:30,
    w:10,
    h:100,
    dy:1,
    speed:10,
    comScore: 10,
    ani:{}
}

const leftPaddle = $('.leftPaddle');
leftPaddle.css({top: `${c.y}px`});	


function moveLeftPaddle(){
    c.y += c.dy * c.speed;
    leftPaddle.css({top: `${c.y}px`});

    if(c.y > screen.availHeight - c.h -100 || c.y < 0){
        c.dy *= -1;
    }

    c.ani = window.requestAnimationFrame(moveLeftPaddle);
}		

moveLeftPaddle();

// keyboard-controlled paddle creation and movement 
    var k = {
        x:0,
        y:0,
        w:10,
        h:100,
        speed:50,
        keyScore:10,
        ani:{}
    }
    
    var rightPaddle = $('.rightPaddle');
    rightPaddle.css({top: `${k.y}px`});	

    function movedRightPaddle(){

        function moveUp(){
            if (k.y>0)
            k.y -= k.speed;
            rightPaddle.css({top: `${k.y}px`});
        }
    
        function moveDown(){
            if (k.y<screen.availHeight-220){
            k.y += k.speed;}
            rightPaddle.css({top: `${k.y}px`});
    
        }

    //add event litsener to detect arrow keys up and down 

        document.addEventListener("keydown",function(event) {
            event.preventDefault();
            const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
         
            if (event.key === "ArrowDown") {
                return moveDown();
            }
            if (event.key === "ArrowUp") {
                return moveUp();
            }
          });
    
        k.ani = window.requestAnimationFrame(moveDown,moveUp);

    }

movedRightPaddle();

// ball creation and movement

    class Ball{
    
        constructor(x, y, width, height, dx, dy, speed){
            this.x =x;
            this.y = y;
            this.width= width;
            this.height = height;
            this.dx = dx;
            this.dy = dy;
            this.speed= speed;
        }

        ballMover(){
            this.x += this.dx * this.speed;
            this.y += this.dy * this.speed;

            $('.ball').css({left: `${this.x}px`});
            $('.ball').css({top: `${this.y}px`});
        
            if (this.x >= screen.width -this.width) {
                this.x = screen.width -this.width;
                this.dx *= -1;
            }
    
            if (this.x < 0) {
                this.x = 0;
                this.dx *= -1;
            }
    
            if (this.y > screen.availHeight - this.height - 80) {
                this.y = screen.availHeight - this.height - 80
                this.dy *= -1;
            }
    
            if (this.y < 0) {
                this.y = 0;
                this.dy *= -1;
            }

            this.collide();
            window.requestAnimationFrame(()=>this.ballMover())
        }

    // detect collison and do all calculations including scores, time, wins and best scores(seconds) of your wins

        collide(){
                var ballLeft = this.x;
                var ballTop = this.y;
                var comTop = c.y;
                var keyTop = k.y;
            
            if (ballLeft<10){
                if(ballTop < comTop + 100 && ballTop >comTop){
                    console.log("collision");
                    $('audio#hit')[0].play();
                   
                }else{
                    var comScoreText = comScore.text();
                    if(comScoreText-1<=0){
                            // reset timer and socres
                        winRight+=1; 
                        scoreStorage();
                        reset();
                        $('.winRight').text(winRight + "wins");
                        checkHighestScore();
                        roundReminder()
        
                    } else{
                        comScore.text(comScoreText-1);
                        $('audio#comScore')[0].play();
                    }
                }

            }
            
            if(ballLeft>=screen.width - this.width){
                if(ballTop<keyTop+100 && ballTop>keyTop){
                    console.log('collision');
                    $('audio#hit')[0].play();

                }  else{

                    var keyScoreText = keyScore.text();
                    if (keyScoreText-1<=0){
                        // reset timer and socres
                        reset();
                        // display all caculations 
                        winLeft+=1; 
                        $('.winLeft').text(winLeft + "wins");// display wins
                        //displayRound();//display wins for each 
                        roundReminder()

                    }else{
                        console.log(keyScoreText);
                        keyScore.text(keyScoreText-1);
                        $('audio#keyScore')[0].play();
                    }
                }
            }
        }
    }

    let ball = new Ball(101,101,50,50,1,1,15);
    ball.ballMover();


//function helper for the time resetting, time used of each round for your wins, and refresh your top 3 scores of your wins
    

    function reset(){
        //reset timer and scores
        keyScore.text(10);
        comScore.text(10);
        sec=0;
    }

    function scoreStorage(){
        // store time of your win for each round to window local storage 
        roundScores.push(sec);
        localStorage.setItem("roundScores", JSON.stringify(roundScores));
    }

    function checkHighestScore(){
        // retrieve the stores from local storage and calculate your best scores to be shown in the interface 
        var storedScores = JSON.parse(localStorage.getItem("roundScores"));
        var uniquestoreScores = [...new Set(storedScores)]; 
        uniquestoreScores.sort((a, b) => a-b);
        var highestNumbers = uniquestoreScores .slice(0, 3);
          $('.1st').text(highestNumbers[0] + " seconds");
          $('.2nd').text(highestNumbers[1] + " seconds");
          $('.3rd').text(highestNumbers[2] + " seconds");
        }

    function roundReminder(){
        //set a reminder for each new round
        $('.round').css('background-color','#ffffff');
        $('.round').css('color', 'black');
        $(".round").text('new round');
        $(".round").fadeIn();
        setTimeout(function() {
            $(".round").fadeOut();
          }, 2000);
    }

});


