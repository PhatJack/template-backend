import swaggerJSDoc from "swagger-jsdoc";

const apiErrorResponse = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Internal server error" },
  },
};

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Template Backend API",
    version: "1.0.0",
    description: "API documentation for the Template Backend service",
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Service health endpoints" },
    { name: "Users", description: "User management endpoints" },
    { name: "Conversations", description: "Conversation endpoints" },
    { name: "Messages", description: "Message and AI reply endpoints" },
    { name: "Files", description: "File record endpoints" },
  ],
  components: {
    responses: {
      BadRequest: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" },
          },
        },
      },
      ServerError: {
        description: "Server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiError" },
          },
        },
      },
    },
    schemas: {
      ApiError: apiErrorResponse,
      HealthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "API is running" },
          data: {
            type: "object",
            properties: {
              env: { type: "string", example: "development" },
              dbClient: { type: "string", example: "mongodb" },
              database: { type: "string", example: "template_backend" },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "683e4b11e4f3b9c9a4af2b11" },
          name: { type: "string", nullable: true, example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/User" },
        },
      },
      UsersResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: { $ref: "#/components/schemas/User" } },
        },
      },
      Conversation: {
        type: "object",
        properties: {
          id: { type: "string", example: "683e4b11e4f3b9c9a4af2b11" },
          title: { type: "string", nullable: true, example: "Support chat" },
          userId: {
            type: "string",
            nullable: true,
            example: "683e4b11e4f3b9c9a4af2b10",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateConversationRequest: {
        type: "object",
        required: ["userId", "prompt"],
        properties: {
          userId: { type: "string", example: "683e4b11e4f3b9c9a4af2b10" },
          prompt: {
            type: "string",
            example: "Help me create a project proposal template",
            description: "Used by Gemini to generate the conversation title",
          },
        },
      },
      UpdateConversationRequest: {
        type: "object",
        properties: {
          title: { type: "string", nullable: true, example: "Support chat" },
          userId: {
            type: "string",
            nullable: true,
            example: "683e4b11e4f3b9c9a4af2b10",
          },
        },
      },
      ConversationResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Conversation" },
        },
      },
      ConversationsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Conversation" },
          },
        },
      },
      Message: {
        type: "object",
        properties: {
          id: { type: "string", example: "683e4b11e4f3b9c9a4af2b22" },
          conversationId: {
            type: "string",
            example: "683e4b11e4f3b9c9a4af2b11",
          },
          role: {
            type: "string",
            enum: ["USER", "ASSISTANT", "SYSTEM"],
            example: "USER",
          },
          content: { type: "string", example: "Hello" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateMessageRequest: {
        type: "object",
        required: ["conversationId", "role", "content"],
        properties: {
          conversationId: {
            type: "string",
            example: "683e4b11e4f3b9c9a4af2b11",
          },
          role: {
            type: "string",
            enum: ["USER", "ASSISTANT", "SYSTEM"],
            example: "USER",
          },
          content: { type: "string", example: "Hello" },
        },
      },
      GenerateMessageReplyRequest: {
        type: "object",
        required: ["messageId"],
        properties: {
          messageId: {
            type: "string",
            example: "683e4b11e4f3b9c9a4af2b22",
          },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Message" },
        },
      },
      MessagesResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Message" },
          },
        },
      },
      GenerateMessageReplyResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              model: { type: "string", example: "gemini-3-flash-preview" },
              sourceMessage: { $ref: "#/components/schemas/Message" },
              assistantMessage: { $ref: "#/components/schemas/Message" },
            },
          },
        },
      },
      File: {
        type: "object",
        properties: {
          id: { type: "string", example: "683e4b11e4f3b9c9a4af2b33" },
          conversationId: {
            type: "string",
            example: "683e4b11e4f3b9c9a4af2b11",
          },
          messageId: {
            type: "string",
            nullable: true,
            example: "683e4b11e4f3b9c9a4af2b22",
          },
          originalName: { type: "string", example: "brief.pdf" },
          fileName: { type: "string", example: "brief-1717000000000.pdf" },
          mimeType: { type: "string", example: "application/pdf" },
          size: { type: "number", example: 102400 },
          url: { type: "string", example: "/uploads/brief.pdf" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateFileRequest: {
        type: "object",
        required: ["conversationId", "url"],
        properties: {
          conversationId: {
            type: "string",
            example: "683e4b11e4f3b9c9a4af2b11",
          },
          messageId: {
            type: "string",
            nullable: true,
            example: "683e4b11e4f3b9c9a4af2b22",
          },
          originalName: { type: "string", example: "brief.pdf" },
          fileName: { type: "string", example: "brief-1717000000000.pdf" },
          mimeType: { type: "string", example: "application/pdf" },
          size: { type: "number", example: 102400 },
          url: { type: "string", example: "/uploads/brief.pdf" },
        },
      },
      FileResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/File" },
        },
      },
      FilesResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: { $ref: "#/components/schemas/File" } },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          "200": {
            description: "API health status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        responses: {
          "200": {
            description: "Users returned successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UsersResponse" },
              },
            },
          },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/conversations": {
      get: {
        tags: ["Conversations"],
        summary: "List conversations",
        parameters: [
          {
            name: "userId",
            in: "query",
            schema: { type: "string" },
            description: "Filter by user id",
          },
        ],
        responses: {
          "200": {
            description: "Conversations returned successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConversationsResponse" },
              },
            },
          },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
      post: {
        tags: ["Conversations"],
        summary: "Create a conversation with an AI-generated title",
        description:
          "Creates a conversation for a user. The prompt is sent to Gemini to generate the conversation title; it does not create the first message.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateConversationRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Conversation created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConversationResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/conversations/{id}": {
      get: {
        tags: ["Conversations"],
        summary: "Get a conversation by id",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Conversation returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConversationResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
      patch: {
        tags: ["Conversations"],
        summary: "Update a conversation",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateConversationRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Conversation updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConversationResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
      delete: {
        tags: ["Conversations"],
        summary: "Delete a conversation and related messages/files",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "204": { description: "Conversation deleted" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/messages": {
      get: {
        tags: ["Messages"],
        summary: "List messages for a conversation",
        parameters: [
          {
            name: "conversationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Messages returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessagesResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
      post: {
        tags: ["Messages"],
        summary: "Create a message",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateMessageRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Message created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/messages/reply": {
      post: {
        tags: ["Messages"],
        summary: "Generate an AI reply for a saved user message",
        description:
          "Call this after creating a USER message. The API reads the message content, generates an AI reply, stores the ASSISTANT message, and returns both messages.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GenerateMessageReplyRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "AI reply generated and stored",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenerateMessageReplyResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/files": {
      get: {
        tags: ["Files"],
        summary: "List files for a conversation",
        parameters: [
          {
            name: "conversationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Files returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FilesResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
      post: {
        tags: ["Files"],
        summary: "Create a file record",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateFileRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "File record created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FileResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/files/{id}": {
      delete: {
        tags: ["Files"],
        summary: "Delete a file",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "204": { description: "File deleted" },
          "500": { $ref: "#/components/responses/ServerError" },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ["./src/**/*.ts"],
});

export default swaggerSpec;
