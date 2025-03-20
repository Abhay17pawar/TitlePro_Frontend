import React from 'react'
import ProductType from './ProductType'
import AddIn from './Add-In'
import BSource from './BSource'
import CustomField from './CustomField'
import LoanType from './LoanType'
import OrderDocument from './OrderDocument'
import OrderLabel from './OrderLabel'
import OrderStatus from './OrderStatus'

const Order = () => {
  return (
        <>
            <div className="row mt-4">
                <AddIn/>
                <BSource/>
                <CustomField/>
                <LoanType/>
                <OrderDocument/>
                <OrderLabel/>
                <OrderStatus/>
                <ProductType/>
            </div>
        </>
    )
}

export default Order