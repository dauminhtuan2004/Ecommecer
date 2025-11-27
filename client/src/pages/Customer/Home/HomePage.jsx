import React from "react";
import Layout from "../../../components/layouts/Layout";
import Button from "../../../components/common/Button";



const HomePage = () => {
    
    
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to the Customer Home Page</h1>
                <p className="text-gray-700">Explore our products and enjoy shopping!</p>
                <Button className="mt-6" onClick={() => alert('đăng nhập ngay')}>
                    Đăng Nhập Ngay
                </Button>
                
            
                
            </div>
        </Layout>
    );
};
export default HomePage;