// OpenAI Function Schema for Browser Access
// This provides the AI direct access to browser functions through API calls

export const openAIBrowserSchema = {
  // Audio Engine Control
  audio_engine_play: {
    name: "audio_engine_play",
    description: "Start audio playback in the browser",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },

  audio_engine_stop: {
    name: "audio_engine_stop", 
    description: "Stop audio playback in the browser",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },

  audio_engine_evaluate: {
    name: "audio_engine_evaluate",
    description: "Evaluate Strudel code in the browser audio engine",
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Strudel pattern code to evaluate"
        }
      },
      required: ["code"]
    }
  },

  audio_engine_set_volume: {
    name: "audio_engine_set_volume",
    description: "Set master volume of the audio engine",
    parameters: {
      type: "object", 
      properties: {
        volume: {
          type: "number",
          description: "Volume level between 0.0 and 1.0",
          minimum: 0.0,
          maximum: 1.0
        }
      },
      required: ["volume"]
    }
  },

  // Project Management
  create_project: {
    name: "create_project",
    description: "Create a new Strudel project",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the new project"
        },
        code: {
          type: "string", 
          description: "Initial Strudel code (optional)",
          default: ""
        },
        bpm: {
          type: "number",
          description: "BPM for the project",
          default: 120
        },
        isPublic: {
          type: "boolean",
          description: "Whether project is public",
          default: false
        }
      },
      required: ["name"]
    }
  },

  update_project: {
    name: "update_project",
    description: "Update an existing project's code",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "number",
          description: "ID of the project to update"
        },
        code: {
          type: "string",
          description: "Updated Strudel code"
        },
        name: {
          type: "string",
          description: "Updated project name (optional)"
        },
        bpm: {
          type: "number", 
          description: "Updated BPM (optional)"
        }
      },
      required: ["projectId", "code"]
    }
  },

  load_project: {
    name: "load_project",
    description: "Load a project into the editor",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "number",
          description: "ID of the project to load"
        }
      },
      required: ["projectId"]
    }
  },

  create_project_snapshot: {
    name: "create_project_snapshot",
    description: "Save a snapshot/version of the current project",
    parameters: {
      type: "object",
      properties: {
        projectId: {
          type: "number",
          description: "ID of the project"
        },
        message: {
          type: "string",
          description: "Description of the snapshot"
        }
      },
      required: ["projectId", "message"]
    }
  },

  // Pattern Generation
  generate_random_beat: {
    name: "generate_random_beat",
    description: "Generate a random Strudel beat pattern",
    parameters: {
      type: "object",
      properties: {
        bpm: {
          type: "number",
          description: "BPM for the generated pattern",
          default: 120
        }
      },
      required: []
    }
  },

  generate_strudel_pattern: {
    name: "generate_strudel_pattern", 
    description: "Generate a specific Strudel pattern based on description",
    parameters: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "Description of the desired pattern (e.g., 'techno beat', 'ambient pad', 'bass line')"
        },
        bpm: {
          type: "number",
          description: "BPM for the pattern",
          default: 120
        }
      },
      required: ["description"]
    }
  },

  // Browser Navigation
  navigate_to_studio: {
    name: "navigate_to_studio",
    description: "Navigate to the studio/editor page",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },

  toggle_studio_mode: {
    name: "toggle_studio_mode",
    description: "Toggle between code editor and performance studio mode",
    parameters: {
      type: "object",
      properties: {
        studioMode: {
          type: "boolean",
          description: "True for studio mode, false for code mode"
        }
      },
      required: ["studioMode"]
    }
  },

  // Sample Management
  play_sample: {
    name: "play_sample",
    description: "Play a specific audio sample",
    parameters: {
      type: "object",
      properties: {
        sampleName: {
          type: "string",
          description: "Name of the sample to play (e.g., 'bd', 'sd', 'hh')"
        },
        gain: {
          type: "number",
          description: "Volume level for the sample",
          default: 1.0,
          minimum: 0.0,
          maximum: 2.0
        }
      },
      required: ["sampleName"]
    }
  },

  // Auto-save Control
  toggle_auto_save: {
    name: "toggle_auto_save",
    description: "Toggle auto-save functionality on/off",
    parameters: {
      type: "object",
      properties: {
        enabled: {
          type: "boolean",
          description: "Whether to enable or disable auto-save"
        }
      },
      required: ["enabled"]
    }
  },

  // Browser Information
  get_browser_info: {
    name: "get_browser_info",
    description: "Get information about the browser and audio capabilities",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },

  // Error Handling
  show_notification: {
    name: "show_notification",
    description: "Show a notification/toast message to the user",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Message to display"
        },
        type: {
          type: "string",
          enum: ["success", "error", "warning", "info"],
          description: "Type of notification",
          default: "info"
        }
      },
      required: ["message"]
    }
  },

  // Live Performance
  apply_global_effect: {
    name: "apply_global_effect",
    description: "Apply an effect to all currently playing patterns",
    parameters: {
      type: "object",
      properties: {
        effect: {
          type: "string",
          description: "Effect to apply (e.g., 'room(.5)', 'lpf(1000)', 'gain(.7)')"
        }
      },
      required: ["effect"]
    }
  },

  emergency_stop: {
    name: "emergency_stop",
    description: "Emergency stop all audio (panic button)",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
};

// Complete schema export for OpenAI Assistant
export const completeOpenAISchema = Object.values(openAIBrowserSchema);