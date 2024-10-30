import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume, provide } from "@lit/context";
import { brandContext } from "../../../.storybook/preview"; // Adjust path as necessary

export interface MyButtonProps {
  label?: string;
  disabled?: boolean;
  brand?: string;
}

@customElement("my-button")
export class MyButton extends LitElement {
  @provide({ context: brandContext })
  @consume({ context: brandContext, subscribe: true })
  _brand: string = "white-label";

  @state()
  brand: string = this._brand;

  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) label = "Button";

  override render() {
    console.log(`Current brand in my-button: ${this.brand}`);
    return html`
      <button
        ?disabled=${this.disabled}
        style="
          background-color: var(--${this
          .brand}-button-light-color-background-primary-solid-default); 
          color: var(--${this
          .brand}-button-light-color-text-primary-solid-default);
          padding-inline-start: var(--${this.brand}-button-space-comfortable);
          padding-inline-end: var(--${this.brand}-button-space-comfortable);
          padding-block-start: var(--${this.brand}-button-space-comfortable);
          padding-block-end: var(--${this.brand}-button-space-comfortable);
        "
      >
        ${this.label}
      </button>
    `;
  }
}
