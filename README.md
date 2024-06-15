# Word Doc Copilot Demo
This is a tech demo to have a LLM copilot on something like Google Doc.

There are a few components:
- `wordllm` - Frontend (React app, scaffolded with `create-react-app`)
- `llmproxy` and `ysweet` - Backend for basic Doc functions (CRUD on Docs, folders, etc). (ExpressJS)
- `pyllmservice` - Backend for AI copilot service

## Setups

(The frontend's chonky is broken currently, maybe due to version update?)

### Frontend

- Go to the `wordllm` folder
- Run `npm install`, then `npm start`.

### Doc function Backend

First, setup `ysweet` which is responsible for real time sync/saves of the Doc as you edit:
- Create a new folder
- Run `npx y-sweet@latest gen-auth`, and answer yes to install
- Take note of the auth key and run the command as instructed (should add `./` at the end of the command to ensure it start at the empty folder)

Then, to run the backend:
- In another terminal, go to the `llmproxy` folder.
- Run `npm install`, then `node migrate.js` to initialize the Sqlite DB.
- Set the environment variable `YSWEET_CONN_STR` to be the connection string shown in ysweet when you started it.
- Finally, run `node index.js`.

### AI Copilot Backend

- Create a new venv with `python -m venv .venv` and activate it with your OS's command. (Eg on Linux it is `source .venv/bin/activate`)
- Install requirements with `pip install -r requirements.txt`
- Edit the `llm.py` file and supply the credentials + URL of an OpenAI compatible LLM API endpoint.
- Start the backend with `python server.py`.

## Note

- Currently, only "Scaffold Draft", "Elaborate", and "Analyze table" are implemented.

