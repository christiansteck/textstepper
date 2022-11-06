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

const textToWords = (txt) => txt.split(/[ \n]/).filter(Boolean);

export class MainApp extends LitElement {
  static properties = {
    mode: { type: String },
    text: { type: String },
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

    this.currentWord = 0;
    this.nextWord = () => {
      if (this.currentWord + 1 < textToWords(this.text).length) {
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
    this.enterInputMode = () => (this.mode = Mode.INPUT);
  }

  // do not use shadow dom, because we want to use regular css
  createRenderRoot() {
    return this;
  }

  render() {
    if (this.mode === Mode.READ) {
      return html`
        <text-stepper
          .words=${textToWords(this.text)}
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
      <div class="main-card" id="main-card">
        <textarea
          id="text-area"
          @input="${(x) => (this.text = x.target.value)}"
        >
${this.text}</textarea
        >
        <div class="control-panel">
          <button class="start-btn" @click="${this.enterReadMode}">
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
            if (ev.x > 2/3 * window.innerWidth) {
                this.nextWord()
            }
            if (ev.x < 1/3 * window.innerWidth) {
                this.prevWord()
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
              this.currentWord = 0;
              this.enterInputMode();
              return;
            }
          }
        }}
      >
        ${this.words[this.currentWord]}
      </div>
      <button
        style="position:absolute;top:0;right:0"
        @click=${() => {
          this.currentWord = 0;
          this.enterInputMode();
        }}
      >
        close
      </button>`;
  }
}
customElements.define("text-stepper", TextStepper);
