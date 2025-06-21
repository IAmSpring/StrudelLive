# Strudel Live Coding Studio

A professional web-based live coding environment for creating algorithmic music with the Strudel pattern language. Built for live performances, creative exploration, and collaborative music making with AI-powered assistance.

![Live Coding Interface](https://img.shields.io/badge/Live%20Coding-Strudel-00D4AA)
![AI Powered](https://img.shields.io/badge/AI-Powered-8B5CF6)
![Real Time](https://img.shields.io/badge/Real%20Time-Collaboration-06B6D4)

## 🎵 What is Strudel Live Coding?

Strudel is a pattern language for live coding music, allowing you to create complex rhythms, melodies, and soundscapes using simple, expressive code. This studio provides a complete development environment for:

- **Live Performances**: Code music in real-time while it plays
- **Creative Exploration**: Experiment with algorithmic composition
- **Learning**: Master live coding with AI assistance
- **Collaboration**: Share and work on projects together

## ✨ Key Features

### 🎹 **Live Coding Engine**
- **Real-time Audio**: Code executes immediately while music plays
- **Pattern Language**: Expressive Strudel syntax for rhythms and melodies
- **Web Audio**: Browser-native audio processing with low latency
- **Live Evaluation**: Modify patterns while they're playing

### 🤖 **AI-Powered Assistance**
- **AI Chat Assistant**: Get help with Strudel syntax and live coding techniques
- **AI Composer**: Describe a track concept and watch AI build it iteratively
- **Pattern Generation**: Generate random beats for inspiration
- **Code Analysis**: Real-time feedback on your Strudel patterns

### 🎛️ **Professional Interface**
- **Cyberpunk Aesthetic**: Terminal-style interface designed for live performance
- **Dual-Panel Layout**: Code editor with real-time visualizers
- **Performance Controls**: Play/stop/mode buttons optimized for live use
- **Sample Library**: Comprehensive drum and synth sample collection

### 📊 **Real-Time Visualizers**
- **Waveform Display**: Live audio waveform visualization
- **Pattern Grid**: Visual representation of playing patterns
- **Step Sequencer**: 16-step grid showing active beats
- **Audio Meters**: CPU usage, latency, and level monitoring

### 💾 **Project Management**
- **Auto-Save**: Automatic project saving while you work
- **Version Control**: Snapshot system for code versions
- **Project Library**: Organize and access all your compositions
- **Export/Import**: Share projects with other users

## 🚀 Getting Started

### First-Time User Experience

When you first open the studio, you'll see a **Welcome Overlay** that guides you through:

1. **Live Coding Basics**: Understanding the Strudel pattern language
2. **AI Features**: How to use the AI Chat and Composer
3. **Quick Start Options**:
   - Generate a random beat to hear the system in action
   - Try the AI Composer with a track description
   - Chat with the AI assistant for learning

### Interface Layout

#### **Top Bar (Dual-Row)**
```
[Play] [Stop] [Mode: CODE/STUDIO]     [Random Beat] [Auto-save: ON/OFF]
● LIVE    Current Project: Welcome Playground    Session: Live Coding  Time: 3:11 AM
```

#### **Main Layout**
```
┌─────────────┬────────────────────────┬──────────────┬─────────────┐
│   Sidebar   │      Code Editor       │ Visualizers  │   Samples   │
│             │                        │              │             │
│ • Projects  │   s("bd*4, hh*8")     │  Waveform    │  • Drums    │
│ • AI Chat   │   .bank("RolandTR909") │  Pattern     │  • Melodic  │
│ • Composer  │                        │  Grid        │  • Bass     │
│             │                        │              │  • Ambient  │
└─────────────┴────────────────────────┴──────────────┴─────────────┘
                        Status Bar: BPM: 120  CPU: 25%  Latency: 15ms
```

## 🎼 Using Strudel Patterns

### Basic Drum Patterns
```javascript
// Simple four-on-the-floor
s("bd*4")

// Complex breakbeat
s("bd*2 ~ bd", "~ sd ~ sd", "hh*8")
```

### Melodic Patterns
```javascript
// Bass line
note("c2 ~ c2 g1").s("bass")

// Chord progression
note("c'maj7 f'maj7 g'7 c'maj7").s("piano")
```

### Effects and Filters
```javascript
// Add low-pass filter
s("bd*4").lpf(800)

// Delay and reverb
s("hh*8").delay(0.25).room(0.8)
```

## 🤖 AI Features Deep Dive

### AI Chat Assistant

The AI assistant helps you learn and create with Strudel:

**What you can ask:**
- "How do I create a techno bassline?"
- "What's the syntax for adding reverb?"
- "Help me fix this pattern: s('bd ~ sd')"
- "Explain how the .fast() function works"

**Features:**
- Real-time chat interface
- Project-aware context
- Strudel syntax highlighting in responses
- Code examples and explanations

### AI Composer

Autonomous track creation with iterative development:

**How it works:**
1. Describe your track: "Progressive house with evolving bassline and atmospheric pads"
2. AI creates the initial pattern
3. AI iteratively adds layers, variations, and effects (up to 50 steps)
4. You can continue beyond 50 steps or stop at any time

**Example progression:**
```
Step 1: Basic kick pattern
Step 2: Add hi-hats
Step 3: Introduce bassline
Step 4: Layer atmospheric pads
Step 5: Add filter sweeps
...
Step 20: Complex polyrhythmic patterns
```

## 🎛️ Interface Components

### Sidebar Panels

#### **Projects Panel**
- View all your saved projects
- Create new projects
- Quick project switching
- Auto-save status indicators

#### **AI Chat Panel**
- Persistent conversation history
- Project-specific context
- Real-time responses
- Code insertion helpers

#### **AI Composer Panel**
- Track description input
- Composition progress tracking
- Step-by-step history
- Continue/stop controls

### Right Panel Tabs

#### **Samples Panel**
- **Categories**: Drums, Melodic, Bass, Ambient
- **Sample Browser**: Search and filter samples
- **Preview**: Play samples before using
- **Quick Insert**: Add samples to code with one click
- **Upload**: Import your own samples (WAV, MP3, FLAC)

#### **Console Panel**
- **Real-time Logging**: Code evaluation results
- **Error Messages**: Syntax and runtime errors
- **Performance Metrics**: Audio engine status
- **Quick Actions**: Restart engine, panic stop

### Visualizers

#### **Waveform Display**
- Real-time audio visualization
- Multi-frequency representation
- Bass and treble separation
- Playing/stopped status indicators

#### **Pattern Grid**
- 16-step sequencer visualization
- Multi-layer pattern display
- Current step highlighting
- Beat indicators and timing

## 🎵 Sample Library

### Built-in Samples

#### **Drums (RolandTR909 Bank)**
- `bd` - Bass Drum
- `sd` - Snare Drum  
- `hh` - Hi-Hat Closed
- `oh` - Hi-Hat Open
- `cp` - Hand Clap
- `rim` - Rim Shot
- `crash` - Crash Cymbal
- `ride` - Ride Cymbal

#### **Melodic Instruments**
- `piano` - Acoustic Piano
- `rhodes` - Electric Piano
- `lead` - Synth Lead
- `pad` - String Pad
- `pluck` - Synth Pluck
- `bell` - Bell Sounds

#### **Bass Synths**
- `bass` - Standard Bass
- `subbass` - Sub Bass
- `reese` - Reese Bass
- `wobble` - Wobble Bass

#### **Ambient Textures**
- `wind` - Wind Sounds
- `rain` - Rain Texture
- `noise` - White Noise
- `vinyl` - Vinyl Crackle

## 🎹 Live Coding Workflow

### Performance Mode

1. **Preparation**
   - Load or create a project
   - Set your BPM (default: 120)
   - Choose your sample banks

2. **Live Coding**
   - Write initial pattern
   - Press `Ctrl+Enter` to evaluate
   - Click **PLAY** to start audio
   - Modify code while it plays
   - Use **Random Beat** for inspiration

3. **Real-Time Editing**
   - Change patterns without stopping
   - Add/remove layers dynamically
   - Experiment with effects
   - Build complex compositions live

### Collaboration Features

- **Auto-Save**: Never lose your work
- **Version Snapshots**: Save specific versions
- **WebSocket Sync**: Real-time collaboration (coming soon)
- **Project Sharing**: Export/import projects

## 🔧 Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for development and builds
- **Monaco Editor** with Strudel syntax highlighting
- **Web Audio API** for audio processing
- **Tailwind CSS** with cyberpunk theming

### Backend Services
- **Express.js** REST API
- **WebSocket** real-time communication
- **PostgreSQL** with Drizzle ORM
- **OpenAI GPT-4o** for AI features

### Audio Engine
- **Web Audio API** browser-native processing
- **Real-time Synthesis** low-latency audio
- **Sample Management** efficient audio loading
- **Effect Processing** built-in filters and effects

## 🎯 Use Cases

### **Live Performance**
- Club performances with real-time coding
- Concert visuals synchronized to code
- Audience interaction through code sharing
- Improvisation with AI assistance

### **Music Production**
- Rapid prototyping of musical ideas
- Algorithmic composition exploration
- Pattern-based arrangement creation
- Collaborative music making

### **Education**
- Learn live coding fundamentals
- Practice with AI guidance
- Interactive tutorials and examples
- Community sharing and feedback

### **Creative Coding**
- Generative music experiments
- Procedural composition techniques
- Interactive audio installations
- Cross-media art projects

## 🚀 Advanced Features

### **Studio Mode**
Toggle between CODE and STUDIO modes for different workflows:
- **CODE Mode**: Focus on writing and editing patterns
- **STUDIO Mode**: Performance-optimized interface with larger controls

### **Performance Optimizations**
- **Low Latency**: Optimized for real-time performance
- **CPU Monitoring**: Real-time performance metrics
- **Memory Management**: Efficient sample and pattern handling
- **Error Recovery**: Graceful handling of code errors

### **Extensibility**
- **Custom Samples**: Upload and use your own audio
- **Effect Chains**: Complex audio processing pipelines
- **MIDI Integration**: Connect external controllers (coming soon)
- **OSC Support**: Network synchronization (coming soon)

## 🎨 Design Philosophy

### **Performance First**
Every interface element is designed for live performance scenarios:
- Large, accessible controls
- High contrast terminal aesthetics
- Minimal visual distractions
- Fast keyboard shortcuts

### **AI Integration**
AI features enhance rather than replace human creativity:
- Learning assistance, not replacement
- Inspiration generation, not rigid templates
- Collaborative composition, not automated music
- Context-aware help, not generic responses

### **Progressive Complexity**
The interface scales from beginner to expert:
- Simple welcome flow for newcomers
- Progressive feature discovery
- Expert shortcuts and power features
- Customizable workspace layouts

## 🔮 Roadmap

### **Immediate Enhancements**
- MIDI controller integration
- Advanced visualizer options
- Extended sample library
- Performance recording

### **Community Features**
- Project sharing marketplace
- Collaborative editing sessions
- Live streaming integration
- Community challenges and events

### **Advanced AI**
- Voice-to-code generation
- Style transfer between artists
- Adaptive learning from your patterns
- Real-time composition assistance

## 🤝 Contributing

This is a live coding platform built for the community. Whether you're a musician, developer, or live coding enthusiast, there are many ways to contribute:

- **Report Issues**: Help us improve the platform
- **Share Patterns**: Contribute to the sample library
- **Feature Requests**: Suggest new capabilities
- **Documentation**: Help others learn live coding

## 📄 License

Open source project built with modern web technologies. See LICENSE file for details.

---

**Ready to start live coding?** Open the studio and click "Generate Random Beat" to hear Strudel in action, then dive into the AI Composer or chat with the assistant to learn more!

*Built with ❤️ for the live coding community*