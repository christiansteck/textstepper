import {
  html,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

const Mode = {
  INPUT: "input",
  READ: "read",
};

const sampleText =
  "This is a sample text.\nYou can use it for testing textstepper\nor replace it with your own text!";

const textToWords = (txt, options) => {
  const words = txt.split(/[ \n]/).filter(Boolean);

  if (options.reverse) {
    words.reverse();
  }

  return words;
};

export class MainApp extends LitElement {
  static properties = {
    mode: { type: String },
    text: { type: String },
    options: { reverse: { type: Boolean } },

    currentWord: { type: Number },
    nextWord: { type: Function },
    prevWord: { type: Function },
    toggleMode: { type: Function },
    enterReadMode: { type: Function },
  };

  constructor() {
    super();

    this.mode = Mode.INPUT;
    this.text = sampleText;
    this.options = { reverse: false };

    this.toggleReverse = () => (this.options.reverse = !this.options.reverse);

    this.currentWord = 0;
    this.nextWord = () => {
      if (this.currentWord + 1 < textToWords(this.text, this.options).length) {
        this.currentWord = this.currentWord + 1;
      }
      return;
    };
    this.prevWord = () => {
      if (this.currentWord > 0) {
        this.currentWord = this.currentWord - 1;
      }
      return;
    };

    this.enterReadMode = () => {
      if (this.text.length === 0) {
        return;
      }
      this.mode = this.mode === Mode.INPUT ? Mode.READ : Mode.INPUT;
    };

    this.enterInputMode = () => {
      this.currentWord = 0;
      this.mode = Mode.INPUT;
    };
  }

  // do not use shadow dom, because we want to use regular css
  createRenderRoot() {
    return this;
  }

  render() {
    if (this.mode === Mode.READ) {
      return html`
        <text-stepper
          .words=${textToWords(this.text, this.options)}
          .currentWord=${this.currentWord}
          .nextWord=${this.nextWord}
          .prevWord=${this.prevWord}
          .enterInputMode=${this.enterInputMode}
        />
      `;
    }

    return html`<div class="title">
        <h2>Textstepper</h2>
        <h1>Step through your text one word at a time</h1>
      </div>
      <div class="main-card">
        <textarea
          id="text-area"
          @input="${(x) => (this.text = x.target.value)}"
        >
${this.text}</textarea
        >
        <div class="control-panel">
          <div>
            <h3>Options</h3>
            <label
              ><input
                type="checkbox"
                name="checkbox"
                .checked=${this.options.reverse}
                @click=${this.toggleReverse}
              />Read backwards</label
            >
          </div>
          <button
            class="generic-btn generic-btn--start"
            @click="${this.enterReadMode}"
          >
            START
          </button>
        </div>
      </div>`;
  }
}
customElements.define("main-app", MainApp);

export class TextStepper extends LitElement {
  static properties = {
    words: { type: Array },
    currentWord: { type: Number },
    nextWord: { type: Function },
    prevWord: { type: Function },
    enterInputMode: { type: Function },
  };

  constructor() {
    super();
    setTimeout(() => this.children[0].focus(), 0);
  }

  // do not use shadow dom, because we want to use regular css
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div
        tabindex="0"
        class="current-word"
        @click=${(ev) => {
          if (ev.x > (2 / 3) * window.innerWidth) {
            this.nextWord();
          }
          if (ev.x < (1 / 3) * window.innerWidth) {
            this.prevWord();
          }
        }}
        @keydown=${(ev) => {
          switch (ev.key) {
            case "ArrowRight": {
              this.nextWord();
              return;
            }
            case "ArrowLeft": {
              this.prevWord();
              return;
            }
            case "Escape": {
              this.enterInputMode();
              return;
            }
          }
        }}
      >
        ${this.words[this.currentWord]}
      </div>
      <div class="progress">
        ${this.currentWord + 1}/${this.words.length}
        (${Math.round((100 * (this.currentWord + 1)) / this.words.length)}%)
      </div>
      <button
        class="generic-btn generic-btn--escape"
        @click=${() => {
          this.enterInputMode();
        }}
      >
        X
      </button>`;
  }
}
customElements.define("text-stepper", TextStepper);
