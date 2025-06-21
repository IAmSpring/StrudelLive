# OpenAI Browser Function Schema

Here's the complete OpenAI function schema that enables your assistant to directly control the browser through API calls:

```json
{
  "functions": [
    {
      "name": "audio_engine_play",
      "description": "Start audio playback in the browser",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    },
    {
      "name": "audio_engine_stop", 
      "description": "Stop audio playback in the browser",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    },
    {
      "name": "audio_engine_evaluate",
      "description": "Evaluate Strudel code in the browser audio engine",
      "parameters": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "Strudel pattern code to evaluate and play"
          }
        },
        "required": ["code"]
      }
    },
    {
      "name": "audio_engine_set_volume",
      "description": "Set master volume of the audio engine",
      "parameters": {
        "type": "object", 
        "properties": {
          "volume": {
            "type": "number",
            "description": "Volume level between 0.0 and 1.0",
            "minimum": 0.0,
            "maximum": 1.0
          }
        },
        "required": ["volume"]
      }
    },
    {
      "name": "create_project",
      "description": "Create a new Strudel project",
      "parameters": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name for the new project"
          },
          "code": {
            "type": "string", 
            "description": "Initial Strudel code (optional)",
            "default": ""
          },
          "bpm": {
            "type": "number",
            "description": "BPM for the project",
            "default": 120
          },
          "isPublic": {
            "type": "boolean",
            "description": "Whether project is public",
            "default": false
          }
        },
        "required": ["name"]
      }
    },
    {
      "name": "update_project",
      "description": "Update an existing project's code",
      "parameters": {
        "type": "object",
        "properties": {
          "projectId": {
            "type": "number",
            "description": "ID of the project to update"
          },
          "code": {
            "type": "string",
            "description": "Updated Strudel code"
          },
          "name": {
            "type": "string",
            "description": "Updated project name (optional)"
          },
          "bpm": {
            "type": "number", 
            "description": "Updated BPM (optional)"
          }
        },
        "required": ["projectId", "code"]
      }
    },
    {
      "name": "load_project",
      "description": "Load a project into the editor",
      "parameters": {
        "type": "object",
        "properties": {
          "projectId": {
            "type": "number",
            "description": "ID of the project to load"
          }
        },
        "required": ["projectId"]
      }
    },
    {
      "name": "create_project_snapshot",
      "description": "Save a snapshot/version of the current project",
      "parameters": {
        "type": "object",
        "properties": {
          "projectId": {
            "type": "number",
            "description": "ID of the project"
          },
          "message": {
            "type": "string",
            "description": "Description of the snapshot"
          }
        },
        "required": ["projectId", "message"]
      }
    },
    {
      "name": "generate_random_beat",
      "description": "Generate a random Strudel beat pattern",
      "parameters": {
        "type": "object",
        "properties": {
          "bpm": {
            "type": "number",
            "description": "BPM for the generated pattern",
            "default": 120
          }
        },
        "required": []
      }
    },
    {
      "name": "generate_strudel_pattern", 
      "description": "Generate a specific Strudel pattern based on description",
      "parameters": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string",
            "description": "Description of the desired pattern (e.g., 'techno beat', 'ambient pad', 'bass line')"
          },
          "bpm": {
            "type": "number",
            "description": "BPM for the pattern",
            "default": 120
          }
        },
        "required": ["description"]
      }
    },
    {
      "name": "navigate_to_studio",
      "description": "Navigate to the studio/editor page",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    },
    {
      "name": "toggle_studio_mode",
      "description": "Toggle between code editor and performance studio mode",
      "parameters": {
        "type": "object",
        "properties": {
          "studioMode": {
            "type": "boolean",
            "description": "True for studio mode, false for code mode"
          }
        },
        "required": ["studioMode"]
      }
    },
    {
      "name": "play_sample",
      "description": "Play a specific audio sample",
      "parameters": {
        "type": "object",
        "properties": {
          "sampleName": {
            "type": "string",
            "description": "Name of the sample to play (e.g., 'bd', 'sd', 'hh')"
          },
          "gain": {
            "type": "number",
            "description": "Volume level for the sample",
            "default": 1.0,
            "minimum": 0.0,
            "maximum": 2.0
          }
        },
        "required": ["sampleName"]
      }
    },
    {
      "name": "toggle_auto_save",
      "description": "Toggle auto-save functionality on/off",
      "parameters": {
        "type": "object",
        "properties": {
          "enabled": {
            "type": "boolean",
            "description": "Whether to enable or disable auto-save"
          }
        },
        "required": ["enabled"]
      }
    },
    {
      "name": "get_browser_info",
      "description": "Get information about the browser and audio capabilities",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    },
    {
      "name": "show_notification",
      "description": "Show a notification/toast message to the user",
      "parameters": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "Message to display"
          },
          "type": {
            "type": "string",
            "enum": ["success", "error", "warning", "info"],
            "description": "Type of notification",
            "default": "info"
          }
        },
        "required": ["message"]
      }
    },
    {
      "name": "apply_global_effect",
      "description": "Apply an effect to all currently playing patterns",
      "parameters": {
        "type": "object",
        "properties": {
          "effect": {
            "type": "string",
            "description": "Effect to apply (e.g., 'room(.5)', 'lpf(1000)', 'gain(.7)')"
          }
        },
        "required": ["effect"]
      }
    },
    {
      "name": "emergency_stop",
      "description": "Emergency stop all audio (panic button)",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }
  ]
}
```

## Usage Instructions

To use these functions in your OpenAI Assistant:

1. Copy the JSON schema above into your assistant's function definitions
2. The AI can now call these functions directly to control the Strudel live coding platform
3. Each function corresponds to a specific browser action or API endpoint
4. The AI can chain multiple function calls to create complex workflows

## Example Function Calls

```javascript
// Start a beat
audio_engine_evaluate({
  "code": "s(\"bd*4, hh*8, ~ sd ~ sd\").gain(.7)"
})

// Create and load a new project
create_project({
  "name": "My Techno Set",
  "code": "s(\"bd*4, hh*8\").bank(\"RolandTR909\")",
  "bpm": 128
})

// Play individual samples for testing
play_sample({
  "sampleName": "bd",
  "gain": 0.8
})
```

This enables your AI assistant to provide hands-on, interactive help with live coding, directly manipulating the audio engine and project management through the browser interface.