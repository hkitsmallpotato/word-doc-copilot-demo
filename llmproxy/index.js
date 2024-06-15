import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

import { DocumentManager } from '@y-sweet/sdk'

import Keyv from 'keyv';

import { v4 as uuidv4 } from 'uuid'

//import pkg from "usellm";
//const { createLLMService } = pkg;

/*const llmService = createLLMService({
    openaiApiKey: process.env.OPENAI_API_KEY,
    actions: ["chat"],
    
})*/

const app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))

const keyv_filelist = new Keyv('sqlite://db/mydb.sqlite', { namespace: 'filelist' });

keyv_filelist.on('error', err => console.log('Connection Error', err));

app.post('/hi', (req, res) => {
    if (req.body.g < 1000) {
        res.status(201).json({ok: false})
    } else {
        res.status(201).json({ok: true, data: req.body})
    }
})

const manager = new DocumentManager(process.env['YSWEET_CONN_STR']);

app.put('/doc', async (req, res) => {
    const now = new Date()
    const { parentDirId } = req.body
    //const myTok = await manager.getOrCreateDocAndToken(req.body.id);
    const docId = uuidv4();
    await manager.createDoc(docId);
    const myTok = await manager.getClientToken(docId)
    const docObj = { id: docId, name: "Untitled Document", isDir: false, modDate: now.toUTCString() }
    await keyv_filelist.set(docId, docObj)
    let dir = await keyv_filelist.get(parentDirId)
    dir['files'].push(docObj)
    await keyv_filelist.set(parentDirId, dir)
    res.status(201).json({doc: docObj, accessToken: myTok });
})

app.get('/doc', async (req, res) => {
    if (req.query.guest) {
        const docObj = await keyv_filelist.get(req.query.id);
        res.status(201).json({doc: {name: docObj.name }});
    } else {
        const myTok = await manager.getClientToken(req.query.id);
        const docObj = await keyv_filelist.get(req.query.id);
        res.status(201).json({doc: docObj, accessToken: myTok });
    }
})

app.put('/doc/rename', async (req, res) => {
    const { docId, parentDirId, name } = req.body;
    let docObj = await keyv_filelist.get(docId)
    docObj['name'] = name
    await keyv_filelist.set(docId, docObj)
    let dir = await keyv_filelist.get(parentDirId)
    const i = dir['files'].findIndex((x) => { x.id === docId })
    dir['files'][i]['name'] = name
    await keyv_filelist.set(parentDirId, dir)
    res.status(201).json({ success: true })
})

//await keyv_filelist.set('origin', {id: 'origin', name: "home", files: [], isDir: true })
//id, name, isDir, modDate

app.get('/fs/dir', async (req, res) => {
    const dirId = req.query.id;
    const a = await keyv_filelist.get(dirId);
    res.status(200).json(a)
})

app.put('/fs/dir', async (req, res) => {
    const now = new Date()
    let { parentDirId, dirName } = req.body;
    const dirId = uuidv4();
    const dirObj = { id: dirId, name: dirName, files: [], parentDirId: parentDirId, isDir: true, modDate: now.toUTCString() };
    await keyv_filelist.set(dirId, dirObj)
    let parent_dir = await keyv_filelist.get(parentDirId)
    parent_dir['files'].push({ id: dirId, name: dirName, isDir: true, modDate: now.toUTCString() }); //files and parentDirId removed from dirObj
    await keyv_filelist.set(parentDirId, parent_dir)
    res.status(201).json(dirObj)
})


/*app.post('/myllm', async (req, res) => {
    const body = await req.json();
    try {
        const { result } = await llmService.handle({ body, req });
        res.status(200).send(result);
    } catch (error) {
        res.status(error?.status || 400).send(error.message);
    }
})*/

app.listen(3001, () => {
    console.log("Server running")
})
