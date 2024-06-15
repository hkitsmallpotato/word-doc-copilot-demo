import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'


library.add(faWandMagicSparkles)

export class LLMAssistTool {
    static get isInline() {
        return true;
    }
    constructor({api}) {
        this.button = null;
        this.mydom = null;
        this.api = api;

        this.init_event = false;
        this.myrange = null;
    }
    render() {
        /*this.button = document.createElement('button');
        this.button.type = 'button';
        //this.button.classList = "fa-solid fa-wand-magic-sparkles";
        this.button.innerHTML = icon({ prefix: 'fas', iconName: 'wand-magic-sparkles'}).html;
        this.button.classList.add(this.api.styles.inlineToolButton);
        //this.button.textContent = 'M';*/

        this.mydom = document.createElement('div');
        this.mydom.innerHTML = `
            <div id='llm-dropdown' class='dropdown'>
                <div class='dropdown-trigger'>
                    <button class='button' aria-haspopup='true' aria-controls='dropdown-menu'>
                        ${icon({ prefix: 'fas', iconName: 'wand-magic-sparkles'}).html}
                    </button>
                </div>
                <div class='dropdown-menu' id='dropdown-menu' role='menu'>
                    <div class='dropdown-content'>
                        <h5>Change Style</h5>
                        <a id='llm-action-style-formal' class="dropdown-item">Formal</a>
                        <a id='llm-action-style-causal' class="dropdown-item">Causal</a>
                        <hr class="dropdown-divider">
                        <h5>Change Length</h5>
                        <a id='llm-action-length-summarize' class="dropdown-item">Summarize</a>
                        <a id='llm-action-length-elaborate' class="dropdown-item">Elaborate</a>
                        <h5>Analyze and Organize...</h5>
                        <a id='llm-action-reorg-table' class="dropdown-item">In Table</a>
                    </div>
                </div>
            </div>
        `;

        
        return this.mydom;
    }

    async handleRequest(event) {
        event.preventDefault();
        console.log(event.target);
        console.log("Handle request")
        console.log(this.myrange);

        //const selectedText = this.myrange.extractContents();
        const selectedText = this.myrange.cloneContents();
        console.log(selectedText)

        let temp = document.createElement("div")
        temp.appendChild(selectedText)
        console.log(temp.innerHTML)

        const inputText = temp.innerHTML

        if (event.target.id === "llm-action-length-elaborate") {
            let ai_ans = await axios.post('http://localhost:5000/ai/text', {
                "service_type": "elaborate",
                "content": inputText
            })
            console.log(ai_ans)
            if (ai_ans.data['success']) {
                this.myrange.deleteContents();
                this.myrange.insertNode(
                    document.createTextNode(ai_ans.data['result'])
                )
            } else {
                console.log("Error")
            }
        } else if (event.target.id === 'llm-action-reorg-table') {
            let ai_ans = await axios.post('http://localhost:5000/ai/text', {
                "service_type": "analyze_table",
                "content": inputText
            })
            console.log(ai_ans)
            if (ai_ans.data['success']) {
                let ai_table = ai_ans.data['result']
                this.api.blocks.insert("table", {
                    "withHeadings": ai_table['heading'],
                    "content": ai_table['data']
                })
                //this.myrange.insertNode(
                //    document.createTextNode(ai_ans.data['result'])
                //)
            } else {
                console.log("Error")
            }
        }

        //this.myrange.insertNode(document.createTextNode("replaced str"))

        //document.getElementById('llm-dropdown').classList.remove('is-active');
    }
    /*renderActions() {
        const test = document.createElement('span');
        test.innerText = "Hello world";

        return test;
    }*/
    surround(range) {
        console.log("Surround called")
        console.log(range)
        this.myrange = range;

        if (!this.init_event) {
            document.getElementById('llm-action-style-formal').addEventListener('click', this.handleRequest.bind(this) , false);
            document.getElementById('llm-action-style-causal').addEventListener('click', this.handleRequest.bind(this) , false);
            document.getElementById('llm-action-length-summarize').addEventListener('click', this.handleRequest.bind(this) , false);
            document.getElementById('llm-action-length-elaborate').addEventListener('click', this.handleRequest.bind(this) , false);
            document.getElementById('llm-action-reorg-table').addEventListener('click', this.handleRequest.bind(this) , false);

            this.init_event = true;
        }
        document.getElementById('llm-dropdown').classList.toggle('is-active');//hack
    }
    checkState(selection) {
        return false;
    }
}