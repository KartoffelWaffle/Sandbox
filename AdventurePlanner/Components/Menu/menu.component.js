const template = document.createElement('template');
template.innerHTML = `

    <style>

        * {
            box-sizing: border-box;
        }

        :host{
        
            display: inline-grid;
            grid-template: 1fr / 1fr auto;

            height: 100%;

            border-radius: 0.5rem; 
            
            box-shadow: 4px 4px 18px 0px rgb(173, 173, 173);
            background-color: #EBEBEB;

            padding: 1rem;

        }

        .flex-container {

            display: flex;

            align-items: center;
            justify-content: start;
        }

        .header {
    
            grid-area: 1 / 1 / 2 / 2;
            height: 100%;

        }

        .main {
            grid-area: 2 / 1 / 3 / 2;
            padding: 40px 0; 
            height: 100%;

            overflow: scroll;
        }

        .footer {
            grid-area: 3 / 1 / 4 / 2;
            height: 100%;
        }

        slot {
            overflow: hidden;
        }

        .sc-hidden {

            grid-area: 1 / 2 / 2 / 3;
            
            margin-left: 1rem;
            width: fit-content;
            height: 100%;

            transition: opacity 1s ease-in-out;

            z-index: 100;
        }

        .mc {

            display: grid;

            grid-area: 1 / 1 / 2 / 2;

            grid-template: auto minmax(0,1fr) auto / 1fr;
        }

        .sc {
            overflow: hidden;
            grid-area: 1 / 2 / 4 / 3;

            width: 0;
            height: 100%;

            transition: width 1s ease-in;
        }

        @media (prefers-color-scheme: dark) {
            :host{
                box-shadow: 6px 6px 18px 0px rgb(0, 0, 0);
                background-color:rgb(39, 39, 39);
            }
        }


    </style>

    <div class="mc">
        <div class="header flex-container"><slot id="menu-toggle" name="header"></slot></div>
        <div class="main flex-container"><slot name="main"></slot></div>
        <div class="footer flex-container"><slot name="footer"></slot></div>
    </div> 
    <div class="sc">
        <div class="sc-hidden">
            <slot name="secondary-content"></slot>
        </div>
    </div>
`;

class Menu extends HTMLElement{

    open = false;


    constructor() {

        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.append(template.content.cloneNode(true));

        const menuToggle = this.shadow.getElementById('menu-toggle');

        menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        })

    }

    toggleMenu() {

        const sc = this.shadow.querySelector('.sc');
        const scHidden = this.shadow.querySelector('.sc-hidden');

        this.open = !this.open;
        const maxWidth = window.getComputedStyle(this).maxWidth;

        this.open ? this.setAttribute('open',this.open) : this.removeAttribute('open');
        this.open ? sc.style.width = (maxWidth !== 'none' ? (parseInt(maxWidth) - this.shadow.querySelector('.mc').getBoundingClientRect().width) + "px" : scHidden.getBoundingClientRect().width + "px") : sc.style.width = "0";
    }

    connectedCallback() {
        requestAnimationFrame(() => {
            window.getComputedStyle(this).maxWidth !== 'none' ? this.shadow.querySelector('.sc-hidden').style.width = window.getComputedStyle(this).maxWidth : null;
        });
    }

}

customElements.define('ap-menu',Menu);