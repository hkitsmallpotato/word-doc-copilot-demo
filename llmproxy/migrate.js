import Keyv from 'keyv';

const keyv_filelist = new Keyv('sqlite://db/mydb2.sqlite', { namespace: 'filelist' });
await keyv_filelist.set('origin', {id: 'origin', name: "home", files: [], isDir: true })
console.log("Done.")
