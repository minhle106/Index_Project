import { Schedule, getBuses} from "../functionAPI.js";
const routes = (app) => {
    app.post("/schedule", (request, response) => {
        const data=Schedule(request);
		response.send(data);
	});
    app.post("/prediction", (request, response) => {
        const data=Prediction(request);
		response.send(data);
	});
};
export default routes;