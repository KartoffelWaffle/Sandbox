class Button extends HTMLElement {

    template = `
        <style>

            :host {
                --in-built-button-primary: #fff;
                --in-built-button-brightness-filter: 0.7;
            }

            @media (prefers-color-scheme: dark) {
                :host {
                    --in-built-button-primary: #111;
                    --in-built-button-brightness-filter: 1.3;
                }
            }

            :host {

                border-radius: 1.5rem;
                padding: 1rem;

                box-shadow: 0 0 10px rgba(0,0,0,0.4);

                background-color: var(--ap-button-primary-color, var(--in-built-button-primary));
            }

            :host(:hover) {
                filter: brightness(var(--ap-button-brightness-filter, var(--in-built-button-brightness-filter)));
            }

            .button-items {
                display: flex;
                gap: 0.5rem;

                justify-content: center;
                align-items: center;
            }

        </style>

        <div class="button-items">
            <slot></slot>
        </div>
    `;

    constructor() {

        super();

        this.shadow = this.attachShadow({"mode":"open"});
        this.shadow.innerHTML = this.template;

    }

}

customElements.define('ap-button',Button);