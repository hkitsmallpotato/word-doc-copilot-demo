import Header from '@editorjs/header'

export class HeaderBulma extends Header {
    constructor({ data, config, api, readOnly }) {
        super({ data, config, api, readOnly })
        this._CSS.wrapper = 'title'
        this._element = this.getTag()
    }
    getTag() {
        const tag = super.getTag()
        let headerClass = 'is-' + this.currentLevel.number
        tag.classList.add(headerClass)

        return tag
    }
}
