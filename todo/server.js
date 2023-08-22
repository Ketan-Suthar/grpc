const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")

const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server()
server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure())

server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos" : readTodos,
    "readTodosStream": readTodosStream
})

server.start()

const todos = []

function createTodo(call, callback) {
    const item = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(item)
    console.log(call);
    callback(null, item)
}

function readTodos(call, callback) {
    callback(null, {"items": todos})
}

function readTodosStream(call, callback) {
    todos.forEach(i => call.write(i))
    call.end()
}

