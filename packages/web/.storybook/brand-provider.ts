import { ContextProvider } from "@lit/context";
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { brandContext } from "./preview"; // Adjust path as necessary

export class BrandProvider extends LitElement {
  private provider!: ContextProvider<{ __context__: string }>;

  @property({ type: String }) brand = "white-label";

  override connectedCallback() {
    super.connectedCallback();
    this.provider = new ContextProvider(this, {
      context: brandContext,
      initialValue: this.brand,
    });
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("brand")) {
      // If the brand changes, update the context value
      this.provider.setValue(this.brand, true);
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

customElements.define("brand-provider", BrandProvider);
