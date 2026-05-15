import swaggerJSDoc from "swagger-jsdoc";

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
    {
      name: "Health",
      description: "Service health endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],
  components: {
    schemas: {
      ApiError: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            id: {
              type: "string",
              example: "683e4b11e4f3b9c9a4af2b11",
            },
            example: "Internal server error",
          },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "API is running",
          },
          data: {
            type: "object",
            properties: {
        CreateConversationRequest: {
          type: "object",
          required: ["userId"],
          properties: {
            title: { type: "string", example: "Support chat" },
            userId: { type: "string", example: "683e4b11e4f3b9c9a4af2b11" }
          }
        },
        ConversationResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { $ref: "#/components/schemas/Conversation" }
          }
        },
        ConversationsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array", items: { $ref: "#/components/schemas/Conversation" } }
          }
        },
              env: {
                type: "string",
                example: "development",
              },
              dbClient: {
                type: "string",
                enum: ["mongodb"],
                example: "mongodb",
              },
              database: {
                type: "string",
                example: "template_backend",
              },
            },
          },
        },
      },
      Message: {
        type: "object",
        properties: {
          id: { type: "string", example: "683e4b11e4f3b9c9a4af2b22" },
          conversationId: { type: "string", example: "683e4b11e4f3b9c9a4af2b11" },
          role: { type: "string", example: "user" },
          content: { type: "string", example: "Hello" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      CreateMessageRequest: {
        type: "object",
        required: ["conversationId", "role", "content"],
        properties: {
          conversationId: { type: "string" },
          role: { type: "string" },
          content: { type: "string" }
        }
      },
      MessageResponse: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Message" } } },
      MessagesResponse: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/Message" } } } },
      File: {
        type: "object",
        properties: {
          id: { type: "string", example: "683e4b11e4f3b9c9a4af2b33" },
          conversationId: { type: "string" },
          name: { type: "string" },
          url: { type: "string" },
          size: { type: "number" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      CreateFileRequest: {
        type: "object",
        required: ["conversationId", "url", "fileName"],
        properties: {
          conversationId: { type: "string" },
          originalName: { type: "string" },
          fileName: { type: "string" },
          mimeType: { type: "string" },
          url: { type: "string" },
          size: { type: "number" }
        }
      },
      FileResponse: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/File" } } },
      FilesResponse: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { $ref: "#/components/schemas/File" } } } },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "683e4b11e4f3b9c9a4af2b11",
          },
          name: {
            type: "string",
            example: "Jane Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: {
            type: "string",
            example: "Jane Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "jane@example.com",
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      UsersResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User",
            },
          },
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
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
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
                schema: {
                  $ref: "#/components/schemas/UsersResponse",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUserRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
              },
            },
          },
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
            description: "Filter by user id"
          }
        ],
        responses: {
          "200": {
            description: "Conversations returned successfully",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ConversationsResponse" } } }
          }
        }
      },
      post: {
        tags: ["Conversations"],
        summary: "Create a conversation",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateConversationRequest" } } } },
        responses: {
          "201": { description: "Conversation created", content: { "application/json": { schema: { $ref: "#/components/schemas/ConversationResponse" } } } },
          "400": { description: "Missing required fields" }
        }
      }
    },
    "/conversations/{id}": {
      get: {
        tags: ["Conversations"],
        summary: "Get a conversation by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Conversation returned", content: { "application/json": { schema: { $ref: "#/components/schemas/ConversationResponse" } } } }, "404": { description: "Not found" } }
      },
      patch: {
        tags: ["Conversations"],
        summary: "Update a conversation",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: false, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateConversationRequest" } } } },
        responses: { "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/ConversationResponse" } } } }, "404": { description: "Not found" } }
      },
      delete: {
        tags: ["Conversations"],
        summary: "Delete a conversation and related messages/files",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } }
      }
    },
    "/messages": {
      get: {
        tags: ["Messages"],
        summary: "List messages for a conversation",
        parameters: [{ name: "conversationId", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Messages returned", content: { "application/json": { schema: { $ref: "#/components/schemas/MessagesResponse" } } } }, "400": { description: "Bad request" } }
      },
      post: {
        tags: ["Messages"],
        summary: "Create a message",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateMessageRequest" } } } },
        responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } }, "400": { description: "Bad request" } }
      }
    },
    "/files": {
      get: {
        tags: ["Files"],
        summary: "List files for a conversation",
        parameters: [{ name: "conversationId", in: "query", schema: { type: "string" } }],
        responses: { "200": { description: "Files returned", content: { "application/json": { schema: { $ref: "#/components/schemas/FilesResponse" } } } }, "400": { description: "Bad request" } }
      },
      post: {
        tags: ["Files"],
        summary: "Create a file record",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateFileRequest" } } } },
        responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/FileResponse" } } } }, "400": { description: "Bad request" } }
      }
    },
    "/files/{id}": {
      delete: {
        tags: ["Files"],
        summary: "Delete a file",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } }
      }
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ["./src/**/*.ts"],
});

export default swaggerSpec;
