import React from 'react'
import OrderTax from './OrderTaxType'
import PaidBy from './PaidBy'
import TaxAcc from './TaxAcc'
import TaxInstallment from './TaxInstallment'
import TaxVerify from './TaxVerify'

const PropertyTax = () => {
  return (
    <>
        <div className="row mt-4">
            <OrderTax/>
            <PaidBy/>
            <TaxAcc/>
            <TaxInstallment/>
            <TaxVerify/>
        </div>
    </>
)
}

export default PropertyTax