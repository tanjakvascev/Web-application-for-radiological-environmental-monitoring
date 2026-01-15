"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const sample_router_1 = __importDefault(require("./routers/sample.router"));
const isotope_router_1 = __importDefault(require("./routers/isotope.router"));
const invoice_router_1 = __importDefault(require("./routers/invoice.router"));
const report_router_1 = __importDefault(require("./routers/report.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect('mongodb://127.0.0.1:27017/Laboratorija060');
const conn = mongoose_1.default.connection;
conn.once('open', () => {
    console.log("DB ok");
});
app.use("/", user_router_1.default);
app.use("/samples", sample_router_1.default);
app.use("/isotope", isotope_router_1.default);
app.use("/invoice", invoice_router_1.default);
app.use("/report", report_router_1.default);
app.listen(4000, () => console.log('Express running on port 4000'));
