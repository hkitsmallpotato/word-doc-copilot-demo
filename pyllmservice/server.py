import json
from flask import Flask, jsonify, request
from flask_cors import CORS

from llm import gen_payload, call_LLM
from templates import base_template, task_templates

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    return jsonify({"running": True, "version": "1.0" })

@app.route('/ai/text', methods=['POST'])
def text_service():
    input = json.loads(request.data)
    service = input['service_type']
    print(service)

    if service == 'elaborate':
        msg = base_template(task_templates['elaborate'], input['content'])
        ret_msg = call_LLM(gen_payload(2048, msg))
        return jsonify({"success": True, "result": ret_msg})
    
    if service == 'analyze_table':
        msg = base_template(task_templates['analyze_table'], input['content'])
        #msg.append({
        #    "role": "assistant",
        #    "content": "```js\n"
        #})
        ret_msg = call_LLM(gen_payload(2048, msg))
        try:
            print(ret_msg)
            ret_msg = ret_msg.removeprefix("```json")
            ret_msg = ret_msg.removeprefix("```js")
            ret_msg = ret_msg.removeprefix("```")
            ret_msg = ret_msg.removesuffix("```\n")
            ret_msg = ret_msg.removesuffix("```")
            print(ret_msg)
            parsed = json.loads(ret_msg)
            return jsonify({"success": True, "result": parsed})
        except Exception as e:
            print(e)
            return jsonify({"success": False, "reason": "LLM result parse failure."})
    
    if service == 'scaffold_draft':
        msg = base_template(task_templates['scaffold_draft'], input['content'])
        ret_msg = call_LLM(gen_payload(3700, msg))
        return jsonify({"success": True, "result": ret_msg})

    return jsonify({"success": False, "reason": "Unknown service type."})

app.run()
