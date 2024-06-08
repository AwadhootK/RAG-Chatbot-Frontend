import axios, { AxiosResponse } from 'axios';

export interface Headers {
    [key: string]: string;
}

export async function postData<T>(url: string, headers: Headers, data: any): Promise<T | null> {
    try {
        const response: AxiosResponse<T> = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error in POST request:', error);
        return null;
    }
}

export async function getData<T>(url: string, headers: Headers): Promise<T | null> {
    try {
        const response: AxiosResponse<T> = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error in GET request:', error);
        return null;
    }
}
