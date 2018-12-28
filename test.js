// require the Koa server
const server = require("./app");
// require supertest
const request = require("supertest");


// close the server after each test
afterEach(() => {
    server.close();
});

describe("GET route = /image", () => {
    test("should respond as expected", async () => {
        const response = await request(server).get("/image");
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual('Handling /image');
    });
});

describe("GET route = /image/:checksum ", () => {
    test("should respond as expected", async () => {
        const checksum = "3ebd143ecb03c556219e59fb4bada120278f872e7dfdad4d04bcc74c82cd3575"
        const response = await request(server).get("/image/" + checksum);
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual("Found image with checksum: " + checksum);
    });
});

describe("GET route = /image/:checksum ", () => {
    test("should respond as expected", async () => {
        const checksum = "000false000"
        const response = await request(server).get("/image/" + checksum);
        expect(response.status).toEqual(404);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual("Couldn't find image with checksum: " + checksum);
    });
});