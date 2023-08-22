const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")

const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("0.0.0.0:4000", grpc.credentials.createInsecure())

text = process.argv[2]

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    console.log("From server: " + JSON.stringify(response));
})

// client.readTodos({}, (err, response) => {
//     console.log("TODOs from server: " + JSON.stringify(response));
// })

const todoStream = client.readTodosStream();

todoStream.on("data", item => {
    console.log("Stream: " + JSON.stringify(item))
})

todoStream.on("end", e => { console.log("serverd done.")})



