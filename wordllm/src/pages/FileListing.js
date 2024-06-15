import { FullFileBrowser, ChonkyActions, defineFileAction, ChonkyIconName } from '@aperturerobotics/chonky'
import { ChonkyIconFA } from '@aperturerobotics/chonky-icon-fontawesome'

import { useState, useCallback, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import axios from 'axios'

export function FileListing() {
    const navigate = useNavigate()
    const createFolderAction = defineFileAction({
        id: 'cust_create_folder',
        button: {
            name: "Create Folder",
            toolbar: true,
            contextMenu: true,
            icon: ChonkyIconName.folderCreate
        }
    })
    const createDocumentAction = defineFileAction({
        id: 'cust_create_doc',
        button: {
            name: "Create Doc",
            toolbar: true,
            icon: ChonkyIconName.file
        }
    })
    const customFileActions = [createDocumentAction, createFolderAction]
    const handleAction = useCallback(async (data) => {
        //console.log("file action called")
        if (data.id === createFolderAction.id) {
            console.log("Create folder")
            console.log(data)
            setModal(true)
        }
        if (data.id === createDocumentAction.id) {
            console.log("Create Document")
            const doc = await axios.put('http://localhost:3001/doc', {
                parentDirId: curDirId
            })
            console.log(doc)//url ws://127.0.0.1:8080/doc/ws, docId, token
            
            navigate({
                pathname: '/app',
                search: `?docId=${doc.data.doc.id}&token=${doc.data.accessToken.token}`
            })
        }
        if (data.id === ChonkyActions.OpenFiles.id) {
            console.log(data)
            const {id, isDir} = data.payload.targetFile;
            const doc = await axios.get('http://localhost:3001/doc', {
                params: {
                    id: id
                }
            })
            console.log(doc)
            navigate({
                pathname: '/app',
                search: `?docId=${doc.data.doc.id}&token=${doc.data.accessToken.token}`
            })
        }
    }, [])
    const [curDirId, setCurDirId] = useState('origin')
    const [fileList, setFileList] = useState([])
    useEffect(() => {
        const initData = async() => {
            const res = await axios.get('http://localhost:3001/fs/dir', {
                params: { id: 'origin' }
            })
            console.log(res.data)
            setFileList(res.data.files)
        }
        initData()
    }, [])
    
    const [modal, setModal] = useState(false)
    const [createFolderName, setCreateFolderName] = useState("")
    async function doCreateFolder() {
        console.log(createFolderName)
        setModal(false)
        await axios.put('http://localhost:3001/fs/dir', {
            parentDirId: curDirId,
            dirName: createFolderName
        })
        const res = await axios.get('http://localhost:3001/fs/dir', {
            params: { id: curDirId }
        })
        console.log(res.data)
        setFileList(res.data.files)
    }
    return (
        <div className="">
            <p>This is the file listing page.</p>
            <div className={`modal ${modal ? " is-active" : ""}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Create Folder</p>
                    </header>
                    <section class="modal-card-body">
                        <input class="input" type="text" placeholder='Folder Name' onInput={e => setCreateFolderName(e.target.value)}/>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={doCreateFolder}>Save</button>
                    </footer>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => setModal(false)}></button>
            </div>
            <div class="hero is-fullheight" style={{ "min-height": "70%" }}>
            <FullFileBrowser 
                files={fileList} 
                iconComponent={ ChonkyIconFA } 
                fileActions={customFileActions}
                onFileAction={handleAction} />
            </div>
        </div>
    )
}
