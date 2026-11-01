import { useRef } from "react";
import { Link } from "react-router-dom";
import "@fontsource/pixelify-sans/400.css";
import "@fontsource/pixelify-sans/700.css";
import "./mainMenu.css";

const rounds = [
  ["Red or black", "Guess the colour of your first card."],
  ["Higher or lower", "Will your second card rank higher or lower than your first?"],
  ["Inside or outside", "Will your third card fall between the first two ranks, or outside them?"],
  ["Pick a suit", "Guess the suit of your fourth card: hearts, diamonds, spades or clubs."],
];

export function MainMenuView() {
  const rulesRef = useRef<HTMLDialogElement>(null);

  return (
    <section className="landing" aria-labelledby="landing-title">
      <div className="landing__table" aria-hidden="true">
        <span className="landing__table-label">ONE DECK. FOUR GUESSES.</span>
        <div className="landing__cards">
          <img className="landing__card landing__card--left" src="/cards/k-spade.png" alt="" width="256" height="256" />
          <img className="landing__card landing__card--right" src="/cards/back.png" alt="" width="512" height="512" />
          <img className="landing__card landing__card--front" src="/cards/a-heart.png" alt="" width="256" height="256" />
        </div>
        <span className="landing__table-suit">♦</span>
      </div>
      <div className="landing__intro">
        <p className="landing__eyebrow">THE NEXT CARD IS ANYONE’S GUESS</p>
        <h1 id="landing-title">Good friends.<br /><span>Bad guesses.</span></h1>
        <p className="landing__description">
          Klemps is a party card game of luck and a little nerve.
          Gather your friends, guess the cards, and see who gets it right.
        </p>
        <div className="landing__actions">
          <Link className="landing__button landing__button--play" to="/setup">
            <span>Play game</span><span aria-hidden="true">→</span>
          </Link>
          <button className="landing__button landing__button--rules" type="button" onClick={() => rulesRef.current?.showModal()}>
            How to play
          </button>
        </div>
        <p className="landing__note">Pass the screen. Take your chances.</p>
      </div>
      <dialog
        ref={rulesRef}
        className="landing-rules"
        aria-labelledby="rules-title"
        aria-describedby="rules-intro"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            event.currentTarget.close();
          }
        }}
      >
        <div className="landing-rules__header">
          <p className="landing__eyebrow">A QUICK DEAL</p>
          <form method="dialog">
            <button className="landing-rules__close" aria-label="Close rules" autoFocus>×</button>
          </form>
        </div>
        <h2 id="rules-title">How to play</h2>
        <p id="rules-intro">Add your players, choose a difficulty, then take turns making four guesses.</p>
        <ol className="landing-rules__rounds">
          {rounds.map(([title, description], index) => (
            <li key={title}>
              <span className="landing-rules__number" aria-hidden="true">0{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
        <p className="landing-rules__outcome">Guess right? Give out drinks. Guess wrong? Take them. The amount depends on the round and difficulty.</p>
        <p className="landing-rules__note">Keep it friendly. Alcohol is optional.</p>
        <form method="dialog"><button className="landing__button landing__button--play landing-rules__done">Got it</button></form>
      </dialog>
    </section>
  );
}
