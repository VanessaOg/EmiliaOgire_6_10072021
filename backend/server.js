// Pour créer un serveur Node on importe le package http natif de Node et on lui passe la fonction qui sera executée à chaque appel
const http = require("http");
const app = require("./app");

// la fonction mormalizePort renvoie un port valide qu'il soit sour un string ou un number
const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// la fonction errorHandler recherche les erreurs et les gère
const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// on crée une const qui fait appel à a méthode createServer et qui a pour argument la fonction qui sera appelée à chaque requête
const server = http.createServer(app);

server.on("error", errorHandler);
// le server doit ecouter le port
server.on("listening", () => {
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

server.listen(port);
