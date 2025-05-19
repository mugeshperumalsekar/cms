import HttpClientWrapper from "../../api/http-client-wrapper";
import { TaskAssignPayload } from "./taskAssign-payload";

class TaskAssignApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    saveTaskAssign = async (payload: TaskAssignPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/taskAssign/createTaskAssign', payload)
        } catch (error) {
            console.error('Error assigning task:', error);
        }
    };

    getTaskAssign = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/TaskAssignView');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default TaskAssignApiService;