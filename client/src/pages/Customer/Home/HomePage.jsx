import React from "react";
import Layout from "../../../components/layouts/Layout";

const HomePage = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to the Customer Home Page</h1>
                <p className="text-gray-700">Explore our products and enjoy shopping!</p>
            </div>
        </Layout>
    );
};
export default HomePage;