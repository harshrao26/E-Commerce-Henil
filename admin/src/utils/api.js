import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        return response.ok ? data : Promise.reject(data);
    } catch (error) {
        console.error('Error:', error);
        return Promise.reject(error);
    }
};

export const fetchDataFromApi = async (url) => {
    try {
        const response = await axios.get(apiUrl + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};

export const uploadImage = async (url, updatedData) => {
    try {
        const response = await axios.put(apiUrl + url, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Upload Error:', error);
        return Promise.reject(error);
    }
};

export const uploadImages = async (url, formData) => {
    try {
        const response = await axios.post(apiUrl + url, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Upload Error:', error);
        return Promise.reject(error);
    }
};

export const editData = async (url, updatedData) => {
    try {
        const response = await axios.put(apiUrl + url, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteImages = async (url) => {
    try {
        const response = await axios.delete(apiUrl + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteData = async (url) => {
    try {
        const response = await axios.delete(apiUrl + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteMultipleData = async (url, data) => {
    try {
        const response = await axios.delete(apiUrl + url, {
            data,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};


