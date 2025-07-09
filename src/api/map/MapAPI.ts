import { MapInterface } from "../../types/entity/map/MapInterface";
import { api } from "../api";

// 예시(example)
export class MapAPI {
   /**
     * 목록 조회 API
     * @returns {Promise<TestInterface[]>} 조회된 목록 Promise 객체
     */
    static async getTests(): Promise<MapInterface[]> {
        const tests = await api.get('/tests');
        return tests.data.success ? tests.data.data : [];
    }

    /**
     * 생성 API
     * @param {TestInterface} 생성할 객체
     * @returns {Promise<TestInterface>} 생성할 객체의 생성 결과 Promise 객체
     */
    static async createTest({ title, data }: MapInterface): Promise<MapInterface|null> {
        const createdTest = await api.post('/tests', {
            title,
      		data
        });

        return createdTest.data.success ? createdTest.data.data : null;
    }

    /**
     * 단건 조회 API
     * @param id {string} 조회할 객체 식별번호
     * @returns {Promise<TestInterface>} 조회된 객체 Promise 객체
     */
    static async getTestById(id: string): Promise<MapInterface> {
        const test = await api.get(`/tests/${id}`);
        if (!test.data.success) {
            throw new Error("조회 실패");
        }

        return test.data.data;
    }
    
    /**
     * 수정 API
     * @param id {string} 식별번호
     * @returns {Promise<TestInterface>} 수정된 객체 Promise 객체
     */
    static async updateTest({ id, title, data }: MapInterface): Promise<MapInterface | null> {
        const updatedTest = await api.patch('/tests', {
            id,
            title,
        });

        if (!updatedTest.data.success) {
            throw new Error("조회 실패");
        }

        return updatedTest.data.data;
    }

    /**
     * 삭제 API
     * @param id {string} 식별번호
     * @returns {Promise<boolean>} 삭제 요청 결과
     */
    static async deleteTest(id: string): Promise<boolean> {
        const result = await api.delete(`/tests/${id}`);
        if (!result.data.success) {
            throw new Error("조회 실패");
        }

        return result.data.data;
    }
}