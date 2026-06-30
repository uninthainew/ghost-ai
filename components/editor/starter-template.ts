import type { CanvasNode, CanvasEdge } from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  node: CanvasNode[]
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

// Helper to construct a node easily and clearly
function createNode(
  id: string,
  label: string,
  x: number,
  y: number,
  shape: string = "rectangle",
  color: string = "#3b82f6", // Default to blue
  textColor: string = "#ffffff",
  width: number = 150,
  height: number = 80
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: {
      label,
      shape,
      color,
      textColor,
    },
    width,
    height,
  }
}

// Helper to construct an edge easily and clearly
function createEdge(
  id: string,
  source: string,
  target: string,
  label: string = ""
): CanvasEdge {
  return {
    id,
    source,
    target,
    label,
    type: "customEdge",
  }
}

// 1. Microservices Architecture
const microserviceNodes: CanvasNode[] = [
  createNode("api-gateway", "API Gateway", 50, 185, "pill", "#3b82f6", "#ffffff", 140, 60),
  createNode("auth-service", "Auth Service", 240, 95, "rectangle", "#10b981", "#ffffff", 140, 60),
  createNode("message-broker", "Message Broker", 260, 270, "hexagon", "#8b5cf6", "#ffffff", 100, 90),
  createNode("inventory-service", "Inventory Service", 440, 30, "rectangle", "#8b5cf6", "#ffffff", 140, 60),
  createNode("payment-service", "Payment Service", 440, 120, "rectangle", "#8b5cf6", "#ffffff", 140, 60),
  createNode("order-service", "Order Service", 440, 210, "rectangle", "#8b5cf6", "#ffffff", 140, 60),
  createNode("delivery-service", "Delivery Service", 440, 300, "rectangle", "#8b5cf6", "#ffffff", 140, 60),
]

const microserviceEdges: CanvasEdge[] = [
  createEdge("edge-api-auth", "api-gateway", "auth-service", "Auth API"),
  createEdge("edge-api-broker", "api-gateway", "message-broker", "Pub/Sub"),
  createEdge("edge-auth-s1", "auth-service", "inventory-service"),
  createEdge("edge-auth-s2", "auth-service", "payment-service"),
  createEdge("edge-auth-s3", "auth-service", "order-service"),
  createEdge("edge-auth-s4", "auth-service", "delivery-service"),
  createEdge("edge-broker-s1", "message-broker", "inventory-service"),
  createEdge("edge-broker-s2", "message-broker", "payment-service"),
  createEdge("edge-broker-s3", "message-broker", "order-service"),
  createEdge("edge-broker-s4", "message-broker", "delivery-service"),
]

// 2. CI/CD Pipeline
const cicdNodes: CanvasNode[] = [
  createNode("git-source", "Git Source", 50, 140, "rectangle", "#3b82f6", "#ffffff", 120, 60),
  createNode("lint", "Lint Code", 210, 140, "rectangle", "#10b981", "#ffffff", 120, 60),
  createNode("build", "Build Image", 370, 140, "rectangle", "#8b5cf6", "#ffffff", 120, 60),
  createNode("unit-test", "Unit Tests", 530, 140, "rectangle", "#10b981", "#ffffff", 120, 60),
  createNode("integration-test", "Integration Tests", 690, 140, "rectangle", "#8b5cf6", "#ffffff", 120, 60),
  createNode("manual-approval", "Manual Approval", 850, 120, "diamond", "#f59e0b", "#1e293b", 100, 100),
  createNode("deploy-prod", "Deploy Prod", 990, 140, "rectangle", "#10b981", "#ffffff", 120, 60),
]

const cicdEdges: CanvasEdge[] = [
  createEdge("edge-git-lint", "git-source", "lint", "Trigger"),
  createEdge("edge-lint-build", "lint", "build"),
  createEdge("edge-build-unit", "build", "unit-test"),
  createEdge("edge-unit-integration", "unit-test", "integration-test"),
  createEdge("edge-integration-approval", "integration-test", "manual-approval"),
  createEdge("edge-approval-deploy", "manual-approval", "deploy-prod"),
]

// 3. Event-Driven System
const eventNodes: CanvasNode[] = [
  createNode("pub-1", "Web Client", 50, 40, "pill", "#3b82f6", "#ffffff", 120, 50),
  createNode("pub-2", "Mobile Client", 50, 120, "pill", "#3b82f6", "#ffffff", 120, 50),
  createNode("pub-3", "IoT Gateway", 50, 200, "pill", "#3b82f6", "#ffffff", 120, 50),
  createNode("event-broker", "Event Broker", 230, 100, "hexagon", "#8b5cf6", "#ffffff", 100, 90),
  createNode("dlq", "Dead Letter Queue", 210, 240, "rectangle", "#ef4444", "#ffffff", 140, 60),
  createNode("consumer-1", "Inventory Engine", 390, 15, "rectangle", "#10b981", "#ffffff", 140, 55),
  createNode("consumer-2", "Notification Engine", 390, 95, "rectangle", "#10b981", "#ffffff", 140, 55),
  createNode("consumer-3", "Analytics Engine", 390, 175, "rectangle", "#10b981", "#ffffff", 140, 55),
  createNode("consumer-4", "Audit Logger", 390, 255, "rectangle", "#10b981", "#ffffff", 140, 55),
  createNode("store-1", "Inventory DB", 590, 15, "cylinder", "#18181c", "#d4d4d8", 90, 55),
  createNode("store-2", "SMS Gateway", 590, 95, "cylinder", "#18181c", "#d4d4d8", 90, 55),
  createNode("store-3", "Clickstream Log", 590, 175, "cylinder", "#18181c", "#d4d4d8", 90, 55),
  createNode("store-4", "Audit Store", 590, 255, "cylinder", "#18181c", "#d4d4d8", 90, 55),
]

const eventEdges: CanvasEdge[] = [
  createEdge("edge-pub1-broker", "pub-1", "event-broker"),
  createEdge("edge-pub2-broker", "pub-2", "event-broker"),
  createEdge("edge-pub3-broker", "pub-3", "event-broker"),
  createEdge("edge-broker-dlq", "event-broker", "dlq", "Failure"),
  createEdge("edge-broker-c1", "event-broker", "consumer-1"),
  createEdge("edge-broker-c2", "event-broker", "consumer-2"),
  createEdge("edge-broker-c3", "event-broker", "consumer-3"),
  createEdge("edge-broker-c4", "event-broker", "consumer-4"),
  createEdge("edge-c1-s1", "consumer-1", "store-1"),
  createEdge("edge-c2-s2", "consumer-2", "store-2"),
  createEdge("edge-c3-s3", "consumer-3", "store-3"),
  createEdge("edge-c4-s4", "consumer-4", "store-4"),
]

// Export as both CANVAS_TEMPLAES (matching exact spec typo) and CANVAS_TEMPLATES (correctly spelled)
export const CANVAS_TEMPLAES: CanvasTemplate[] = [
  {
    id: "microservice",
    name: "Microservices",
    description: "API Gateway routes traffic to isolated services, each backed by a dedicated database and connected via a shared message bus.",
    node: microserviceNodes,
    nodes: microserviceNodes,
    edges: microserviceEdges,
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "End-to-end delivery from source commit through build, test, containerisation, and staged deployment to production.",
    node: cicdNodes,
    nodes: cicdNodes,
    edges: cicdEdges,
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "Producers publish events to a central bus. Independent consumers handle emails, push notifications, analytics, and error queues.",
    node: eventNodes,
    nodes: eventNodes,
    edges: eventEdges,
  },
]

export const CANVAS_TEMPLATES = CANVAS_TEMPLAES
