import "jest";
import { mockRequestResponse, stopTestMongo, startTestMongo } from "../../testUtil";
import { ItemsController } from "../ItemsController";
const controller = new ItemsController();

describe("ItemsController", () => {
  afterAll(async () => await stopTestMongo());
  beforeAll(async () => await startTestMongo());
  // afterEach(async () => {
  // });
  // beforeEach(async () => {
  // });

  describe("getItems", () => {
    test("Returns the items", async () => {
      const { req, res, next } = mockRequestResponse();
      req.params = { id: "null" };
      await controller.getItems(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

});
