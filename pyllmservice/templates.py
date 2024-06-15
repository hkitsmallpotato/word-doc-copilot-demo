def base_template(task, fragment):
    return [
        {
            "role": "system",
            "content": "You are an AI writer assistant. You act as a co-pilot in an interactive writing app. The user will give you a task below. Follow user instruction carefully and then reply with the created/edited (rich) text fragments only.\n\nNotes:\n- Your response should be plain text, except for these simple inline style: bold, italics. Use HTML tag for those."
        },
        {
            "role": "user",
            "content": task
        },
        {
            "role": "assistant",
            "content": "Understood. Please supply the (rich) text fragment, and then I will reply with just the edited text fragment without commentary."
        },
        {
            "role": "user",
            "content": fragment
        }
    ]

task_templates = {
    "elaborate": "Please elaborate and expand upon the text I am currently editing, so that it has a more natural, logical flow to let reader understand, and so that the details and nuance of various arguments or expositions are covered more comprehensively.",
    "summarize": "Please summarize the text I am currently editing, so that the same meaning is conveyed in a more concise manner.",
    "analyze_table": """Please analyze the situation as described by the text, and present the information using a table in a way that allows reader to quickly grasp the situation, or to drill down to the details easily.

You response must be strictly a **single** JSON object (**without** the markdown triple quote) adhereing to this format:
- It contains two attributes: heading, and data.
- `heading` is a JS boolean based on wheather the first row is a header.
- `data` is a two dimensional JS array. Each cell is a string containing natural language text (though numbers as string is also allowed).

**Makes no other commentary in your response.**

Example:
```
{
    "heading": true,
    "data": [
        ["Name", "Open source?", "Description", "Rating"],
        ["Roaster", "No", "PaaS for food delivery", "6.5/10"],
        ["OpenFoodie", "Yes", "Self-hostable food ordering webapp", "5.5/10"]
    ]
}
```
Describes a table with 4 columns and 3 rows with heading.
""",
    "scaffold_draft": "Please write a first draft that I can use as a starting point of my writing. I will supply the topic, context, and any additional requirements in the next round. Remember that your final response further after that should not contain commentary on the draft."
}
