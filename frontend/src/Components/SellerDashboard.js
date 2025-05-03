import OrderManagementComponent from './OrderManagement';
import React, { useState } from 'react';
import Header from './HeaderMainStore';
import SellerDashboardSidebar from './SellerDashboardSidebar';
import ProductManagement from './ProductManagement';
import DashBoardHome from './DashBoardHome';

export default function SellerDashboard() {

    // Initialize the currentManager with the result of ReturnCurrentManagerComponent
    const [currentManager, setCurrentManager] = useState(() => ReturnCurrentManagerComponent(0));

    // This function determines which component to render based on the index
    function ReturnCurrentManagerComponent(index = 0) {
        switch(index) {
            case 0:
                return <DashBoardHome />;
            case 1:
                return <ProductManagement />;
            case 2:
                return <OrderManagementComponent />;
            default:
                return <ProductManagement />;
        }
    }

    return (
        <div>
            <Header />
            <div className="flex flex-row">
                <div className="w-[20%]">
                    <SellerDashboardSidebar GetManager={ReturnCurrentManagerComponent} SetManager={setCurrentManager} />
                </div>
                <div className="w-[80%] mt-9">
                    {currentManager}
                </div>
            </div>
        </div>
    );
}
