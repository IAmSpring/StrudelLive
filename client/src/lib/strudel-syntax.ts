import * as monaco from "monaco-editor";

export function setupStrudelSyntax() {
  // Register Strudel language
  monaco.languages.register({ id: "strudel" });

  // Define Strudel syntax highlighting
  monaco.languages.setMonarchTokensProvider("strudel", {
    // Keywords and functions
    keywords: [
      'stack', 'seq', 'cat', 'rev', 'fast', 'slow', 'iter', 'every', 'when', 'unless',
      'sine', 'saw', 'square', 'tri', 'noise', 'rand', 'choose', 'range',
      'note', 'n', 's', 'gain', 'pan', 'lpf', 'hpf', 'bpf', 'delay', 'reverb',
      'room', 'size', 'crush', 'shape', 'vowel', 'speed', 'unit', 'loop',
      'cut', 'cutoff', 'resonance', 'attack', 'release', 'sustain', 'decay'
    ],

    // Sample names
    samples: [
      'bd', 'sn', 'hh', 'oh', 'cp', 'perc', 'tom', 'kick', 'snare', 'hihat',
      'piano', 'bass', 'lead', 'pad', 'pluck', 'bell', 'organ', 'string',
      'drum', 'cymbal', 'crash', 'ride', 'clap', 'rim', 'cowbell', 'block'
    ],

    // Operators
    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
      '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=', '>>>='
    ],

    // Symbols
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // Escapes
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    // Tokenizer rules
    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],

        // Sample patterns (quoted strings with ~ and sample names)
        [/"[^"]*"/, {
          cases: {
            '@samples': 'string.sample',
            '@default': 'string'
          }
        }],

        // Functions and methods
        [/\.[a-zA-Z_]\w*/, 'function'],

        // Keywords
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@samples': 'sample',
            '@default': 'identifier'
          }
        }],

        // Whitespace
        { include: '@whitespace' },

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // Delimiter
        [/[;,.]/, 'delimiter'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ["\\*/", 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      string: [
        [/[^\\"~]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/~/, 'string.rest'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
    },
  });

  // Define Strudel dark theme
  monaco.editor.defineTheme("strudel-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A737D" },
      { token: "keyword", foreground: "6366F1", fontStyle: "bold" },
      { token: "function", foreground: "8B5CF6" },
      { token: "sample", foreground: "10B981" },
      { token: "string", foreground: "F59E0B" },
      { token: "string.sample", foreground: "10B981" },
      { token: "string.rest", foreground: "6B7280" },
      { token: "number", foreground: "F59E0B" },
      { token: "operator", foreground: "8B5CF6" },
      { token: "delimiter", foreground: "D1D5DB" },
      { token: "identifier", foreground: "E5E7EB" },
    ],
    colors: {
      "editor.background": "#0F0F23",
      "editor.foreground": "#E5E7EB",
      "editor.lineHighlightBackground": "#1E1B4B",
      "editor.selectionBackground": "#312E81",
      "editor.inactiveSelectionBackground": "#312E8150",
      "editor.findMatchBackground": "#6366F150",
      "editor.findMatchHighlightBackground": "#8B5CF630",
      "editorLineNumber.foreground": "#6B7280",
      "editorLineNumber.activeForeground": "#D1D5DB",
      "editorIndentGuide.background": "#374151",
      "editorIndentGuide.activeBackground": "#6B7280",
      "editorWhitespace.foreground": "#374151",
      "editorCursor.foreground": "#6366F1",
    }
  });

  // Language configuration for brackets, auto-closing, etc.
  monaco.languages.setLanguageConfiguration("strudel", {
    brackets: [
      ['(', ')'],
      ['{', '}'],
      ['[', ']'],
      ['"', '"']
    ],
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '"', close: '"', notIn: ['string'] },
    ],
    surroundingPairs: [
      { open: '(', close: ')' },
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '"', close: '"' },
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*//\\s*#?region\\b"),
        end: new RegExp("^\\s*//\\s*#?endregion\\b")
      }
    }
  });

  // Hover provider for documentation
  monaco.languages.registerHoverProvider("strudel", {
    provideHover: function (model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return;

      const hoverTexts: Record<string, string> = {
        'stack': 'Layers multiple patterns on top of each other\nExample: stack("bd ~ ~ ~", "~ ~ sn ~")',
        's': 'Sets the gain/volume of a pattern\nExample: "bd sn".s(0.5)',
        'note': 'Sets the note/pitch\nExample: "~ ~ ~ ~".note("c3 d3 e3 f3")',
        'lpf': 'Low-pass filter with cutoff frequency\nExample: "bd sn".lpf(1000)',
        'fast': 'Speeds up a pattern by a factor\nExample: "bd sn".fast(2)',
        'slow': 'Slows down a pattern by a factor\nExample: "bd sn".slow(2)',
        'rev': 'Reverses a pattern\nExample: "bd sn hh cp".rev()',
        'bd': 'Bass drum/kick sample',
        'sn': 'Snare drum sample',
        'hh': 'Hi-hat sample',
        'cp': 'Clap sample',
        '~': 'Rest/silence in a pattern'
      };

      const text = hoverTexts[word.word];
      if (text) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [{ value: text }]
        };
      }
    }
  });

  // Auto-completion provider
  monaco.languages.registerCompletionItemProvider("strudel", {
    provideCompletionItems: function (model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [
        // Functions
        {
          label: 'stack',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'stack(\n  $1\n)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Layer multiple patterns together',
          range: range
        },
        {
          label: 's',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 's($1)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Set gain/volume (0-1)',
          range: range
        },
        {
          label: 'note',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'note("$1")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Set note/pitch',
          range: range
        },
        {
          label: 'lpf',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'lpf($1)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Low-pass filter (frequency in Hz)',
          range: range
        },

        // Samples
        {
          label: 'bd',
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: 'bd',
          documentation: 'Bass drum/kick sample',
          range: range
        },
        {
          label: 'sn',
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: 'sn',
          documentation: 'Snare drum sample',
          range: range
        },
        {
          label: 'hh',
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: 'hh',
          documentation: 'Hi-hat sample',
          range: range
        },

        // Pattern snippets
        {
          label: 'basic-drums',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'stack(\n  "bd ~ ~ ~",\n  "~ ~ sn ~",\n  "hh hh hh hh"\n).s(0.7)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Basic drum pattern template',
          range: range
        }
      ];

      return { suggestions: suggestions };
    }
  });
}
