import logo from '../logo.svg';
import '../App.css';

import { createReactEditorJS } from 'react-editor-js'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Table from '@editorjs/table'
//import Header from '@editorjs/header'

import { HeaderBulma } from "../misc/bulmaheader.js"
import { LLMAssistTool } from "../tools/llmassist.js"
import { LLMScaffold } from '../tools/llmscaffold.js';

import React from 'react';
import * as Y from 'yjs'

import { EditorBinding } from '../yjsbinding.js'
import axios from 'axios'

import { createYjsProvider } from '@y-sweet/client'

import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import 'bulma/css/bulma.min.css';

export function App() {
  let [searchParams, setSearchParams] = useSearchParams()
  const ReactEditorJS = createReactEditorJS()

  const EDITOR_JS_TOOLS = {
    table: Table,
    list: List,
    header: HeaderBulma,
    llmassisttool: {
      class: LLMAssistTool
    },
    llmscaffold: LLMScaffold
  }

  const editorCore = React.useRef(null);
  const blocks = []
  const [docName, setDocName] = useState("")
  const handleInitialize = React.useCallback((instance) => {
    const docId = searchParams.get('docId')
    const token = searchParams.get('token')

    editorCore.current = instance;
    let editor1 = editorCore.current.dangerouslyLowLevelInstance
    const yDoc = new Y.Doc();
    //let clientToken = await axios.put('http://localhost:3001/doc', { id: "sample" })
    //createYjsProvider(yDoc, clientToken.data)
    createYjsProvider(yDoc, {url: "ws://127.0.0.1:8080/doc/ws", docId: docId, token: token})
    let holder1 = document.getElementById("custom-holder")

    const binding = new EditorBinding(editor1, holder1, yDoc.getArray('docId'))
  }, [])

  useEffect(() => {
    const initData = async() => {
      const docId = searchParams.get('docId')
      const doc = await axios.get('http://localhost:3001/doc', {
        params: {
          guest: true,
          id: docId
        }
      })
      setDocName(doc.data.doc.name)
    }
    initData()
  }, [])

  return (
    <div className="App">
      <div>
        <Link to="/">Go home</Link>
        <h3>Doc: {docName}</h3>
        <ReactEditorJS tools={EDITOR_JS_TOOLS} onInitialize={handleInitialize} holder="custom-holder" defaultValue={blocks}>
          <div id="custom-holder" />
        </ReactEditorJS>
      </div>
    </div>
  );
}

export default App;

/*<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>*/
