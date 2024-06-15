import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

library.add(faWandMagicSparkles)

export class LLMScaffold {
    static get toolbox() {
        return {
            title: "AI Scaffold",
            icon: icon({ prefix: 'fas', iconName: 'wand-magic-sparkles'}).html
        }
    }

    constructor({ api }) {
        this.api = api;
    }

    async handlerDraft(event) {
        console.log("handlerDraft called")
        let prompt = document.getElementById("prompt").value;

        document.getElementById("prompt").disabled = true
        document.getElementById("prompt-container").classList.add('is-loading')

        //Send API call
        let ai_ans = await axios.post('http://localhost:5000/ai/text', {
            "service_type": "scaffold_draft",
            "content": prompt
        })
        document.getElementById("prompt-container").classList.remove('is-loading')
        document.getElementById("prompt").disabled = false

        if (ai_ans.data['success']) {
            let draft = ai_ans.data['result']
            this.api.blocks.insert('paragraph', {
                "text": draft
            })
        } else {
            console.log("Error")
        }
    }
    handlerOutline(event) {
        console.log("handlerOutline called")
    }

    render() {
        let mydom = document.createElement('div');
        mydom.innerHTML = `
            <div class="card has-background-primary">
                <div class="card-content">
                    <div id="prompt-container" class="control">
                        <textarea id="prompt" class="textarea" placeholder="What do you want to write today?" rows="4"></textarea>
                    </div>
                </div>
                <footer class="card-footer">
                    <p class="card-footer-item">Options</p>
                    <span class="card-footer-item">
                        <button id="scaffold-outline" class="button is-light is-success">Generate Outline</button>
                    </span>
                    <span class="card-footer-item">
                        <button id="scaffold-draft" class="button is-light is-success">Write a Draft</button>
                    </span>
                </footer>
            </div>`
        mydom.querySelector("[id='scaffold-outline']").addEventListener('click', this.handlerOutline.bind(this), false)
        mydom.querySelector("[id='scaffold-draft']").addEventListener('click', this.handlerDraft.bind(this), false)
        return mydom;
    }

    save(blockContent) {
        return {}
    }
}
