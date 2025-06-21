import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertProjectSnapshotSchema, insertChatMessageSchema } from "@shared/schema";
import { chatWithAI, generateRandomBeat } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'code_update') {
          // Broadcast code updates to other connected clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'code_update',
                projectId: data.projectId,
                code: data.code,
                userId: data.userId
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Mock user for development (in production, implement proper auth)
  const mockUserId = 1;

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUser(mockUserId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      console.log("Creating project with data:", req.body);
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({ ...projectData, userId: mockUserId });
      res.status(201).json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      res.status(400).json({ message: "Invalid project data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(parseInt(req.params.id), projectData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Project snapshots API
  app.get("/api/projects/:id/snapshots", async (req, res) => {
    try {
      const snapshots = await storage.getProjectSnapshots(parseInt(req.params.id));
      res.json(snapshots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch snapshots" });
    }
  });

  app.post("/api/projects/:id/snapshots", async (req, res) => {
    try {
      const snapshotData = insertProjectSnapshotSchema.parse({
        ...req.body,
        projectId: parseInt(req.params.id)
      });
      const snapshot = await storage.createProjectSnapshot(snapshotData);
      res.status(201).json(snapshot);
    } catch (error) {
      res.status(400).json({ message: "Invalid snapshot data" });
    }
  });

  // Samples API
  app.get("/api/samples", async (req, res) => {
    try {
      const { category } = req.query;
      const samples = category 
        ? await storage.getSamplesByCategory(category as string)
        : await storage.getSamples();
      res.json(samples);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch samples" });
    }
  });

  // Chat API
  app.get("/api/projects/:id/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/projects/:id/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        projectId: parseInt(req.params.id)
      });

      // Save user message
      const userMessage = await storage.createChatMessage({
        ...messageData,
        userId: mockUserId
      });

      // Get AI response
      const project = await storage.getProject(parseInt(req.params.id));
      const aiResponse = await chatWithAI(messageData.content, project?.code || "");

      // Save AI response
      const aiMessage = await storage.createChatMessage({
        projectId: parseInt(req.params.id),
        role: "assistant",
        content: aiResponse,
        userId: mockUserId
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Auto-save endpoint
  app.post("/api/projects/:id/autosave", async (req, res) => {
    try {
      const { code } = req.body;
      const project = await storage.updateProject(parseInt(req.params.id), { code });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Auto-saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Auto-save failed" });
    }
  });

  // Generate random beat endpoint
  app.post("/api/generate/random-beat", async (req, res) => {
    try {
      const beat = await generateRandomBeat();
      res.json({ code: beat });
    } catch (error) {
      console.error('Random beat generation error:', error);
      res.status(500).json({ message: "Failed to generate random beat" });
    }
  });

  return httpServer;
}
