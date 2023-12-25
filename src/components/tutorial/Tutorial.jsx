import styled from "styled-components";

const Tutorial = () => {
    return (
        <Wrapper>
            <TutorialTitle>Here are the instructions about how to play the game</TutorialTitle>
            <div>
                <h2>Goal of the game</h2>
                <p>
                    The goal of the game is simple, you have to bring the opponent's health to 0.
                </p>
            </div>

            <div>
                <h2>How to play</h2>
                
                <p>
                    As a word game in the style of <a href="https://en.wikipedia.org/wiki/Shiritori">shiritori</a> (a japanese word game), you have to
                    attack your opponent by writing words in the inputs. The tricky part is to defend an attacking word. You have to use the
                    last letter of the opponent's word and the length of the word must be equal or higher than the attacking one.
                </p>

                <p>Let's look at the image below. Under that image, you will find what the numbers mean.</p>
                
                <TutorialImg1 src="/src/assets/images/tutorialImg1.jpg" alt="image with numbers explaining how to play" />

                <ol>
                    <TutorialListInstance>
                        The input field where you have to write the words you want to attack with (press the enter key after writing a word).
                        It can be use for attacking or defending. If there's no arrow pointing to that input, it means you can attack.
                        If there is an arrow, it means you're getting attacked and you are now in a duel for that specific input. The players have
                        to go back and forth until the timer on a duel arrow expires.
                    </TutorialListInstance>

                    <TutorialListInstance>
                        The target input (press the input with the mouse to select a target). As you can see, you can attack multiple inputs at once.
                        You have to be quick and accurate because it can rapidly become overwhelming.
                    </TutorialListInstance>

                    <TutorialListInstance>
                        The timing arrow. After attacking or defending with a word, you can see an arrow with a number attached to it. That number is
                        the remaining seconds you have to defend. Once it expires, you take the length of the word as damage to your health.
                    </TutorialListInstance>

                    <TutorialListInstance>
                        While defending, there is a feedback bar indicating if the defending word has enough length to defend. Once it's of the same length or higer,
                        the bar will turn fully green and a thumbs up will appear.
                    </TutorialListInstance>

                    <TutorialListInstance>
                        Lastly, this is the area where the used words are being tracked. Be careful, once a word is used, it cannot be used for both players. Keep
                        an eye on both areas.
                    </TutorialListInstance>
                </ol>
                
                <h1>Have fun!</h1>
            </div>
        </Wrapper>
    )
}

export default Tutorial;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
    overflow-y: scroll;
    flex: 1;
    padding: 15px;
    line-height: 1.5;

`

const TutorialTitle = styled.span`
    align-self: center;
    font-size: 1.5em;
    margin-bottom: 15px;
`

const TutorialImg1 = styled.img`
    max-width: -webkit-fill-available;
    margin: 15px 0;
`

const TutorialListInstance = styled.li`
    padding: 5px;
`