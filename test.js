// require the Koa server
const server = require("./app");
// require supertest
const request = require("supertest");

// close the server after each test
afterEach(() => {
    server.close();
});

describe("200: GET route = /image", () => {
    test("should respond as expected", async () => {
        const response = await request(server).get("/image");
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual('Handling /image');
    });
});

describe("200: GET route = /image/:checksum ", () => {
    test("should find image with checksum", async () => {
        const checksum = "3ebd143ecb03c556219e59fb4bada120278f872e7dfdad4d04bcc74c82cd3575"
        const response = await request(server).get("/image/" + checksum);
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual("Found image with checksum: " + checksum);
    });
});

describe("404: GET route = /image/:checksum ", () => {
    test("should not find an image with checksum", async () => {
        const checksum = "000false000"
        const response = await request(server).get("/image/" + checksum);
        expect(response.status).toEqual(404);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual("Couldn't find image with checksum: " + checksum);
    });
});

describe("200: POST route = /image/ ", () => {
    test("should upload an image", async () => {
        const response = await request(server).post("/image/").attach('image', './testFiles/imageForTestGood.png');
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.message).toEqual('Image uploaded');
        expect(response.body.checksum).toBeDefined();
    });
});

describe("415: POST route = /image/ ", () => {
    test("should fail to upload image because of file format", async () => {
        const response = await request(server).post("/image/").attach('image', './testFiles/wrongFileForTest.txt');
        expect(response.status).toEqual(415);
        expect(response.type).toEqual("application/json");
        expect(response.body.error.message).toEqual('Wrong file type, please use .JPG, .PNG or .GIF');
    });
});

describe("413: POST route = /image/ ", () => {
    test("should fail to upload image because of file size", async () => {
        const response = await request(server).post("/image/").attach('image', './testFiles/imageForTestBig.jpg');
        expect(response.status).toEqual(413);
        expect(response.type).toEqual("application/json");
        expect(response.body.error.message).toEqual('File too large');
    });
});
