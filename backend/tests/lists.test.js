/**
 * @jest-environment node
 */

jest.setTimeout(30000);

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import List from "../models/List.js";

let token;
let userId;
let createdListId;


// BEFORE ALL

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 20000,
  });

  // Clear DB
  await User.deleteMany({});
  await List.deleteMany({});

  // Registration user
  await request(app).post("/api/auth/register").send({
    name: "Test",
    surename: "User",
    email: "test@example.com",
    password: "pass123",
  });

  // Login → JWT
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "pass123",
  });

  token = loginRes.body.token;
  userId = loginRes.body.user._id;
});


// AFTER ALL

afterAll(async () => {
  await mongoose.connection.close();
});


// GET /api/lists

test("GET /api/lists returns empty array", async () => {
  const res = await request(app)
    .get("/api/lists")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body).toEqual([]);
});


// POST /api/lists

test("POST /api/lists creates new list", async () => {
  const res = await request(app)
    .post("/api/lists")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Nákupní seznam" });

  expect(res.status).toBe(201);
  expect(res.body.name).toBe("Nákupní seznam");

  createdListId = res.body._id;
});


// GET /api/lists/:id

test("GET /api/lists/:id returns created list", async () => {
  const res = await request(app)
    .get(`/api/lists/${createdListId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body._id).toBe(createdListId);
  expect(res.body.owner._id).toBe(userId);
});


//  PUT /api/lists/:id

test("PUT /api/lists/:id updates list name", async () => {
  const res = await request(app)
    .put(`/api/lists/${createdListId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "Updated Name" });

  expect(res.status).toBe(200);
  expect(res.body.name).toBe("Updated Name");
});


//  DELETE /api/lists/:id

test("DELETE /api/lists/:id deletes list", async () => {
  const res = await request(app)
    .delete(`/api/lists/${createdListId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(204);

  const check = await List.findById(createdListId);
  expect(check).toBeNull();
});


// 401 — no token

test("GET /api/lists without token returns 401", async () => {
  const res = await request(app).get("/api/lists");

  expect(res.status).toBe(401);
});


// 404 — list not found

test("GET /api/lists/:id with non-existing id returns 404", async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .get(`/api/lists/${fakeId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(404);
});


// 400 — missing name

test("POST /api/lists without name returns 400", async () => {
  const res = await request(app)
    .post("/api/lists")
    .set("Authorization", `Bearer ${token}`)
    .send({});

  expect(res.status).toBe(400);
});

//404 — foreign user cannot access list

test("DELETE /api/lists/:id by foreign user returns 404", async () => {
  // register second user
  await request(app).post("/api/auth/register").send({
    name: "Other",
    surename: "User",
    email: "other@example.com",
    password: "pass123",
  });

  // login second user
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "other@example.com",
    password: "pass123",
  });

  const foreignToken = loginRes.body.token;

  const res = await request(app)
    .delete(`/api/lists/${createdListId}`)
    .set("Authorization", `Bearer ${foreignToken}`);

  expect(res.status).toBe(404);
});


