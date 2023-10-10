interface IBodyResponse{
    success: boolean;
    code: number;
    message?: string | string[];
    errors?: string[];
    error?: any;
    data?: any; 
}

export default IBodyResponse;